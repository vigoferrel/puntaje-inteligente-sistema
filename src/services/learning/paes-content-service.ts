
import { supabase } from '@/integrations/supabase/client';

/**
 * Servicio para gestionar contenido educativo basado en PAES
 * Simplificado para usar solo tablas existentes
 */
export class PAESContentService {
  
  /**
   * Generate educational content nodes based on existing learning_nodes
   */
  static async generateEducationalNodes(userId: string, skillLevel: number = 0.5) {
    try {
      // Get existing learning nodes that could be enhanced with PAES content
      const { data: nodes, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .limit(10);

      if (error) {
        console.error('Error fetching learning nodes:', error);
        return [];
      }

      // Return existing nodes with PAES-enhanced metadata
      return (nodes || []).map(node => ({
        ...node,
        paes_enhanced: true,
        user_skill_level: skillLevel,
        recommended_for_user: skillLevel < 0.7 // Recommend if skill level is low
      }));

    } catch (error) {
      console.error('Error in generateEducationalNodes:', error);
      return [];
    }
  }

  /**
   * Create study plan based on PAES requirements
   */
  static async createPAESStudyPlan(userId: string) {
    try {
      // Get user's current progress
      const { data: userProgress, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user progress:', error);
        return null;
      }

      // Generate simple study plan
      return {
        userId,
        totalNodes: userProgress?.length || 0,
        completedNodes: userProgress?.filter(p => p.status === 'completed').length || 0,
        recommendedNextSteps: ['Revisar conceptos básicos', 'Practicar ejercicios', 'Hacer simulacros'],
        estimatedTimeToCompletion: '4-6 semanas'
      };

    } catch (error) {
      console.error('Error creating PAES study plan:', error);
      return null;
    }
  }
}
