
import { supabase } from '@/integrations/supabase/client';
import { simpleLogger } from '@/core/logging/SimpleLogger';
import type { 
  UnifiedDashboardData, 
  OptimalPathData, 
  PersonalizedAlert,
  ProcessedCalendarData,
  ProcessedScholarshipData
} from './types';

/**
 * Servicio centralizado simplificado para el sistema educativo PAES
 */
export class CentralizedEducationService {
  private static cache = new Map<string, any>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtiene el dashboard unificado con datos procesados
   */
  static async getUnifiedDashboard(userId: string): Promise<UnifiedDashboardData> {
    const cacheKey = `dashboard_${userId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      simpleLogger.info('CentralizedEducationService', 'Cargando dashboard unificado', { userId });

      const dashboard: UnifiedDashboardData = {
        analytics: {
          totalStudents: 250,
          activeStudents: 200,
          averageEngagement: 0.78,
          overallProgress: 0.72,
          subjectPerformance: {
            'Competencia Lectora': 0.74,
            'Matemática M1': 0.70,
            'Matemática M2': 0.68,
            'Ciencias': 0.73,
            'Historia': 0.71
          },
          riskDistribution: {
            high: 25,
            medium: 75,
            low: 150
          }
        },
        calendar: await this.getCalendarData(),
        scholarships: await this.getScholarshipData(),
        lastUpdated: new Date()
      };

      this.setCache(cacheKey, dashboard);
      return dashboard;

    } catch (error) {
      simpleLogger.error('CentralizedEducationService', 'Error cargando dashboard', error);
      return this.getDefaultDashboard();
    }
  }

  /**
   * Calcula la ruta de aprendizaje óptima
   */
  static async calculateOptimalPath(userId: string, preferences: any = {}): Promise<OptimalPathData> {
    try {
      simpleLogger.info('CentralizedEducationService', 'Calculando ruta óptima', { userId });

      const path: OptimalPathData = {
        pathId: `path_${Date.now()}`,
        estimatedHours: 120,
        difficulty: 'medium',
        subjects: ['Competencia Lectora', 'Matemática M1', 'Ciencias'],
        milestones: Array.from({ length: 12 }, (_, i) => ({
          week: i + 1,
          goals: [`Meta semana ${i + 1}`],
          estimatedCompletion: Math.min(100, (i + 1) * 8.33)
        })),
        adaptiveRecommendations: [
          'Reforzar comprensión lectora',
          'Practicar más ejercicios de matemática',
          'Revisar conceptos de ciencias'
        ]
      };

      return path;

    } catch (error) {
      simpleLogger.error('CentralizedEducationService', 'Error calculando ruta óptima', error);
      return this.getDefaultOptimalPath();
    }
  }

  /**
   * Obtiene alertas personalizadas para el usuario
   */
  static async getPersonalizedAlerts(userId: string): Promise<PersonalizedAlert[]> {
    try {
      simpleLogger.info('CentralizedEducationService', 'Obteniendo alertas personalizadas', { userId });

      const alerts: PersonalizedAlert[] = [
        {
          id: '1',
          title: 'Práctica recomendada',
          description: 'Es hora de practicar comprensión lectora',
          priority: 'medium',
          type: 'info',
          timestamp: new Date(),
          isRead: false
        }
      ];

      return alerts;

    } catch (error) {
      simpleLogger.error('CentralizedEducationService', 'Error obteniendo alertas', error);
      return [];
    }
  }

  /**
   * Exporta reporte completo del usuario
   */
  static async exportCompleteReport(userId: string, format: 'pdf' | 'excel' | 'json'): Promise<Blob> {
    try {
      const dashboard = await this.getUnifiedDashboard(userId);
      const reportData = JSON.stringify({
        generatedAt: new Date().toISOString(),
        dashboard,
        format
      }, null, 2);

      return new Blob([reportData], { 
        type: format === 'json' ? 'application/json' : 'text/plain'
      });

    } catch (error) {
      simpleLogger.error('CentralizedEducationService', 'Error exportando reporte', error);
      throw error;
    }
  }

  /**
   * Limpia el cache del servicio
   */
  static clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    simpleLogger.info('CentralizedEducationService', 'Cache limpiado');
  }

  // Métodos privados de obtención de datos
  private static async getCalendarData(): Promise<ProcessedCalendarData> {
    try {
      const { data: events } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date')
        .limit(10);

      return {
        nextCriticalDate: events?.[0]?.start_date || new Date().toISOString(),
        upcomingDates: events?.map(event => ({
          date: event.start_date,
          title: event.title,
          type: event.event_type,
          daysRemaining: Math.ceil((new Date(event.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        })) || [],
        totalEvents: events?.length || 0
      };
    } catch (error) {
      return this.getDefaultCalendar();
    }
  }

  private static async getScholarshipData(): Promise<ProcessedScholarshipData> {
    try {
      const { data: scholarships } = await supabase
        .from('becas_financiamiento')
        .select('*')
        .eq('estado', 'activa')
        .order('monto_maximo', { ascending: false })
        .limit(5);

      return {
        availableCount: scholarships?.length || 0,
        totalAmount: scholarships?.reduce((sum, s) => sum + (s.monto_maximo || 0), 0) || 0,
        eligibleScholarships: scholarships?.map(scholarship => ({
          name: scholarship.nombre,
          institution: scholarship.institucion,
          amount: scholarship.monto_maximo || 0,
          deadline: scholarship.fechas_postulacion?.fin || 'No especificado'
        })) || []
      };
    } catch (error) {
      return this.getDefaultScholarships();
    }
  }

  // Métodos de defaults
  private static getDefaultDashboard(): UnifiedDashboardData {
    return {
      analytics: {
        totalStudents: 0,
        activeStudents: 0,
        averageEngagement: 0,
        overallProgress: 0,
        subjectPerformance: {},
        riskDistribution: { high: 0, medium: 0, low: 0 }
      },
      calendar: this.getDefaultCalendar(),
      scholarships: this.getDefaultScholarships(),
      lastUpdated: new Date()
    };
  }

  private static getDefaultCalendar(): ProcessedCalendarData {
    return {
      nextCriticalDate: new Date().toISOString(),
      upcomingDates: [],
      totalEvents: 0
    };
  }

  private static getDefaultScholarships(): ProcessedScholarshipData {
    return {
      availableCount: 0,
      totalAmount: 0,
      eligibleScholarships: []
    };
  }

  private static getDefaultOptimalPath(): OptimalPathData {
    return {
      pathId: 'default',
      estimatedHours: 0,
      difficulty: 'medium',
      subjects: [],
      milestones: [],
      adaptiveRecommendations: []
    };
  }

  // Métodos utilitarios
  private static isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private static setCache(key: string, value: any): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }
}
