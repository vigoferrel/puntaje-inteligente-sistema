
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import type { 
  UnifiedDashboardData, 
  OptimalPathData, 
  PersonalizedAlert,
  RawCalendarData,
  RawScholarshipData,
  ProcessedCalendarData,
  ProcessedScholarshipData
} from './types';

/**
 * Servicio centralizado para el sistema educativo PAES
 * Maneja datos unificados con transformaciones consistentes
 */
export class CentralizedEducationService {
  private static cache = new Map<string, any>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtiene el dashboard unificado con todos los datos procesados
   */
  static async getUnifiedDashboard(userId: string): Promise<UnifiedDashboardData> {
    const cacheKey = `dashboard_${userId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info('CentralizedEducationService', 'Cargando dashboard unificado', { userId });

      // Obtener datos en paralelo
      const [analytics, calendarData, scholarshipData] = await Promise.allSettled([
        this.getAnalyticsData(userId),
        this.getCalendarData(),
        this.getScholarshipData()
      ]);

      const dashboard: UnifiedDashboardData = {
        analytics: this.extractSettledValue(analytics, this.getDefaultAnalytics()),
        calendar: this.extractSettledValue(calendarData, this.getDefaultCalendar()),
        scholarships: this.extractSettledValue(scholarshipData, this.getDefaultScholarships()),
        lastUpdated: new Date()
      };

      this.setCache(cacheKey, dashboard);
      return dashboard;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error cargando dashboard', error);
      return this.getDefaultDashboard();
    }
  }

  /**
   * Calcula la ruta de aprendizaje óptima
   */
  static async calculateOptimalPath(userId: string, preferences: any = {}): Promise<OptimalPathData> {
    const cacheKey = `optimal_path_${userId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info('CentralizedEducationService', 'Calculando ruta óptima', { userId, preferences });

      // Obtener progreso del usuario
      const { data: userProgress } = await supabase
        .from('user_node_progress')
        .select('node_id, mastery_level, status')
        .eq('user_id', userId);

      // Obtener nodos de aprendizaje
      const { data: learningNodes } = await supabase
        .from('learning_nodes')
        .select('id, title, difficulty, estimated_time_minutes, tier_priority')
        .order('position');

      const path = this.buildOptimalPath(userProgress || [], learningNodes || [], preferences);
      
      this.setCache(cacheKey, path);
      return path;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error calculando ruta óptima', error);
      return this.getDefaultOptimalPath();
    }
  }

  /**
   * Obtiene alertas personalizadas para el usuario
   */
  static async getPersonalizedAlerts(userId: string): Promise<PersonalizedAlert[]> {
    const cacheKey = `alerts_${userId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      logger.info('CentralizedEducationService', 'Obteniendo alertas personalizadas', { userId });

      // Obtener notificaciones del usuario
      const { data: notifications } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('is_read', false)
        .order('created_at', { ascending: false });

      const alerts = this.transformNotificationsToAlerts(notifications || []);
      
      this.setCache(cacheKey, alerts);
      return alerts;

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo alertas', error);
      return this.getDefaultAlerts();
    }
  }

  /**
   * Exporta reporte completo del usuario
   */
  static async exportCompleteReport(userId: string, format: 'pdf' | 'excel' | 'json'): Promise<Blob> {
    try {
      logger.info('CentralizedEducationService', 'Exportando reporte completo', { userId, format });

      const dashboard = await this.getUnifiedDashboard(userId);
      const reportData = this.generateReportData(dashboard, format);

      return new Blob([reportData], { 
        type: this.getContentType(format) 
      });

    } catch (error) {
      logger.error('CentralizedEducationService', 'Error exportando reporte', error);
      throw error;
    }
  }

  /**
   * Limpia el cache del servicio
   */
  static clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    logger.info('CentralizedEducationService', 'Cache limpiado');
  }

  // ========== MÉTODOS PRIVADOS DE OBTENCIÓN DE DATOS ==========

  private static async getAnalyticsData(userId: string) {
    // Datos mock mejorados para analytics
    return {
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
    };
  }

  private static async getCalendarData(): Promise<ProcessedCalendarData> {
    try {
      const { data: events } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date')
        .limit(10);

      return this.processCalendarData(events || []);
    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo datos de calendario', error);
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

      return this.processScholarshipData(scholarships || []);
    } catch (error) {
      logger.error('CentralizedEducationService', 'Error obteniendo datos de becas', error);
      return this.getDefaultScholarships();
    }
  }

  // ========== MÉTODOS DE TRANSFORMACIÓN DE DATOS ==========

  private static processCalendarData(events: any[]): ProcessedCalendarData {
    const upcomingDates = events.map(event => ({
      date: event.start_date,
      title: event.title,
      type: event.event_type,
      daysRemaining: Math.ceil((new Date(event.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    }));

    return {
      nextCriticalDate: events[0]?.start_date || new Date().toISOString(),
      upcomingDates,
      totalEvents: events.length
    };
  }

  private static processScholarshipData(scholarships: any[]): ProcessedScholarshipData {
    const eligibleScholarships = scholarships.map(scholarship => ({
      name: scholarship.nombre,
      institution: scholarship.institucion,
      amount: scholarship.monto_maximo || 0,
      deadline: scholarship.fechas_postulacion?.fin || 'No especificado'
    }));

    return {
      availableCount: scholarships.length,
      totalAmount: scholarships.reduce((sum, s) => sum + (s.monto_maximo || 0), 0),
      eligibleScholarships
    };
  }

  private static buildOptimalPath(userProgress: any[], learningNodes: any[], preferences: any): OptimalPathData {
    // Lógica simplificada para construir la ruta óptima
    const subjects = ['Competencia Lectora', 'Matemática M1', 'Ciencias'];
    const milestones = Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      goals: [`Meta semana ${i + 1}`],
      estimatedCompletion: Math.min(100, (i + 1) * 8.33)
    }));

    return {
      pathId: `path_${Date.now()}`,
      estimatedHours: 120,
      difficulty: 'medium',
      subjects,
      milestones,
      adaptiveRecommendations: [
        'Reforzar comprensión lectora',
        'Practicar más ejercicios de matemática',
        'Revisar conceptos de ciencias'
      ]
    };
  }

  private static transformNotificationsToAlerts(notifications: any[]): PersonalizedAlert[] {
    return notifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      description: notification.message,
      priority: notification.priority || 'medium',
      type: 'info',
      timestamp: new Date(notification.created_at),
      isRead: notification.is_read
    }));
  }

  // ========== MÉTODOS DE DEFAULTS ==========

  private static getDefaultDashboard(): UnifiedDashboardData {
    return {
      analytics: this.getDefaultAnalytics(),
      calendar: this.getDefaultCalendar(),
      scholarships: this.getDefaultScholarships(),
      lastUpdated: new Date()
    };
  }

  private static getDefaultAnalytics() {
    return {
      totalStudents: 0,
      activeStudents: 0,
      averageEngagement: 0,
      overallProgress: 0,
      subjectPerformance: {},
      riskDistribution: { high: 0, medium: 0, low: 0 }
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

  private static getDefaultAlerts(): PersonalizedAlert[] {
    return [];
  }

  // ========== MÉTODOS UTILITARIOS ==========

  private static extractSettledValue<T>(result: PromiseSettledResult<T>, defaultValue: T): T {
    return result.status === 'fulfilled' ? result.value : defaultValue;
  }

  private static isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private static setCache(key: string, value: any): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private static generateReportData(dashboard: UnifiedDashboardData, format: string): string {
    const data = {
      generatedAt: new Date().toISOString(),
      dashboard,
      format
    };

    return format === 'json' ? JSON.stringify(data, null, 2) : `Reporte ${format.toUpperCase()}\n${JSON.stringify(data, null, 2)}`;
  }

  private static getContentType(format: string): string {
    const types = {
      'pdf': 'application/pdf',
      'excel': 'application/vnd.ms-excel',
      'json': 'application/json'
    };
    return types[format as keyof typeof types] || 'text/plain';
  }
}
