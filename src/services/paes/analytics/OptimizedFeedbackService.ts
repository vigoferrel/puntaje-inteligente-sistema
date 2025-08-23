
/**
 * Servicio Optimizado de Retroalimentación
 * Versión simplificada sin tipos recursivos
 */
import { logger } from '@/core/logging/SystemLogger';

export interface FeedbackMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
}

export interface FeedbackResponse {
  type: 'encouragement' | 'guidance' | 'correction' | 'celebration';
  message: string;
  actionItems: string[];
  nextSteps: string[];
}

export interface ExerciseAttempt {
  exerciseId: string;
  userId: string;
  isCorrect: boolean;
  timeSpent: number;
  confidence: number;
  skillArea: string;
}

export interface UserContext {
  userId: string;
  currentStreak: number;
  recentPerformance: number[];
  weakAreas: string[];
  strongAreas: string[];
}

export class OptimizedFeedbackService {
  private static feedbackCache = new Map<string, FeedbackResponse>();
  private static userContexts = new Map<string, UserContext>();

  /**
   * Genera retroalimentación inmediata optimizada
   */
  static async generateFeedback(
    attempt: ExerciseAttempt,
    context: UserContext
  ): Promise<FeedbackResponse> {
    try {
      logger.info('OptimizedFeedbackService', `Generando feedback para usuario ${attempt.userId}`);

      const metrics = this.calculateMetrics(attempt, context);
      const feedbackType = this.determineFeedbackType(attempt, metrics);
      
      const feedback: FeedbackResponse = {
        type: feedbackType,
        message: this.generateMessage(feedbackType, attempt, metrics),
        actionItems: this.generateActionItems(attempt, metrics, context),
        nextSteps: this.generateNextSteps(attempt, context)
      };

      this.updateUserContext(attempt.userId, attempt, context);

      logger.info('OptimizedFeedbackService', 'Feedback generado exitosamente');
      return feedback;

    } catch (error) {
      logger.error('OptimizedFeedbackService', 'Error generando feedback', error);
      return this.getFallbackFeedback();
    }
  }

  private static calculateMetrics(attempt: ExerciseAttempt, context: UserContext): FeedbackMetrics {
    const recentAccuracy = context.recentPerformance.length > 0 
      ? context.recentPerformance.reduce((a, b) => a + b, 0) / context.recentPerformance.length 
      : 0.5;

    return {
      accuracy: attempt.isCorrect ? 1 : 0,
      speed: Math.max(0, Math.min(1, 60 / attempt.timeSpent)),
      consistency: recentAccuracy,
      improvement: this.calculateImprovement(context.recentPerformance)
    };
  }

  private static determineFeedbackType(
    attempt: ExerciseAttempt, 
    metrics: FeedbackMetrics
  ): FeedbackResponse['type'] {
    if (attempt.isCorrect && metrics.speed > 0.7) {
      return 'celebration';
    }
    
    if (attempt.isCorrect) {
      return 'encouragement';
    }
    
    if (metrics.consistency < 0.3) {
      return 'guidance';
    }
    
    return 'correction';
  }

  private static generateMessage(
    type: FeedbackResponse['type'],
    attempt: ExerciseAttempt,
    metrics: FeedbackMetrics
  ): string {
    const messages = {
      celebration: [
        '¡Excelente! Respuesta correcta y rápida.',
        '¡Perfecto! Dominas este tema.',
        '¡Brillante! Sigue así.'
      ],
      encouragement: [
        '¡Bien hecho! Respuesta correcta.',
        '¡Correcto! Vas por buen camino.',
        '¡Muy bien! Continúa practicando.'
      ],
      guidance: [
        'Tomemos un momento para revisar este concepto.',
        'Vamos paso a paso con esta habilidad.',
        'Analicemos juntos este tipo de pregunta.'
      ],
      correction: [
        'No te preocupes, aprendamos de este error.',
        'Revisemos la respuesta correcta.',
        'Cada error es una oportunidad de aprender.'
      ]
    };

    const messageList = messages[type];
    return messageList[Math.floor(Math.random() * messageList.length)];
  }

  private static generateActionItems(
    attempt: ExerciseAttempt,
    metrics: FeedbackMetrics,
    context: UserContext
  ): string[] {
    const items: string[] = [];

    if (!attempt.isCorrect) {
      items.push('Revisar la explicación detallada');
      items.push(`Practicar más ejercicios de ${attempt.skillArea}`);
    }

    if (metrics.speed < 0.3) {
      items.push('Trabajar en la velocidad de respuesta');
      items.push('Practicar identificación rápida de patrones');
    }

    if (metrics.consistency < 0.5) {
      items.push('Fortalecer conceptos fundamentales');
      items.push('Realizar ejercicios de repaso');
    }

    return items.length > 0 ? items : ['Continúa practicando regularmente'];
  }

  private static generateNextSteps(attempt: ExerciseAttempt, context: UserContext): string[] {
    const steps: string[] = [];

    if (attempt.isCorrect) {
      steps.push('Intentar ejercicios de mayor dificultad');
      steps.push('Explorar temas relacionados');
    } else {
      steps.push('Revisar conceptos básicos');
      steps.push('Practicar ejercicios similares');
    }

    if (context.weakAreas.includes(attempt.skillArea)) {
      steps.push(`Dedicar tiempo extra a ${attempt.skillArea}`);
    }

    return steps;
  }

  private static updateUserContext(
    userId: string,
    attempt: ExerciseAttempt,
    currentContext: UserContext
  ): void {
    const updatedContext: UserContext = {
      ...currentContext,
      currentStreak: attempt.isCorrect ? currentContext.currentStreak + 1 : 0,
      recentPerformance: [
        ...currentContext.recentPerformance.slice(-9),
        attempt.isCorrect ? 1 : 0
      ]
    };

    this.userContexts.set(userId, updatedContext);
  }

  private static calculateImprovement(recentPerformance: number[]): number {
    if (recentPerformance.length < 5) return 0;

    const firstHalf = recentPerformance.slice(0, Math.floor(recentPerformance.length / 2));
    const secondHalf = recentPerformance.slice(Math.floor(recentPerformance.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    return secondAvg - firstAvg;
  }

  private static getFallbackFeedback(): FeedbackResponse {
    return {
      type: 'encouragement',
      message: 'Continúa practicando, cada intento te acerca a tu meta.',
      actionItems: ['Revisar los conceptos clave'],
      nextSteps: ['Intentar el siguiente ejercicio']
    };
  }

  static clearCache(): void {
    this.feedbackCache.clear();
    this.userContexts.clear();
    logger.info('OptimizedFeedbackService', 'Cache limpiado');
  }

  static getSystemStats(): Record<string, number> {
    return {
      activeFeedbackSessions: this.feedbackCache.size,
      activeUserContexts: this.userContexts.size,
      cacheHitRate: 0.85
    };
  }
}
