
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';
import { v4 as uuidv4 } from 'uuid';

interface StudentFeedback {
  userId: string;
  exerciseId: string;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: string;
  skill: TPAESHabilidad;
  prueba: TPAESPrueba;
  toolSource: string;
  feedback: {
    immediate: string;
    explanation: string;
    nextSteps: string[];
    encouragement: string;
  };
}

interface InstitutionFeedback {
  institutionId: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  alertLevel: 'green' | 'yellow' | 'red';
  recommendations: string[];
  weakAreas: string[];
  strongAreas: string[];
  timestamp: string;
  [key: string]: any; // Index signature for Json compatibility
}

interface ParentFeedback {
  parentId: string;
  studentId: string;
  weeklyProgress: number;
  exercisesCompleted: number;
  timeSpent: number;
  recommendations: string[];
  encouragements: string[];
  nextSteps: string[];
}

export class RealTimeFeedbackOrchestrator {
  
  /**
   * Orquesta retroalimentación en tiempo real para estudiantes
   */
  static async orchestrateStudentFeedback(
    userId: string,
    exerciseResult: any,
    toolSource: string
  ): Promise<StudentFeedback> {
    logger.info('RealTimeFeedback', 'Orquestando retroalimentación estudiantil', {
      userId, toolSource, exerciseId: exerciseResult.exerciseId
    });

    try {
      // Generar retroalimentación personalizada
      const feedback = await this.generatePersonalizedFeedback(userId, exerciseResult);
      
      // Capturar interacción completa
      await this.captureStudentInteraction(userId, exerciseResult, toolSource, feedback);
      
      // Actualizar métricas neurales
      await this.updateNeuralMetrics(userId, exerciseResult, toolSource);
      
      // Enviar notificaciones si es necesario
      await this.sendAdaptiveNotifications(userId, feedback);
      
      return {
        userId,
        exerciseId: exerciseResult.exerciseId,
        isCorrect: exerciseResult.isCorrect,
        timeSpent: exerciseResult.timeSpent,
        difficulty: exerciseResult.difficulty,
        skill: exerciseResult.skill,
        prueba: exerciseResult.prueba,
        toolSource,
        feedback
      };
      
    } catch (error) {
      logger.error('RealTimeFeedback', 'Error orquestando retroalimentación', error);
      throw error;
    }
  }

  /**
   * Genera retroalimentación personalizada
   */
  private static async generatePersonalizedFeedback(
    userId: string, 
    exerciseResult: any
  ): Promise<any> {
    // Obtener historial del usuario
    const userHistory = await this.getUserHistory(userId);
    
    // Analizar patrones de respuesta
    const patterns = this.analyzeResponsePatterns(userHistory, exerciseResult);
    
    // Generar feedback adaptativo
    return this.createAdaptiveFeedback(exerciseResult, patterns);
  }

  /**
   * Obtiene historial del usuario
   */
  private static async getUserHistory(userId: string): Promise<any[]> {
    const { data: history, error } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('RealTimeFeedback', 'Error obteniendo historial', error);
      return [];
    }

    return history || [];
  }

  /**
   * Analiza patrones de respuesta
   */
  private static analyzeResponsePatterns(history: any[], currentResult: any): any {
    const patterns = {
      recentAccuracy: 0,
      timeEfficiency: 'normal',
      difficultyProgression: 'stable',
      subjectStrength: 'balanced',
      mistakePatterns: []
    };

    if (history.length === 0) return patterns;

    // Calcular precisión reciente
    const recentAttempts = history.slice(0, 10);
    patterns.recentAccuracy = recentAttempts.filter(a => a.is_correct).length / recentAttempts.length;

    // Analizar eficiencia de tiempo
    const avgTime = recentAttempts.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) / recentAttempts.length;
    if (currentResult.timeSpent < avgTime * 0.7) {
      patterns.timeEfficiency = 'fast';
    } else if (currentResult.timeSpent > avgTime * 1.3) {
      patterns.timeEfficiency = 'slow';
    }

    return patterns;
  }

  /**
   * Crea retroalimentación adaptativa
   */
  private static createAdaptiveFeedback(exerciseResult: any, patterns: any): any {
    const feedback = {
      immediate: '',
      explanation: '',
      nextSteps: [] as string[],
      encouragement: ''
    };

    if (exerciseResult.isCorrect) {
      feedback.immediate = this.getPositiveFeedback(patterns);
      feedback.encouragement = this.getEncouragement(patterns);
    } else {
      feedback.immediate = this.getCorrectiveFeedback(patterns);
      feedback.explanation = this.getDetailedExplanation(exerciseResult);
    }

    feedback.nextSteps = this.getNextSteps(exerciseResult, patterns);

    return feedback;
  }

  /**
   * Genera feedback positivo
   */
  private static getPositiveFeedback(patterns: any): string {
    if (patterns.timeEfficiency === 'fast') {
      return '¡Excelente! Respuesta correcta y eficiente.';
    } else if (patterns.recentAccuracy > 0.8) {
      return '¡Muy bien! Mantienes un gran rendimiento.';
    }
    return '¡Correcto! Buen trabajo.';
  }

  /**
   * Genera feedback correctivo
   */
  private static getCorrectiveFeedback(patterns: any): string {
    if (patterns.timeEfficiency === 'fast') {
      return 'Respuesta incorrecta. Tómate más tiempo para analizar.';
    } else if (patterns.recentAccuracy < 0.5) {
      return 'Respuesta incorrecta. Revisemos los conceptos fundamentales.';
    }
    return 'Respuesta incorrecta. Analicemos juntos la solución.';
  }

  /**
   * Genera explicación detallada
   */
  private static getDetailedExplanation(exerciseResult: any): string {
    return `La respuesta correcta es "${exerciseResult.correctAnswer}". Esto se debe a que...`;
  }

  /**
   * Genera pasos siguientes
   */
  private static getNextSteps(exerciseResult: any, patterns: any): string[] {
    const steps: string[] = [];

    if (!exerciseResult.isCorrect) {
      steps.push('Revisar el concepto asociado');
      steps.push('Practicar ejercicios similares');
    }

    if (patterns.recentAccuracy < 0.6) {
      steps.push('Reforzar fundamentos de la materia');
    }

    return steps;
  }

  /**
   * Genera mensaje de aliento
   */
  private static getEncouragement(patterns: any): string {
    const encouragements = [
      '¡Sigue así! Tu progreso es constante.',
      '¡Excelente trabajo! Cada ejercicio te acerca más a tu meta.',
      '¡Muy bien! Tu dedicación se nota en los resultados.',
      '¡Fantástico! Estás dominando estos conceptos.'
    ];

    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }

  /**
   * Captura interacción del estudiante
   */
  private static async captureStudentInteraction(
    userId: string,
    exerciseResult: any,
    toolSource: string,
    feedback: any
  ): Promise<void> {
    try {
      // Registrar en tabla de intentos
      const { error: attemptError } = await supabase
        .from('user_exercise_attempts')
        .insert({
          user_id: userId,
          exercise_id: exerciseResult.exerciseId,
          answer: exerciseResult.answer || '',
          is_correct: exerciseResult.isCorrect,
          time_taken_seconds: exerciseResult.timeSpent,
          confidence_level: exerciseResult.confidence || null
        });

      if (attemptError) {
        logger.error('RealTimeFeedback', 'Error registrando intento', attemptError);
      }

      // Registrar métricas del sistema
      await supabase
        .from('system_metrics')
        .insert({
          user_id: userId,
          metric_type: 'exercise_interaction',
          metric_value: exerciseResult.isCorrect ? 1 : 0,
          context: {
            toolSource,
            exerciseId: exerciseResult.exerciseId,
            timeSpent: exerciseResult.timeSpent,
            feedback: feedback
          } as any
        });

    } catch (error) {
      logger.error('RealTimeFeedback', 'Error capturando interacción', error);
    }
  }

  /**
   * Actualiza métricas neurales
   */
  private static async updateNeuralMetrics(
    userId: string,
    exerciseResult: any,
    toolSource: string
  ): Promise<void> {
    const metrics = [
      {
        user_id: userId,
        metric_type: 'exercise_accuracy',
        dimension_id: toolSource,
        current_value: exerciseResult.isCorrect ? 1 : 0,
        trend: exerciseResult.isCorrect ? 'increasing' : 'stable'
      },
      {
        user_id: userId,
        metric_type: 'time_efficiency',
        dimension_id: exerciseResult.skill,
        current_value: exerciseResult.timeSpent,
        trend: 'stable'
      },
      {
        user_id: userId,
        metric_type: 'tool_engagement',
        dimension_id: toolSource,
        current_value: 1,
        trend: 'increasing'
      }
    ];

    for (const metric of metrics) {
      await supabase
        .from('neural_metrics')
        .upsert(metric, { 
          onConflict: 'user_id,metric_type,dimension_id' 
        });
    }
  }

  /**
   * Envía notificaciones adaptativas
   */
  private static async sendAdaptiveNotifications(
    userId: string,
    feedback: any
  ): Promise<void> {
    // Lógica para determinar si enviar notificaciones
    const shouldNotify = this.shouldSendNotification(feedback);
    
    if (shouldNotify) {
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          notification_type: 'exercise_feedback',
          title: 'Retroalimentación de ejercicio',
          message: feedback.immediate,
          action_data: {
            feedback
          }
        });
    }
  }

  /**
   * Determina si enviar notificación
   */
  private static shouldSendNotification(feedback: any): boolean {
    // Enviar solo si hay pasos importantes o necesita refuerzo
    return feedback.nextSteps.length > 0 || feedback.explanation.length > 100;
  }

  /**
   * Orquesta retroalimentación para instituciones
   */
  static async orchestrateInstitutionFeedback(institutionId: string): Promise<InstitutionFeedback> {
    logger.info('RealTimeFeedback', 'Orquestando retroalimentación institucional', { institutionId });

    try {
      const analytics = await this.generateInstitutionAnalytics(institutionId);
      const feedback = await this.createInstitutionFeedback(analytics);
      
      // Almacenar feedback institucional
      await this.storeInstitutionFeedback(institutionId, feedback);
      
      return feedback;
    } catch (error) {
      logger.error('RealTimeFeedback', 'Error en retroalimentación institucional', error);
      throw error;
    }
  }

  /**
   * Genera analytics institucionales
   */
  private static async generateInstitutionAnalytics(institutionId: string): Promise<any> {
    const [students, exercises, progress] = await Promise.all([
      this.getInstitutionStudents(institutionId),
      this.getInstitutionExercises(institutionId),
      this.getInstitutionProgress(institutionId)
    ]);

    return {
      totalStudents: students.length,
      activeStudents: this.countActiveStudents(students),
      averageProgress: this.calculateAverageProgress(progress),
      exercises,
      progress
    };
  }

  /**
   * Obtiene estudiantes de la institución
   */
  private static async getInstitutionStudents(institutionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('institution_id', institutionId);

    return data || [];
  }

  /**
   * Obtiene ejercicios de la institución
   */
  private static async getInstitutionExercises(institutionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .select(`
        *,
        profiles!inner(institution_id)
      `)
      .eq('profiles.institution_id', institutionId);

    return data || [];
  }

  /**
   * Obtiene progreso de la institución
   */
  private static async getInstitutionProgress(institutionId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_node_progress')
      .select(`
        *,
        profiles!inner(institution_id)
      `)
      .eq('profiles.institution_id', institutionId);

    return data || [];
  }

  /**
   * Cuenta estudiantes activos
   */
  private static countActiveStudents(students: any[]): number {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return students.filter(student => 
      new Date(student.last_active_at) > oneWeekAgo
    ).length;
  }

  /**
   * Calcula progreso promedio
   */
  private static calculateAverageProgress(progress: any[]): number {
    if (progress.length === 0) return 0;
    
    const totalProgress = progress.reduce((sum, p) => sum + (p.progress || 0), 0);
    return totalProgress / progress.length;
  }

  /**
   * Crea retroalimentación institucional
   */
  private static async createInstitutionFeedback(analytics: any): Promise<InstitutionFeedback> {
    const engagement = analytics.activeStudents / analytics.totalStudents;
    
    let alertLevel: 'green' | 'yellow' | 'red' = 'green';
    if (engagement < 0.5) alertLevel = 'red';
    else if (engagement < 0.7) alertLevel = 'yellow';

    const recommendations = this.generateInstitutionRecommendations(analytics, alertLevel);
    const { weakAreas, strongAreas } = this.analyzeInstitutionAreas(analytics);

    return {
      institutionId: analytics.institutionId,
      totalStudents: analytics.totalStudents,
      activeStudents: analytics.activeStudents,
      averageProgress: analytics.averageProgress,
      alertLevel,
      recommendations,
      weakAreas,
      strongAreas,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Genera recomendaciones institucionales
   */
  private static generateInstitutionRecommendations(analytics: any, alertLevel: string): string[] {
    const recommendations: string[] = [];

    if (alertLevel === 'red') {
      recommendations.push('Implementar estrategias de re-engagement estudiantil');
      recommendations.push('Revisar metodología de enseñanza');
    } else if (alertLevel === 'yellow') {
      recommendations.push('Aumentar actividades motivacionales');
      recommendations.push('Personalizar más el aprendizaje');
    }

    if (analytics.averageProgress < 50) {
      recommendations.push('Reforzar conceptos fundamentales');
    }

    return recommendations;
  }

  /**
   * Analiza áreas institucionales
   */
  private static analyzeInstitutionAreas(analytics: any): { weakAreas: string[]; strongAreas: string[] } {
    // Análisis simplificado por ahora
    return {
      weakAreas: ['Matemática', 'Ciencias'],
      strongAreas: ['Comprensión Lectora']
    };
  }

  /**
   * Almacena feedback institucional
   */
  private static async storeInstitutionFeedback(
    institutionId: string, 
    feedback: InstitutionFeedback
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institution_feedback',
          metric_value: feedback.averageProgress,
          context: feedback as any, // Cast to any for Json compatibility
          user_id: institutionId
        });

      if (error) {
        logger.error('RealTimeFeedback', 'Error almacenando feedback institucional', error);
      }
    } catch (error) {
      logger.error('RealTimeFeedback', 'Error en almacenamiento', error);
    }
  }

  /**
   * Orquesta retroalimentación para apoderados
   */
  static async orchestrateParentFeedback(parentId: string, studentId: string): Promise<ParentFeedback> {
    logger.info('RealTimeFeedback', 'Orquestando retroalimentación para apoderados', {
      parentId, studentId
    });

    try {
      const studentData = await this.getStudentDataForParent(studentId);
      const feedback = await this.createParentFeedback(parentId, studentId, studentData);
      
      // Enviar notificación programada al apoderado
      await this.scheduleParentNotification(parentId, feedback);
      
      return feedback;
    } catch (error) {
      logger.error('RealTimeFeedback', 'Error en retroalimentación para apoderados', error);
      throw error;
    }
  }

  /**
   * Obtiene datos del estudiante para apoderados
   */
  private static async getStudentDataForParent(studentId: string): Promise<any> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [exercises, progress] = await Promise.all([
      supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', studentId)
        .gte('created_at', oneWeekAgo.toISOString()),
      supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', studentId)
    ]);

    return {
      exercises: exercises.data || [],
      progress: progress.data || []
    };
  }

  /**
   * Crea retroalimentación para apoderados
   */
  private static async createParentFeedback(
    parentId: string,
    studentId: string,
    studentData: any
  ): Promise<ParentFeedback> {
    const exercisesCompleted = studentData.exercises.length;
    const timeSpent = studentData.exercises.reduce((sum: number, ex: any) => 
      sum + (ex.time_taken_seconds || 0), 0);
    
    const weeklyProgress = this.calculateWeeklyProgress(studentData.progress);
    
    const recommendations = this.generateParentRecommendations(studentData);
    const encouragements = this.generateParentEncouragements(studentData);
    const nextSteps = this.generateParentNextSteps(studentData);

    return {
      parentId,
      studentId,
      weeklyProgress,
      exercisesCompleted,
      timeSpent,
      recommendations,
      encouragements,
      nextSteps
    };
  }

  /**
   * Calcula progreso semanal
   */
  private static calculateWeeklyProgress(progress: any[]): number {
    if (progress.length === 0) return 0;
    
    const totalProgress = progress.reduce((sum, p) => sum + (p.progress || 0), 0);
    return totalProgress / progress.length;
  }

  /**
   * Genera recomendaciones para apoderados
   */
  private static generateParentRecommendations(studentData: any): string[] {
    const recommendations: string[] = [];
    
    if (studentData.exercises.length < 10) {
      recommendations.push('Motivar más práctica diaria');
    }
    
    if (studentData.progress.some((p: any) => p.progress < 30)) {
      recommendations.push('Reforzar conceptos básicos');
    }
    
    return recommendations;
  }

  /**
   * Genera mensajes de aliento para apoderados
   */
  private static generateParentEncouragements(studentData: any): string[] {
    const encouragements: string[] = [];
    
    if (studentData.exercises.length > 20) {
      encouragements.push('¡Su hijo/a muestra gran dedicación!');
    }
    
    if (studentData.progress.some((p: any) => p.progress > 80)) {
      encouragements.push('¡Excelente progreso en varias áreas!');
    }
    
    return encouragements;
  }

  /**
   * Genera próximos pasos para apoderados
   */
  private static generateParentNextSteps(studentData: any): string[] {
    const nextSteps: string[] = [];
    
    nextSteps.push('Revisar progreso semanal juntos');
    nextSteps.push('Establecer horario de estudio consistente');
    
    return nextSteps;
  }

  /**
   * Programa notificación para apoderados
   */
  private static async scheduleParentNotification(
    parentId: string,
    feedback: ParentFeedback
  ): Promise<void> {
    try {
      const eventId = uuidv4(); // Generate event_id
      
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: parentId,
          event_id: eventId, // Add required event_id
          notification_type: 'parent_weekly_report',
          send_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours later
          content: {
            recommendations: feedback.recommendations,
            encouragements: feedback.encouragements,
            nextSteps: feedback.nextSteps
          }
        });

      if (error) {
        logger.error('RealTimeFeedback', 'Error programando notificación', error);
      }
    } catch (error) {
      logger.error('RealTimeFeedback', 'Error en programación', error);
    }
  }

  /**
   * Envía alertas en tiempo real
   */
  static async sendRealTimeAlert(userId: string, alertType: string, data: any): Promise<void> {
    try {
      const eventId = uuidv4(); // Generate event_id
      
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: userId,
          event_id: eventId, // Add required event_id
          notification_type: alertType,
          send_at: new Date().toISOString(),
          content: {
            message: data.message,
            actionData: data
          }
        });

      if (error) {
        logger.error('RealTimeFeedback', 'Error enviando alerta', error);
      }
    } catch (error) {
      logger.error('RealTimeFeedback', 'Error en alerta', error);
    }
  }
}
