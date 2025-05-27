
import { supabase } from '@/integrations/supabase/client';
import { OptimizedRLSService } from './optimized-rls-service';

/**
 * Servicio específico para user_node_progress
 * Sin abstracciones genéricas problemáticas
 */
export class UserProgressService {
  
  /**
   * Obtener progreso del usuario autenticado
   */
  static async getUserProgress(userId?: string) {
    const currentUserId = userId || await OptimizedRLSService.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', currentUserId);
  }

  /**
   * Obtener progreso específico por nodo
   */
  static async getNodeProgress(nodeId: string, userId?: string) {
    const currentUserId = userId || await OptimizedRLSService.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('node_id', nodeId)
      .single();
  }

  /**
   * Crear o actualizar progreso de nodo
   */
  static async upsertProgress(data: {
    node_id: string;
    progress?: number;
    mastery_level?: number;
    status?: string;
    time_spent_minutes?: number;
    attempts_count?: number;
    success_rate?: number;
    last_performance_score?: number;
  }) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('user_node_progress')
      .upsert({
        ...data,
        user_id: userId,
        last_activity_at: new Date().toISOString()
      });
  }

  /**
   * Actualizar progreso existente
   */
  static async updateProgress(id: string, data: Partial<{
    progress: number;
    mastery_level: number;
    status: string;
    time_spent_minutes: number;
    attempts_count: number;
    success_rate: number;
    last_performance_score: number;
  }>) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('user_node_progress')
      .update({
        ...data,
        last_activity_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId);
  }
}
