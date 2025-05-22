
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

/**
 * Type definition for node creation payload
 */
type NodeCreationPayload = {
  title: string;
  description: string;
  code: string;
  skillId: number | null;
  testId: number | null;
  contentType: string;
  contentText: string;
  position: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
};

/**
 * Create multiple educational nodes in batch
 */
export const batchCreateEducationalNodes = async (
  nodes: NodeCreationPayload[]
): Promise<{ success: number; failed: number; errors: string[] }> => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };
  
  try {
    console.log(`Starting batch creation of ${nodes.length} educational nodes`);
    
    // Process nodes one by one to handle errors individually
    for (const nodeData of nodes) {
      try {
        // Create the learning node first
        const { data: nodeResult, error: nodeError } = await supabase
          .from('learning_nodes')
          .insert({
            title: nodeData.title,
            description: nodeData.description,
            code: nodeData.code,
            skill_id: nodeData.skillId,
            test_id: nodeData.testId,
            position: nodeData.position,
            difficulty: nodeData.difficulty
          })
          .select('id')
          .single();
        
        if (nodeError) {
          throw nodeError;
        }
        
        // Then create the associated content
        const nodeId = nodeResult.id;
        const { error: contentError } = await supabase
          .from('node_content')
          .insert({
            node_id: nodeId,
            content_type: nodeData.contentType,
            content: nodeData.contentText
          });
        
        if (contentError) {
          throw contentError;
        }
        
        results.success++;
        
      } catch (error: any) {
        results.failed++;
        results.errors.push(`Error creating node ${nodeData.code}: ${error.message}`);
        console.error(`Failed to create educational node: ${nodeData.code}`, error);
      }
    }
    
    return results;
    
  } catch (error: any) {
    console.error('Batch creation failed:', error);
    results.failed = nodes.length - results.success;
    results.errors.push(`Batch operation failed: ${error.message}`);
    return results;
  }
};
