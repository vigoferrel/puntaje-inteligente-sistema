
/**
 * Servicio de persistencia de datos de analytics
 * Responsabilidad única: interacción con base de datos
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/core/logging/SystemLogger';
import { MetricsDTO, ParentReportDTO } from './types';

export class DataPersistence {
  /**
   * Almacena métricas institucionales en la base de datos
   */
  static async storeInstitutionalMetrics(
    institutionId: string,
    metrics: MetricsDTO
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('system_metrics')
        .insert({
          metric_type: 'institutional_analytics',
          metric_value: metrics.totalStudents,
          context: metrics as any, // Conversión explícita para Supabase Json
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
   * Crea notificación para padres
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
          notification_type: 'parent_report',
          title: 'Reporte Semanal de Progreso',
          message: `Progreso semanal: ${report.weeklyProgress.toFixed(1)}%`,
          action_data: report as any // Conversión explícita para Supabase Json
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
   * Obtiene datos de estudiantes - IMPLEMENTACIÓN TEMPORAL
   * Retorna todos los perfiles hasta que se implemente la relación institución-estudiante
   */
  static async getStudentsData(institutionId: string): Promise<any[]> {
    try {
      logger.warn('DataPersistence', `Obteniendo datos mock para institución ${institutionId} - columna institution_id no existe`);
      
      // Implementación temporal: obtener todos los perfiles
      // TODO: Crear tabla institution_students o agregar institution_id a profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, learning_phase, created_at')
        .limit(50); // Limitar para evitar sobrecarga

      if (error) {
        logger.error('DataPersistence', 'Error obteniendo datos de estudiantes', error);
        return [];
      }

      // Simular estudiantes de la institución con los primeros registros
      return data?.slice(0, 10) || [];
    } catch (error) {
      logger.error('DataPersistence', 'Error en consulta de estudiantes', error);
      return [];
    }
  }

  /**
   * Obtiene datos de ejercicios de la institución
   */
  static async getExercisesData(institutionId: string): Promise<any[]> {
    try {
      const students = await this.getStudentsData(institutionId);
      const studentIds = students.map(s => s.id);

      if (studentIds.length === 0) {
        logger.info('DataPersistence', 'No hay estudiantes para obtener ejercicios');
        return [];
      }

      const { data, error } = await supabase
        .from('user_exercise_attempts')
        .select('*')
        .in('user_id', studentIds)
        .limit(100); // Limitar consulta

      if (error) {
        logger.error('DataPersistence', 'Error obteniendo datos de ejercicios', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('DataPersistence', 'Error en consulta de ejercicios', error);
      return [];
    }
  }

  /**
   * Obtiene datos de progreso de la institución
   */
  static async getProgressData(institutionId: string): Promise<any[]> {
    try {
      const students = await this.getStudentsData(institutionId);
      const studentIds = students.map(s => s.id);

      if (studentIds.length === 0) {
        logger.info('DataPersistence', 'No hay estudiantes para obtener progreso');
        return [];
      }

      const { data, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .in('user_id', studentIds)
        .limit(100); // Limitar consulta

      if (error) {
        logger.error('DataPersistence', 'Error obteniendo datos de progreso', error);
        return [];
      }

      return data || [];
    } catch (error) {
      logger.error('DataPersistence', 'Error en consulta de progreso', error);
      return [];
    }
  }
}
