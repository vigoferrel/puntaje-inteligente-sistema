
import { supabase } from '@/integrations/supabase/client';
import { OptimizedRLSService } from './optimized-rls-service';

/**
 * Servicio específico para learning_nodes
 * Elimina abstracciones genéricas problemáticas
 */
export class LearningNodesService {
  
  /**
   * Obtener todos los nodos de aprendizaje
   */
  static async getAll() {
    return supabase
      .from('learning_nodes')
      .select('*')
      .order('test_id', { ascending: true })
      .order('position', { ascending: true });
  }

  /**
   * Obtener nodos por test_id específico
   */
  static async getByTestId(testId: number) {
    return supabase
      .from('learning_nodes')
      .select('*')
      .eq('test_id', testId)
      .order('position', { ascending: true });
  }

  /**
   * Obtener nodos por skill_id específico
   */
  static async getBySkillId(skillId: number) {
    return supabase
      .from('learning_nodes')
      .select('*')
      .eq('skill_id', skillId)
      .order('position', { ascending: true });
  }

  /**
   * Obtener nodo por ID
   */
  static async getById(nodeId: string) {
    return supabase
      .from('learning_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();
  }

  /**
   * Obtener nodos por códigos específicos
   */
  static async getByCodes(codes: string[]) {
    return supabase
      .from('learning_nodes')
      .select('*')
      .in('code', codes);
  }
}
