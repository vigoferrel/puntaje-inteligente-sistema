
/**
 * REFACTORIZADO: Proxy hacia el nuevo EnhancedInstitutionalAnalyticsService
 * Mantiene compatibilidad mientras se migra gradualmente
 */
import { logger } from '@/core/logging/SystemLogger';
import { EnhancedInstitutionalAnalyticsService } from './EnhancedInstitutionalAnalyticsService';
import { InstitutionalMetrics } from './types';

export class InstitutionalAnalyticsService {
  /**
   * @deprecated Usar EnhancedInstitutionalAnalyticsService.generateInstitutionalReport directamente
   */
  static async generateInstitutionalReport(institutionId: string): Promise<InstitutionalMetrics> {
    logger.warn('InstitutionalAnalyticsService', 'Usando servicio legacy - migrar a EnhancedInstitutionalAnalyticsService');
    return EnhancedInstitutionalAnalyticsService.generateInstitutionalReport(institutionId);
  }

  /**
   * @deprecated Usar EnhancedInstitutionalAnalyticsService.generateParentReports directamente
   */
  static async generateParentReports(institutionId: string): Promise<void> {
    logger.warn('InstitutionalAnalyticsService', 'Usando servicio legacy - migrar a EnhancedInstitutionalAnalyticsService');
    return EnhancedInstitutionalAnalyticsService.generateParentReports(institutionId);
  }
}
