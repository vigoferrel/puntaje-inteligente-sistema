
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

// Interfaces para tipos de datos
export interface TimelineEvent {
  fecha_id: number;
  proceso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_restantes: number;
  prioridad: number;
  estado: string;
}

export interface ScholarshipBenefit {
  beneficio_id: number;
  nombre: string;
  categoria: string;
  monto_anual: number;
  porcentaje_cobertura: number;
  compatibilidad: number;
  estado_postulacion: string;
  fecha_cierre: string;
}

export interface CareerRecommendation {
  carrera_id: number;
  nombre_carrera: string;
  universidad: string;
  puntaje_corte: number;
  vacantes: number;
  puntaje_postulacion: number;
  probabilidad_ingreso: number;
  region: string;
}

export interface UnifiedDashboardData {
  timeline: TimelineEvent[];
  scholarships: ScholarshipBenefit[];
  careers: CareerRecommendation[];
  analytics: {
    totalStudents: number;
    activeStudents: number;
    averageProgress: number;
    weeklyGrowth: number;
  };
  alerts: PersonalizedAlert[];
}

export interface OptimalPathData {
  recommendedNodes: string[];
  estimatedHours: number;
  priorityAreas: string[];
  weeklySchedule: any;
}

export interface PersonalizedAlert {
  id: string;
  type: 'info' | 'warning' | 'urgent';
  title: string;
  message: string;
  actionRequired: boolean;
  dueDate?: string;
}

export class CentralizedEducationService {
  private static cache = new Map<string, any>();

  /**
   * Obtiene dashboard unificado con datos reales y fallbacks
   */
  static async getUnifiedDashboard(userId: string): Promise<UnifiedDashboardData> {
    const cacheKey = `dashboard_${userId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info('CentralizedEducationService', 'Cargando dashboard unificado');

      // Obtener timeline con fallback
      const timeline = await this.getTimeline();
      
      // Obtener becas con fallback
      const scholarships = await this.getScholarships(userId);
      
      // Obtener carreras con fallback
      const careers = await this.getCareers(userId);

      const dashboardData: UnifiedDashboardData = {
        timeline,
        scholarships,
        careers,
        analytics: {
          totalStudents: 1250,
          activeStudents: 980,
          averageProgress: 0.74,
          weeklyGrowth: 0.12
        },
        alerts: this.generatePersonalizedAlerts(userId)
      };

      this.cache.set(cacheKey, dashboardData);
      return dashboardData;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error cargando dashboard', error);
      return this.getFallbackDashboard();
    }
  }

  /**
   * Obtiene timeline con datos reales o fallback
   */
  private static async getTimeline(): Promise<TimelineEvent[]> {
    try {
      // Intentar usar función SQL personalizada
      const { data, error } = await supabase
        .from('beneficios_estudiantiles')
        .select('*')
        .limit(10);

      if (error) {
        logger.warn('CentralizedEducationService', 'Error en consulta timeline, usando fallback');
        return this.getFallbackTimeline();
      }

      // Si no hay datos reales, usar fallback
      if (!data || data.length === 0) {
        return this.getFallbackTimeline();
      }

      return data.map(item => ({
        fecha_id: item.id || 1,
        proceso: item.proceso || 'PAES 2025',
        descripcion: item.descripcion || 'Proceso PAES',
        fecha_inicio: item.fecha_inicio || '2024-12-02',
        fecha_fin: item.fecha_fin || '2024-12-02',
        dias_restantes: this.calculateDaysRemaining(item.fecha_inicio || '2024-12-02'),
        prioridad: item.prioridad || 1,
        estado: item.estado || 'PRÓXIMA'
      }));

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo timeline', error);
      return this.getFallbackTimeline();
    }
  }

  /**
   * Obtiene becas compatibles con fallback
   */
  private static async getScholarships(userId: string): Promise<ScholarshipBenefit[]> {
    try {
      // Obtener perfil del usuario
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Intentar consulta a becas
      const { data, error } = await supabase
        .from('becas_financiamiento')
        .select('*')
        .eq('estado', 'activa')
        .limit(5);

      if (error || !data) {
        return this.getFallbackScholarships();
      }

      return data.map(beca => ({
        beneficio_id: Math.floor(Math.random() * 1000),
        nombre: beca.nombre,
        categoria: beca.tipo_beca,
        monto_anual: Number(beca.monto_maximo) || 0,
        porcentaje_cobertura: beca.porcentaje_cobertura || 0,
        compatibilidad: this.calculateCompatibility(beca, profile),
        estado_postulacion: 'ABIERTA',
        fecha_cierre: '2025-03-13'
      }));

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo becas', error);
      return this.getFallbackScholarships();
    }
  }

  /**
   * Obtiene carreras compatibles con fallback
   */
  private static async getCareers(userId: string): Promise<CareerRecommendation[]> {
    try {
      // Por ahora usar datos fallback hasta tener tabla de carreras completa
      return this.getFallbackCareers();

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo carreras', error);
      return this.getFallbackCareers();
    }
  }

  /**
   * Calcula ruta óptima de estudio
   */
  static async calculateOptimalPath(userId: string, preferences: any = {}): Promise<OptimalPathData> {
    try {
      logger.info('CentralizedEducationService', 'Calculando ruta óptima');

      // Obtener nodos de aprendizaje
      const { data: nodes } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('tier_priority', 'tier1_critico')
        .limit(10);

      // Obtener progreso del usuario
      const { data: progress } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      const recommendedNodes = nodes?.map(node => node.code) || ['CL-01', 'CL-02', 'M1-01'];
      
      return {
        recommendedNodes,
        estimatedHours: 40,
        priorityAreas: ['Competencia Lectora', 'Matemática M1'],
        weeklySchedule: {
          lunes: ['CL-01'],
          miercoles: ['M1-01'],
          viernes: ['CL-02']
        }
      };

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error calculando ruta óptima', error);
      return {
        recommendedNodes: ['CL-01', 'M1-01'],
        estimatedHours: 20,
        priorityAreas: ['Competencia Lectora'],
        weeklySchedule: {}
      };
    }
  }

  /**
   * Obtiene alertas personalizadas
   */
  static async getPersonalizedAlerts(userId: string): Promise<PersonalizedAlert[]> {
    return this.generatePersonalizedAlerts(userId);
  }

  /**
   * Exporta reporte completo
   */
  static async exportCompleteReport(userId: string, format: 'pdf' | 'excel' | 'json'): Promise<Blob> {
    try {
      const dashboard = await this.getUnifiedDashboard(userId);
      const content = JSON.stringify(dashboard, null, 2);
      
      const mimeTypes = {
        pdf: 'application/pdf',
        excel: 'application/vnd.ms-excel',
        json: 'application/json'
      };

      return new Blob([content], { type: mimeTypes[format] });

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error exportando reporte', error);
      throw error;
    }
  }

  /**
   * Limpia cache del servicio
   */
  static clearCache(): void {
    this.cache.clear();
    logger.info('CentralizedEducationService', 'Cache limpiado');
  }

  // Métodos de fallback
  private static getFallbackDashboard(): UnifiedDashboardData {
    return {
      timeline: this.getFallbackTimeline(),
      scholarships: this.getFallbackScholarships(),
      careers: this.getFallbackCareers(),
      analytics: {
        totalStudents: 1000,
        activeStudents: 750,
        averageProgress: 0.65,
        weeklyGrowth: 0.08
      },
      alerts: []
    };
  }

  private static getFallbackTimeline(): TimelineEvent[] {
    return [
      {
        fecha_id: 1,
        proceso: 'PAES 2025',
        descripcion: 'Rendición PAES Regular - Día 1',
        fecha_inicio: '2024-12-02',
        fecha_fin: '2024-12-02',
        dias_restantes: this.calculateDaysRemaining('2024-12-02'),
        prioridad: 1,
        estado: 'PRÓXIMA'
      },
      {
        fecha_id: 2,
        proceso: 'Admisión 2025',
        descripcion: 'Postulación a Universidades',
        fecha_inicio: '2025-01-06',
        fecha_fin: '2025-01-09',
        dias_restantes: this.calculateDaysRemaining('2025-01-06'),
        prioridad: 1,
        estado: 'PRÓXIMA'
      }
    ];
  }

  private static getFallbackScholarships(): ScholarshipBenefit[] {
    return [
      {
        beneficio_id: 1,
        nombre: 'Gratuidad Universitaria',
        categoria: 'estatal',
        monto_anual: 0,
        porcentaje_cobertura: 100,
        compatibilidad: 85,
        estado_postulacion: 'ABIERTA',
        fecha_cierre: '2025-03-13'
      },
      {
        beneficio_id: 2,
        nombre: 'Beca Excelencia Académica',
        categoria: 'estatal',
        monto_anual: 2650000,
        porcentaje_cobertura: 0,
        compatibilidad: 75,
        estado_postulacion: 'ABIERTA',
        fecha_cierre: '2025-03-13'
      }
    ];
  }

  private static getFallbackCareers(): CareerRecommendation[] {
    return [
      {
        carrera_id: 1,
        nombre_carrera: 'Ingeniería Civil Industrial',
        universidad: 'Universidad de Chile',
        puntaje_corte: 720,
        vacantes: 180,
        puntaje_postulacion: 650,
        probabilidad_ingreso: 0.65,
        region: 'Región Metropolitana'
      },
      {
        carrera_id: 2,
        nombre_carrera: 'Medicina',
        universidad: 'Universidad de Chile',
        puntaje_corte: 780,
        vacantes: 180,
        puntaje_postulacion: 650,
        probabilidad_ingreso: 0.35,
        region: 'Región Metropolitana'
      }
    ];
  }

  private static generatePersonalizedAlerts(userId: string): PersonalizedAlert[] {
    return [
      {
        id: '1',
        type: 'urgent',
        title: 'PAES en 15 días',
        message: 'Intensifica tu preparación en Competencia Lectora',
        actionRequired: true,
        dueDate: '2024-11-30'
      },
      {
        id: '2',
        type: 'info',
        title: 'Nueva beca disponible',
        message: 'Revisa los requisitos para la Beca de Excelencia',
        actionRequired: false
      }
    ];
  }

  private static calculateDaysRemaining(dateString: string): number {
    const targetDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = targetDate.getTime() - currentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static calculateCompatibility(beca: any, profile: any): number {
    // Cálculo básico de compatibilidad
    let score = 50;
    
    if (beca.puntaje_minimo_competencia_lectora && profile?.target_score) {
      score += (profile.target_score >= beca.puntaje_minimo_competencia_lectora) ? 30 : -20;
    }
    
    return Math.max(0, Math.min(100, score));
  }
}
