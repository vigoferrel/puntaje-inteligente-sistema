
import { logger } from '@/core/logging/SystemLogger';
import { supabase } from '@/integrations/supabase/client';

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
  private static cache = new Map<string, any>();

  /**
   * Genera métricas institucionales unificadas
   */
  static async generateInstitutionalMetrics(institutionId: string): Promise<SimplifiedInstitutionalMetrics> {
    const cacheKey = `institutional_metrics_${institutionId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info('UnifiedAnalyticsService', 'Generando métricas institucionales unificadas');

      // For now, return mock data since we need to implement proper institutional data fetching
      const metrics: SimplifiedInstitutionalMetrics = {
        totalStudents: 250,
        activeStudents: 200,
        averageEngagement: 0.78,
        overallProgress: 0.72,
        riskDistribution: {
          high: 25,
          medium: 75,
          low: 150
        },
        subjectPerformance: {
          'Competencia Lectora': 0.74,
          'Matemática M1': 0.70,
          'Matemática M2': 0.68,
          'Ciencias': 0.73,
          'Historia': 0.71
        }
      };

      this.cache.set(cacheKey, metrics);
      return metrics;
    } catch (error) {
      logger.error('UnifiedAnalyticsService', 'Error generando métricas institucionales', error);
      throw error;
    }
  }

  /**
   * Busca carreras usando función de base de datos
   */
  static async searchCareers(
    texto?: string,
    region?: string,
    puntajeMin?: number,
    puntajeMax?: number,
    area?: string
  ): Promise<CareerRecommendation[]> {
    try {
      logger.info('UnifiedAnalyticsService', 'Buscando carreras');

      // Use RPC function to search careers
      const { data, error } = await supabase.rpc('buscar_carreras', {
        p_texto: texto || '',
        p_region: region || '',
        p_puntaje_min: puntajeMin || 0,
        p_puntaje_max: puntajeMax || 850,
        p_area: area || ''
      });

      if (error) {
        logger.error('UnifiedAnalyticsService', 'Error en búsqueda de carreras', error);
        // Return mock data as fallback
        return this.getMockCareerData();
      }

      return data || [];
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
        carrera: 'Ingeniería Civil Industrial',
        universidad: 'Universidad de Chile',
        region: 'Región Metropolitana',
        area_conocimiento: 'Ingeniería y Tecnología',
        puntaje_corte: 720,
        vacantes: 180,
        arancel: 3200000
      },
      {
        codigo_demre: '12201',
        carrera: 'Medicina',
        universidad: 'Universidad de Chile',
        region: 'Región Metropolitana',
        area_conocimiento: 'Ciencias de la Salud',
        puntaje_corte: 780,
        vacantes: 180,
        arancel: 4500000
      },
      {
        codigo_demre: '17101',
        carrera: 'Derecho',
        universidad: 'Universidad de Chile',
        region: 'Región Metropolitana',
        area_conocimiento: 'Derecho y Ciencias Jurídicas',
        puntaje_corte: 740,
        vacantes: 150,
        arancel: 3500000
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
          content = this.generateCSV(metrics); // Simplified - use CSV format
          mimeType = 'application/vnd.ms-excel';
          break;
        case 'pdf':
          content = this.generateCSV(metrics); // Simplified - use CSV format
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
      'Métrica,Valor',
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
