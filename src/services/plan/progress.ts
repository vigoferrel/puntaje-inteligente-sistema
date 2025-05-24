
import { supabase } from "@/integrations/supabase/client";
import { PlanProgress } from "@/types/learning-plan";

/**
 * Updates progress for a virtual learning plan using existing tables only
 */
export const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
  try {
    console.log(`Calculating virtual plan progress for user ${userId}`);
    
    // For virtual plans, we calculate progress based on user_node_progress
    const { data: userProgress, error: progressError } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      throw progressError;
    }
    
    if (!userProgress || userProgress.length === 0) {
      console.log('No progress found for user');
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0,
        nodeProgress: {}
      };
    }
    
    // Calculate metrics from user progress
    const totalNodes = userProgress.length;
    const completedNodes = userProgress.filter(p => p.status === 'completed').length;
    const inProgressNodes = userProgress.filter(p => p.status === 'in_progress').length;
    const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
    
    // Create nodeProgress map
    const nodeProgressMap: Record<string, number> = {};
    userProgress.forEach(p => {
      nodeProgressMap[p.node_id] = (p.progress || 0) * 100;
    });
    
    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      overallProgress: Math.round(overallProgress),
      nodeProgress: nodeProgressMap
    };
  } catch (error) {
    console.error("Error updating plan progress:", error);
    return false;
  }
};
