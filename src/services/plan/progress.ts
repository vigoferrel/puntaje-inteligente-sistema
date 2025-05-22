
import { supabase } from "@/integrations/supabase/client";
import { PlanProgress } from "@/types/learning-plan";
import { mapUserNodeProgress } from "@/utils/learning-node-mappers";

/**
 * Updates progress for a learning plan with improved error handling
 */
export const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
  try {
    console.log(`Updating progress for plan ${planId} of user ${userId}`);
    
    // Fetch the plan
    const { data: plan, error: planError } = await supabase
      .from('learning_plans')
      .select('id')
      .eq('id', planId)
      .eq('user_id', userId)
      .single();
    
    if (planError) {
      console.error('Error fetching plan:', planError);
      throw planError;
    }
    
    if (!plan) {
      console.error('Plan not found');
      return false;
    }
    
    // Fetch plan nodes
    const { data: planNodes, error: nodesError } = await supabase
      .from('learning_plan_nodes')
      .select('id, node_id')
      .eq('plan_id', planId);
    
    if (nodesError) {
      console.error('Error fetching plan nodes:', nodesError);
      throw nodesError;
    }
    
    if (!planNodes || planNodes.length === 0) {
      console.log('No nodes found for plan');
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0,
        nodeProgress: {}
      };
    }
    
    const nodeIds = planNodes.map(n => n.node_id);
    console.log(`Found ${nodeIds.length} nodes for plan`);
    
    // Fetch progress for all nodes
    const { data: progress, error: progressError } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    if (progressError) {
      console.error('Error fetching node progress:', progressError);
      throw progressError;
    }
    
    // Map progress data
    const nodeProgress = mapUserNodeProgress(progress || []);
    console.log(`Found progress data for ${nodeProgress.length} nodes`);
    
    // Calculate metrics
    const totalNodes = planNodes.length;
    const completedNodes = nodeProgress.filter(p => p.status === 'completed').length;
    const inProgressNodes = nodeProgress.filter(p => p.status === 'in_progress').length;
    const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
    
    // Create nodeProgress map for specific progress values
    const nodeProgressMap: Record<string, number> = {};
    nodeProgress.forEach(p => {
      nodeProgressMap[p.nodeId] = p.progress;
    });
    
    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      overallProgress,
      nodeProgress: nodeProgressMap
    };
  } catch (error) {
    console.error("Error updating plan progress:", error);
    return false;
  }
};
