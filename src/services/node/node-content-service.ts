
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";

/**
 * Store content for a learning node
 */
export const storeNodeContent = async (nodeId: string, content: TLearningNode['content']): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('node_content')
      .insert({
        node_id: nodeId,
        content_type: 'main',
        content: content
      });
    
    if (error) {
      console.error('Error storing node content:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in storeNodeContent:', error);
    return false;
  }
};

/**
 * Retrieve content for a learning node
 */
export const getNodeContent = async (nodeId: string): Promise<TLearningNode['content'] | null> => {
  try {
    const { data, error } = await supabase
      .from('node_content')
      .select('content')
      .eq('node_id', nodeId)
      .eq('content_type', 'main')
      .single();
    
    if (error || !data) {
      console.error('Error retrieving node content:', error);
      return null;
    }
    
    return data.content as TLearningNode['content'];
  } catch (error) {
    console.error('Error in getNodeContent:', error);
    return null;
  }
};
