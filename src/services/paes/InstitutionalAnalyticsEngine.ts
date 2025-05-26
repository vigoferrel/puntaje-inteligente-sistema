
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

interface StudentAnalytics {
  userId: string;
  averageScore: number;
  completedExercises: number;
  weakAreas: string[];
  strongAreas: string[];
  timeSpent: number;
  lastActivity: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface InstitutionalMetrics {
  totalStudents: number;
  activeStudents: number;
  averageEngagement: number;
  overallProgress: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  subjectPerformance: Record<string, number>;
  toolUsage: Record<string, number>;
  timestamp: string;
  [key: string]: any; // Index signature for Json compatibility
}

interface ParentReport {
  studentId: string;
  parentId: string;
  weeklyProgress: number;
  exercisesCompleted: number;
  timeSpent: number;
  strongSubjects: string[];
  improvementAreas: string[];
  recommendations: string[];
  nextGoals: string[];
}

export class InstitutionalAnalyticsEngine {
  
  /**
   * Genera analytics completos para una institución
   */
  static async generateInstitutionalAnalytics(institutionId: string): Promise<InstitutionalMetrics> {
    logger.info('InstitutionalAnalytics', 'Generando analytics institucionales', { institutionId });
    
    try {
      const [students, exercises, progress] = await Promise.all([
        this.getInstitutionStudents(institutionId),
        this.getStudentExerciseData(institutionId),
        this.getStudentProgressData(institutionId)
      ]);

      const metrics = await this.calculateInstitutionalMetrics(students, exercises, progress);
      
      // Almacenar métricas con Json-compatible data
      await this.storeInstitutionalMetrics(institutionId, metrics);
      
      return metrics;
    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error generando analytics', error);
      throw error;
    }
  }

  /**
   * Obtiene estudiantes de una institución
   */
  private static async getInstitutionStudents(institutionId: string): Promise<any[]> {
    const { data: students, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('institution_id', institutionId);

    if (error) {
      logger.error('InstitutionalAnalytics', 'Error obteniendo estudiantes', error);
      return [];
    }

    return students || [];
  }

  /**
   * Obtiene datos de ejercicios de estudiantes
   */
  private static async getStudentExerciseData(institutionId: string): Promise<any[]> {
    const { data: exercises, error } = await supabase
      .from('user_exercise_attempts')
      .select(`
        *,
        profiles!inner(institution_id)
      `)
      .eq('profiles.institution_id', institutionId);

    if (error) {
      logger.error('InstitutionalAnalytics', 'Error obteniendo ejercicios', error);
      return [];
    }

    return exercises || [];
  }

  /**
   * Obtiene datos de progreso de estudiantes
   */
  private static async getStudentProgressData(institutionId: string): Promise<any[]> {
    const { data: progress, error } = await supabase
      .from('user_node_progress')
      .select(`
        *,
        profiles!inner(institution_id)
      `)
      .eq('profiles.institution_id', institutionId);

    if (error) {
      logger.error('InstitutionalAnalytics', 'Error obteniendo progreso', error);
      return [];
    }

    return progress || [];
  }

  /**
   * Calcula métricas institucionales
   */
  private static async calculateInstitutionalMetrics(
    students: any[], 
    exercises: any[], 
    progress: any[]
  ): Promise<InstitutionalMetrics> {
    const totalStudents = students.length;
    const activeStudents = this.countActiveStudents(students);
    
    const riskDistribution = this.calculateRiskDistribution(students);
    const subjectPerformance = this.calculateSubjectPerformance(exercises);
    const toolUsage = this.calculateToolUsage(exercises);
    
    const averageEngagement = activeStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;
    const overallProgress = this.calculateOverallProgress(progress);

    return {
      totalStudents,
      activeStudents,
      averageEngagement,
      overallProgress,
      riskDistribution,
      subjectPerformance,
      toolUsage,
      timestamp: new Date().toISOString()
    };
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
   * Calcula distribución de riesgo
   */
  private static calculateRiskDistribution(students: any[]): { low: number; medium: number; high: number } {
    const distribution = { low: 0, medium: 0, high: 0 };
    
    students.forEach(student => {
      const riskLevel = this.calculateStudentRiskLevel(student);
      distribution[riskLevel]++;
    });
    
    return distribution;
  }

  /**
   * Calcula nivel de riesgo del estudiante
   */
  private static calculateStudentRiskLevel(student: any): 'low' | 'medium' | 'high' {
    const lastActivity = new Date(student.last_active_at);
    const daysInactive = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysInactive <= 3) return 'low';
    if (daysInactive <= 7) return 'medium';
    return 'high';
  }

  /**
   * Calcula rendimiento por materia
   */
  private static calculateSubjectPerformance(exercises: any[]): Record<string, number> {
    const subjectScores: Record<string, number[]> = {};
    
    exercises.forEach(exercise => {
      const subject = exercise.subject || 'general';
      if (!subjectScores[subject]) {
        subjectScores[subject] = [];
      }
      subjectScores[subject].push(exercise.is_correct ? 1 : 0);
    });
    
    const performance: Record<string, number> = {};
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      performance[subject] = scores.length > 0 
        ? (scores.reduce((a, b) => a + b, 0) / scores.length) * 100 
        : 0;
    });
    
    return performance;
  }

  /**
   * Calcula uso de herramientas
   */
  private static calculateToolUsage(exercises: any[]): Record<string, number> {
    const toolCounts: Record<string, number> = {};
    
    exercises.forEach(exercise => {
      const tool = exercise.tool_source || 'unknown';
      toolCounts[tool] = (toolCounts[tool] || 0) + 1;
    });
    
    return toolCounts;
  }

  /**
   * Calcula progreso general
   */
  private static calculateOverallProgress(progress: any[]): number {
    if (progress.length === 0) return 0;
    
    const totalProgress = progress.reduce((sum, p) => sum + (p.progress || 0), 0);
    return totalProgress / progress.length;
  }

  /**
   * Almacena métricas institucionales
   */
  private static async storeInstitutionalMetrics(
    institutionId: string, 
    metrics: InstitutionalMetrics
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_analytics',
          metric_value: metrics.totalStudents,
          context: metrics as any, // Cast to any for Json compatibility
          user_id: institutionId
        });

      if (error) {
        logger.error('InstitutionalAnalytics', 'Error almacenando métricas', error);
      }
    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error en almacenamiento', error);
    }
  }

  /**
   * Genera reporte para apoderados
   */
  static async generateParentReport(studentId: string, parentId: string): Promise<ParentReport> {
    try {
      const [exercises, progress, profile] = await Promise.all([
        this.getStudentExercises(studentId),
        this.getStudentProgress(studentId),
        this.getStudentProfile(studentId)
      ]);

      const report = this.calculateParentReport(studentId, parentId, exercises, progress, profile);
      
      // Enviar notificación al apoderado
      await this.notifyParent(parentId, report);
      
      return report;
    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error generando reporte para apoderados', error);
      throw error;
    }
  }

  /**
   * Obtiene ejercicios del estudiante
   */
  private static async getStudentExercises(studentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', studentId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    return data || [];
  }

  /**
   * Obtiene progreso del estudiante
   */
  private static async getStudentProgress(studentId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', studentId);

    return data || [];
  }

  /**
   * Obtiene perfil del estudiante
   */
  private static async getStudentProfile(studentId: string): Promise<any> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .single();

    return data;
  }

  /**
   * Calcula reporte para apoderados
   */
  private static calculateParentReport(
    studentId: string,
    parentId: string,
    exercises: any[],
    progress: any[],
    profile: any
  ): ParentReport {
    const weeklyProgress = this.calculateWeeklyProgress(progress);
    const exercisesCompleted = exercises.length;
    const timeSpent = exercises.reduce((sum, ex) => sum + (ex.time_taken_seconds || 0), 0);
    
    const strongSubjects = this.identifyStrongSubjects(exercises);
    const improvementAreas = this.identifyImprovementAreas(exercises);
    
    const recommendations = this.generateRecommendations(exercises, progress);
    const nextGoals = this.generateNextGoals(progress);

    return {
      studentId,
      parentId,
      weeklyProgress,
      exercisesCompleted,
      timeSpent,
      strongSubjects,
      improvementAreas,
      recommendations,
      nextGoals
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
   * Identifica materias fuertes
   */
  private static identifyStrongSubjects(exercises: any[]): string[] {
    const subjectScores: Record<string, number[]> = {};
    
    exercises.forEach(exercise => {
      const subject = exercise.subject || 'general';
      if (!subjectScores[subject]) {
        subjectScores[subject] = [];
      }
      subjectScores[subject].push(exercise.is_correct ? 1 : 0);
    });
    
    return Object.entries(subjectScores)
      .filter(([_, scores]) => {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        return average > 0.8;
      })
      .map(([subject, _]) => subject);
  }

  /**
   * Identifica áreas de mejora
   */
  private static identifyImprovementAreas(exercises: any[]): string[] {
    const subjectScores: Record<string, number[]> = {};
    
    exercises.forEach(exercise => {
      const subject = exercise.subject || 'general';
      if (!subjectScores[subject]) {
        subjectScores[subject] = [];
      }
      subjectScores[subject].push(exercise.is_correct ? 1 : 0);
    });
    
    return Object.entries(subjectScores)
      .filter(([_, scores]) => {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length;
        return average < 0.6;
      })
      .map(([subject, _]) => subject);
  }

  /**
   * Genera recomendaciones
   */
  private static generateRecommendations(exercises: any[], progress: any[]): string[] {
    const recommendations: string[] = [];
    
    if (exercises.length < 10) {
      recommendations.push('Aumentar la práctica diaria de ejercicios');
    }
    
    if (progress.some(p => p.progress < 30)) {
      recommendations.push('Reforzar conceptos fundamentales');
    }
    
    return recommendations;
  }

  /**
   * Genera próximas metas
   */
  private static generateNextGoals(progress: any[]): string[] {
    const goals: string[] = [];
    
    const uncompletedNodes = progress.filter(p => p.progress < 100);
    if (uncompletedNodes.length > 0) {
      goals.push(`Completar ${uncompletedNodes.length} nodos de aprendizaje`);
    }
    
    return goals;
  }

  /**
   * Notifica al apoderado
   */
  private static async notifyParent(parentId: string, report: ParentReport): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: parentId,
          notification_type: 'parent_report',
          title: 'Reporte Semanal de Progreso',
          message: `Progreso semanal: ${report.weeklyProgress.toFixed(1)}%`,
          action_data: {
            reportData: report
          }
        });

      if (error) {
        logger.error('InstitutionalAnalytics', 'Error notificando apoderado', error);
      }
    } catch (error) {
      logger.error('InstitutionalAnalytics', 'Error en notificación', error);
    }
  }

  /**
   * Obtiene métricas de engagement
   */
  static async getEngagementMetrics(institutionId: string): Promise<any> {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data: metrics, error } = await supabase
      .from('system_metrics')
      .select('*')
      .eq('metric_type', 'institutional_analytics')
      .eq('user_id', institutionId)
      .gte('recorded_at', oneMonthAgo.toISOString())
      .order('recorded_at', { ascending: false });

    if (error) {
      logger.error('InstitutionalAnalytics', 'Error obteniendo métricas', error);
      return null;
    }

    return this.processEngagementTrends(metrics || []);
  }

  /**
   * Procesa tendencias de engagement
   */
  private static processEngagementTrends(metrics: any[]): any {
    if (metrics.length === 0) return null;

    const trends = {
      studentGrowth: 0,
      engagementTrend: 'stable',
      riskTrend: 'stable',
      subjectTrends: {}
    };

    // Calcular tendencias básicas
    if (metrics.length >= 2) {
      const latest = metrics[0];
      const previous = metrics[1];
      
      trends.studentGrowth = latest.context?.totalStudents - previous.context?.totalStudents || 0;
      
      if (latest.context?.averageEngagement > previous.context?.averageEngagement) {
        trends.engagementTrend = 'increasing';
      } else if (latest.context?.averageEngagement < previous.context?.averageEngagement) {
        trends.engagementTrend = 'decreasing';
      }
    }

    return trends;
  }
}
