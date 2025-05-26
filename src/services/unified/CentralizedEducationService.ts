
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';

// Interfaces actualizadas para tipos de datos
export interface TimelineEvent {
  fecha_id: number;
  proceso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  dias_restantes: number;
  prioridad: number;
  estado: string;
  nextCriticalDate?: TimelineEvent;
  upcomingDates?: TimelineEvent[];
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
  potentialSavings?: number;
  compatibleBenefits?: number;
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
  compatibleCareers?: number;
  recommendations?: CareerRecommendation[];
}

export interface PersonalizedAlert {
  id: string;
  type: 'info' | 'warning' | 'urgent';
  title: string;
  message: string;
  actionRequired: boolean;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
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
    overallProgress: number;
    paesReadiness: number;
    subjectStrengths: string[];
    areasForImprovement: string[];
  };
  alerts: PersonalizedAlert[];
  personalInfo?: {
    name: string;
    targetScore: number;
    studyProgress: number;
  };
}

export interface OptimalPathData {
  recommendedNodes: string[];
  estimatedHours: number;
  priorityAreas: string[];
  weeklySchedule: any;
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
          weeklyGrowth: 0.12,
          overallProgress: 0.74,
          paesReadiness: 0.82,
          subjectStrengths: ['Competencia Lectora', 'Historia'],
          areasForImprovement: ['Matemática M2', 'Ciencias']
        },
        alerts: this.generatePersonalizedAlerts(userId),
        personalInfo: {
          name: 'Estudiante',
          targetScore: 650,
          studyProgress: 74
        }
      };

      this.cache.set(cacheKey, dashboardData);
      return dashboardData;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error cargando dashboard', error);
      return this.getFallbackDashboard();
    }
  }

  /**
   * Obtiene timeline con datos reales o fallback usando tabla calendar_events
   */
  private static async getTimeline(): Promise<TimelineEvent[]> {
    try {
      // Usar tabla calendar_events existente
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('event_type', 'paes_deadline')
        .order('start_date', { ascending: true })
        .limit(10);

      if (error) {
        logger.warn('CentralizedEducationService', 'Error en consulta timeline, usando fallback');
        return this.getFallbackTimeline();
      }

      // Si no hay datos reales, usar fallback
      if (!data || data.length === 0) {
        return this.getFallbackTimeline();
      }

      const processedTimeline = data.map((item, index) => ({
        fecha_id: index + 1,
        proceso: item.title || 'PAES 2025',
        descripcion: item.description || 'Proceso PAES',
        fecha_inicio: item.start_date || '2024-12-02',
        fecha_fin: item.end_date || item.start_date || '2024-12-02',
        dias_restantes: this.calculateDaysRemaining(item.start_date || '2024-12-02'),
        prioridad: item.priority === 'high' ? 1 : 2,
        estado: 'PRÓXIMA'
      }));

      // Añadir propiedades especiales al primer evento
      if (processedTimeline.length > 0) {
        processedTimeline[0].nextCriticalDate = processedTimeline[0];
        processedTimeline[0].upcomingDates = processedTimeline.slice(0, 3);
      }

      return processedTimeline;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo timeline', error);
      return this.getFallbackTimeline();
    }
  }

  /**
   * Obtiene becas compatibles con fallback usando tabla becas_financiamiento
   */
  private static async getScholarships(userId: string): Promise<ScholarshipBenefit[]> {
    try {
      // Obtener perfil del usuario
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // Consulta a becas existentes
      const { data, error } = await supabase
        .from('becas_financiamiento')
        .select('*')
        .eq('estado', 'activa')
        .limit(5);

      if (error || !data) {
        return this.getFallbackScholarships();
      }

      const processedScholarships = data.map((beca, index) => ({
        beneficio_id: index + 1,
        nombre: beca.nombre,
        categoria: beca.tipo_beca,
        monto_anual: Number(beca.monto_maximo) || 0,
        porcentaje_cobertura: beca.porcentaje_cobertura || 0,
        compatibilidad: this.calculateCompatibility(beca, profile),
        estado_postulacion: 'ABIERTA',
        fecha_cierre: '2025-03-13',
        potentialSavings: Number(beca.monto_maximo) * 0.8 || 2000000,
        compatibleBenefits: data.length
      }));

      return processedScholarships;

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
      const fallbackCareers = this.getFallbackCareers();
      
      // Añadir propiedades especiales
      return fallbackCareers.map(career => ({
        ...career,
        compatibleCareers: fallbackCareers.length,
        recommendations: fallbackCareers.slice(0, 3)
      }));

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

  // Métodos de fallback actualizados
  private static getFallbackDashboard(): UnifiedDashboardData {
    const timeline = this.getFallbackTimeline();
    const scholarships = this.getFallbackScholarships();
    const careers = this.getFallbackCareers();

    return {
      timeline,
      scholarships,
      careers,
      analytics: {
        totalStudents: 1000,
        activeStudents: 750,
        averageProgress: 0.65,
        weeklyGrowth: 0.08,
        overallProgress: 0.65,
        paesReadiness: 0.70,
        subjectStrengths: ['Competencia Lectora'],
        areasForImprovement: ['Matemática M1', 'Ciencias']
      },
      alerts: [],
      personalInfo: {
        name: 'Estudiante',
        targetScore: 600,
        studyProgress: 65
      }
    };
  }

  private static getFallbackTimeline(): TimelineEvent[] {
    const events = [
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

    // Añadir propiedades especiales
    events[0].nextCriticalDate = events[0];
    events[0].upcomingDates = events;

    return events;
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
        fecha_cierre: '2025-03-13',
        potentialSavings: 3500000,
        compatibleBenefits: 3
      },
      {
        beneficio_id: 2,
        nombre: 'Beca Excelencia Académica',
        categoria: 'estatal',
        monto_anual: 2650000,
        porcentaje_cobertura: 0,
        compatibilidad: 75,
        estado_postulacion: 'ABIERTA',
        fecha_cierre: '2025-03-13',
        potentialSavings: 2650000,
        compatibleBenefits: 3
      }
    ];
  }

  private static getFallbackCareers(): CareerRecommendation[] {
    const careers = [
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

    return careers.map(career => ({
      ...career,
      compatibleCareers: careers.length,
      recommendations: careers
    }));
  }

  private static generatePersonalizedAlerts(userId: string): PersonalizedAlert[] {
    return [
      {
        id: '1',
        type: 'urgent',
        title: 'PAES en 15 días',
        message: 'Intensifica tu preparación en Competencia Lectora',
        actionRequired: true,
        dueDate: '2024-11-30',
        priority: 'urgent'
      },
      {
        id: '2',
        type: 'info',
        title: 'Nueva beca disponible',
        message: 'Revisa los requisitos para la Beca de Excelencia',
        actionRequired: false,
        priority: 'medium'
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
}
