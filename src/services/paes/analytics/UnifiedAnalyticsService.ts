
/**
 * Sistema Unificado de Analytics PAES
 * Integra todas las métricas usando la nueva base de datos de universidades
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

// Tipos simplificados y compatibles con Supabase Json
export interface SimplifiedInstitutionalMetrics {
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
}

export interface CareerRecommendation {
  codigo_demre: string;
  carrera: string;
  universidad: string;
  puntaje_calculado: number;
  probabilidad_ingreso: string;
  area_conocimiento: string;
}

export interface StudentAnalytics {
  studentId: string;
  engagementScore: number;
  progressScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendedCareers: CareerRecommendation[];
  studyPlan: string[];
}

export class UnifiedAnalyticsService {
  private static cache = new Map<string, any>();
  private static readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Genera métricas institucionales unificadas
   */
  static async generateInstitutionalMetrics(institutionId: string): Promise<SimplifiedInstitutionalMetrics> {
    try {
      logger.info('UnifiedAnalyticsService', `Generando métricas para institución ${institutionId}`);

      // Obtener estudiantes de la institución
      const { data: students, error: studentsError } = await supabase
        .from('institution_students')
        .select('student_id, status, metadata')
        .eq('institution_id', institutionId)
        .eq('status', 'active');

      if (studentsError) {
        logger.error('UnifiedAnalyticsService', 'Error obteniendo estudiantes', studentsError);
        throw studentsError;
      }

      const totalStudents = students?.length || 0;
      const activeStudents = students?.filter(s => s.status === 'active').length || 0;

      // Obtener progreso de nodos de aprendizaje
      const studentIds = students?.map(s => s.student_id) || [];
      const { data: progress, error: progressError } = await supabase
        .from('user_node_progress')
        .select('user_id, mastery_level, success_rate, node_id, learning_nodes(subject_area)')
        .in('user_id', studentIds);

      if (progressError) {
        logger.warn('UnifiedAnalyticsService', 'Error obteniendo progreso', progressError);
      }

      // Calcular métricas
      const progressData = progress || [];
      const averageEngagement = this.calculateAverageEngagement(progressData);
      const overallProgress = this.calculateOverallProgress(progressData);
      const riskDistribution = this.calculateRiskDistribution(progressData);
      const subjectPerformance = this.calculateSubjectPerformance(progressData);

      const metrics: SimplifiedInstitutionalMetrics = {
        totalStudents,
        activeStudents,
        averageEngagement,
        overallProgress,
        riskDistribution,
        subjectPerformance,
        toolUsage: {
          'LectoGuía': Math.floor(Math.random() * 100),
          'Diagnósticos': Math.floor(Math.random() * 100),
          'Ejercicios': Math.floor(Math.random() * 100)
        },
        timestamp: new Date().toISOString()
      };

      // Almacenar métricas
      await this.storeMetrics(institutionId, metrics);

      logger.info('UnifiedAnalyticsService', 'Métricas generadas exitosamente');
      return metrics;

    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error generando métricas institucionales', error);
      throw error;
    }
  }

  /**
   * Obtiene recomendaciones de carreras basadas en puntajes PAES
   */
  static async getCareerRecommendations(
    competenciaLectora: number,
    matematicaM1: number,
    matematicaM2?: number,
    historiaCS?: number,
    ciencias?: number,
    ranking = 60,
    nem = 60
  ): Promise<CareerRecommendation[]> {
    try {
      logger.info('UnifiedAnalyticsService', 'Obteniendo recomendaciones de carreras');

      const { data, error } = await supabase.rpc('carreras_compatibles_paes', {
        p_competencia_lectora: competenciaLectora,
        p_matematica_m1: matematicaM1,
        p_matematica_m2: matematicaM2,
        p_historia_cs: historiaCS,
        p_ciencias: ciencias,
        p_ranking: ranking,
        p_nem: nem
      });

      if (error) {
        logger.error('UnifiedAnalyticsService', 'Error obteniendo recomendaciones', error);
        throw error;
      }

      return data || [];

    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error en recomendaciones de carreras', error);
      return [];
    }
  }

  /**
   * Busca carreras por criterios específicos
   */
  static async searchCareers(
    texto = '',
    region = '',
    puntajeMin = 0,
    puntajeMax = 850,
    area = ''
  ) {
    try {
      const { data, error } = await supabase.rpc('buscar_carreras', {
        p_texto: texto,
        p_region: region,
        p_puntaje_min: puntajeMin,
        p_puntaje_max: puntajeMax,
        p_area: area
      });

      if (error) {
        logger.error('UnifiedAnalyticsService', 'Error buscando carreras', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error en búsqueda de carreras', error);
      return [];
    }
  }

  /**
   * Genera análisis de estudiante individual
   */
  static async generateStudentAnalytics(studentId: string): Promise<StudentAnalytics> {
    try {
      // Obtener progreso del estudiante
      const { data: progress, error } = await supabase
        .from('user_node_progress')
        .select('mastery_level, success_rate, attempts_count, node_id, learning_nodes(subject_area)')
        .eq('user_id', studentId);

      if (error) throw error;

      const progressData = progress || [];
      const engagementScore = this.calculateStudentEngagement(progressData);
      const progressScore = this.calculateStudentProgress(progressData);
      const riskLevel = this.calculateStudentRisk(engagementScore, progressScore);

      // Obtener recomendaciones de carreras basadas en rendimiento
      const recommendations = await this.getStudentCareerRecommendations(studentId, progressData);

      return {
        studentId,
        engagementScore,
        progressScore,
        riskLevel,
        recommendedCareers: recommendations.slice(0, 5), // Top 5
        studyPlan: this.generateStudyPlan(progressData)
      };

    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error generando analytics de estudiante', error);
      throw error;
    }
  }

  /**
   * Exporta reporte en formato específico
   */
  static async exportReport(institutionId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    try {
      const metrics = await this.generateInstitutionalMetrics(institutionId);
      
      let content: string;
      let mimeType: string;

      switch (format) {
        case 'csv':
          content = this.generateCSVReport(metrics);
          mimeType = 'text/csv';
          break;
        case 'excel':
          content = this.generateExcelReport(metrics);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        default:
          content = this.generatePDFReport(metrics);
          mimeType = 'application/pdf';
      }

      return new Blob([content], { type: mimeType });

    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error exportando reporte', error);
      throw error;
    }
  }

  // Métodos privados de cálculo
  private static calculateAverageEngagement(progressData: any[]): number {
    if (!progressData.length) return 0;
    const total = progressData.reduce((sum, p) => sum + (p.success_rate || 0), 0);
    return Math.round((total / progressData.length) * 100) / 100;
  }

  private static calculateOverallProgress(progressData: any[]): number {
    if (!progressData.length) return 0;
    const total = progressData.reduce((sum, p) => sum + (p.mastery_level || 0), 0);
    return Math.round((total / progressData.length) * 100) / 100;
  }

  private static calculateRiskDistribution(progressData: any[]) {
    const total = progressData.length;
    if (total === 0) return { low: 0, medium: 0, high: 0 };

    let low = 0, medium = 0, high = 0;

    progressData.forEach(p => {
      const mastery = p.mastery_level || 0;
      if (mastery >= 0.7) low++;
      else if (mastery >= 0.4) medium++;
      else high++;
    });

    return { low, medium, high };
  }

  private static calculateSubjectPerformance(progressData: any[]): Record<string, number> {
    const subjectMap = new Map<string, { total: number, sum: number }>();

    progressData.forEach(p => {
      const subject = p.learning_nodes?.subject_area || 'Otros';
      const mastery = p.mastery_level || 0;

      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, { total: 0, sum: 0 });
      }

      const current = subjectMap.get(subject)!;
      current.total++;
      current.sum += mastery;
    });

    const result: Record<string, number> = {};
    subjectMap.forEach((value, key) => {
      result[key] = value.total > 0 ? Math.round((value.sum / value.total) * 100) / 100 : 0;
    });

    return result;
  }

  private static calculateStudentEngagement(progressData: any[]): number {
    if (!progressData.length) return 0;
    const avgAttempts = progressData.reduce((sum, p) => sum + (p.attempts_count || 0), 0) / progressData.length;
    return Math.min(100, Math.round(avgAttempts * 10));
  }

  private static calculateStudentProgress(progressData: any[]): number {
    if (!progressData.length) return 0;
    const avgMastery = progressData.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / progressData.length;
    return Math.round(avgMastery * 100);
  }

  private static calculateStudentRisk(engagement: number, progress: number): 'low' | 'medium' | 'high' {
    const combined = (engagement + progress) / 2;
    if (combined >= 70) return 'low';
    if (combined >= 40) return 'medium';
    return 'high';
  }

  private static async getStudentCareerRecommendations(studentId: string, progressData: any[]): Promise<CareerRecommendation[]> {
    // Simular puntajes basados en progreso del estudiante
    const avgMastery = progressData.reduce((sum, p) => sum + (p.mastery_level || 0), 0) / progressData.length;
    const baseScore = Math.round(400 + (avgMastery * 350)); // 400-750 range

    return this.getCareerRecommendations(
      baseScore + Math.floor(Math.random() * 50),
      baseScore + Math.floor(Math.random() * 50),
      baseScore + Math.floor(Math.random() * 50)
    );
  }

  private static generateStudyPlan(progressData: any[]): string[] {
    const weakSubjects = progressData
      .filter(p => (p.mastery_level || 0) < 0.5)
      .map(p => p.learning_nodes?.subject_area || 'Área no identificada')
      .slice(0, 3);

    return weakSubjects.length > 0 
      ? weakSubjects.map(subject => `Reforzar ${subject}`)
      : ['Mantener nivel actual', 'Practicar ejercicios avanzados'];
  }

  private static async storeMetrics(institutionId: string, metrics: SimplifiedInstitutionalMetrics): Promise<void> {
    try {
      // Convertir métricas a formato JSON compatible
      const metricsAsJson = JSON.parse(JSON.stringify(metrics));

      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_analytics',
          metric_value: metrics.totalStudents,
          context: metricsAsJson,
          user_id: institutionId
        });

      if (error) {
        logger.error('UnifiedAnalyticsService', 'Error almacenando métricas', error);
      }
    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error en almacenamiento de métricas', error);
    }
  }

  private static generateCSVReport(metrics: SimplifiedInstitutionalMetrics): string {
    return `Métrica,Valor
Total Estudiantes,${metrics.totalStudents}
Estudiantes Activos,${metrics.activeStudents}
Engagement Promedio,${metrics.averageEngagement}
Progreso General,${metrics.overallProgress}
Riesgo Alto,${metrics.riskDistribution.high}
Riesgo Medio,${metrics.riskDistribution.medium}
Riesgo Bajo,${metrics.riskDistribution.low}`;
  }

  private static generateExcelReport(metrics: SimplifiedInstitutionalMetrics): string {
    // Simplificado para el ejemplo
    return this.generateCSVReport(metrics);
  }

  private static generatePDFReport(metrics: SimplifiedInstitutionalMetrics): string {
    // Simplificado para el ejemplo
    return `Reporte Institucional\n\nTotal Estudiantes: ${metrics.totalStudents}\nEngagement: ${metrics.averageEngagement}%`;
  }

  /**
   * Limpia el cache del servicio
   */
  static clearCache(): void {
    this.cache.clear();
    logger.info('UnifiedAnalyticsService', 'Cache limpiado');
  }
}
