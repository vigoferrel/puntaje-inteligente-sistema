
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";
import { mapDatabaseNodeToLearningNode } from "./node-base-service";

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
      const mappedNodes: TLearningNode[] = data.map(mapDatabaseNodeToLearningNode);
      return mappedNodes;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching learning nodes:', error);
    return [];
  }
};
