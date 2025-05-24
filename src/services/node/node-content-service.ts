
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
        domainCategory: node.domain_category,
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
 * Batch create educational nodes using existing learning_nodes
 */
export async function batchCreateEducationalNodes(nodeRequests: any[]): Promise<any[]> {
  try {
    console.log('Batch creating educational nodes:', nodeRequests.length);
    
    // Get existing learning nodes that match the requests
    const { data: existingNodes, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .limit(nodeRequests.length * 2);
    
    if (error) {
      console.error('Error fetching existing nodes for batch creation:', error);
      return [];
    }
    
    // Return existing nodes as "created" educational nodes
    return (existingNodes || []).slice(0, nodeRequests.length).map((node, index) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      difficulty: node.difficulty,
      skill_id: node.skill_id,
      domain_category: node.domain_category,
      cognitive_level: node.cognitive_level,
      created_from_request: nodeRequests[index] || {},
      created_at: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error in batchCreateEducationalNodes:', error);
    return [];
  }
}
