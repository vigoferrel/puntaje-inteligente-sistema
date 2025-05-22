
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchNodesBySkills } from "@/services/learning-node-service";

/**
 * Creates a learning plan for a user with improved error handling
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
    
    // Insert the plan
    const { data: plan, error } = await supabase
      .from('learning_plans')
      .insert({
        user_id: userId,
        title,
        description,
        target_date: targetDate
      })
      .select()
      .single();
    
    if (error) throw error;
    
    if (!plan) {
      throw new Error("No data returned after inserting learning plan");
    }
    
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
      console.warn("No nodes found for selected skills. Creating empty plan.");
      return {
        id: plan.id,
        title: plan.title,
        description: plan.description || '',
        userId: plan.user_id,
        createdAt: plan.created_at,
        updatedAt: plan.updated_at,
        targetDate: plan.target_date || null,
        nodes: []
      };
    }
    
    // Add nodes to the plan
    const planNodes = [];
    for (let i = 0; i < nodes.length; i++) {
      try {
        const node = nodes[i];
        const { data: planNode, error } = await supabase
          .from('learning_plan_nodes')
          .insert({
            plan_id: plan.id,
            node_id: node.id,
            position: i
          })
          .select('id')
          .single();
        
        if (error) throw error;
        
        planNodes.push({
          id: planNode.id,
          nodeId: node.id,
          nodeName: node.title,
          nodeDescription: node.description || '',
          nodeDifficulty: node.difficulty,
          nodeSkill: node.skill || 'MODEL',
          position: i,
          planId: plan.id
        });
      } catch (nodeError) {
        console.error(`Error adding node to plan for position ${i}:`, nodeError);
        // Continue with next node on error
      }
    }
    
    // Return the plan with nodes
    return {
      id: plan.id,
      title: plan.title,
      description: plan.description || '',
      userId: plan.user_id,
      createdAt: plan.created_at,
      updatedAt: plan.updated_at,
      targetDate: plan.target_date || null,
      nodes: planNodes
    };
  } catch (error) {
    console.error("Error creating learning plan:", error);
    return null;
  }
};
