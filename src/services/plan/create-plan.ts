
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Creates a virtual learning plan using existing learning_nodes data
 */
export const createLearningPlan = async (
  userId: string, 
  title: string, 
  description?: string,
  targetDate?: string,
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<LearningPlan | null> => {
  try {
    // Create virtual plan ID
    const planId = `virtual-plan-${userId}-${Date.now()}`;
    
    // Get learning nodes from database
    const { data: nodes, error } = await supabase
      .from('learning_nodes')
      .select('*')
      .order('position', { ascending: true })
      .limit(10);
    
    if (error) {
      console.error("Error fetching learning nodes:", error);
      return null;
    }
    
    if (!nodes || nodes.length === 0) {
      console.warn("No learning nodes found.");
      return null;
    }
    
    // Create plan nodes from available learning nodes
    const planNodes = nodes.map((node, index) => ({
      id: `virtual-node-${node.id}-${index}`,
      nodeId: node.id,
      nodeName: node.title,
      nodeDescription: node.description || '',
      nodeDifficulty: node.difficulty,
      nodeSkill: node.skill_id ? `SKILL_${node.skill_id}` : 'MODEL',
      position: index,
      planId: planId
    }));
    
    // Return the virtual plan
    return {
      id: planId,
      title,
      description: description || '',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetDate: targetDate || null,
      nodes: planNodes
    };
  } catch (error) {
    console.error("Error creating virtual learning plan:", error);
    return null;
  }
};
