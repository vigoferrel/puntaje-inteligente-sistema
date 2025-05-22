
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";

/**
 * Fetches content for a specific learning node
 */
export const fetchNodeContent = async (nodeId: string) => {
  try {
    const { data, error } = await supabase
      .from('node_content')
      .select('*')
      .eq('node_id', nodeId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) throw error;
    
    return data?.[0]?.content || null;
  } catch (error) {
    console.error('Error fetching node content:', error);
    return null;
  }
};
