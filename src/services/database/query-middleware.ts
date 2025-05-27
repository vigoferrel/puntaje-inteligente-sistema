
import { supabase } from '@/integrations/supabase/client';
import { OptimizedRLSService } from './optimized-rls-service';

/**
 * Middleware para optimizar consultas y reducir carga de RLS
 */

export class QueryMiddleware {
  
  /**
   * Wrapper para consultas de usuario que pre-filtra por user_id
   */
  static async queryUserData<T = any>(
    tableName: string,
    columns = '*',
    additionalFilters?: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    let query = supabase
      .from(tableName)
      .select(columns)
      .eq('user_id', userId);

    // Aplicar filtros adicionales
    if (additionalFilters) {
      Object.entries(additionalFilters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    return query;
  }

  /**
   * Inserción optimizada con user_id pre-seteado
   */
  static async insertUserData(
    tableName: string,
    data: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from(tableName)
      .insert({
        ...data,
        user_id: userId
      });
  }

  /**
   * Actualización optimizada con validación de ownership
   */
  static async updateUserData(
    tableName: string,
    id: string,
    data: Record<string, any>
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from(tableName)
      .update(data)
      .eq('id', id)
      .eq('user_id', userId);
  }

  /**
   * Eliminación optimizada con validación de ownership
   */
  static async deleteUserData(
    tableName: string,
    id: string
  ) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
  }

  /**
   * Consulta batch optimizada para múltiples tablas
   */
  static async batchUserQuery(tableQueries: Array<{
    table: string;
    columns?: string;
    filters?: Record<string, any>;
  }>) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const promises = tableQueries.map(({ table, columns = '*', filters = {} }) => {
      let query = supabase
        .from(table)
        .select(columns)
        .eq('user_id', userId);

      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      return query;
    });

    return Promise.allSettled(promises);
  }
}
