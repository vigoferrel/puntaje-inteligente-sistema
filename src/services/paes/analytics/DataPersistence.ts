
/**
 * DEPRECADO: Este archivo será eliminado gradualmente
 * La funcionalidad ha sido migrada a EnhancedInstitutionalAnalyticsService
 * que usa datos reales de las tablas institution_students y user_relationships
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { MetricsDTO, ParentReportDTO } from './types';

export class DataPersistence {
  /**
   * @deprecated Usar EnhancedInstitutionalAnalyticsService.storeInstitutionalMetrics
   */
  static async storeInstitutionalMetrics(
    institutionId: string,
    metrics: MetricsDTO
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_analytics_legacy',
          metric_value: metrics.totalStudents,
          context: metrics as any,
          user_id: institutionId
        });

      if (error) {
        logger.error('DataPersistence', 'Error almacenando métricas institucionales', error);
        throw error;
      }

      logger.info('DataPersistence', 'Métricas institucionales almacenadas exitosamente');
    } catch (error) {
      logger.error('DataPersistence', 'Error en almacenamiento de métricas', error);
      throw error;
    }
  }

  /**
   * @deprecated Usar EnhancedInstitutionalAnalyticsService.generateAndSendParentReport
   */
  static async createParentNotification(
    parentId: string,
    report: ParentReportDTO
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .insert({
          user_id: parentId,
          notification_type: 'parent_report_legacy',
          title: 'Reporte Semanal de Progreso (Legacy)',
          message: `Progreso semanal: ${report.weeklyProgress.toFixed(1)}%`,
          action_data: report as any
        });

      if (error) {
        logger.error('DataPersistence', 'Error creando notificación para padres', error);
        throw error;
      }

      logger.info('DataPersistence', 'Notificación para padres creada exitosamente');
    } catch (error) {
      logger.error('DataPersistence', 'Error en creación de notificación', error);
      throw error;
    }
  }

  /**
   * @deprecated Usar EnhancedInstitutionalAnalyticsService.getRealStudentsData
   */
  static async getStudentsData(institutionId: string): Promise<any[]> {
    logger.warn('DataPersistence', 'Método obsoleto - usar EnhancedInstitutionalAnalyticsService');
    return [];
  }

  /**
   * @deprecated Funcionalidad migrada a EnhancedInstitutionalAnalyticsService
   */
  static async getExercisesData(institutionId: string): Promise<any[]> {
    logger.warn('DataPersistence', 'Método obsoleto - usar EnhancedInstitutionalAnalyticsService');
    return [];
  }

  /**
   * @deprecated Funcionalidad migrada a EnhancedInstitutionalAnalyticsService
   */
  static async getProgressData(institutionId: string): Promise<any[]> {
    logger.warn('DataPersistence', 'Método obsoleto - usar EnhancedInstitutionalAnalyticsService');
    return [];
  }
}
