
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

interface ExerciseInteraction {
  userId: string;
  exerciseId: string;
  toolSource: 'lectoguia' | 'superpaes' | 'diagnostic' | 'training' | 'qna' | 'adaptive' | 'general';
  interactionType: 'view' | 'answer' | 'complete' | 'skip' | 'help' | 'retry';
  response?: string;
  isCorrect?: boolean;
  timeSpent: number;
  difficulty: string;
  prueba: TPAESPrueba;
  skill: TPAESHabilidad;
  metadata?: any;
}

interface LearningSession {
  userId: string;
  toolSource: string;
  sessionData: {
    startTime: string;
    endTime?: string;
    exercisesCompleted: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    skillsWorked: TPAESHabilidad[];
    progressMade: number;
  };
}

export class UniversalExerciseTrackingService {
  
  /**
   * Registra una interacción de ejercicio desde cualquier herramienta
   */
  static async trackExerciseInteraction(interaction: ExerciseInteraction): Promise<void> {
    try {
      logger.info('UniversalTracking', 'Registrando interacción', {
        userId: interaction.userId,
        tool: interaction.toolSource,
        type: interaction.interactionType
      });

      // Registrar en tabla de interacciones
      const { error: interactionError } = await supabase
        .from('user_exercise_attempts')
        .insert({
          user_id: interaction.userId,
          exercise_id: interaction.exerciseId,
          answer: interaction.response || '',
          is_correct: interaction.isCorrect || false,
          time_taken_seconds: interaction.timeSpent,
          confidence_level: interaction.metadata?.confidence || null,
          created_at: new Date().toISOString()
        });

      if (interactionError) {
        logger.error('UniversalTracking', 'Error registrando interacción', interactionError);
      }

      // Actualizar métricas neurales
      await this.updateNeuralMetrics(interaction);

      // Registrar progreso por herramienta
      await this.updateToolProgress(interaction);

      // Capturar para análisis institucional
      await this.captureForInstitutionalAnalytics(interaction);

    } catch (error) {
      logger.error('UniversalTracking', 'Error en tracking de ejercicio', error);
    }
  }

  /**
   * Actualiza métricas neurales basadas en la interacción
   */
  private static async updateNeuralMetrics(interaction: ExerciseInteraction): Promise<void> {
    const metrics = [
      {
        user_id: interaction.userId,
        metric_type: 'exercises_completed',
        dimension_id: interaction.toolSource,
        current_value: 1,
        trend: 'increasing',
        metadata: {
          tool: interaction.toolSource,
          prueba: interaction.prueba,
          skill: interaction.skill,
          difficulty: interaction.difficulty
        }
      },
      {
        user_id: interaction.userId,
        metric_type: 'accuracy_rate',
        dimension_id: `${interaction.toolSource}_${interaction.prueba}`,
        current_value: interaction.isCorrect ? 1 : 0,
        trend: interaction.isCorrect ? 'increasing' : 'decreasing',
        metadata: {
          tool: interaction.toolSource,
          prueba: interaction.prueba,
          skill: interaction.skill
        }
      },
      {
        user_id: interaction.userId,
        metric_type: 'time_efficiency',
        dimension_id: interaction.skill,
        current_value: interaction.timeSpent,
        trend: 'stable',
        metadata: {
          tool: interaction.toolSource,
          difficulty: interaction.difficulty
        }
      }
    ];

    for (const metric of metrics) {
      await supabase
        .from('neural_metrics')
        .upsert(metric, { 
          onConflict: 'user_id,metric_type,dimension_id',
          ignoreDuplicates: false 
        });
    }
  }

  /**
   * Actualiza progreso específico por herramienta
   */
  private static async updateToolProgress(interaction: ExerciseInteraction): Promise<void> {
    const progressKey = `${interaction.toolSource}_progress`;
    
    const { error } = await supabase
      .from('system_metrics')
      .insert({
        user_id: interaction.userId,
        metric_type: progressKey,
        metric_value: interaction.isCorrect ? 1 : 0,
        context: {
          tool: interaction.toolSource,
          exerciseId: interaction.exerciseId,
          prueba: interaction.prueba,
          skill: interaction.skill,
          difficulty: interaction.difficulty,
          timeSpent: interaction.timeSpent,
          interactionType: interaction.interactionType,
          timestamp: new Date().toISOString()
        }
      });

    if (error) {
      logger.warn('UniversalTracking', 'Error actualizando progreso por herramienta', error);
    }
  }

  /**
   * Captura datos para análisis institucional
   */
  private static async captureForInstitutionalAnalytics(interaction: ExerciseInteraction): Promise<void> {
    const analyticsData = {
      userId: interaction.userId,
      tool: interaction.toolSource,
      prueba: interaction.prueba,
      skill: interaction.skill,
      difficulty: interaction.difficulty,
      isCorrect: interaction.isCorrect,
      timeSpent: interaction.timeSpent,
      timestamp: new Date().toISOString()
    };

    // Esto se puede expandir para generar reportes institucionales
    logger.info('InstitutionalAnalytics', 'Datos capturados', analyticsData);
  }

  /**
   * Registra sesión de aprendizaje completa
   */
  static async trackLearningSession(session: LearningSession): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          user_id: session.userId,
          metric_type: 'learning_session',
          metric_value: session.sessionData.exercisesCompleted,
          context: {
            tool: session.toolSource,
            sessionData: session.sessionData,
            capturedAt: new Date().toISOString()
          }
        });

      if (error) {
        logger.error('UniversalTracking', 'Error registrando sesión de aprendizaje', error);
      }

    } catch (error) {
      logger.error('UniversalTracking', 'Error en tracking de sesión', error);
    }
  }

  /**
   * Obtiene métricas consolidadas por usuario
   */
  static async getUserConsolidatedMetrics(userId: string): Promise<any> {
    try {
      const { data: metrics, error } = await supabase
        .from('neural_metrics')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        logger.error('UniversalTracking', 'Error obteniendo métricas consolidadas', error);
        return null;
      }

      // Consolidar métricas por herramienta
      const consolidated = {
        lectoguia: this.consolidateToolMetrics(metrics, 'lectoguia'),
        superpaes: this.consolidateToolMetrics(metrics, 'superpaes'),
        diagnostic: this.consolidateToolMetrics(metrics, 'diagnostic'),
        training: this.consolidateToolMetrics(metrics, 'training'),
        qna: this.consolidateToolMetrics(metrics, 'qna'),
        adaptive: this.consolidateToolMetrics(metrics, 'adaptive'),
        overall: this.calculateOverallMetrics(metrics)
      };

      return consolidated;

    } catch (error) {
      logger.error('UniversalTracking', 'Error consolidando métricas', error);
      return null;
    }
  }

  /**
   * Consolida métricas por herramienta específica
   */
  private static consolidateToolMetrics(metrics: any[], tool: string): any {
    const toolMetrics = metrics.filter(m => m.dimension_id === tool || m.dimension_id.startsWith(tool));
    
    return {
      exercisesCompleted: this.getMetricValue(toolMetrics, 'exercises_completed'),
      averageAccuracy: this.getMetricValue(toolMetrics, 'accuracy_rate'),
      timeEfficiency: this.getMetricValue(toolMetrics, 'time_efficiency'),
      lastActivity: this.getLatestActivity(toolMetrics)
    };
  }

  /**
   * Calcula métricas generales
   */
  private static calculateOverallMetrics(metrics: any[]): any {
    const totalExercises = metrics
      .filter(m => m.metric_type === 'exercises_completed')
      .reduce((sum, m) => sum + m.current_value, 0);

    const accuracyMetrics = metrics.filter(m => m.metric_type === 'accuracy_rate');
    const averageAccuracy = accuracyMetrics.length > 0 
      ? accuracyMetrics.reduce((sum, m) => sum + m.current_value, 0) / accuracyMetrics.length 
      : 0;

    return {
      totalExercises,
      averageAccuracy,
      toolsUsed: new Set(metrics.map(m => m.dimension_id.split('_')[0])).size,
      lastActivity: new Date().toISOString()
    };
  }

  private static getMetricValue(metrics: any[], type: string): number {
    const metric = metrics.find(m => m.metric_type === type);
    return metric ? metric.current_value : 0;
  }

  private static getLatestActivity(metrics: any[]): string {
    const latest = metrics.reduce((latest, current) => {
      return new Date(current.last_calculated_at) > new Date(latest.last_calculated_at) 
        ? current : latest;
    }, metrics[0]);

    return latest ? latest.last_calculated_at : new Date().toISOString();
  }
}
