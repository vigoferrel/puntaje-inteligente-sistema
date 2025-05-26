
/**
 * Enhanced Institutional Analytics Service
 * Servicio unificado con funcionalidades incrementadas
 * - Real-time analytics
 * - Automated parent reports
 * - Intelligent caching
 * - Predictive metrics
 */
import { logger } from '@/core/logging/SystemLogger';
import { supabase } from '@/integrations/supabase/client';
import { MetricsCalculator } from './MetricsCalculator';
import { AnalyticsMappers } from './mappers';
import { InstitutionalMetrics, ParentReportData } from './types';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

interface AnalyticsConfig {
  enableRealtime: boolean;
  cacheTimeout: number;
  batchSize: number;
  enablePredictive: boolean;
}

export class EnhancedInstitutionalAnalyticsService {
  private static cache = new Map<string, CacheEntry>();
  private static config: AnalyticsConfig = {
    enableRealtime: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    batchSize: 50,
    enablePredictive: true
  };

  /**
   * Genera reporte completo de analytics institucionales con datos reales
   */
  static async generateInstitutionalReport(institutionId: string): Promise<InstitutionalMetrics> {
    try {
      logger.info('EnhancedInstitutionalAnalytics', 'Iniciando generación de reporte institucional');

      // Verificar cache primero
      const cachedData = this.getCachedData(`report_${institutionId}`);
      if (cachedData) {
        logger.info('EnhancedInstitutionalAnalytics', 'Retornando datos del cache');
        return cachedData;
      }

      // Obtener datos reales usando las nuevas tablas
      const students = await this.getRealStudentsData(institutionId);
      const exercises = await this.getExercisesData(institutionId);
      const progress = await this.getProgressData(institutionId);

      // Calcular métricas con algoritmos mejorados
      const metrics = MetricsCalculator.calculateInstitutionalMetrics(students, exercises, progress);
      
      // Agregar métricas predictivas
      const predictiveMetrics = await this.calculatePredictiveMetrics(institutionId, metrics);
      const enhancedMetrics = { ...metrics, ...predictiveMetrics };

      // Persistir métricas
      const metricsDTO = AnalyticsMappers.metricsToDTO(enhancedMetrics);
      await this.storeInstitutionalMetrics(institutionId, metricsDTO);
      
      // Cachear resultado
      this.setCacheData(`report_${institutionId}`, enhancedMetrics);

      // Programar reportes automáticos para padres
      this.scheduleParentReports(institutionId);
      
      logger.info('EnhancedInstitutionalAnalytics', 'Reporte institucional generado exitosamente');
      return enhancedMetrics;

    } catch (error) {
      logger.error('EnhancedInstitutionalAnalytics', 'Error generando reporte institucional', error);
      throw error;
    }
  }

  /**
   * Obtiene datos de estudiantes usando la nueva tabla institution_students
   */
  private static async getRealStudentsData(institutionId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('institution_students')
        .select(`
          student_id,
          enrollment_date,
          status,
          grade_level,
          profiles!inner(id, name, email, learning_phase, created_at)
        `)
        .eq('institution_id', institutionId)
        .eq('status', 'active')
        .limit(this.config.batchSize);

      if (error) {
        logger.error('EnhancedInstitutionalAnalytics', 'Error obteniendo estudiantes reales', error);
        return [];
      }

      return data?.map(item => ({
        id: item.student_id,
        ...item.profiles,
        enrollment_date: item.enrollment_date,
        grade_level: item.grade_level
      })) || [];
    } catch (error) {
      logger.error('EnhancedInstitutionalAnalytics', 'Error en consulta de estudiantes', error);
      return [];
    }
  }

  /**
   * Genera y envía reportes automatizados para padres
   */
  static async generateParentReports(institutionId: string): Promise<void> {
    try {
      logger.info('EnhancedInstitutionalAnalytics', 'Iniciando generación de reportes automáticos para padres');

      // Obtener relaciones padre-estudiante
      const { data: relationships, error } = await supabase
        .from('user_relationships')
        .select(`
          parent_user_id,
          child_user_id,
          profiles!user_relationships_child_user_id_fkey(name, email)
        `)
        .eq('relationship_type', 'parent_child')
        .eq('is_active', true);

      if (error) {
        logger.error('EnhancedInstitutionalAnalytics', 'Error obteniendo relaciones padre-estudiante', error);
        return;
      }

      // Procesar reportes en lotes
      const batchSize = 10;
      for (let i = 0; i < (relationships?.length || 0); i += batchSize) {
        const batch = relationships?.slice(i, i + batchSize) || [];
        await Promise.all(
          batch.map(rel => this.generateAndSendParentReport(rel.parent_user_id, rel.child_user_id))
        );
      }

      logger.info('EnhancedInstitutionalAnalytics', 'Reportes para padres generados exitosamente');
    } catch (error) {
      logger.error('EnhancedInstitutionalAnalytics', 'Error generando reportes para padres', error);
      throw error;
    }
  }

  /**
   * Genera reporte individual para padre
   */
  private static async generateAndSendParentReport(parentId: string, studentId: string): Promise<void> {
    try {
      const report = await this.generateStudentReport(studentId);
      const reportDTO = AnalyticsMappers.parentReportToDTO({
        ...report,
        parentId
      });

      // Crear notificación mejorada
      await supabase
        .from('user_notifications')
        .insert({
          user_id: parentId,
          notification_type: 'parent_report_enhanced',
          title: 'Reporte Semanal de Progreso Avanzado',
          message: `Reporte detallado: ${report.weeklyProgress.toFixed(1)}% progreso, ${report.exercisesCompleted} ejercicios completados`,
          action_data: {
            ...reportDTO,
            trends: await this.getStudentTrends(studentId),
            recommendations: await this.getPersonalizedRecommendations(studentId)
          }
        });

      logger.info('EnhancedInstitutionalAnalytics', `Reporte enviado para padre ${parentId}`);
    } catch (error) {
      logger.error('EnhancedInstitutionalAnalytics', `Error enviando reporte para padre ${parentId}`, error);
    }
  }

  /**
   * Calcula métricas predictivas usando algoritmos avanzados
   */
  private static async calculatePredictiveMetrics(institutionId: string, baseMetrics: InstitutionalMetrics) {
    if (!this.config.enablePredictive) return {};

    try {
      // Tendencia de rendimiento
      const performanceTrend = this.calculatePerformanceTrend(baseMetrics);
      
      // Predicción de riesgo
      const riskPrediction = this.calculateRiskPrediction(baseMetrics);
      
      // Proyección de objetivos
      const goalProjection = await this.calculateGoalProjection(institutionId, baseMetrics);

      return {
        predictive: {
          performanceTrend,
          riskPrediction,
          goalProjection,
          nextRecommendedActions: this.generateRecommendedActions(baseMetrics)
        }
      };
    } catch (error) {
      logger.warn('EnhancedInstitutionalAnalytics', 'Error calculando métricas predictivas', error);
      return {};
    }
  }

  /**
   * Sistema de cache inteligente
   */
  private static getCachedData(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  private static setCacheData(key: string, data: any, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.config.cacheTimeout
    });
  }

  /**
   * Programar reportes automáticos
   */
  private static async scheduleParentReports(institutionId: string): Promise<void> {
    try {
      // Crear evento en calendario para reporte semanal
      await supabase
        .from('calendar_events')
        .insert({
          user_id: institutionId, // Sistema
          title: 'Generar Reportes Automáticos para Padres',
          description: `Generación automática de reportes para institución ${institutionId}`,
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Próxima semana
          event_type: 'automated_report',
          is_recurring: true,
          recurrence_pattern: {
            type: 'weekly',
            interval: 1,
            daysOfWeek: [1] // Lunes
          },
          metadata: {
            institutionId,
            reportType: 'parent_weekly'
          }
        });

      logger.info('EnhancedInstitutionalAnalytics', 'Reporte automático programado');
    } catch (error) {
      logger.warn('EnhancedInstitutionalAnalytics', 'Error programando reporte automático', error);
    }
  }

  // Métodos auxiliares para datos específicos
  private static async getExercisesData(institutionId: string): Promise<any[]> {
    const students = await this.getRealStudentsData(institutionId);
    const studentIds = students.map(s => s.id);

    if (studentIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .in('user_id', studentIds)
      .limit(this.config.batchSize * 2);

    if (error) {
      logger.error('EnhancedInstitutionalAnalytics', 'Error obteniendo ejercicios', error);
      return [];
    }

    return data || [];
  }

  private static async getProgressData(institutionId: string): Promise<any[]> {
    const students = await this.getRealStudentsData(institutionId);
    const studentIds = students.map(s => s.id);

    if (studentIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_node_progress')
      .select('*')
      .in('user_id', studentIds)
      .limit(this.config.batchSize * 2);

    if (error) {
      logger.error('EnhancedInstitutionalAnalytics', 'Error obteniendo progreso', error);
      return [];
    }

    return data || [];
  }

  private static async generateStudentReport(studentId: string): Promise<ParentReportData> {
    // Obtener datos reales del estudiante
    const { data: progress } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', studentId);

    const { data: exercises } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', studentId)
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    const weeklyProgress = progress?.reduce((sum, p) => sum + (p.progress || 0), 0) / Math.max(progress?.length || 1, 1);
    const exercisesCompleted = exercises?.length || 0;
    const timeSpent = exercises?.reduce((sum, e) => sum + (e.time_taken_seconds || 0), 0) || 0;

    return {
      studentId,
      parentId: '', // Se asigna posteriormente
      weeklyProgress,
      exercisesCompleted,
      timeSpent,
      strongSubjects: this.calculateStrongSubjects(progress || []),
      improvementAreas: this.calculateImprovementAreas(progress || []),
      recommendations: this.generateRecommendations(weeklyProgress, exercisesCompleted),
      nextGoals: this.generateNextGoals(weeklyProgress)
    };
  }

  // Métodos auxiliares para cálculos
  private static calculateStrongSubjects(progress: any[]): string[] {
    const subjectScores = progress.reduce((acc, p) => {
      const subject = p.subject_area || 'General';
      acc[subject] = (acc[subject] || 0) + (p.progress || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(subjectScores)
      .filter(([_, score]) => score > 70)
      .map(([subject]) => subject)
      .slice(0, 3);
  }

  private static calculateImprovementAreas(progress: any[]): string[] {
    const subjectScores = progress.reduce((acc, p) => {
      const subject = p.subject_area || 'General';
      acc[subject] = (acc[subject] || 0) + (p.progress || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(subjectScores)
      .filter(([_, score]) => score < 50)
      .map(([subject]) => subject)
      .slice(0, 3);
  }

  private static generateRecommendations(weeklyProgress: number, exercisesCompleted: number): string[] {
    const recommendations = [];
    
    if (weeklyProgress < 50) {
      recommendations.push('Incrementar tiempo de estudio diario');
    }
    if (exercisesCompleted < 10) {
      recommendations.push('Realizar más ejercicios prácticos');
    }
    if (weeklyProgress > 80) {
      recommendations.push('Explorar contenido avanzado');
    }

    return recommendations;
  }

  private static generateNextGoals(weeklyProgress: number): string[] {
    const goals = [];
    
    if (weeklyProgress < 70) {
      goals.push('Alcanzar 70% de progreso semanal');
    } else {
      goals.push('Mantener progreso constante');
    }
    
    goals.push('Completar 15 ejercicios esta semana');
    return goals;
  }

  private static calculatePerformanceTrend(metrics: InstitutionalMetrics): string {
    if (metrics.overallProgress > 0.8) return 'increasing';
    if (metrics.overallProgress > 0.6) return 'stable';
    return 'decreasing';
  }

  private static calculateRiskPrediction(metrics: InstitutionalMetrics): any {
    return {
      highRiskStudents: metrics.riskDistribution.high,
      predictedDropouts: Math.round(metrics.riskDistribution.high * 0.3),
      interventionRecommended: metrics.riskDistribution.high > metrics.totalStudents * 0.2
    };
  }

  private static async calculateGoalProjection(institutionId: string, metrics: InstitutionalMetrics): Promise<any> {
    return {
      projectedPAESScore: 150 + (metrics.overallProgress * 700),
      timeToGoal: Math.max(1, 12 - Math.round(metrics.overallProgress * 10)),
      successProbability: Math.min(95, metrics.overallProgress * 100)
    };
  }

  private static generateRecommendedActions(metrics: InstitutionalMetrics): string[] {
    const actions = [];
    
    if (metrics.riskDistribution.high > 0) {
      actions.push('Implementar tutorías individualizadas');
    }
    if (metrics.averageEngagement < 0.7) {
      actions.push('Revisar estrategias de engagement');
    }
    if (metrics.overallProgress < 0.6) {
      actions.push('Intensificar práctica en áreas débiles');
    }

    return actions;
  }

  private static async getStudentTrends(studentId: string): Promise<any> {
    // Obtener tendencias de los últimos 30 días
    const { data } = await supabase
      .from('user_node_progress')
      .select('progress, last_activity_at')
      .eq('user_id', studentId)
      .gte('last_activity_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('last_activity_at', { ascending: true });

    return {
      progressTrend: data?.map(d => d.progress) || [],
      activityTrend: data?.length || 0,
      improvementRate: this.calculateImprovementRate(data || [])
    };
  }

  private static async getPersonalizedRecommendations(studentId: string): Promise<string[]> {
    const { data: weakAreas } = await supabase
      .from('user_node_progress')
      .select('node_id, progress')
      .eq('user_id', studentId)
      .lt('progress', 50)
      .limit(3);

    return weakAreas?.map(area => 
      `Reforzar área de aprendizaje en nodo ${area.node_id}`
    ) || ['Continuar con el plan de estudios actual'];
  }

  private static calculateImprovementRate(progressData: any[]): number {
    if (progressData.length < 2) return 0;
    
    const first = progressData[0]?.progress || 0;
    const last = progressData[progressData.length - 1]?.progress || 0;
    
    return ((last - first) / Math.max(first, 1)) * 100;
  }

  private static async storeInstitutionalMetrics(institutionId: string, metrics: any): Promise<void> {
    await supabase
      .from('system_metrics')
      .insert({
        metric_type: 'institutional_analytics_enhanced',
        metric_value: metrics.totalStudents,
        context: metrics,
        user_id: institutionId
      });
  }

  /**
   * API para exportación de reportes
   */
  static async exportReport(institutionId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    const report = await this.generateInstitutionalReport(institutionId);
    
    // Aquí se implementaría la lógica de exportación según el formato
    const jsonData = JSON.stringify(report, null, 2);
    return new Blob([jsonData], { type: 'application/json' });
  }

  /**
   * Limpieza de cache
   */
  static clearCache(): void {
    this.cache.clear();
    logger.info('EnhancedInstitutionalAnalytics', 'Cache limpiado');
  }
}
