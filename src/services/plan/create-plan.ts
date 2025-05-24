
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchNodesBySkills } from "@/services/learning-node-service";

/**
 * Creates a virtual learning plan using existing user_node_progress data
 */
export const createLearningPlan = async (
  userId: string, 
  title: string, 
  description?: string,
  targetDate?: string,
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<LearningPlan | null> => {
  try {
    // Default skill priorities if none provided
    const defaultSkillPriorities: Record<TPAESHabilidad, number> = {
      "SOLVE_PROBLEMS": 0.5,
      "REPRESENT": 0.5,
      "MODEL": 0.5,
      "INTERPRET_RELATE": 0.5,
      "EVALUATE_REFLECT": 0.5,
      "TRACK_LOCATE": 0.5,
      "ARGUE_COMMUNICATE": 0.5,
      "IDENTIFY_THEORIES": 0.5,
      "PROCESS_ANALYZE": 0.5,
      "APPLY_PRINCIPLES": 0.5,
      "SCIENTIFIC_ARGUMENT": 0.5,
      "TEMPORAL_THINKING": 0.5,
      "SOURCE_ANALYSIS": 0.5,
      "MULTICAUSAL_ANALYSIS": 0.5,
      "CRITICAL_THINKING": 0.5,
      "REFLECTION": 0.5
    };
    
    const priorities = skillPriorities || defaultSkillPriorities;
    
    // Create virtual plan ID
    const planId = `virtual-plan-${userId}-${Date.now()}`;
    
    // Get top skills to focus on (those with lowest scores)
    const skillsToFocus = Object.entries(priorities)
      .sort(([, a], [, b]) => a - b) // Sort by score ascending
      .slice(0, 3) // Take top 3 lowest scores
      .map(([skill]) => skill as TPAESHabilidad);
    
    // Fetch nodes for these skills
    let nodes;
    try {
      nodes = await fetchNodesBySkills(skillsToFocus);
    } catch (error) {
      console.error("Error fetching nodes for skills:", error);
      nodes = [];
    }
    
    if (!nodes || nodes.length === 0) {
      console.warn("No nodes found for selected skills. Getting default nodes.");
      
      // Get default nodes from learning_nodes
      const { data: defaultNodes, error } = await supabase
        .from('learning_nodes')
        .select('*')
        .order('position', { ascending: true })
        .limit(10);
      
      if (error) {
        console.error("Error fetching default nodes:", error);
        nodes = [];
      } else {
        nodes = defaultNodes || [];
      }
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
