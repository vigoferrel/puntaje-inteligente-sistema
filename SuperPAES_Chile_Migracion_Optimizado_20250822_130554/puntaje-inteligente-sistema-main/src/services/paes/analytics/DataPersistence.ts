/* eslint-disable react-refresh/only-export-components */
import { supabase } from '@/integrations/supabase/leonardo-auth-client';

/**
 * DEPRECADO: Este archivo serÃ¡ eliminado gradualmente
 * La funcionalidad ha sido migrada a EnhancedInstitutionalAnalyticsService
 * que usa datos reales de las tablas institution_students y user_relationships
 */
// DISABLED: // DISABLED: import { supabase } from '@/integrations/supabase/unified-client';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '@/types/core';
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
          context: metrics as unknown,
          user_id: institutionId
        });

      if (error) {
        logger.error('DataPersistence', 'Error almacenando mÃ©tricas institucionales', error);
        throw error;
      }

      logger.info('DataPersistence', 'MÃ©tricas institucionales almacenadas exitosamente');
    } catch (error) {
      logger.error('DataPersistence', 'Error en almacenamiento de mÃ©tricas', error);
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
          action_data: report as unknown
        });

      if (error) {
        logger.error('DataPersistence', 'Error creando notificaciÃ³n para padres', error);
        throw error;
      }

      logger.info('DataPersistence', 'NotificaciÃ³n para padres creada exitosamente');
    } catch (error) {
      logger.error('DataPersistence', 'Error en creaciÃ³n de notificaciÃ³n', error);
      throw error;
    }
  }

  /**
   * @deprecated Usar EnhancedInstitutionalAnalyticsService.getRealStudentsData
   */
  static async getStudentsData(institutionId: string): Promise<unknown[]> {
    logger.warn('DataPersistence', 'MÃ©todo obsoleto - usar EnhancedInstitutionalAnalyticsService');
    return [];
  }

  /**
   * @deprecated Funcionalidad migrada a EnhancedInstitutionalAnalyticsService
   */
  static async getExercisesData(institutionId: string): Promise<unknown[]> {
    logger.warn('DataPersistence', 'MÃ©todo obsoleto - usar EnhancedInstitutionalAnalyticsService');
    return [];
  }

  /**
   * @deprecated Funcionalidad migrada a EnhancedInstitutionalAnalyticsService
   */
  static async getProgressData(institutionId: string): Promise<unknown[]> {
    logger.warn('DataPersistence', 'MÃ©todo obsoleto - usar EnhancedInstitutionalAnalyticsService');
    return [];
  }
}





