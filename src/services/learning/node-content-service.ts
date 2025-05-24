
import { supabase } from "@/integrations/supabase/client";

/**
 * Service for managing learning node content using existing tables
 */
export class NodeContentService {
  
  /**
   * Get exercises for a specific learning node
   */
  static async getNodeExercises(nodeId: string) {
    try {
      const { data: exercises, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('node_id', nodeId);

      if (error) {
        console.error('Error fetching node exercises:', error);
        return [];
      }

      return exercises || [];
    } catch (error) {
      console.error('Error in getNodeExercises:', error);
      return [];
    }
  }

  /**
   * Get learning node details
   */
  static async getNodeDetails(nodeId: string) {
    try {
      const { data: node, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .eq('id', nodeId)
        .single();

      if (error) {
        console.error('Error fetching node details:', error);
        return null;
      }

      return node;
    } catch (error) {
      console.error('Error in getNodeDetails:', error);
      return null;
    }
  }

  /**
   * Update user progress for a node
   */
  static async updateNodeProgress(userId: string, nodeId: string, progress: number, status: string) {
    try {
      const { data, error } = await supabase
        .from('user_node_progress')
        .upsert({
          user_id: userId,
          node_id: nodeId,
          progress: progress / 100, // Convert to decimal
          status,
          last_activity_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating node progress:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateNodeProgress:', error);
      return false;
    }
  }
}
