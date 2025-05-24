
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, LearningPlanNode, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { mapSkillIdToEnum } from "@/utils/supabase-mappers";

/**
 * Simple plan service that works with existing Supabase tables only
 */
export class SimplePlanService {
  /**
   * Get virtual plans for a user based on their progress
   */
  static async getUserPlans(userId: string): Promise<LearningPlan[]> {
    try {
      // Get all learning nodes
      const { data: nodes, error: nodesError } = await supabase
        .from('learning_nodes')
        .select('*')
        .order('position', { ascending: true });
      
      if (nodesError) {
        console.error('Error fetching nodes:', nodesError);
        return [];
      }
      
      if (!nodes || nodes.length === 0) {
        return [];
      }
      
      // Create a single comprehensive plan
      const plan = this.createComprehensivePlan(userId, nodes);
      return [plan];
      
    } catch (error) {
      console.error('Error in getUserPlans:', error);
      return [];
    }
  }
  
  /**
   * Create a comprehensive learning plan
   */
  static createComprehensivePlan(userId: string, nodes: any[]): LearningPlan {
    // Take first 15 nodes for the plan
    const selectedNodes = nodes.slice(0, 15);
    
    const planNodes: LearningPlanNode[] = selectedNodes.map((node, index) => ({
      id: `node-${node.id}-${index}`,
      nodeId: node.id,
      nodeName: node.title,
      nodeDescription: node.description || '',
      nodeDifficulty: node.difficulty,
      nodeSkill: this.getNodeSkill(node.skill_id),
      position: index,
      planId: `comprehensive-${userId}`
    }));
    
    return {
      id: `comprehensive-${userId}`,
      title: "Plan de Aprendizaje Integral",
      description: "Plan integral basado en nodos de aprendizaje disponibles",
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetDate: null,
      nodes: planNodes
    };
  }
  
  /**
   * Get plan progress for a virtual plan
   */
  static async getPlanProgress(userId: string, planId: string): Promise<PlanProgress | null> {
    try {
      // Get user progress for all nodes
      const { data: userProgress, error } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user progress:', error);
        return null;
      }
      
      // Calculate overall progress
      const progressData = userProgress || [];
      const totalNodes = progressData.length;
      const completedNodes = progressData.filter(p => p.status === 'completed').length;
      const inProgressNodes = progressData.filter(p => p.status === 'in_progress').length;
      
      const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
      
      return {
        totalNodes,
        completedNodes,
        inProgressNodes,
        overallProgress: Math.round(overallProgress),
        nodeProgress: progressData.reduce((acc, progress) => {
          acc[progress.node_id] = (progress.progress || 0) * 100;
          return acc;
        }, {} as Record<string, number>)
      };
      
    } catch (error) {
      console.error('Error calculating plan progress:', error);
      return null;
    }
  }
  
  /**
   * Helper to map skill ID to enum
   */
  private static getNodeSkill(skillId: number | null): TPAESHabilidad {
    try {
      if (skillId) {
        return mapSkillIdToEnum(skillId);
      }
    } catch (error) {
      console.warn('Error mapping skill ID:', skillId);
    }
    return 'MODEL'; // Default value
  }
}
