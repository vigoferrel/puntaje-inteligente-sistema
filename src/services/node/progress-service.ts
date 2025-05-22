
import { supabase } from "@/integrations/supabase/client";
import { NodeProgress } from "@/types/node-progress";

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
