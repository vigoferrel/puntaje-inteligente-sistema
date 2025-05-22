import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { mapNodeSkillSafely } from "./utils";

// Helper function to ensure user has a learning plan
export async function ensureUserHasLearningPlan(userId: string): Promise<boolean> {
  try {
    // First check if the user already has plans
    const { count, error } = await supabase
      .from('learning_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // If user has plans, we're done
    if (count && count > 0) return true;
    
    // Otherwise, generate a default plan
    const { data: planData, error: planError } = await supabase
      .from('learning_plans')
      .insert({
        user_id: userId,
        title: 'Plan de Estudio PAES',
        description: 'Plan de estudio personalizado para la PAES',
        target_date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
      })
      .select()
      .single();
    
    if (planError) throw planError;
    if (!planData) throw new Error('No se pudo crear el plan por defecto');
    
    // Generate nodes for the new plan
    await generateNodesForPlan(planData.id);
    
    return true;
  } catch (error) {
    console.error('Error ensuring user has learning plan:', error);
    return false;
  }
}

// Helper function to generate nodes for a plan
export async function generateNodesForPlan(
  planId: string, 
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<boolean> {
  try {
    // Fetch some basic nodes to include
    const { data: nodes, error: nodesError } = await supabase
      .from('learning_nodes')
      .select('id, position, skill_id, difficulty')
      .order('difficulty', { ascending: true })
      .order('position', { ascending: true })
      .limit(10);
    
    if (nodesError) throw nodesError;
    
    if (!nodes || nodes.length === 0) {
      console.warn('No learning nodes available to add to the plan');
      return false;
    }
    
    // Prepare nodes for insertion
    let position = 1;
    const planNodes = nodes.map(node => ({
      plan_id: planId,
      node_id: node.id,
      position: position++
    }));
    
    // Insert the nodes into the plan
    const { error: insertError } = await supabase
      .from('learning_plan_nodes')
      .insert(planNodes);
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error('Error generating nodes for plan:', error);
    return false;
  }
}

// Function to fetch plans with their nodes
export async function fetchPlansWithNodes(userId: string): Promise<LearningPlan[]> {
  try {
    // Fetch plans with their nodes
    const { data: plansData, error: plansError } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (plansError) throw plansError;
    
    if (!plansData || plansData.length === 0) {
      return [];
    }
    
    // For each plan, fetch its nodes
    const plansWithNodes = await Promise.all(
      plansData.map(async (plan) => {
        try {
          const { data: nodesData, error: nodesError } = await supabase
            .from('learning_plan_nodes')
            .select(`
              id, position,
              node:node_id (
                id, title, description, difficulty, skill_id
              )
            `)
            .eq('plan_id', plan.id)
            .order('position', { ascending: true });
          
          if (nodesError) throw nodesError;
          
          // Transform nodes to the expected format
          const nodes = (nodesData || []).map(item => {
            const nodeSkill = mapNodeSkillSafely(item.node?.skill_id);
            
            return {
              id: item.id,
              nodeId: item.node?.id || '',
              nodeName: item.node?.title || `Node ${item.position}`,
              nodeDescription: item.node?.description || '',
              nodeDifficulty: item.node?.difficulty || 'basic',
              nodeSkill,
              position: item.position,
              planId: plan.id
            };
          });
          
          // Return complete plan object
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
          // Return plan with empty nodes array on error
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
}

// Function to update plan progress
export async function fetchPlanProgress(userId: string, planId: string): Promise<PlanProgress | null> {
  try {
    // Fetch the nodes in this plan
    const { data: planNodes, error: nodesError } = await supabase
      .from('learning_plan_nodes')
      .select('id, node_id')
      .eq('plan_id', planId);
    
    if (nodesError) throw nodesError;
    
    if (!planNodes || planNodes.length === 0) {
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0,
        nodeProgress: {}
      };
    }
    
    const nodeIds = planNodes.map(n => n.node_id);
    
    // Fetch progress for all nodes
    const { data: progress, error: progressError } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    if (progressError) throw progressError;
    
    // Calculate metrics
    const totalNodes = planNodes.length;
    const completedNodes = (progress || []).filter(p => p.status === 'completed').length;
    const inProgressNodes = (progress || []).filter(p => p.status === 'in_progress').length;
    const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) : 0;
    
    // Create nodeProgress map
    const nodeProgressMap: Record<string, number> = {};
    (progress || []).forEach(p => {
      nodeProgressMap[p.node_id] = p.progress || 0;
    });
    
    // Return progress data
    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      overallProgress,
      nodeProgress: nodeProgressMap
    };
  } catch (error) {
    console.error("Error fetching plan progress:", error);
    return null;
  }
}
