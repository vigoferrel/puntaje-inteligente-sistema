
import { supabase } from '@/integrations/supabase/client';
import { OptimizedRLSService } from './optimized-rls-service';

/**
 * Middleware para optimizar consultas y reducir carga de RLS
 * Versión simplificada para evitar problemas de tipado TypeScript
 */

export class QueryMiddleware {
  
  /**
   * Wrapper para consultas de usuario específicas por tabla
   */
  static async queryLearningNodes(
    columns = '*',
    additionalFilters?: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('learning_nodes')
      .select(columns);

    // Aplicar filtros adicionales si se proporcionan
    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return query;
  }

  /**
   * Wrapper para consultas de progreso de usuario
   */
  static async queryUserProgress(
    columns = '*',
    additionalFilters?: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('user_node_progress')
      .select(columns)
      .eq('user_id', userId);

    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return query;
  }

  /**
   * Wrapper para consultas de planes de estudio
   */
  static async queryStudyPlans(
    columns = '*',
    additionalFilters?: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from('generated_study_plans')
      .select(columns)
      .eq('user_id', userId);

    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return query;
  }

  /**
   * Inserción optimizada con user_id pre-seteado para user_node_progress
   */
  static async insertUserProgress(data: Record<string, any>) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('user_node_progress')
      .insert({
        ...data,
        user_id: userId
      });
  }

  /**
   * Actualización optimizada de progreso de usuario
   */
  static async updateUserProgress(
    id: string,
    data: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('user_node_progress')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId);
  }

  /**
   * Consulta de métricas del sistema (para admins)
   */
  static async querySystemMetrics(columns = '*') {
    const isAdmin = await OptimizedRLSService.isCurrentUserAdmin();
    
    if (!isAdmin) {
      throw new Error('Admin access required');
    }

    return supabase
      .from('system_metrics')
      .select(columns);
  }

  /**
   * Función genérica usando RPC para consultas dinámicas seguras
   */
  static async executeUserScopedQuery(
    tableName: string,
    operation: 'select' | 'insert' | 'update' | 'delete',
    data?: Record<string, any>,
    filters?: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase.rpc('execute_user_scoped_query', {
      table_name: tableName,
      operation_type: operation,
      user_id: userId,
      query_data: data || {},
      query_filters: filters || {}
    });
  }
}
