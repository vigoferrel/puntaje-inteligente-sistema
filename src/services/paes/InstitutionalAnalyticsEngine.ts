
/**
 * Engine simplificado que delega responsabilidades
 * Solo orquesta, no contiene lógica compleja
 */
import { InstitutionalAnalyticsService } from './analytics/InstitutionalAnalyticsService';
import { logger } from '@/core/logging/SystemLogger';

export class InstitutionalAnalyticsEngine {
  /**
   * Punto de entrada principal para analytics institucionales
   */
  static async generateInstitutionalReport(institutionId: string) {
    try {
      return await InstitutionalAnalyticsService.generateInstitutionalReport(institutionId);
    } catch (error) {
      logger.error('InstitutionalAnalyticsEngine', 'Error en generación de reporte', error);
      throw error;
    }
  }

  /**
   * Genera reportes para padres
   */
  static async generateParentReports(institutionId: string) {
    try {
      return await InstitutionalAnalyticsService.generateParentReports(institutionId);
    } catch (error) {
      logger.error('InstitutionalAnalyticsEngine', 'Error en reportes para padres', error);
      throw error;
    }
  }
}
