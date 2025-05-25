
import { supabase } from "@/integrations/supabase/client";
import { PreguntaBanco, BancoEvaluacionesService } from "../banco-evaluaciones/BancoEvaluacionesService";

/**
 * Motor de Evaluación Adaptativa con IRT (Item Response Theory)
 * Implementa algoritmo de 3 parámetros para selección inteligente de preguntas
 */
export class AdaptiveEvaluationEngine {
  private static readonly DEFAULT_THETA = 0.0; // Habilidad inicial estimada
  private static readonly MIN_QUESTIONS = 8;
  private static readonly MAX_QUESTIONS = 25;
  private static readonly TARGET_PRECISION = 0.3; // Error estándar objetivo

  /**
   * Inicia una evaluación adaptativa personalizada
   */
  static async initializeAdaptiveSession(
    userId: string,
    pruebaPaes: string,
    targetNodes?: string[]
  ): Promise<{
    sessionId: string;
    firstQuestion: PreguntaBanco;
    estimatedAbility: number;
    adaptiveConfig: any;
  }> {
    console.log('🎯 Iniciando sesión adaptativa para usuario:', userId);

    // Cargar historial del usuario para estimación inicial
    const { data: historial } = await supabase
      .from('respuestas_evaluacion')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Estimar habilidad inicial basada en historial
    const initialTheta = this.estimateInitialAbility(historial || []);
    
    // Crear nueva sesión adaptativa
    const { data: session, error } = await supabase
      .from('sesiones_evaluacion')
      .insert({
        user_id: userId,
        codigo_sesion: `ADAPT-${Date.now()}`,
        estado: 'iniciada',
        nombre_sesion: `Evaluación Adaptativa ${pruebaPaes}`,
        fecha_inicio: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    // Seleccionar primera pregunta óptima
    const firstQuestion = await this.selectOptimalQuestion(
      initialTheta,
      [],
      pruebaPaes,
      targetNodes
    );

    const adaptiveConfig = {
      currentTheta: initialTheta,
      standardError: 1.0,
      questionsAsked: 0,
      targetPrecision: this.TARGET_PRECISION,
      maxQuestions: this.MAX_QUESTIONS,
      convergenceHistory: []
    };

    return {
      sessionId: session.id,
      firstQuestion,
      estimatedAbility: initialTheta,
      adaptiveConfig
    };
  }

  /**
   * Selecciona la siguiente pregunta óptima usando máxima información
   */
  static async selectOptimalQuestion(
    currentTheta: number,
    answeredQuestions: string[],
    pruebaPaes: string,
    targetNodes?: string[]
  ): Promise<PreguntaBanco> {
    console.log('🔍 Seleccionando pregunta óptima para θ =', currentTheta);

    // Obtener pool de preguntas candidatas
    let query = supabase
      .from('banco_preguntas')
      .select(`
        id, codigo_pregunta, nodo_code, enunciado, nivel_dificultad,
        tipo_pregunta, parametro_dificultad, parametro_discriminacion,
        parametro_adivinanza, tiempo_estimado_segundos,
        alternativas_respuesta (
          id, letra, contenido, es_correcta
        )
      `)
      .eq('validada', true)
      .eq('prueba_paes', pruebaPaes)
      .not('id', 'in', `(${answeredQuestions.join(',') || "''"})`)
      .limit(200);

    if (targetNodes?.length) {
      query = query.in('nodo_code', targetNodes);
    }

    const { data: candidateQuestions, error } = await query;
    
    if (error || !candidateQuestions?.length) {
      throw new Error('No hay preguntas disponibles para la evaluación adaptativa');
    }

    // Calcular información de Fisher para cada pregunta
    const questionsWithInfo = candidateQuestions.map(q => ({
      ...q,
      information: this.calculateFisherInformation(
        currentTheta,
        q.parametro_dificultad || 0,
        q.parametro_discriminacion || 1,
        q.parametro_adivinanza || 0.25
      )
    }));

    // Seleccionar pregunta con máxima información
    const optimalQuestion = questionsWithInfo.reduce((max, current) => 
      current.information > max.information ? current : max
    );

    console.log(`✅ Pregunta seleccionada: ${optimalQuestion.codigo_pregunta} (Info: ${optimalQuestion.information.toFixed(3)})`);

    return {
      id: optimalQuestion.id,
      codigo_pregunta: optimalQuestion.codigo_pregunta,
      nodo_code: optimalQuestion.nodo_code,
      prueba_paes: pruebaPaes,
      enunciado: optimalQuestion.enunciado,
      nivel_dificultad: optimalQuestion.nivel_dificultad as 'basico' | 'intermedio' | 'avanzado',
      tipo_pregunta: optimalQuestion.tipo_pregunta as any,
      tiempo_estimado_segundos: optimalQuestion.tiempo_estimado_segundos || 120,
      alternativas: optimalQuestion.alternativas_respuesta?.map(alt => ({
        id: alt.id,
        letra: alt.letra,
        contenido: alt.contenido,
        es_correcta: alt.es_correcta
      })) || [],
      competencias_evaluadas: [],
      tags_contenido: []
    } as PreguntaBanco;
  }

  /**
   * Procesa respuesta y actualiza estimación de habilidad
   */
  static async processAdaptiveResponse(
    sessionId: string,
    questionId: string,
    response: string,
    currentTheta: number,
    responseTime: number,
    analytics: any
  ): Promise<{
    updatedTheta: number;
    standardError: number;
    shouldContinue: boolean;
    nextQuestion?: PreguntaBanco;
    feedbackLevel: 'basic' | 'detailed' | 'remedial';
  }> {
    console.log('📊 Procesando respuesta adaptativa...');

    // Obtener datos de la pregunta respondida
    const { data: questionData } = await supabase
      .from('banco_preguntas')
      .select('*, alternativas_respuesta(*)')
      .eq('id', questionId)
      .single();

    if (!questionData) throw new Error('Pregunta no encontrada');

    // Determinar si la respuesta es correcta
    const correctAnswer = questionData.alternativas_respuesta.find((alt: any) => alt.es_correcta);
    const isCorrect = correctAnswer?.letra === response;

    // Guardar respuesta en la base de datos
    await supabase.from('respuestas_evaluacion').insert({
      sesion_id: sessionId,
      pregunta_id: questionId,
      respuesta_seleccionada: response,
      es_correcta: isCorrect,
      tiempo_respuesta_segundos: responseTime,
      ...analytics
    });

    // Actualizar estimación de habilidad usando Newton-Raphson
    const { newTheta, standardError } = this.updateAbilityEstimate(
      currentTheta,
      isCorrect,
      questionData.parametro_dificultad || 0,
      questionData.parametro_discriminacion || 1,
      questionData.parametro_adivinanza || 0.25
    );

    // Obtener historial de respuestas para determinar si continuar
    const { data: responseHistory } = await supabase
      .from('respuestas_evaluacion')
      .select('*')
      .eq('sesion_id', sessionId)
      .order('created_at', { ascending: true });

    const questionsAnswered = responseHistory?.length || 1;
    const shouldContinue = this.shouldContinueAdaptive(
      questionsAnswered,
      standardError,
      responseHistory || []
    );

    let nextQuestion: PreguntaBanco | undefined;
    if (shouldContinue) {
      const answeredIds = responseHistory?.map(r => r.pregunta_id) || [];
      nextQuestion = await this.selectOptimalQuestion(
        newTheta,
        answeredIds,
        questionData.prueba_paes
      );
    }

    // Determinar nivel de feedback basado en rendimiento
    const feedbackLevel = this.determineFeedbackLevel(
      isCorrect,
      responseTime,
      analytics,
      newTheta
    );

    console.log(`📈 Habilidad actualizada: θ = ${newTheta.toFixed(3)} (SE = ${standardError.toFixed(3)})`);

    return {
      updatedTheta: newTheta,
      standardError,
      shouldContinue,
      nextQuestion,
      feedbackLevel
    };
  }

  /**
   * Genera análisis final de la evaluación adaptativa
   */
  static async generateAdaptiveAnalysis(sessionId: string): Promise<{
    finalTheta: number;
    standardError: number;
    paesScorePrediction: number;
    confidenceInterval: [number, number];
    strengthAreas: string[];
    improvementAreas: string[];
    detailedAnalysis: any;
  }> {
    console.log('📋 Generando análisis final adaptativo...');

    // Obtener todas las respuestas de la sesión
    const { data: responses } = await supabase
      .from('respuestas_evaluacion')
      .select(`
        *,
        banco_preguntas!inner(
          nodo_code, nivel_dificultad, competencias_evaluadas,
          parametro_dificultad, parametro_discriminacion
        )
      `)
      .eq('sesion_id', sessionId)
      .order('created_at', { ascending: true });

    if (!responses?.length) {
      throw new Error('No se encontraron respuestas para la sesión');
    }

    // Calcular estimación final de habilidad
    const finalEstimation = this.calculateFinalAbilityEstimate(responses);
    
    // Predecir puntaje PAES (150-850)
    const paesScore = this.convertThetaToPAESScore(finalEstimation.theta);
    
    // Calcular intervalo de confianza (95%)
    const margin = 1.96 * finalEstimation.standardError;
    const confidenceInterval: [number, number] = [
      this.convertThetaToPAESScore(finalEstimation.theta - margin),
      this.convertThetaToPAESScore(finalEstimation.theta + margin)
    ];

    // Análisis por áreas de competencia
    const competencyAnalysis = this.analyzeCompetencyPerformance(responses);

    // Análisis detallado de patrones
    const detailedAnalysis = {
      totalQuestions: responses.length,
      correctAnswers: responses.filter(r => r.es_correcta).length,
      averageResponseTime: responses.reduce((sum, r) => sum + (r.tiempo_respuesta_segundos || 0), 0) / responses.length,
      difficultyProgression: this.analyzeDifficultyProgression(responses),
      behaviorPatterns: this.analyzeBehaviorPatterns(responses),
      adaptiveEfficiency: this.calculateAdaptiveEfficiency(responses)
    };

    return {
      finalTheta: finalEstimation.theta,
      standardError: finalEstimation.standardError,
      paesScorePrediction: paesScore,
      confidenceInterval,
      strengthAreas: competencyAnalysis.strengths,
      improvementAreas: competencyAnalysis.weaknesses,
      detailedAnalysis
    };
  }

  // === MÉTODOS AUXILIARES PRIVADOS ===

  private static estimateInitialAbility(historial: any[]): number {
    if (!historial.length) return this.DEFAULT_THETA;

    const correctRate = historial.filter(r => r.es_correcta).length / historial.length;
    // Conversión logística: P(θ) = 1 / (1 + exp(-(θ)))
    // θ = ln(P / (1 - P))
    const clampedRate = Math.max(0.01, Math.min(0.99, correctRate));
    return Math.log(clampedRate / (1 - clampedRate));
  }

  private static calculateFisherInformation(
    theta: number,
    difficulty: number,
    discrimination: number,
    guessing: number
  ): number {
    const z = discrimination * (theta - difficulty);
    const p = guessing + (1 - guessing) / (1 + Math.exp(-z));
    const q = 1 - p;
    
    if (p <= guessing || p >= 1) return 0;
    
    const numerator = Math.pow(discrimination, 2) * Math.pow(1 - guessing, 2) * Math.exp(-z);
    const denominator = Math.pow(1 + Math.exp(-z), 2) * p * q;
    
    return numerator / denominator;
  }

  private static updateAbilityEstimate(
    currentTheta: number,
    isCorrect: boolean,
    difficulty: number,
    discrimination: number,
    guessing: number
  ): { newTheta: number; standardError: number } {
    let theta = currentTheta;
    
    // Newton-Raphson iterations
    for (let i = 0; i < 10; i++) {
      const z = discrimination * (theta - difficulty);
      const p = guessing + (1 - guessing) / (1 + Math.exp(-z));
      
      const firstDerivative = isCorrect ? 
        discrimination * (1 - guessing) * Math.exp(-z) / (p * (1 + Math.exp(-z))) :
        -discrimination * (1 - guessing) * Math.exp(-z) / ((1 - p) * (1 + Math.exp(-z)));
      
      const secondDerivative = -this.calculateFisherInformation(theta, difficulty, discrimination, guessing);
      
      if (Math.abs(secondDerivative) < 0.0001) break;
      
      const delta = firstDerivative / secondDerivative;
      theta -= delta;
      
      if (Math.abs(delta) < 0.001) break;
    }
    
    const information = this.calculateFisherInformation(theta, difficulty, discrimination, guessing);
    const standardError = information > 0 ? 1 / Math.sqrt(information) : 1.0;
    
    return { newTheta: theta, standardError };
  }

  private static shouldContinueAdaptive(
    questionsAnswered: number,
    standardError: number,
    responses: any[]
  ): boolean {
    if (questionsAnswered < this.MIN_QUESTIONS) return true;
    if (questionsAnswered >= this.MAX_QUESTIONS) return false;
    if (standardError <= this.TARGET_PRECISION) return false;
    
    // Verificar convergencia en las últimas 3 preguntas
    if (questionsAnswered >= 6) {
      const recentSEs = responses.slice(-3).map(r => r.error_estandar_posterior || 1.0);
      const seImprovement = recentSEs[0] - recentSEs[recentSEs.length - 1];
      if (seImprovement < 0.05) return false; // Convergencia alcanzada
    }
    
    return true;
  }

  private static determineFeedbackLevel(
    isCorrect: boolean,
    responseTime: number,
    analytics: any,
    theta: number
  ): 'basic' | 'detailed' | 'remedial' {
    if (!isCorrect && responseTime < 30) return 'remedial'; // Respuesta incorrecta muy rápida
    if (!isCorrect && theta < -0.5) return 'remedial'; // Habilidad baja
    if (isCorrect && responseTime > 180) return 'detailed'; // Correcto pero lento
    return 'basic';
  }

  private static calculateFinalAbilityEstimate(responses: any[]): { theta: number; standardError: number } {
    // Método de máxima verosimilitud para estimación final
    let theta = 0;
    let totalInfo = 0;
    
    for (const response of responses) {
      const question = response.banco_preguntas;
      const { newTheta } = this.updateAbilityEstimate(
        theta,
        response.es_correcta,
        question.parametro_dificultad || 0,
        question.parametro_discriminacion || 1,
        0.25
      );
      
      const info = this.calculateFisherInformation(
        newTheta,
        question.parametro_dificultad || 0,
        question.parametro_discriminacion || 1,
        0.25
      );
      
      theta = newTheta;
      totalInfo += info;
    }
    
    const standardError = totalInfo > 0 ? 1 / Math.sqrt(totalInfo) : 1.0;
    return { theta, standardError };
  }

  private static convertThetaToPAESScore(theta: number): number {
    // Conversión θ a puntaje PAES (150-850)
    // Asumiendo μ = 500, σ = 110 para distribución normal
    const paesScore = 500 + (theta * 110);
    return Math.round(Math.max(150, Math.min(850, paesScore)));
  }

  private static analyzeCompetencyPerformance(responses: any[]): { strengths: string[]; weaknesses: string[] } {
    const competencyScores: Record<string, { correct: number; total: number }> = {};
    
    responses.forEach(response => {
      const competencias = response.banco_preguntas.competencias_evaluadas || [];
      competencias.forEach((comp: string) => {
        if (!competencyScores[comp]) {
          competencyScores[comp] = { correct: 0, total: 0 };
        }
        competencyScores[comp].total++;
        if (response.es_correcta) {
          competencyScores[comp].correct++;
        }
      });
    });
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    Object.entries(competencyScores).forEach(([comp, scores]) => {
      const rate = scores.correct / scores.total;
      if (rate >= 0.7 && scores.total >= 2) {
        strengths.push(comp);
      } else if (rate < 0.4 && scores.total >= 2) {
        weaknesses.push(comp);
      }
    });
    
    return { strengths, weaknesses };
  }

  private static analyzeDifficultyProgression(responses: any[]): any {
    return {
      startingDifficulty: responses[0]?.banco_preguntas.nivel_dificultad,
      endingDifficulty: responses[responses.length - 1]?.banco_preguntas.nivel_dificultad,
      adaptationEffectiveness: this.calculateAdaptationScore(responses)
    };
  }

  private static analyzeBehaviorPatterns(responses: any[]): any {
    const times = responses.map(r => r.tiempo_respuesta_segundos || 0);
    const avgTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    
    return {
      averageResponseTime: avgTime,
      timeVariability: this.calculateVariance(times),
      responsePatterns: this.identifyResponsePatterns(responses)
    };
  }

  private static calculateAdaptiveEfficiency(responses: any[]): number {
    // Mide qué tan eficientemente se alcanzó la precisión objetivo
    const informationGained = responses.reduce((total, response, index) => {
      if (index === 0) return 0;
      return total + (response.informacion_aportada || 0);
    }, 0);
    
    return informationGained / responses.length;
  }

  private static calculateAdaptationScore(responses: any[]): number {
    // Puntuación de qué tan bien se adaptó la dificultad
    let score = 0;
    for (let i = 1; i < responses.length; i++) {
      const prev = responses[i - 1];
      const curr = responses[i];
      
      // Si respondió bien, la siguiente debería ser más difícil
      if (prev.es_correcta && curr.banco_preguntas.parametro_dificultad > prev.banco_preguntas.parametro_dificultad) {
        score += 1;
      }
      // Si respondió mal, la siguiente debería ser más fácil
      if (!prev.es_correcta && curr.banco_preguntas.parametro_dificultad < prev.banco_preguntas.parametro_dificultad) {
        score += 1;
      }
    }
    
    return responses.length > 1 ? score / (responses.length - 1) : 0;
  }

  private static calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return variance;
  }

  private static identifyResponsePatterns(responses: any[]): string[] {
    const patterns: string[] = [];
    
    // Patrón de respuestas rápidas al final (fatiga)
    const lastThree = responses.slice(-3);
    if (lastThree.every(r => (r.tiempo_respuesta_segundos || 0) < 30)) {
      patterns.push('respuestas_rapidas_finales');
    }
    
    // Patrón de alternancia en respuestas
    let alternating = 0;
    for (let i = 1; i < responses.length; i++) {
      if (responses[i].es_correcta !== responses[i - 1].es_correcta) {
        alternating++;
      }
    }
    if (alternating / responses.length > 0.6) {
      patterns.push('alternancia_rendimiento');
    }
    
    return patterns;
  }
}
