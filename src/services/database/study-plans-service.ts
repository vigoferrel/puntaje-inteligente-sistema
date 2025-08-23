
import { supabase } from '@/integrations/supabase/client';
import { OptimizedRLSService } from './optimized-rls-service';

/**
 * Servicio específico para generated_study_plans
 * Sin abstracciones genéricas problemáticas
 */
export class StudyPlansService {
  
  /**
   * Obtener planes de estudio del usuario
   */
  static async getUserPlans(userId?: string) {
    const currentUserId = userId || await OptimizedRLSService.getCurrentUserId();
    
    if (!currentUserId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('generated_study_plans')
      .select('*')
      .eq('user_id', currentUserId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
  }

  /**
   * Obtener plan específico por ID
   */
  static async getPlanById(planId: string) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('generated_study_plans')
      .select('*')
      .eq('id', planId)
      .eq('user_id', userId)
      .single();
  }

  /**
   * Crear nuevo plan de estudio
   */
  static async createPlan(data: {
    title: string;
    description?: string;
    plan_type: string;
    target_tests: string[];
    estimated_duration_weeks: number;
    estimated_hours: number;
    schedule?: any;
    metrics?: any;
  }) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('generated_study_plans')
      .insert({
        ...data,
        user_id: userId
      });
  }

  /**
   * Actualizar plan existente
   */
  static async updatePlan(planId: string, data: Partial<{
    title: string;
    description: string;
    schedule: any;
    metrics: any;
    is_active: boolean;
  }>) {
    const userId = await OptimizedRLSService.getCurrentUserId();
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return supabase
      .from('generated_study_plans')
      .update(data)
      .eq('id', planId)
      .eq('user_id', userId);
  }
}
