
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";
import { v4 as uuidv4 } from 'uuid';

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

/**
 * Create a learning node with educational content
 * This function creates a node in learning_nodes table and its content in node_content table
 */
export const createEducationalNode = async (
  title: string, 
  description: string,
  code: string,
  skillId: number | null,
  testId: number | null,
  contentType: string,
  contentText: string,
  position: number = 1,
  difficulty: 'basic' | 'intermediate' | 'advanced' = 'basic'
): Promise<string | null> => {
  try {
    // Generate UUID for the new node
    const nodeId = uuidv4();
    
    // Create node record - properly handle null values for skill_id and test_id
    const { error: nodeError } = await supabase
      .from('learning_nodes')
      .insert({
        id: nodeId,
        title,
        description,
        code,
        skill_id: skillId, // Will be null if skillId is null
        test_id: testId, // Will be null if testId is null
        position,
        difficulty
      });
    
    if (nodeError) {
      console.error('Error creating learning node:', nodeError);
      return null;
    }
    
    // Create content record
    const { error: contentError } = await supabase
      .from('node_content')
      .insert({
        node_id: nodeId,
        content_type: contentType,
        content: { text: contentText }
      });
    
    if (contentError) {
      console.error('Error creating node content:', contentError);
      // Consider deleting the node if content creation fails
      await supabase.from('learning_nodes').delete().eq('id', nodeId);
      return null;
    }
    
    return nodeId;
  } catch (error) {
    console.error('Error in createEducationalNode:', error);
    return null;
  }
};

/**
 * Batch create educational nodes from CSV-like data
 * Each row should have: title, code, content_type, content_text, skill_id, test_id
 */
export const batchCreateEducationalNodes = async (
  nodes: Array<{
    title: string;
    description?: string;
    code: string;
    skillId: number | null;
    testId: number | null;
    contentType: string;
    contentText: string;
    position?: number;
    difficulty?: 'basic' | 'intermediate' | 'advanced';
  }>
): Promise<{success: number; failed: number; errors: string[]}> => {
  const results = {
    success: 0,
    failed: 0,
    errors: [] as string[]
  };
  
  for (const node of nodes) {
    try {
      const nodeId = await createEducationalNode(
        node.title,
        node.description || '',
        node.code,
        node.skillId, // Pass null if it's null
        node.testId, // Pass null if it's null
        node.contentType,
        node.contentText,
        node.position || 1,
        node.difficulty || 'basic'
      );
      
      if (nodeId) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push(`Failed to create node: ${node.title}`);
      }
    } catch (error) {
      results.failed++;
      results.errors.push(`Error creating node ${node.title}: ${error}`);
    }
  }
  
  return results;
};

/**
 * Delete a node and its associated content
 */
export const deleteEducationalNode = async (nodeId: string): Promise<boolean> => {
  try {
    // Delete content first due to foreign key constraint
    const { error: contentError } = await supabase
      .from('node_content')
      .delete()
      .eq('node_id', nodeId);
    
    if (contentError) {
      console.error('Error deleting node content:', contentError);
      return false;
    }
    
    // Delete the node
    const { error: nodeError } = await supabase
      .from('learning_nodes')
      .delete()
      .eq('id', nodeId);
    
    if (nodeError) {
      console.error('Error deleting learning node:', nodeError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteEducationalNode:', error);
    return false;
  }
};
