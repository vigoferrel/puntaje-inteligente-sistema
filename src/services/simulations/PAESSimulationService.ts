
import { supabase } from '@/integrations/supabase/client';
import { BancoEvaluacionesService } from '@/services/banco-evaluaciones/BancoEvaluacionesService';
import { PAESSimulation, PAESSimulationResult, DiagnosticQuestion } from '@/types/diagnostic';

/**
 * SERVICIO DE SIMULACIONES PAES OFICIALES
 * Recrear condiciones exactas del examen PAES
 */
export class PAESSimulationService {
  private static instance: PAESSimulationService;

  static getInstance(): PAESSimulationService {
    if (!PAESSimulationService.instance) {
      PAESSimulationService.instance = new PAESSimulationService();
    }
    return PAESSimulationService.instance;
  }

  /**
   * GENERAR SIMULACIÓN OFICIAL PAES
   */
  async generateOfficialSimulation(
    prueba: string,
    type: 'official' | 'practice' = 'official'
  ): Promise<PAESSimulation> {
    console.log(`🎯 Generando simulación ${type} para ${prueba}`);

    const simulationConfig = this.getSimulationConfig(prueba);
    
    try {
      // Obtener preguntas oficiales del banco
      const evaluacion = await BancoEvaluacionesService.generarEvaluacionOptimizada({
        tipo_evaluacion: 'simulacion',
        prueba_paes: prueba,
        total_preguntas: simulationConfig.totalQuestions,
        duracion_minutos: simulationConfig.duration,
        distribucion_dificultad: {
          basico: 30,
          intermedio: 50,
          avanzado: 20
        }
      });

      const questions: DiagnosticQuestion[] = evaluacion.preguntas?.map((pregunta: any, index: number) => ({
        id: `sim-${pregunta.id}`,
        question: pregunta.enunciado,
        options: pregunta.alternativas?.map((alt: any) => alt.contenido) || [],
        correctAnswer: pregunta.alternativas?.find((alt: any) => alt.es_correcta)?.contenido || '',
        explanation: this.generateSimulationExplanation(pregunta),
        difficulty: this.mapDifficulty(pregunta.nivel_dificultad),
        skill: this.mapSkill(pregunta.competencia_especifica),
        prueba: prueba,
        metadata: {
          source: 'oficial_simulacion',
          originalId: pregunta.id,
          nodoCode: pregunta.nodo_code
        }
      })) || [];

      const simulation: PAESSimulation = {
        id: `sim-${prueba.toLowerCase()}-${Date.now()}`,
        name: `Simulación ${type === 'official' ? 'Oficial' : 'Práctica'} ${this.getPruebaDisplayName(prueba)}`,
        type,
        prueba,
        duration: simulationConfig.duration,
        totalQuestions: simulationConfig.totalQuestions,
        questions,
        isCompleted: false,
        metadata: {
          officialFormat: true,
          timedMode: type === 'official',
          allowNavigation: type === 'practice',
          showAnswers: type === 'practice'
        }
      };

      console.log(`✅ Simulación generada: ${simulation.name} (${questions.length} preguntas)`);
      return simulation;

    } catch (error) {
      console.error('Error generando simulación:', error);
      return this.createFallbackSimulation(prueba, type);
    }
  }

  /**
   * PROGRAMAR SIMULACIONES AUTOMÁTICAS
   */
  async scheduleWeeklySimulations(userId: string): Promise<PAESSimulation[]> {
    const simulaciones: PAESSimulation[] = [];
    const pruebas = ['COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS', 'HISTORIA'];
    
    for (let i = 0; i < 4; i++) { // 4 semanas
      const pruebaIndex = i % pruebas.length;
      const prueba = pruebas[pruebaIndex];
      
      const simulacion = await this.generateOfficialSimulation(prueba, 'official');
      
      // Programar para sábado de cada semana a las 9:00 AM
      const fechaProgramada = new Date();
      fechaProgramada.setDate(fechaProgramada.getDate() + (6 - fechaProgramada.getDay()) + (i * 7));
      fechaProgramada.setHours(9, 0, 0, 0);
      
      simulacion.scheduledDate = fechaProgramada;
      simulaciones.push(simulacion);
    }

    console.log(`📅 ${simulaciones.length} simulaciones programadas para ${userId}`);
    return simulaciones;
  }

  /**
   * SUBMETER RESULTADO DE SIMULACIÓN
   */
  async submitSimulationResult(
    simulationId: string,
    userId: string,
    answers: { questionId: string; selectedAnswer: string; timeSpent: number }[]
  ): Promise<PAESSimulationResult> {
    console.log(`📊 Procesando resultado de simulación ${simulationId}`);

    // Calcular resultados
    const simulation = await this.getSimulation(simulationId);
    if (!simulation) throw new Error('Simulación no encontrada');

    let correctAnswers = 0;
    const processedAnswers = answers.map(answer => {
      const question = simulation.questions.find(q => q.id === answer.questionId);
      const isCorrect = question?.correctAnswer === answer.selectedAnswer;
      if (isCorrect) correctAnswers++;
      
      return {
        ...answer,
        isCorrect
      };
    });

    const score = (correctAnswers / simulation.totalQuestions) * 100;
    const totalTimeSpent = answers.reduce((sum, answer) => sum + answer.timeSpent, 0);

    // Calcular rendimiento por habilidad
    const skillPerformance: Record<string, number> = {};
    simulation.questions.forEach(question => {
      if (!skillPerformance[question.skill]) {
        skillPerformance[question.skill] = 0;
      }
      const answer = processedAnswers.find(a => a.questionId === question.id);
      if (answer?.isCorrect) {
        skillPerformance[question.skill]++;
      }
    });

    // Convertir a porcentajes
    Object.keys(skillPerformance).forEach(skill => {
      const totalQuestions = simulation.questions.filter(q => q.skill === skill).length;
      skillPerformance[skill] = (skillPerformance[skill] / totalQuestions) * 100;
    });

    // Predicción de puntaje PAES
    const predictedPAESScore = this.calculatePredictedPAESScore(score, simulation.prueba);

    const result: PAESSimulationResult = {
      id: `result-${simulationId}-${Date.now()}`,
      simulationId,
      userId,
      score,
      totalQuestions: simulation.totalQuestions,
      correctAnswers,
      timeSpent: totalTimeSpent,
      answers: processedAnswers,
      skillPerformance,
      completedAt: new Date().toISOString(),
      predictedPAESScore
    };

    // Guardar en localStorage temporalmente
    const existingResults = JSON.parse(localStorage.getItem('simulation-results') || '[]');
    existingResults.push(result);
    localStorage.setItem('simulation-results', JSON.stringify(existingResults));

    console.log(`✅ Resultado procesado: ${score.toFixed(1)}% (${correctAnswers}/${simulation.totalQuestions})`);
    return result;
  }

  /**
   * OBTENER RESULTADOS HISTÓRICOS
   */
  async getUserSimulationResults(userId: string): Promise<PAESSimulationResult[]> {
    const results = JSON.parse(localStorage.getItem('simulation-results') || '[]');
    return results.filter((result: PAESSimulationResult) => result.userId === userId);
  }

  // Métodos auxiliares
  private getSimulationConfig(prueba: string) {
    const configs: Record<string, { duration: number; totalQuestions: number }> = {
      'COMPETENCIA_LECTORA': { duration: 90, totalQuestions: 65 },
      'MATEMATICA_1': { duration: 140, totalQuestions: 65 },
      'MATEMATICA_2': { duration: 140, totalQuestions: 65 },
      'CIENCIAS': { duration: 140, totalQuestions: 80 },
      'HISTORIA': { duration: 90, totalQuestions: 65 }
    };
    return configs[prueba] || { duration: 90, totalQuestions: 30 };
  }

  private getPruebaDisplayName(prueba: string): string {
    const names: Record<string, string> = {
      'COMPETENCIA_LECTORA': 'Comprensión Lectora',
      'MATEMATICA_1': 'Matemática M1',
      'MATEMATICA_2': 'Matemática M2',
      'CIENCIAS': 'Ciencias',
      'HISTORIA': 'Historia y Geografía'
    };
    return names[prueba] || prueba;
  }

  private mapDifficulty(nivel?: string): 'BASICO' | 'INTERMEDIO' | 'AVANZADO' {
    if (!nivel) return 'INTERMEDIO';
    const upper = nivel.toUpperCase();
    if (upper.includes('BASICO') || upper.includes('FÁCIL')) return 'BASICO';
    if (upper.includes('AVANZADO') || upper.includes('DIFÍCIL')) return 'AVANZADO';
    return 'INTERMEDIO';
  }

  private mapSkill(competencia?: string): string {
    if (!competencia) return 'INTERPRET_RELATE';
    if (competencia.includes('localizar')) return 'TRACK_LOCATE';
    if (competencia.includes('evaluar')) return 'EVALUATE_REFLECT';
    return 'INTERPRET_RELATE';
  }

  private generateSimulationExplanation(pregunta: any): string {
    return `Explicación oficial: Esta pregunta evalúa ${pregunta.competencia_especifica || 'competencias fundamentales'} según estándares PAES.`;
  }

  private calculatePredictedPAESScore(percentage: number, prueba: string): number {
    // Fórmula aproximada de conversión a puntaje PAES
    const baseScore = Math.round((percentage / 100) * 700 + 150);
    return Math.min(850, Math.max(150, baseScore));
  }

  private createFallbackSimulation(prueba: string, type: 'official' | 'practice'): PAESSimulation {
    const config = this.getSimulationConfig(prueba);
    
    return {
      id: `fallback-${prueba.toLowerCase()}-${Date.now()}`,
      name: `Simulación ${type === 'official' ? 'Oficial' : 'Práctica'} ${this.getPruebaDisplayName(prueba)}`,
      type,
      prueba,
      duration: config.duration,
      totalQuestions: 10, // Simulación reducida
      questions: this.createFallbackQuestions(prueba, 10),
      isCompleted: false,
      metadata: {
        officialFormat: false,
        timedMode: false,
        allowNavigation: true,
        showAnswers: true
      }
    };
  }

  private createFallbackQuestions(prueba: string, count: number): DiagnosticQuestion[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `fallback-${prueba}-${i + 1}`,
      question: `Pregunta ${i + 1} de ${this.getPruebaDisplayName(prueba)}`,
      options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
      correctAnswer: 'Opción A',
      explanation: 'Explicación de la respuesta correcta.',
      difficulty: 'INTERMEDIO' as const,
      skill: 'INTERPRET_RELATE',
      prueba,
      metadata: {
        source: 'fallback'
      }
    }));
  }

  private async getSimulation(simulationId: string): Promise<PAESSimulation | null> {
    // En una implementación real, esto vendría de la base de datos
    const simulations = JSON.parse(localStorage.getItem('simulations') || '[]');
    return simulations.find((sim: PAESSimulation) => sim.id === simulationId) || null;
  }
}

export const paesSimulationService = PAESSimulationService.getInstance();
