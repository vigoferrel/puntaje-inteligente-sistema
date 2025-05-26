
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

interface FeedbackTrigger {
  type: 'achievement' | 'struggle' | 'milestone' | 'recommendation' | 'warning';
  priority: 'high' | 'medium' | 'low';
  message: string;
  actionData?: any;
}

interface StudentFeedback {
  userId: string;
  triggers: FeedbackTrigger[];
  recommendations: string[];
  encouragements: string[];
  nextSteps: string[];
}

interface InstitutionFeedback {
  type: 'daily_summary' | 'weekly_report' | 'alert' | 'recommendation';
  title: string;
  content: string;
  metrics: any;
  affectedStudents: number;
}

export class RealTimeFeedbackOrchestrator {
  
  /**
   * Procesa feedback en tiempo real para estudiante
   */
  static async processStudentFeedback(
    userId: string, 
    interactionData: {
      exerciseId: string;
      isCorrect: boolean;
      timeSpent: number;
      tool: string;
      difficulty: string;
    }
  ): Promise<void> {
    try {
      logger.info('FeedbackOrchestrator', 'Procesando feedback estudiantil', { userId });

      // Generar triggers de feedback
      const triggers = await this.generateFeedbackTriggers(userId, interactionData);
      
      // Procesar cada trigger
      for (const trigger of triggers) {
        await this.processTrigger(userId, trigger);
      }

      // Generar feedback consolidado
      const studentFeedback = await this.generateStudentFeedback(userId, triggers);
      
      // Enviar notificaciones
      await this.sendStudentNotifications(userId, studentFeedback);

    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error procesando feedback estudiantil', error);
    }
  }

  /**
   * Genera triggers de feedback basados en la interacción
   */
  private static async generateFeedbackTriggers(userId: string, interactionData: any): Promise<FeedbackTrigger[]> {
    const triggers: FeedbackTrigger[] = [];

    try {
      // Obtener contexto del usuario
      const userContext = await this.getUserContext(userId);

      // Trigger por respuesta correcta consecutiva
      if (interactionData.isCorrect && userContext.currentStreak >= 5) {
        triggers.push({
          type: 'achievement',
          priority: 'medium',
          message: `¡Excelente! Llevas ${userContext.currentStreak} respuestas correctas consecutivas`,
          actionData: { streak: userContext.currentStreak }
        });
      }

      // Trigger por dificultad con ejercicios
      if (!interactionData.isCorrect && userContext.recentAccuracy < 0.3) {
        triggers.push({
          type: 'struggle',
          priority: 'high',
          message: 'Detectamos que puedes necesitar apoyo adicional en esta área',
          actionData: { tool: interactionData.tool, difficulty: interactionData.difficulty }
        });
      }

      // Trigger por tiempo excesivo
      if (interactionData.timeSpent > 300) { // más de 5 minutos
        triggers.push({
          type: 'recommendation',
          priority: 'medium',
          message: 'Considera revisar los conceptos básicos antes de continuar',
          actionData: { suggestedTool: 'qna' }
        });
      }

      // Trigger por milestone de progreso
      if (userContext.totalExercises > 0 && userContext.totalExercises % 50 === 0) {
        triggers.push({
          type: 'milestone',
          priority: 'high',
          message: `¡Felicitaciones! Has completado ${userContext.totalExercises} ejercicios`,
          actionData: { milestone: userContext.totalExercises }
        });
      }

      // Trigger por inactividad
      const daysSinceLastActivity = userContext.daysSinceLastActivity;
      if (daysSinceLastActivity >= 3) {
        triggers.push({
          type: 'warning',
          priority: 'medium',
          message: 'Te echamos de menos. ¡Continúa con tu preparación PAES!',
          actionData: { daysInactive: daysSinceLastActivity }
        });
      }

      return triggers;

    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error generando triggers', error);
      return [];
    }
  }

  /**
   * Procesa un trigger específico
   */
  private static async processTrigger(userId: string, trigger: FeedbackTrigger): Promise<void> {
    try {
      // Registrar el trigger
      await supabase
        .from('system_metrics')
        .insert({
          user_id: userId,
          metric_type: 'feedback_trigger',
          metric_value: this.getTriggerValue(trigger),
          context: {
            triggerType: trigger.type,
            priority: trigger.priority,
            message: trigger.message,
            actionData: trigger.actionData,
            timestamp: new Date().toISOString()
          }
        });

      // Acciones específicas por tipo de trigger
      switch (trigger.type) {
        case 'achievement':
          await this.processAchievementTrigger(userId, trigger);
          break;
        case 'struggle':
          await this.processStruggleTrigger(userId, trigger);
          break;
        case 'milestone':
          await this.processMilestoneTrigger(userId, trigger);
          break;
        case 'recommendation':
          await this.processRecommendationTrigger(userId, trigger);
          break;
        case 'warning':
          await this.processWarningTrigger(userId, trigger);
          break;
      }

    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error procesando trigger', error);
    }
  }

  /**
   * Genera feedback consolidado para el estudiante
   */
  private static async generateStudentFeedback(userId: string, triggers: FeedbackTrigger[]): Promise<StudentFeedback> {
    const userContext = await this.getUserContext(userId);
    
    const feedback: StudentFeedback = {
      userId,
      triggers,
      recommendations: await this.generateRecommendations(userId, userContext),
      encouragements: this.generateEncouragements(userContext),
      nextSteps: this.generateNextSteps(userContext)
    };

    return feedback;
  }

  /**
   * Envía notificaciones al estudiante
   */
  private static async sendStudentNotifications(userId: string, feedback: StudentFeedback): Promise<void> {
    try {
      // Filtrar triggers de alta prioridad para notificación inmediata
      const highPriorityTriggers = feedback.triggers.filter(t => t.priority === 'high');

      for (const trigger of highPriorityTriggers) {
        await supabase
          .from('user_notifications')
          .insert({
            user_id: userId,
            notification_type: `feedback_${trigger.type}`,
            title: this.getTriggerTitle(trigger),
            message: trigger.message,
            priority: trigger.priority,
            action_data: trigger.actionData || {}
          });
      }

      // Notificación consolidada diaria
      if (feedback.recommendations.length > 0) {
        await this.scheduleConsolidatedNotification(userId, feedback);
      }

    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error enviando notificaciones', error);
    }
  }

  /**
   * Procesa feedback institucional
   */
  static async processInstitutionalFeedback(): Promise<void> {
    try {
      logger.info('FeedbackOrchestrator', 'Procesando feedback institucional');

      // Generar resumen diario
      const dailySummary = await this.generateDailySummary();
      await this.sendInstitutionalFeedback(dailySummary);

      // Detectar alertas
      const alerts = await this.detectInstitutionalAlerts();
      for (const alert of alerts) {
        await this.sendInstitutionalFeedback(alert);
      }

    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error procesando feedback institucional', error);
    }
  }

  // Métodos auxiliares

  private static async getUserContext(userId: string): Promise<any> {
    try {
      const [metrics, progress, recentAttempts] = await Promise.all([
        supabase.from('neural_metrics').select('*').eq('user_id', userId),
        supabase.from('user_node_progress').select('*').eq('user_id', userId),
        supabase.from('user_exercise_attempts').select('*').eq('user_id', userId)
          .order('created_at', { ascending: false }).limit(10)
      ]);

      const totalExercises = this.getMetricValue(metrics.data, 'exercises_completed');
      const recentCorrect = recentAttempts.data?.filter(a => a.is_correct).length || 0;
      const recentAccuracy = recentAttempts.data?.length > 0 ? recentCorrect / recentAttempts.data.length : 0;
      
      // Calcular racha actual
      let currentStreak = 0;
      for (const attempt of recentAttempts.data || []) {
        if (attempt.is_correct) {
          currentStreak++;
        } else {
          break;
        }
      }

      // Calcular días desde última actividad
      const lastActivity = recentAttempts.data?.[0]?.created_at;
      const daysSinceLastActivity = lastActivity 
        ? Math.floor((Date.now() - new Date(lastActivity).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      return {
        totalExercises,
        recentAccuracy,
        currentStreak,
        daysSinceLastActivity,
        averageProgress: this.calculateAverageProgress(progress.data)
      };

    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error obteniendo contexto de usuario', error);
      return {
        totalExercises: 0,
        recentAccuracy: 0,
        currentStreak: 0,
        daysSinceLastActivity: 0,
        averageProgress: 0
      };
    }
  }

  private static async generateRecommendations(userId: string, context: any): Promise<string[]> {
    const recommendations: string[] = [];

    if (context.recentAccuracy < 0.5) {
      recommendations.push('Considera usar LectoGuía para reforzar conceptos');
    }

    if (context.averageProgress < 30) {
      recommendations.push('Realiza la evaluación diagnóstica para personalizar tu estudio');
    }

    if (context.currentStreak === 0 && context.totalExercises > 10) {
      recommendations.push('Prueba ejercicios de menor dificultad para recuperar confianza');
    }

    return recommendations;
  }

  private static generateEncouragements(context: any): string[] {
    const encouragements: string[] = [];

    if (context.currentStreak >= 3) {
      encouragements.push('¡Vas muy bien! Mantén el momentum');
    }

    if (context.averageProgress > 70) {
      encouragements.push('¡Excelente progreso! Estás muy cerca de tu meta');
    }

    if (context.totalExercises >= 100) {
      encouragements.push('¡Eres muy constante! La práctica hace al maestro');
    }

    return encouragements.length > 0 ? encouragements : ['¡Sigue adelante! Cada ejercicio te acerca más a tu meta PAES'];
  }

  private static generateNextSteps(context: any): string[] {
    const steps: string[] = [];

    if (context.averageProgress < 30) {
      steps.push('Completa la evaluación diagnóstica');
      steps.push('Establece una rutina de estudio diaria');
    } else if (context.averageProgress < 70) {
      steps.push('Practica 15-20 ejercicios diarios');
      steps.push('Utiliza diferentes herramientas según tus necesidades');
    } else {
      steps.push('Enfócate en ejercicios de alta dificultad');
      steps.push('Prepárate para simulacros PAES');
    }

    return steps;
  }

  // Procesadores específicos de triggers

  private static async processAchievementTrigger(userId: string, trigger: FeedbackTrigger): Promise<void> {
    // Registrar logro
    await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_type: 'streak',
        achievement_id: `streak_${trigger.actionData?.streak}`,
        title: 'Racha de aciertos',
        description: trigger.message,
        points_awarded: trigger.actionData?.streak * 10 || 50,
        category: 'performance'
      });
  }

  private static async processStruggleTrigger(userId: string, trigger: FeedbackTrigger): Promise<void> {
    // Generar recomendación de apoyo
    const recommendedTool = trigger.actionData?.tool === 'diagnostic' ? 'lectoguia' : 'qna';
    
    await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        notification_type: 'support_recommendation',
        title: 'Apoyo personalizado disponible',
        message: `Te recomendamos usar ${recommendedTool} para reforzar conceptos`,
        priority: 'high',
        action_data: { recommendedTool }
      });
  }

  private static async processMilestoneTrigger(userId: string, trigger: FeedbackTrigger): Promise<void> {
    // Registrar milestone
    await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_type: 'milestone',
        achievement_id: `exercises_${trigger.actionData?.milestone}`,
        title: 'Milestone de ejercicios',
        description: trigger.message,
        points_awarded: 100,
        category: 'progress',
        rarity: trigger.actionData?.milestone >= 500 ? 'rare' : 'common'
      });
  }

  private static async processRecommendationTrigger(userId: string, trigger: FeedbackTrigger): Promise<void> {
    // Programar recomendación para mostrar más tarde
    await this.scheduleDelayedRecommendation(userId, trigger);
  }

  private static async processWarningTrigger(userId: string, trigger: FeedbackTrigger): Promise<void> {
    // Enviar recordatorio motivacional
    await supabase
      .from('user_notifications')
      .insert({
        user_id: userId,
        notification_type: 'engagement_reminder',
        title: '¡Te echamos de menos!',
        message: trigger.message,
        priority: 'medium',
        action_data: { daysInactive: trigger.actionData?.daysInactive }
      });
  }

  // Métodos para feedback institucional

  private static async generateDailySummary(): Promise<InstitutionFeedback> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayActivity } = await supabase
      .from('user_exercise_attempts')
      .select('user_id, is_correct')
      .gte('created_at', today.toISOString());

    const uniqueStudents = new Set(todayActivity?.map(a => a.user_id)).size;
    const totalExercises = todayActivity?.length || 0;
    const correctAnswers = todayActivity?.filter(a => a.is_correct).length || 0;
    const accuracy = totalExercises > 0 ? correctAnswers / totalExercises : 0;

    return {
      type: 'daily_summary',
      title: 'Resumen Diario de Actividad',
      content: `Hoy ${uniqueStudents} estudiantes completaron ${totalExercises} ejercicios con ${Math.round(accuracy * 100)}% de precisión`,
      metrics: {
        activeStudents: uniqueStudents,
        totalExercises,
        averageAccuracy: accuracy,
        date: today.toISOString()
      },
      affectedStudents: uniqueStudents
    };
  }

  private static async detectInstitutionalAlerts(): Promise<InstitutionFeedback[]> {
    const alerts: InstitutionFeedback[] = [];

    // Detectar estudiantes inactivos
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const { data: inactiveStudents } = await supabase
      .from('neural_metrics')
      .select('user_id')
      .lt('last_calculated_at', weekAgo.toISOString());

    if (inactiveStudents && inactiveStudents.length > 0) {
      alerts.push({
        type: 'alert',
        title: 'Estudiantes Inactivos Detectados',
        content: `${inactiveStudents.length} estudiantes no han tenido actividad en la última semana`,
        metrics: { inactiveCount: inactiveStudents.length },
        affectedStudents: inactiveStudents.length
      });
    }

    return alerts;
  }

  private static async sendInstitutionalFeedback(feedback: InstitutionFeedback): Promise<void> {
    try {
      await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_feedback',
          metric_value: feedback.affectedStudents,
          context: feedback,
          recorded_at: new Date().toISOString()
        });
    } catch (error) {
      logger.error('FeedbackOrchestrator', 'Error enviando feedback institucional', error);
    }
  }

  // Métodos auxiliares

  private static getTriggerValue(trigger: FeedbackTrigger): number {
    const priorityValues = { high: 3, medium: 2, low: 1 };
    return priorityValues[trigger.priority];
  }

  private static getTriggerTitle(trigger: FeedbackTrigger): string {
    const titles = {
      achievement: '¡Logro desbloqueado!',
      struggle: 'Apoyo disponible',
      milestone: '¡Hito alcanzado!',
      recommendation: 'Recomendación personalizada',
      warning: 'Recordatorio de estudio'
    };
    return titles[trigger.type];
  }

  private static async scheduleConsolidatedNotification(userId: string, feedback: StudentFeedback): Promise<void> {
    // Programar notificación para el final del día
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0); // 7 PM

    await supabase
      .from('scheduled_notifications')
      .insert({
        user_id: userId,
        notification_type: 'daily_feedback_summary',
        send_at: tomorrow.toISOString(),
        content: {
          recommendations: feedback.recommendations,
          encouragements: feedback.encouragements,
          nextSteps: feedback.nextSteps
        }
      });
  }

  private static async scheduleDelayedRecommendation(userId: string, trigger: FeedbackTrigger): Promise<void> {
    const in30Minutes = new Date(Date.now() + 30 * 60 * 1000);

    await supabase
      .from('scheduled_notifications')
      .insert({
        user_id: userId,
        notification_type: 'delayed_recommendation',
        send_at: in30Minutes.toISOString(),
        content: {
          message: trigger.message,
          actionData: trigger.actionData
        }
      });
  }

  private static getMetricValue(metrics: any[], type: string): number {
    const metric = metrics?.find(m => m.metric_type === type);
    return metric ? metric.current_value : 0;
  }

  private static calculateAverageProgress(progressData: any[]): number {
    if (!progressData || progressData.length === 0) return 0;
    const total = progressData.reduce((sum, item) => sum + (item.progress || 0), 0);
    return total / progressData.length;
  }
}
