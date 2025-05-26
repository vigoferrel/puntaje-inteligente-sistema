
/**
 * SERVICIO MEJORADO DE ANALYTICS INSTITUCIONALES
 * Sistema unificado que elimina duplicaciones y añade funcionalidades avanzadas
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { 
  InstitutionalMetrics, 
  EnhancedInstitutionalMetrics,
  ParentReportData, 
  EnhancedParentReportData,
  PredictiveMetrics,
  InstitutionAnalyticsConfig 
} from './types';
import { MetricsCalculator } from './MetricsCalculator';

export class EnhancedInstitutionalAnalyticsService {
  private static cache = new Map<string, { data: any; timestamp: number }>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Configuración por defecto para analytics institucionales
   */
  private static readonly DEFAULT_CONFIG: InstitutionAnalyticsConfig = {
    enableRealtime: true,
    enablePredictive: true,
    cacheTimeout: 300000, // 5 min
    batchSize: 50,
    reportFrequency: 'weekly',
    notificationThresholds: {
      riskLevel: 0.7,
      engagementDrop: 0.3,
      progressStagnation: 0.1
    }
  };

  /**
   * Genera reporte institucional mejorado con datos reales
   */
  static async generateInstitutionalReport(institutionId: string): Promise<InstitutionalMetrics> {
    try {
      logger.info('EnhancedInstitutionalAnalyticsService', `Generando reporte para institución ${institutionId}`);

      // Verificar cache
      const cached = this.getCachedData(`institutional_${institutionId}`);
      if (cached) {
        logger.info('EnhancedInstitutionalAnalyticsService', 'Datos obtenidos desde cache');
        return cached;
      }

      // Obtener estudiantes reales de la institución
      const students = await this.getRealStudentsData(institutionId);
      const exercises = await this.getRealExercisesData(institutionId);
      const progress = await this.getRealProgressData(institutionId);

      // Calcular métricas usando el calculador
      const metrics = MetricsCalculator.calculateInstitutionalMetrics(students, exercises, progress);

      // Agregar métricas predictivas si están habilitadas
      const enhancedMetrics = await this.addPredictiveMetrics(metrics, students);

      // Guardar en cache
      this.setCachedData(`institutional_${institutionId}`, enhancedMetrics);

      // Persistir métricas para histórico
      await this.storeInstitutionalMetrics(institutionId, enhancedMetrics);

      logger.info('EnhancedInstitutionalAnalyticsService', 'Reporte institucional generado exitosamente');
      return enhancedMetrics;

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error generando reporte institucional', error);
      throw new Error(`Error generando reporte institucional: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtiene datos reales de estudiantes usando la nueva tabla institution_students
   */
  private static async getRealStudentsData(institutionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('institution_students')
        .select(`
          student_id,
          status,
          grade_level,
          enrollment_date,
          profiles!inner(*)
        `)
        .eq('institution_id', institutionId)
        .eq('status', 'active');

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error obteniendo estudiantes', error);
        return [];
      }

      return data?.map(student => ({
        id: student.student_id,
        status: student.status,
        grade_level: student.grade_level,
        enrollment_date: student.enrollment_date,
        profile: student.profiles
      })) || [];

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en getRealStudentsData', error);
      return [];
    }
  }

  /**
   * Obtiene datos reales de ejercicios de los estudiantes
   */
  private static async getRealExercisesData(institutionId: string): Promise<any[]> {
    try {
      // Primero obtenemos los IDs de estudiantes de la institución
      const { data: studentIds } = await supabase
        .from('institution_students')
        .select('student_id')
        .eq('institution_id', institutionId)
        .eq('status', 'active');

      if (!studentIds || studentIds.length === 0) {
        return [];
      }

      const ids = studentIds.map(s => s.student_id);

      const { data, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .in('user_id', ids)
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error obteniendo ejercicios', error);
        return [];
      }

      return data || [];

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en getRealExercisesData', error);
      return [];
    }
  }

  /**
   * Obtiene datos reales de progreso de los estudiantes
   */
  private static async getRealProgressData(institutionId: string): Promise<any[]> {
    try {
      // Obtener IDs de estudiantes
      const { data: studentIds } = await supabase
        .from('institution_students')
        .select('student_id')
        .eq('institution_id', institutionId)
        .eq('status', 'active');

      if (!studentIds || studentIds.length === 0) {
        return [];
      }

      const ids = studentIds.map(s => s.student_id);

      const { data, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .in('user_id', ids);

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error obteniendo progreso', error);
        return [];
      }

      return data || [];

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en getRealProgressData', error);
      return [];
    }
  }

  /**
   * Genera y envía reportes automáticos a padres
   */
  static async generateParentReports(institutionId: string): Promise<void> {
    try {
      logger.info('EnhancedInstitutionalAnalyticsService', `Generando reportes para padres de institución ${institutionId}`);

      // Obtener relaciones padre-estudiante de la institución
      const parentStudentRelations = await this.getParentStudentRelations(institutionId);

      for (const relation of parentStudentRelations) {
        try {
          const report = await this.generateParentReport(relation.parent_user_id, relation.child_user_id);
          await this.sendParentReport(relation.parent_user_id, report);
          
          // Crear evento de calendario para seguimiento
          await this.createReportEvent(relation.parent_user_id, report);
          
        } catch (error) {
          logger.error('EnhancedInstitutionalAnalyticsService', `Error generando reporte para padre ${relation.parent_user_id}`, error);
        }
      }

      logger.info('EnhancedInstitutionalAnalyticsService', 'Reportes para padres generados exitosamente');

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error generando reportes para padres', error);
      throw error;
    }
  }

  /**
   * Obtiene relaciones padre-estudiante usando la nueva tabla user_relationships
   */
  private static async getParentStudentRelations(institutionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('user_relationships')
        .select(`
          parent_user_id,
          child_user_id,
          institution_students!inner(institution_id)
        `)
        .eq('relationship_type', 'parent_child')
        .eq('is_active', true)
        .eq('institution_students.institution_id', institutionId);

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error obteniendo relaciones padre-estudiante', error);
        return [];
      }

      return data || [];

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en getParentStudentRelations', error);
      return [];
    }
  }

  /**
   * Genera reporte individual para un padre específico
   */
  private static async generateParentReport(parentId: string, studentId: string): Promise<EnhancedParentReportData> {
    try {
      // Obtener progreso del estudiante
      const { data: progress } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', studentId);

      // Obtener ejercicios realizados
      const { data: exercises } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .eq('user_id', studentId)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const progressData = progress || [];
      const exerciseData = exercises || [];

      // Calcular métricas
      const weeklyProgress = this.calculateWeeklyProgress(progressData);
      const exercisesCompleted = exerciseData.length;
      const timeSpent = exerciseData.reduce((total, ex) => total + (ex.time_taken_seconds || 0), 0);

      // Analizar fortalezas y áreas de mejora
      const strongSubjects = this.identifyStrongSubjects(progressData);
      const improvementAreas = this.identifyImprovementAreas(progressData);

      const baseReport: ParentReportData = {
        studentId,
        parentId,
        weeklyProgress,
        exercisesCompleted,
        timeSpent,
        strongSubjects,
        improvementAreas,
        recommendations: this.generateRecommendations(progressData),
        nextGoals: this.generateNextGoals(progressData)
      };

      // Agregar métricas avanzadas
      const enhancedReport: EnhancedParentReportData = {
        ...baseReport,
        trends: this.calculateStudentTrends(progressData),
        personalizedRecommendations: this.generatePersonalizedRecommendations(progressData),
        riskLevel: this.calculateRiskLevel(progressData),
        projectedOutcome: this.calculateProjectedOutcome(progressData)
      };

      return enhancedReport;

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error generando reporte individual', error);
      throw error;
    }
  }

  /**
   * Crea evento de calendario para el reporte enviado
   */
  private static async createReportEvent(parentId: string, report: EnhancedParentReportData): Promise<void> {
    try {
      const eventData = {
        user_id: parentId,
        title: 'Reporte Semanal de Progreso',
        description: `Progreso semanal: ${report.weeklyProgress.toFixed(1)}%\nEjercicios completados: ${report.exercisesCompleted}`,
        event_type: 'parent_report',
        start_date: new Date().toISOString(),
        color: '#10B981',
        priority: 'medium' as const,
        metadata: {
          report_data: {
            weeklyProgress: report.weeklyProgress,
            exercisesCompleted: report.exercisesCompleted,
            riskLevel: report.riskLevel
          }
        }
      };

      const { error } = await supabase
        .from('calendar_events')
        .insert(eventData);

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error creando evento de calendario', error);
      }

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en createReportEvent', error);
    }
  }

  /**
   * Envía notificación del reporte al padre
   */
  private static async sendParentReport(parentId: string, report: EnhancedParentReportData): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: parentId,
          notification_type: 'parent_report',
          title: 'Nuevo Reporte de Progreso',
          message: `Progreso semanal de su hijo: ${report.weeklyProgress.toFixed(1)}%`,
          priority: 'normal',
          action_data: {
            report_id: report.studentId,
            weekly_progress: report.weeklyProgress,
            risk_level: report.riskLevel
          }
        });

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error enviando notificación', error);
      }

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en sendParentReport', error);
    }
  }

  /**
   * Exporta reporte en diferentes formatos
   */
  static async exportReport(institutionId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    try {
      const metrics = await this.generateInstitutionalReport(institutionId);
      
      switch (format) {
        case 'csv':
          return this.exportAsCSV(metrics);
        case 'excel':
          return this.exportAsExcel(metrics);
        case 'pdf':
          return this.exportAsPDF(metrics);
        default:
          throw new Error(`Formato ${format} no soportado`);
      }

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error exportando reporte', error);
      throw error;
    }
  }

  /**
   * Métodos de utilidad privados
   */

  private static getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private static setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  static clearCache(): void {
    this.cache.clear();
    logger.info('EnhancedInstitutionalAnalyticsService', 'Cache limpiado');
  }

  private static async addPredictiveMetrics(
    metrics: InstitutionalMetrics, 
    students: any[]
  ): Promise<EnhancedInstitutionalMetrics> {
    const predictiveMetrics: PredictiveMetrics = {
      performanceTrend: this.calculatePerformanceTrend(students),
      riskPrediction: {
        highRiskStudents: metrics.riskDistribution.high,
        predictedDropouts: Math.floor(metrics.riskDistribution.high * 0.3),
        interventionRecommended: metrics.riskDistribution.high > metrics.totalStudents * 0.15
      },
      goalProjection: {
        projectedPAESScore: this.calculateProjectedPAESScore(metrics),
        timeToGoal: this.calculateTimeToGoal(metrics),
        successProbability: this.calculateSuccessProbability(metrics)
      },
      nextRecommendedActions: this.generateRecommendedActions(metrics)
    };

    return {
      ...metrics,
      predictive: predictiveMetrics
    };
  }

  private static calculatePerformanceTrend(students: any[]): 'increasing' | 'stable' | 'decreasing' {
    // Análisis simplificado basado en la distribución de estudiantes activos
    const activeRatio = students.length > 0 ? students.filter(s => s.status === 'active').length / students.length : 0;
    
    if (activeRatio > 0.8) return 'increasing';
    if (activeRatio > 0.6) return 'stable';
    return 'decreasing';
  }

  private static calculateProjectedPAESScore(metrics: InstitutionalMetrics): number {
    return Math.round(400 + (metrics.overallProgress * 450));
  }

  private static calculateTimeToGoal(metrics: InstitutionalMetrics): number {
    const progressRate = metrics.overallProgress;
    return progressRate > 0.5 ? 12 : 24; // semanas
  }

  private static calculateSuccessProbability(metrics: InstitutionalMetrics): number {
    return Math.round(metrics.overallProgress * 100);
  }

  private static generateRecommendedActions(metrics: InstitutionalMetrics): string[] {
    const actions: string[] = [];
    
    if (metrics.riskDistribution.high > metrics.totalStudents * 0.2) {
      actions.push('Implementar programa de apoyo para estudiantes en riesgo');
    }
    
    if (metrics.averageEngagement < 0.6) {
      actions.push('Mejorar estrategias de engagement estudiantil');
    }
    
    if (metrics.overallProgress < 0.5) {
      actions.push('Revisar metodologías de enseñanza');
    }
    
    return actions;
  }

  private static async storeInstitutionalMetrics(institutionId: string, metrics: EnhancedInstitutionalMetrics): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_analytics',
          metric_value: metrics.totalStudents,
          context: {
            institution_id: institutionId,
            metrics: metrics,
            generated_at: new Date().toISOString()
          }
        });

      if (error) {
        logger.error('EnhancedInstitutionalAnalyticsService', 'Error almacenando métricas', error);
      }

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalyticsService', 'Error en storeInstitutionalMetrics', error);
    }
  }

  // Métodos auxiliares para cálculos específicos
  private static calculateWeeklyProgress(progressData: any[]): number {
    if (progressData.length === 0) return 0;
    return progressData.reduce((sum, p) => sum + (Number(p.progress) || 0), 0) / progressData.length;
  }

  private static identifyStrongSubjects(progressData: any[]): string[] {
    const subjectProgress = new Map<string, number[]>();
    
    progressData.forEach(p => {
      const progress = Number(p.progress) || 0;
      if (progress > 70) { // Solo considerar progreso alto
        const subject = p.subject_area || 'General';
        if (!subjectProgress.has(subject)) {
          subjectProgress.set(subject, []);
        }
        subjectProgress.get(subject)!.push(progress);
      }
    });

    return Array.from(subjectProgress.entries())
      .filter(([_, scores]) => scores.length > 0)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([subject]) => subject);
  }

  private static identifyImprovementAreas(progressData: any[]): string[] {
    const subjectProgress = new Map<string, number[]>();
    
    progressData.forEach(p => {
      const progress = Number(p.progress) || 0;
      if (progress < 50) { // Solo considerar progreso bajo
        const subject = p.subject_area || 'General';
        if (!subjectProgress.has(subject)) {
          subjectProgress.set(subject, []);
        }
        subjectProgress.get(subject)!.push(progress);
      }
    });

    return Array.from(subjectProgress.entries())
      .filter(([_, scores]) => scores.length > 0)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3)
      .map(([subject]) => subject);
  }

  private static generateRecommendations(progressData: any[]): string[] {
    return [
      'Aumentar tiempo de estudio en áreas deficientes',
      'Practicar ejercicios de mayor dificultad',
      'Revisar conceptos fundamentales'
    ];
  }

  private static generateNextGoals(progressData: any[]): string[] {
    return [
      'Alcanzar 80% de progreso en materias débiles',
      'Completar 5 ejercicios adicionales por semana',
      'Mejorar tiempo de respuesta'
    ];
  }

  private static generatePersonalizedRecommendations(progressData: any[]): string[] {
    return [
      'Estrategias de estudio personalizadas',
      'Recursos adicionales recomendados',
      'Plan de mejora específico'
    ];
  }

  private static calculateStudentTrends(progressData: any[]): any {
    return {
      progressTrend: [65, 70, 75, 80], // Simulado
      activityTrend: 1.2,
      improvementRate: 15
    };
  }

  private static calculateRiskLevel(progressData: any[]): 'low' | 'medium' | 'high' {
    const avgProgress = this.calculateWeeklyProgress(progressData);
    if (avgProgress > 70) return 'low';
    if (avgProgress > 40) return 'medium';
    return 'high';
  }

  private static calculateProjectedOutcome(progressData: any[]): any {
    const avgProgress = this.calculateWeeklyProgress(progressData);
    return {
      paesScore: Math.round(400 + (avgProgress * 4.5)),
      improvementNeeded: Math.max(0, 70 - avgProgress),
      timeFrame: '12 semanas'
    };
  }

  // Métodos de exportación (implementación básica)
  private static exportAsCSV(metrics: EnhancedInstitutionalMetrics): Blob {
    const csvContent = `
Métrica,Valor
Total Estudiantes,${metrics.totalStudents}
Estudiantes Activos,${metrics.activeStudents}
Engagement Promedio,${(metrics.averageEngagement * 100).toFixed(1)}%
Progreso General,${(metrics.overallProgress * 100).toFixed(1)}%
    `.trim();
    
    return new Blob([csvContent], { type: 'text/csv' });
  }

  private static exportAsExcel(metrics: EnhancedInstitutionalMetrics): Blob {
    // Implementación básica - en producción usar biblioteca como xlsx
    return new Blob([JSON.stringify(metrics, null, 2)], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }

  private static exportAsPDF(metrics: EnhancedInstitutionalMetrics): Blob {
    // Implementación básica - en producción usar biblioteca como jsPDF
    const pdfContent = `
REPORTE INSTITUCIONAL
====================

Total de Estudiantes: ${metrics.totalStudents}
Estudiantes Activos: ${metrics.activeStudents}
Engagement Promedio: ${(metrics.averageEngagement * 100).toFixed(1)}%
Progreso General: ${(metrics.overallProgress * 100).toFixed(1)}%

Generado: ${new Date().toLocaleDateString()}
    `;
    
    return new Blob([pdfContent], { type: 'application/pdf' });
  }
}
