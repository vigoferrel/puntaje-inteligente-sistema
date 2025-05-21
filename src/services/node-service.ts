
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode, TLearningCyclePhase } from "@/types/system-types";
import { mapSkillIdToEnum, mapTestIdToEnum } from "@/utils/supabase-mappers";
import { NodeProgress } from "@/types/node-progress";

/**
 * Fetches learning nodes from the database with optional filtering
 */
export const fetchLearningNodes = async (testId?: number, skillId?: number): Promise<TLearningNode[]> => {
  try {
    let query = supabase
      .from('learning_nodes')
      .select('*');
    
    if (testId) {
      query = query.eq('test_id', testId);
    }
    
    if (skillId) {
      query = query.eq('skill_id', skillId);
    }
    
    // Order by position for proper sequencing
    query = query.order('position', { ascending: true });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Map database nodes to our frontend type
    if (data) {
      const mappedNodes: TLearningNode[] = data.map(node => ({
        id: node.id,
        title: node.title,
        description: node.description || '',
        skill: mapSkillIdToEnum(node.skill_id),
        prueba: mapTestIdToEnum(node.test_id),
        difficulty: node.difficulty,
        position: node.position,
        dependsOn: node.depends_on || [],
        estimatedTimeMinutes: node.estimated_time_minutes || 30,
        content: {
          theory: '',
          examples: [],
          exerciseCount: 15
        }
      }));
      
      return mappedNodes;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching learning nodes:', error);
    return [];
  }
};

/**
 * Fetches user's progress on learning nodes
 */
export const fetchUserNodeProgress = async (userId: string): Promise<Record<string, NodeProgress>> => {
  try {
    const { data, error } = await supabase
      .from('user_node_progress')
      .select('node_id, status, progress, time_spent_minutes')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (data) {
      const progressMap: Record<string, NodeProgress> = {};
      
      data.forEach(item => {
        progressMap[item.node_id] = {
          nodeId: item.node_id,
          status: item.status as 'not_started' | 'in_progress' | 'completed',
          progress: item.progress || 0,
          timeSpentMinutes: item.time_spent_minutes || 0
        };
      });
      
      return progressMap;
    }
    
    return {};
  } catch (error) {
    console.error('Error fetching node progress:', error);
    return {};
  }
};

/**
 * Updates a user's progress on a specific learning node
 */
export const updateNodeProgress = async (
  userId: string, 
  nodeId: string, 
  status: 'not_started' | 'in_progress' | 'completed',
  progress: number,
  additionalTimeMinutes = 0
): Promise<boolean> => {
  try {
    // Get current progress to update time tracking
    const { data: currentData, error: fetchError } = await supabase
      .from('user_node_progress')
      .select('time_spent_minutes')
      .eq('user_id', userId)
      .eq('node_id', nodeId)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    const timeSpentMinutes = (currentData?.time_spent_minutes || 0) + additionalTimeMinutes;
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    
    const { error } = await supabase
      .from('user_node_progress')
      .upsert({
        user_id: userId,
        node_id: nodeId,
        status,
        progress,
        time_spent_minutes: timeSpentMinutes,
        completed_at: completedAt,
        last_activity_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating node progress:', error);
    return false;
  }
};

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
