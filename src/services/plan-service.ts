
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, LearningPlanNode, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchNodeById, fetchNodesBySkills } from "@/services/learning-node-service";
import { mapUserNodeProgress } from "@/utils/learning-node-mappers";

/**
 * Fetches all learning plans for a user
 */
export const fetchLearningPlans = async (userId: string): Promise<LearningPlan[]> => {
  try {
    // Fetch all plans for the user
    const { data: plans, error } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!plans || plans.length === 0) {
      return [];
    }
    
    // For each plan, fetch its nodes
    const plansWithNodes = await Promise.all(
      plans.map(async (plan) => {
        const { data: planNodes, error: nodesError } = await supabase
          .from('learning_plan_nodes')
          .select(`
            id, position,
            node:node_id (
              id, code, title, description, difficulty, 
              skill:skill_id (id, name, code)
            )
          `)
          .eq('plan_id', plan.id)
          .order('position', { ascending: true });
        
        if (nodesError) throw nodesError;
        
        // Map the nodes to the expected format
        const nodes: LearningPlanNode[] = planNodes.map(item => ({
          id: item.id,
          nodeId: item.node.id,
          nodeName: item.node.title,
          nodeDescription: item.node.description,
          nodeDifficulty: item.node.difficulty,
          nodeSkill: item.node.skill.code as TPAESHabilidad,
          position: item.position,
          planId: plan.id // Add planId since it's required in LearningPlanNode
        }));
        
        // Return the plan with its nodes
        return {
          id: plan.id,
          title: plan.title,
          description: plan.description || '',
          userId: plan.user_id,
          createdAt: plan.created_at,
          updatedAt: plan.updated_at,
          targetDate: plan.target_date || null,
          nodes
        };
      })
    );
    
    return plansWithNodes;
  } catch (error) {
    console.error("Error fetching learning plans:", error);
    throw error;
  }
};

/**
 * Creates a learning plan for a user
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
    
    // Get top skills to focus on (those with lowest scores)
    const skillsToFocus = Object.entries(priorities)
      .sort(([, a], [, b]) => a - b) // Sort by score ascending
      .slice(0, 3) // Take top 3 lowest scores
      .map(([skill]) => skill as TPAESHabilidad);
    
    // Fetch nodes for these skills
    const nodes = await fetchNodesBySkills(skillsToFocus);
    
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
        // Fix: Don't access .code on skill, since TPAESHabilidad is already the skill code
        nodeSkill: node.skill || 'MODEL', // Default to MODEL if skill is undefined
        position: i,
        planId: plan.id
      });
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

/**
 * Updates the progress for a learning plan
 */
export const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
  try {
    // Fetch the plan
    const { data: plan } = await supabase
      .from('learning_plans')
      .select('id')
      .eq('id', planId)
      .eq('user_id', userId)
      .single();
    
    if (!plan) return false;
    
    // Fetch plan nodes
    const { data: planNodes } = await supabase
      .from('learning_plan_nodes')
      .select('id, node_id')
      .eq('plan_id', planId);
    
    if (!planNodes || planNodes.length === 0) {
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0
      };
    }
    
    const nodeIds = planNodes.map(n => n.node_id);
    
    // Fetch progress for all nodes
    const { data: progress } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    // Map progress data
    const nodeProgress = mapUserNodeProgress(progress || []);
    
    // Calculate metrics
    const totalNodes = planNodes.length;
    const completedNodes = nodeProgress.filter(p => p.status === 'completed').length;
    const inProgressNodes = nodeProgress.filter(p => p.status === 'in_progress').length;
    const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
    
    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      overallProgress
    };
  } catch (error) {
    console.error("Error updating plan progress:", error);
    return false;
  }
};
