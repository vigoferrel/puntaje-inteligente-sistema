
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, LearningPlanNode, PlanProgress } from "@/types/learning-plan";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchLearningNodes } from "@/services/node-service";

/**
 * Fetches all learning plans for a user
 */
export async function fetchLearningPlans(userId: string): Promise<LearningPlan[]> {
  try {
    // Get all learning plans for the user
    const { data: planData, error: planError } = await supabase
      .from('learning_plans')
      .select('*')
      .eq('user_id', userId);
    
    if (planError) throw planError;
    
    if (!planData) return [];
    
    // For each plan, fetch its nodes
    const plansWithNodes: LearningPlan[] = await Promise.all(
      planData.map(async (plan) => {
        // Get nodes for this plan
        const { data: nodeData, error: nodeError } = await supabase
          .from('learning_plan_nodes')
          .select('*')
          .eq('plan_id', plan.id)
          .order('position', { ascending: true });
        
        if (nodeError) throw nodeError;
        
        // Get node details for display purposes
        const nodeIds = nodeData?.map(n => n.node_id) || [];
        let nodeDetails: Record<string, { title: string; skill_id: number }> = {};
        
        if (nodeIds.length > 0) {
          const { data: details, error: detailsError } = await supabase
            .from('learning_nodes')
            .select('id, title, skill_id')
            .in('id', nodeIds);
            
          if (detailsError) throw detailsError;
          
          if (details) {
            nodeDetails = details.reduce((acc, node) => {
              acc[node.id] = { title: node.title, skill_id: node.skill_id };
              return acc;
            }, {} as Record<string, { title: string; skill_id: number }>);
          }
        }
        
        // Map nodes to our frontend type
        const mappedNodes: LearningPlanNode[] = nodeData?.map(node => ({
          id: node.id,
          planId: node.plan_id,
          nodeId: node.node_id,
          position: node.position,
          nodeName: nodeDetails[node.node_id]?.title || 'Unnamed Node',
          nodeSkill: nodeDetails[node.node_id]?.skill_id?.toString() || undefined
        })) || [];
        
        // Return the plan with its nodes
        return {
          id: plan.id,
          userId: plan.user_id,
          title: plan.title,
          description: plan.description,
          targetDate: plan.target_date,
          createdAt: plan.created_at,
          nodes: mappedNodes
        };
      })
    );
    
    return plansWithNodes;
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    toast({
      title: "Error",
      description: "No se pudieron cargar los planes de aprendizaje",
      variant: "destructive"
    });
    return [];
  }
}

/**
 * Creates a new learning plan for a user
 */
export async function createLearningPlan(
  userId: string,
  title: string,
  description?: string,
  targetDate?: string,
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<LearningPlan | null> {
  try {
    // Create the learning plan
    const { data: planData, error: planError } = await supabase
      .from('learning_plans')
      .insert({
        user_id: userId,
        title,
        description,
        target_date: targetDate
      })
      .select()
      .single();
    
    if (planError) throw planError;
    
    if (!planData) throw new Error("No plan data returned");
    
    // Generate nodes for the plan
    const generatedNodes = await generateLearningPlanNodes(userId, planData.id, skillPriorities);
    
    // Create the new plan object
    const newPlan: LearningPlan = {
      id: planData.id,
      userId: planData.user_id,
      title: planData.title,
      description: planData.description,
      targetDate: planData.target_date,
      createdAt: planData.created_at,
      nodes: generatedNodes
    };
    
    toast({
      title: "Plan creado",
      description: `Tu plan de aprendizaje "${title}" ha sido creado`
    });
    
    return newPlan;
  } catch (error) {
    console.error('Error creating learning plan:', error);
    toast({
      title: "Error",
      description: "No se pudo crear el plan de aprendizaje",
      variant: "destructive"
    });
    return null;
  }
}

/**
 * Generates nodes for a learning plan
 */
export async function generateLearningPlanNodes(
  userId: string,
  planId: string,
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<LearningPlanNode[]> {
  try {
    // Fetch appropriate nodes based on user's skill levels and career target
    // Get user's target career
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('target_career')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    const targetCareer = userData?.target_career;
    
    // Get user's skill levels
    const { data: skillData, error: skillError } = await supabase
      .from('user_skill_levels')
      .select('skill_id, level')
      .eq('user_id', userId);
    
    if (skillError) throw skillError;
    
    // Fetch all learning nodes
    const allNodes = await fetchLearningNodes();
    
    if (!allNodes || allNodes.length === 0) {
      throw new Error("No learning nodes available");
    }
    
    // Sort nodes based on user's skill levels, skill priorities, and target career
    // This would be a complex algorithm in a real implementation
    // For now, we'll just select a subset of nodes and order them by position
    const selectedNodes = allNodes.slice(0, 10);
    
    // Insert nodes into the learning plan
    const planNodes: LearningPlanNode[] = [];
    let position = 1;
    
    for (const node of selectedNodes) {
      const { data: nodeData, error: nodeError } = await supabase
        .from('learning_plan_nodes')
        .insert({
          plan_id: planId,
          node_id: node.id,
          position: position++
        })
        .select()
        .single();
      
      if (nodeError) throw nodeError;
      
      if (nodeData) {
        planNodes.push({
          id: nodeData.id,
          planId: nodeData.plan_id,
          nodeId: nodeData.node_id,
          position: nodeData.position,
          nodeName: node.title,
          // Fix for the skill_id error - skill property exists on TLearningNode, but not skill_id
          nodeSkill: node.skill ? node.skill.toString() : undefined
        });
      }
    }
    
    return planNodes;
  } catch (error) {
    console.error('Error generating learning plan nodes:', error);
    return [];
  }
}

/**
 * Updates progress for a learning plan
 */
export async function updatePlanProgress(userId: string, planId: string): Promise<PlanProgress | false> {
  try {
    // Find all nodes for this plan
    const { data: nodeData, error: nodeError } = await supabase
      .from('learning_plan_nodes')
      .select('node_id')
      .eq('plan_id', planId);
      
    if (nodeError) throw nodeError;
    
    if (!nodeData || nodeData.length === 0) return false;
    
    const nodeIds = nodeData.map(n => n.node_id);
    
    // Check progress for each node in the plan
    const { data: progressData, error: progressError } = await supabase
      .from('user_node_progress')
      .select('node_id, status, progress')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    if (progressError) throw progressError;
    
    // Calculate overall plan progress
    const totalNodes = nodeIds.length;
    const completedNodes = progressData?.filter(p => p.status === 'completed').length || 0;
    const inProgressNodes = progressData?.filter(p => p.status === 'in_progress').length || 0;
    
    const overallProgress = totalNodes > 0 
      ? (completedNodes + (inProgressNodes * 0.5)) / totalNodes 
      : 0;
    
    return {
      totalNodes,
      completedNodes,
      inProgressNodes,
      overallProgress
    };
  } catch (error) {
    console.error('Error updating plan progress:', error);
    return false;
  }
}
