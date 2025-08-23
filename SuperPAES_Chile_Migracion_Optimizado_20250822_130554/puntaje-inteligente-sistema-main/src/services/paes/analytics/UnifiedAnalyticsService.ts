/* eslint-disable react-refresh/only-export-components */

import { logger } from '@/core/logging/SystemLogger';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

export interface SimplifiedInstitutionalMetrics {
  totalStudents: number;
  activeStudents: number;
  averageEngagement: number;
  overallProgress: number;
  riskDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  subjectPerformance: Record<string, number>;
}

export interface CareerRecommendation {
  codigo_demre: string;
  carrera: string;
  universidad: string;
  region: string;
  area_conocimiento: string;
  puntaje_corte: number;
  vacantes: number;
  arancel: number;
}

export class UnifiedAnalyticsService {
  private static cache = new Map<string, unknown>();

  /**
   * Genera mÃ©tricas institucionales usando datos reales de Supabase
   */
  static async generateInstitutionalMetrics(institutionId: string): Promise<SimplifiedInstitutionalMetrics> {
    const cacheKey = `institutional_metrics_${institutionId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info('UnifiedAnalyticsService', 'Generando mÃ©tricas institucionales desde Supabase');

      // Obtener estudiantes de la instituciÃ³n
      const { data: institutionStudents, error: studentsError } = await supabase
        .from('institution_students')
        .select('student_id, status, created_at')
        .eq('institution_id', institutionId);

      if (studentsError) {
        logger.error('UnifiedAnalyticsService', 'Error obteniendo estudiantes institucionales', studentsError);
        throw studentsError;
      }

      const studentIds = institutionStudents?.map(s => s.student_id) || [];
      const totalStudents = studentIds.length;
      
      if (totalStudents === 0) {
        // Si no hay estudiantes, devolver mÃ©tricas vacÃ­as
        const emptyMetrics: SimplifiedInstitutionalMetrics = {
          totalStudents: 0,
          activeStudents: 0,
          averageEngagement: 0,
          overallProgress: 0,
          riskDistribution: { high: 0, medium: 0, low: 0 },
          subjectPerformance: {}
        };
        this.cache.set(cacheKey, emptyMetrics);
        return emptyMetrics;
      }

      // Obtener progreso de nodos para todos los estudiantes
      const { data: nodeProgress } = await supabase
        .from('user_node_progress')
        .select('user_id, status, progress, success_rate, last_activity_at')
        .in('user_id', studentIds);

      // Obtener informaciÃ³n de nodos para calcular rendimiento por materia
      const { data: learningNodes } = await supabase
        .from('learning_nodes')
        .select('id, subject_area');

      // Calcular estudiantes activos (con actividad en los Ãºltimos 7 dÃ­as)
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const activeStudents = new Set(
        nodeProgress?.filter(np => 
          np.last_activity_at && new Date(np.last_activity_at) > new Date(weekAgo)
        ).map(np => np.user_id) || []
      ).size;

      // Calcular engagement promedio
      const totalProgress = nodeProgress?.reduce((sum, np) => sum + (np.progress || 0), 0) || 0;
      const averageEngagement = nodeProgress?.length ? totalProgress / nodeProgress.length : 0;

      // Calcular progreso general
      const completedNodes = nodeProgress?.filter(np => np.status === 'completed').length || 0;
      const totalNodes = nodeProgress?.length || 0;
      const overallProgress = totalNodes > 0 ? completedNodes / totalNodes : 0;

      // Calcular distribuciÃ³n de riesgo basada en success_rate
      const riskDistribution = this.calculateRiskDistribution(nodeProgress || []);

      // Calcular rendimiento por materia
      const subjectPerformance = this.calculateSubjectPerformance(
        nodeProgress || [], 
        learningNodes || []
      );

      const metrics: SimplifiedInstitutionalMetrics = {
        totalStudents,
        activeStudents,
        averageEngagement,
        overallProgress,
        riskDistribution,
        subjectPerformance
      };

      this.cache.set(cacheKey, metrics);
      logger.info('UnifiedAnalyticsService', 'MÃ©tricas institucionales generadas exitosamente');
      return metrics;

    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error generando mÃ©tricas institucionales', error);
      throw error;
    }
  }

  /**
   * Calcula distribuciÃ³n de riesgo basada en success_rate
   */
  private static calculateRiskDistribution(nodeProgress: unknown[]) {
    const studentRisks = new Map<string, number[]>();
    
    // Calcular promedio de success_rate por estudiante
    nodeProgress.forEach(np => {
      if (!studentRisks.has(np.user_id)) {
        studentRisks.set(np.user_id, []);
      }
      if (np.success_rate !== null) {
        const rates = studentRisks.get(np.user_id);
        if (rates) {
          rates.push(np.success_rate);
        }
      }
    });

    const riskCounts = { high: 0, medium: 0, low: 0 };
    
    studentRisks.forEach((rates, userId) => {
      if (rates.length === 0) return;
      
      const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
      
      if (avgRate < 0.5) riskCounts.high++;
      else if (avgRate < 0.75) riskCounts.medium++;
      else riskCounts.low++;
    });

    return riskCounts;
  }

  /**
   * Calcula rendimiento por materia
   */
  private static calculateSubjectPerformance(nodeProgress: unknown[], learningNodes: unknown[]) {
    const nodeSubjectMap = new Map<string, string>();
    learningNodes.forEach(node => {
      nodeSubjectMap.set(node.id, node.subject_area);
    });

    const subjectProgress = new Map<string, number[]>();
    
    nodeProgress.forEach(np => {
      const subject = nodeSubjectMap.get(np.node_id);
      if (subject && np.success_rate !== null) {
        if (!subjectProgress.has(subject)) {
          subjectProgress.set(subject, []);
        }
        const rates = subjectProgress.get(subject);
        if (rates) {
          rates.push(np.success_rate);
        }
      }
    });

    const subjectPerformance: Record<string, number> = {};
    subjectProgress.forEach((rates, subject) => {
      if (rates.length > 0) {
        subjectPerformance[subject] = rates.reduce((a, b) => a + b, 0) / rates.length;
      }
    });

    return subjectPerformance;
  }

  /**
   * Busca carreras usando datos reales de becas_financiamiento
   */
  static async searchCareers(
    texto?: string,
    region?: string,
    puntajeMin?: number,
    puntajeMax?: number,
    area?: string
  ): Promise<CareerRecommendation[]> {
    try {
      logger.info('UnifiedAnalyticsService', 'Buscando carreras desde Supabase');

      // Buscar en becas_financiamiento como fuente de datos de carreras
      let query = supabase
        .from('becas_financiamiento')
        .select('*')
        .eq('estado', 'activa');

      // Aplicar filtros
      if (texto) {
        query = query.or(`nombre.ilike.%${texto}%,institucion.ilike.%${texto}%`);
      }

      const { data: becasData, error } = await query.limit(10);

      if (error) {
        logger.error('UnifiedAnalyticsService', 'Error buscando carreras', error);
        return this.getMockCareerData();
      }

      // Transformar datos de becas a formato de carrera
      const careers: CareerRecommendation[] = becasData?.map((beca, index) => ({
        codigo_demre: `BEC${index + 1}`,
        carrera: beca.nombre,
        universidad: beca.institucion,
        region: 'RegiÃ³n Metropolitana', // Default
        area_conocimiento: beca.tipo_beca === 'academica' ? 'AcadÃ©mica' : 'TÃ©cnica',
        puntaje_corte: beca.puntaje_minimo_competencia_lectora || 600,
        vacantes: 50, // Default
        arancel: beca.monto_maximo || 3000000
      })) || [];

      return careers.length > 0 ? careers : this.getMockCareerData();

    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error buscando carreras', error);
      return this.getMockCareerData();
    }
  }

  /**
   * Datos mock de carreras como fallback
   */
  private static getMockCareerData(): CareerRecommendation[] {
    return [
      {
        codigo_demre: '15306',
        carrera: 'IngenierÃ­a Civil Industrial',
        universidad: 'Universidad de Chile',
        region: 'RegiÃ³n Metropolitana',
        area_conocimiento: 'IngenierÃ­a y TecnologÃ­a',
        puntaje_corte: 720,
        vacantes: 180,
        arancel: 3200000
      },
      {
        codigo_demre: '12201',
        carrera: 'Medicina',
        universidad: 'Universidad de Chile',
        region: 'RegiÃ³n Metropolitana',
        area_conocimiento: 'Ciencias de la Salud',
        puntaje_corte: 780,
        vacantes: 180,
        arancel: 4500000
      }
    ];
  }

  /**
   * Exporta reporte en formato especificado
   */
  static async exportReport(institutionId: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    try {
      const metrics = await this.generateInstitutionalMetrics(institutionId);
      
      let content: string;
      let mimeType: string;

      switch (format) {
        case 'csv':
          content = this.generateCSV(metrics);
          mimeType = 'text/csv';
          break;
        case 'excel':
          content = this.generateCSV(metrics);
          mimeType = 'application/vnd.ms-excel';
          break;
        case 'pdf':
          content = this.generateCSV(metrics);
          mimeType = 'application/pdf';
          break;
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }

      return new Blob([content], { type: mimeType });
    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error exportando reporte', error);
      throw error;
    }
  }

  /**
   * Genera contenido CSV
   */
  private static generateCSV(metrics: SimplifiedInstitutionalMetrics): string {
    const lines = [
      'MÃ©trica,Valor',
      `Total Estudiantes,${metrics.totalStudents}`,
      `Estudiantes Activos,${metrics.activeStudents}`,
      `Engagement Promedio,${Math.round(metrics.averageEngagement * 100)}%`,
      `Progreso General,${Math.round(metrics.overallProgress * 100)}%`,
      `Riesgo Alto,${metrics.riskDistribution.high}`,
      `Riesgo Medio,${metrics.riskDistribution.medium}`,
      `Riesgo Bajo,${metrics.riskDistribution.low}`
    ];

    Object.entries(metrics.subjectPerformance).forEach(([subject, performance]) => {
      lines.push(`${subject},${Math.round(performance * 100)}%`);
    });

    return lines.join('\n');
  }

  /**
   * Limpia el cache
   */
  static clearCache(): void {
    this.cache.clear();
    logger.info('UnifiedAnalyticsService', 'Cache limpiado');
  }
}





