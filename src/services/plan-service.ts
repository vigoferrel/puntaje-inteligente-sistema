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
    console.log(`Fetching learning plans for user ${userId}`);
    
    // Fetch all plans for the user
    const { data: plans, error } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
    
    if (!plans || plans.length === 0) {
      console.log('No plans found for user');
      return [];
    }
    
    console.log(`Found ${plans.length} plans for user`);
    
    // For each plan, fetch its nodes
    const plansWithNodes = await Promise.all(
      plans.map(async (plan) => {
        try {
          console.log(`Fetching nodes for plan ${plan.id}`);
          
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
          
          if (nodesError) {
            console.error(`Error fetching nodes for plan ${plan.id}:`, nodesError);
            throw nodesError;
          }
          
          console.log(`Found ${planNodes?.length || 0} nodes for plan ${plan.id}`);
          
          // Map the nodes to the expected format
          const nodes: LearningPlanNode[] = planNodes ? planNodes.map(item => ({
            id: item.id,
            nodeId: item.node.id,
            nodeName: item.node.title,
            nodeDescription: item.node.description,
            nodeDifficulty: item.node.difficulty,
            nodeSkill: item.node.skill?.code as TPAESHabilidad || 'MODEL',
            position: item.position,
            planId: plan.id
          })) : [];
          
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
        } catch (nodeError) {
          console.error(`Error fetching nodes for plan ${plan.id}:`, nodeError);
          // Return plan with empty nodes array if there was an error fetching nodes
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
      })
    );
    
    return plansWithNodes;
  } catch (error) {
    console.error("Error fetching learning plans:", error);
    throw error;
  }
};

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
          // Fix: Don't access .code on skill, since TPAESHabilidad is already the skill code
          nodeSkill: node.skill || 'MODEL', // Default to MODEL if skill is undefined
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

/**
 * Updates progress for a learning plan with improved error handling
 */
export const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
  try {
    console.log(`Updating progress for plan ${planId} of user ${userId}`);
    
    // Fetch the plan
    const { data: plan, error: planError } = await supabase
      .from('learning_plans')
      .select('id')
      .eq('id', planId)
      .eq('user_id', userId)
      .single();
    
    if (planError) {
      console.error('Error fetching plan:', planError);
      throw planError;
    }
    
    if (!plan) {
      console.error('Plan not found');
      return false;
    }
    
    // Fetch plan nodes
    const { data: planNodes, error: nodesError } = await supabase
      .from('learning_plan_nodes')
      .select('id, node_id')
      .eq('plan_id', planId);
    
    if (nodesError) {
      console.error('Error fetching plan nodes:', nodesError);
      throw nodesError;
    }
    
    if (!planNodes || planNodes.length === 0) {
      console.log('No nodes found for plan');
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0,
        nodeProgress: {}
      };
    }
    
    const nodeIds = planNodes.map(n => n.node_id);
    console.log(`Found ${nodeIds.length} nodes for plan`);
    
    // Fetch progress for all nodes
    const { data: progress, error: progressError } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    if (progressError) {
      console.error('Error fetching node progress:', progressError);
      throw progressError;
    }
    
    // Map progress data
    const nodeProgress = mapUserNodeProgress(progress || []);
    console.log(`Found progress data for ${nodeProgress.length} nodes`);
    
    // Calculate metrics
    const totalNodes = planNodes.length;
    const completedNodes = nodeProgress.filter(p => p.status === 'completed').length;
    const inProgressNodes = nodeProgress.filter(p => p.status === 'in_progress').length;
    const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
    
    // Create nodeProgress map for specific progress values
    const nodeProgressMap: Record<string, number> = {};
    nodeProgress.forEach(p => {
      nodeProgressMap[p.nodeId] = p.progress;
    });
    
    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      overallProgress,
      nodeProgress: nodeProgressMap
    };
  } catch (error) {
    console.error("Error updating plan progress:", error);
    return false;
  }
};
