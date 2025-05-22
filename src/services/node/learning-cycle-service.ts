
import { supabase } from "@/integrations/supabase/client";
import { TLearningCyclePhase } from "@/types/system-types";

/**
 * Determine the current learning cycle phase based on user's progress
 */
export const getLearningCyclePhase = async (userId: string): Promise<TLearningCyclePhase> => {
  try {
    // Check if user has completed diagnostic
    const { data: diagnosticData, error: diagnosticError } = await supabase
      .from('user_diagnostic_results')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (diagnosticError) throw diagnosticError;
    
    if (!diagnosticData || diagnosticData.length === 0) {
      return 'DIAGNOSIS'; // User needs to complete diagnosis first
    }
    
    // Check if user has a learning plan
    const { data: planData, error: planError } = await supabase
      .from('learning_plans')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (planError) throw planError;
    
    if (!planData || planData.length === 0) {
      return 'PERSONALIZED_PLAN'; // User needs a learning plan
    }
    
    // Check user's progress on nodes
    const { data: nodeProgress, error: progressError } = await supabase
      .from('user_node_progress')
      .select('status')
      .eq('user_id', userId);
    
    if (progressError) throw progressError;
    
    if (!nodeProgress || nodeProgress.length === 0) {
      return 'SKILL_TRAINING'; // User needs to start training skills
    }
    
    const completedNodes = nodeProgress.filter(node => node.status === 'completed').length;
    const inProgressNodes = nodeProgress.filter(node => node.status === 'in_progress').length;
    
    // Calculate progress percentage assuming there are nodes in the plan
    const { data: planNodesCount, error: countError } = await supabase
      .from('learning_plan_nodes')
      .select('id', { count: 'exact' })
      .eq('plan_id', planData[0].id);
    
    if (countError) throw countError;
    
    const totalNodes = planNodesCount?.length || 0;
    
    if (totalNodes === 0) {
      return 'PERSONALIZED_PLAN'; // Plan exists but has no nodes
    }
    
    const progressPercentage = completedNodes / totalNodes;
    
    if (progressPercentage < 0.2) {
      return 'SKILL_TRAINING';
    } else if (progressPercentage < 0.5) {
      return 'CONTENT_STUDY';
    } else if (progressPercentage < 0.75) {
      return 'PERIODIC_TESTS';
    } else if (progressPercentage < 0.9) {
      return 'FEEDBACK_ANALYSIS';
    } else if (progressPercentage < 1.0) {
      return 'REINFORCEMENT';
    } else {
      return 'FINAL_SIMULATIONS'; // All nodes completed
    }
  } catch (error) {
    console.error('Error determining learning cycle phase:', error);
    return 'DIAGNOSIS'; // Default to diagnosis if error
  }
};
