
import { universalHub } from '../universal-hub/UniversalDataHub';
import { BancoEvaluacionesService } from '@/services/banco-evaluaciones/BancoEvaluacionesService';

/**
 * BRIDGE QUIRÚRGICO - Canal directo Evaluación ↔ LectoGuía ↔ Dashboard
 * Elimina duplicaciones y centraliza flujos
 */
export class EvaluationBridge {
  private static instance: EvaluationBridge;
  
  static getInstance(): EvaluationBridge {
    if (!EvaluationBridge.instance) {
      EvaluationBridge.instance = new EvaluationBridge();
    }
    return EvaluationBridge.instance;
  }

  /**
   * FLUJO EVALUATIVO CENTRALIZADO
   */
  async startAdaptiveEvaluation(userId: string, prueba: string): Promise<any> {
    console.log(`🎯 Iniciando evaluación adaptativa: ${prueba} para usuario ${userId}`);
    
    // Usar el hub central para evitar duplicaciones
    const evaluationData = await universalHub.getEvaluationData(userId, prueba);
    
    // Bridge automático con LectoGuía
    await this.bridgeToLectoGuia(userId, prueba, evaluationData);
    
    return {
      ...evaluationData,
      adaptiveConfig: this.generateAdaptiveConfig(evaluationData),
      cinematicFlow: this.setupCinematicFlow(prueba)
    };
  }

  /**
   * CONFIGURACIÓN ADAPTATIVA QUIRÚRGICA
   */
  private generateAdaptiveConfig(evaluationData: any): any {
    const { progreso, analisis } = evaluationData;
    
    return {
      startingDifficulty: this.calculateStartingDifficulty(progreso, analisis),
      adaptationSpeed: this.calculateAdaptationSpeed(analisis),
      stoppingCriteria: {
        maxQuestions: 20,
        minQuestions: 8,
        precisionTarget: 0.3,
        timeLimit: 45 * 60 // 45 minutos
      },
      cinematicTransitions: true,
      realTimeFeedback: true
    };
  }

  private calculateStartingDifficulty(progreso: any[], analisis: any): 'basic' | 'intermediate' | 'advanced' {
    if (!analisis) return 'basic';
    
    const avgProgress = progreso.reduce((acc, p) => acc + (p.progress || 0), 0) / Math.max(progreso.length, 1);
    
    if (avgProgress > 70) return 'advanced';
    if (avgProgress > 40) return 'intermediate';
    return 'basic';
  }

  private calculateAdaptationSpeed(analisis: any): number {
    // Velocidad de adaptación basada en análisis previo
    if (!analisis) return 1.0;
    
    const confidence = analisis.confiabilidad_estimacion || 0.5;
    return Math.max(0.5, Math.min(2.0, confidence * 2));
  }

  /**
   * BRIDGE AUTOMÁTICO CON LECTOGUÍA
   */
  private async bridgeToLectoGuia(userId: string, prueba: string, evaluationData: any): Promise<void> {
    // Obtener datos de LectoGuía de forma centralizada
    const lectoGuiaData = await universalHub.getLectoGuiaData(userId, this.mapPruebaToSubject(prueba));
    
    // Sincronizar nodos relevantes
    const relevantNodes = this.findRelevantNodes(evaluationData.preguntas, lectoGuiaData.nodes);
    
    // Notificar bridge bidireccional
    universalHub.subscribe(`evaluation_${userId}`, (data) => {
      this.handleEvaluationUpdate(data, userId);
    });
  }

  private mapPruebaToSubject(prueba: string): string {
    const mapping: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'lectura',
      'MATEMATICA_1': 'matematicas-basica',
      'MATEMATICA_2': 'matematicas-avanzada',
      'CIENCIAS': 'ciencias',
      'HISTORIA': 'historia'
    };
    
    return mapping[prueba] || 'general';
  }

  private findRelevantNodes(preguntas: any[], nodes: any[]): any[] {
    return nodes.filter(node => 
      preguntas.some(pregunta => pregunta.nodo_code === node.code)
    );
  }

  private async handleEvaluationUpdate(data: any, userId: string): Promise<void> {
    // Bridge automático: Evaluación → LectoGuía
    if (data.type === 'question_answered') {
      await universalHub.bridgeEvaluationToLectoGuia(data.payload, userId);
    }
    
    // Bridge automático: Evaluación → Dashboard
    if (data.type === 'evaluation_completed') {
      await this.bridgeToDashboard(data.payload, userId);
    }
  }

  private async bridgeToDashboard(evaluationResult: any, userId: string): Promise<void> {
    // Invalidar cache del dashboard para forzar actualización
    universalHub.clearCache(`dashboard_${userId}`);
    
    // Notificar actualización
    universalHub.subscribe(`dashboard_${userId}`, () => {
      console.log('📊 Dashboard actualizado con resultados de evaluación');
    });
  }

  /**
   * FLUJO CINEMATOGRÁFICO
   */
  private setupCinematicFlow(prueba: string): any {
    return {
      transitions: {
        questionToQuestion: { duration: 500, easing: 'easeInOut' },
        evaluationToResults: { duration: 800, easing: 'easeOut' },
        resultsToLectoGuia: { duration: 600, easing: 'easeInOut' }
      },
      animations: {
        progressBar: 'smooth',
        scoreUpdates: 'counterUp',
        nodeUnlock: 'celebration'
      },
      contextualHints: {
        showNodeConnections: true,
        highlightWeakAreas: true,
        suggestNextSteps: true
      }
    };
  }

  /**
   * RESPUESTA ADAPTATIVA EN TIEMPO REAL
   */
  async processAdaptiveResponse(
    userId: string, 
    questionId: string, 
    response: string, 
    analytics: any
  ): Promise<any> {
    // Análisis IRT en tiempo real
    const irtAnalysis = await this.calculateIRTResponse(questionId, response, analytics);
    
    // Selección de próxima pregunta adaptativa
    const nextQuestion = await this.selectNextAdaptiveQuestion(userId, irtAnalysis);
    
    // Bridge automático con otros sistemas
    await this.bridgeResponseUpdate(userId, {
      questionId,
      response,
      irtAnalysis,
      nextQuestion,
      analytics
    });
    
    return {
      isCorrect: irtAnalysis.isCorrect,
      abilityEstimate: irtAnalysis.abilityEstimate,
      nextQuestion,
      cinematicFeedback: this.generateCinematicFeedback(irtAnalysis),
      shouldContinue: this.shouldContinueEvaluation(irtAnalysis)
    };
  }

  private async calculateIRTResponse(questionId: string, response: string, analytics: any): Promise<any> {
    // Implementación IRT simplificada
    const question = await BancoEvaluacionesService.obtenerPreguntaPorId(questionId);
    const isCorrect = question?.alternativas.find(alt => alt.letra === response)?.es_correcta || false;
    
    return {
      isCorrect,
      abilityEstimate: this.estimateAbility(isCorrect, analytics),
      informationGained: this.calculateInformationGain(question, analytics),
      confidence: this.calculateConfidence(analytics)
    };
  }

  private estimateAbility(isCorrect: boolean, analytics: any): number {
    // Algoritmo IRT simplificado
    const baseAbility = 0.0; // Habilidad neutra
    const adjustment = isCorrect ? 0.5 : -0.5;
    const timeAdjustment = analytics.tiempo_respuesta_segundos > 120 ? -0.2 : 0.1;
    
    return baseAbility + adjustment + timeAdjustment;
  }

  private calculateInformationGain(question: any, analytics: any): number {
    // Información ganada basada en Fisher Information
    const discrimination = question?.parametro_discriminacion || 1.0;
    const difficulty = question?.parametro_dificultad || 0.0;
    
    return discrimination * Math.exp(-Math.abs(difficulty)) * (analytics.confidence_level || 0.5);
  }

  private calculateConfidence(analytics: any): number {
    const factors = [
      analytics.tiempo_respuesta_segundos > 30 ? 0.8 : 0.5, // Tiempo de reflexión
      analytics.numero_cambios_respuesta === 0 ? 0.9 : 0.6, // Decisión firme
      analytics.porcentaje_texto_leido > 70 ? 0.8 : 0.4 // Lectura completa
    ];
    
    return factors.reduce((acc, factor) => acc + factor, 0) / factors.length;
  }

  private async selectNextAdaptiveQuestion(userId: string, irtAnalysis: any): Promise<any> {
    // Selección adaptativa quirúrgica
    const targetDifficulty = irtAnalysis.abilityEstimate;
    const usedQuestions = await this.getUsedQuestions(userId);
    
    return BancoEvaluacionesService.seleccionarPreguntaAdaptativa({
      targetDifficulty,
      usedQuestions,
      maxInformation: true
    });
  }

  private async getUsedQuestions(userId: string): Promise<string[]> {
    // Obtener preguntas ya utilizadas para evitar repeticiones
    return universalHub.getCentralizedData(
      `used_questions_${userId}`,
      async () => {
        // Implementar consulta a respuestas_evaluacion
        return [];
      },
      300000 // 5 minutos TTL
    );
  }

  private async bridgeResponseUpdate(userId: string, responseData: any): Promise<void> {
    // Notificar a todos los sistemas conectados
    universalHub.notifySubscribers(`response_update_${userId}`, responseData);
    
    // Actualizar progreso en nodos relacionados
    if (responseData.nextQuestion?.nodo_id) {
      await universalHub.bridgeEvaluationToLectoGuia(responseData, userId);
    }
  }

  private generateCinematicFeedback(irtAnalysis: any): any {
    return {
      visual: {
        animation: irtAnalysis.isCorrect ? 'success_pulse' : 'gentle_shake',
        color: irtAnalysis.isCorrect ? 'green' : 'orange',
        duration: 1500
      },
      audio: {
        enabled: true,
        type: irtAnalysis.isCorrect ? 'success_chime' : 'thoughtful_tone'
      },
      message: this.generateContextualMessage(irtAnalysis),
      nextStepHint: this.generateNextStepHint(irtAnalysis)
    };
  }

  private generateContextualMessage(irtAnalysis: any): string {
    if (irtAnalysis.isCorrect && irtAnalysis.confidence > 0.8) {
      return "¡Excelente! Demuestras dominio sólido en este concepto.";
    } else if (irtAnalysis.isCorrect) {
      return "¡Correcto! Tu razonamiento está en el camino adecuado.";
    } else if (irtAnalysis.confidence > 0.6) {
      return "Cerca de la respuesta. Revisemos este concepto juntos.";
    } else {
      return "Este es un concepto importante. Te ayudo a reforzarlo.";
    }
  }

  private generateNextStepHint(irtAnalysis: any): string {
    if (irtAnalysis.abilityEstimate > 0.5) {
      return "Siguiente: Exploraremos conceptos más avanzados.";
    } else if (irtAnalysis.abilityEstimate > -0.5) {
      return "Siguiente: Reforzaremos conceptos base relacionados.";
    } else {
      return "Siguiente: Revisaremos fundamentos paso a paso.";
    }
  }

  private shouldContinueEvaluation(irtAnalysis: any): boolean {
    // Criterio adaptativo de continuación
    return irtAnalysis.informationGained > 0.1 && irtAnalysis.confidence < 0.9;
  }
}

export const evaluationBridge = EvaluationBridge.getInstance();
