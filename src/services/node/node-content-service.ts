
import { supabase } from '@/integrations/supabase/client';

export interface NodeContent {
  id: string;
  nodeId: string;
  content: string;
  contentType: 'text' | 'video' | 'interactive' | 'exercise';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Since we don't have a node_content table, we'll simulate content based on learning_nodes
export async function fetchNodeContent(nodeId: string): Promise<NodeContent | null> {
  try {
    // Get node information from learning_nodes table
    const { data: node, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();
    
    if (error || !node) {
      console.warn('Node not found:', nodeId);
      return null;
    }

    // Create simulated content based on node data
    return {
      id: `content-${node.id}`,
      nodeId: node.id,
      content: node.description || 'Contenido educativo para este nodo de aprendizaje.',
      contentType: 'text',
      metadata: {
        title: node.title,
        difficulty: node.difficulty,
        domainCategory: node.domain_category, // Use correct field name
        cognitiveLevel: node.cognitive_level
      },
      createdAt: node.created_at,
      updatedAt: node.updated_at
    };
  } catch (error) {
    console.error('Error fetching node content:', error);
    return null;
  }
}

export async function createNodeContent(content: Omit<NodeContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<NodeContent | null> {
  try {
    // Since we don't have a node_content table, we'll update the learning_nodes description
    const { data: node, error } = await supabase
      .from('learning_nodes')
      .update({
        description: content.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', content.nodeId)
      .select()
      .single();

    if (error || !node) {
      console.error('Error updating node content:', error);
      return null;
    }

    return {
      id: `content-${node.id}`,
      nodeId: node.id,
      content: node.description || content.content,
      contentType: content.contentType,
      metadata: content.metadata,
      createdAt: node.created_at,
      updatedAt: node.updated_at
    };
  } catch (error) {
    console.error('Error creating node content:', error);
    return null;
  }
}

export async function updateNodeContent(contentId: string, updates: Partial<NodeContent>): Promise<NodeContent | null> {
  try {
    // Extract nodeId from contentId (format: content-{nodeId})
    const nodeId = contentId.replace('content-', '');
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (updates.content) {
      updateData.description = updates.content;
    }

    const { data: node, error } = await supabase
      .from('learning_nodes')
      .update(updateData)
      .eq('id', nodeId)
      .select()
      .single();

    if (error || !node) {
      console.error('Error updating node content:', error);
      return null;
    }

    return {
      id: contentId,
      nodeId: node.id,
      content: node.description || updates.content || '',
      contentType: updates.contentType || 'text',
      metadata: updates.metadata || {},
      createdAt: node.created_at,
      updatedAt: node.updated_at
    };
  } catch (error) {
    console.error('Error updating node content:', error);
    return null;
  }
}

/**
 * Batch create educational nodes (placeholder implementation)
 */
export async function batchCreateEducationalNodes(nodes: any[]): Promise<any[]> {
  try {
    console.log('Batch creating educational nodes:', nodes.length);
    
    // For now, return empty array as this is a placeholder
    // In the future, this could create multiple learning nodes
    return [];
  } catch (error) {
    console.error('Error in batchCreateEducationalNodes:', error);
    return [];
  }
}
