
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, LearningPlanNode, PlanProgress } from "@/types/learning-plan";
import { toast } from "@/components/ui/use-toast";
import { TPAESHabilidad } from "@/types/system-types";
import { fetchLearningNodes } from "@/services/node";
import { ensureLearningNodesExist } from "@/services/learning/initialize-learning-service";
import { generatePersonalizedLearningPlan } from "@/services/learning/plan-generator-service";
import { mapEnumToSkillId, mapSkillIdToEnum } from "@/utils/supabase-mappers";

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
        const mappedNodes: LearningPlanNode[] = nodeData?.map(node => {
          const details = nodeDetails[node.node_id];
          const skillEnum = details?.skill_id ? mapSkillIdToEnum(details.skill_id) : undefined;
          
          return {
            id: node.id,
            planId: node.plan_id,
            nodeId: node.node_id,
            position: node.position,
            nodeName: details?.title || 'Módulo de aprendizaje',
            nodeSkill: skillEnum
          };
        }) || [];
        
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
    // Asegurar que existan nodos de aprendizaje
    await ensureLearningNodesExist();
    
    // Usar el servicio de generación de planes personalizado
    const planId = await generatePersonalizedLearningPlan(
      userId,
      title,
      description,
      targetDate
    );
    
    if (!planId) {
      throw new Error("No se pudo crear el plan de aprendizaje");
    }
    
    // Obtener el plan recién creado con sus nodos
    const plans = await fetchLearningPlans(userId);
    const newPlan = plans.find(p => p.id === planId);
    
    if (!newPlan) {
      throw new Error("Plan creado pero no se pudo recuperar la información completa");
    }
    
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
    
    if (!nodeData || nodeData.length === 0) {
      // Si no hay nodos, inicializar valores predeterminados
      return {
        totalNodes: 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0
      };
    }
    
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
    
    // Si no hay nodos con progreso, inicializar automáticamente
    if (!progressData || progressData.length === 0) {
      // Crear registros de progreso iniciales para los nodos del plan
      const initialProgress = nodeIds.map(nodeId => ({
        user_id: userId,
        node_id: nodeId,
        status: 'not_started' as const,
        progress: 0,
        time_spent_minutes: 0
      }));
      
      await supabase
        .from('user_node_progress')
        .upsert(initialProgress);
    }
    
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

/**
 * Gets skill distribution for a learning plan
 */
export async function getPlanSkillDistribution(planId: string): Promise<Record<TPAESHabilidad, number>> {
  try {
    // Get nodes for this plan
    const { data: nodeData, error: nodeError } = await supabase
      .from('learning_plan_nodes')
      .select('node_id')
      .eq('plan_id', planId);
      
    if (nodeError) throw nodeError;
    
    if (!nodeData || nodeData.length === 0) return {};
    
    const nodeIds = nodeData.map(n => n.node_id);
    
    // Get skill information for these nodes
    const { data: nodeDetails, error: detailsError } = await supabase
      .from('learning_nodes')
      .select('skill_id')
      .in('id', nodeIds);
      
    if (detailsError) throw detailsError;
    
    if (!nodeDetails) return {};
    
    // Count nodes by skill
    const skillCounts: Record<TPAESHabilidad, number> = {};
    
    nodeDetails.forEach(node => {
      const skillEnum = mapSkillIdToEnum(node.skill_id);
      skillCounts[skillEnum] = (skillCounts[skillEnum] || 0) + 1;
    });
    
    return skillCounts;
  } catch (error) {
    console.error('Error getting plan skill distribution:', error);
    return {};
  }
}

/**
 * Get next recommended node for a user
 */
export async function getNextRecommendedNode(userId: string, planId: string): Promise<string | null> {
  try {
    // Get nodes for this plan with their current progress
    const { data: planNodes, error: nodesError } = await supabase
      .from('learning_plan_nodes')
      .select('node_id, position')
      .eq('plan_id', planId)
      .order('position', { ascending: true });
      
    if (nodesError) throw nodesError;
    
    if (!planNodes || planNodes.length === 0) return null;
    
    const nodeIds = planNodes.map(n => n.node_id);
    
    // Get progress for these nodes
    const { data: progressData, error: progressError } = await supabase
      .from('user_node_progress')
      .select('node_id, status')
      .eq('user_id', userId)
      .in('node_id', nodeIds);
    
    if (progressError) throw progressError;
    
    // Find the first node that is not completed
    const completedNodeIds = progressData
      ?.filter(p => p.status === 'completed')
      .map(p => p.node_id) || [];
    
    for (const node of planNodes) {
      if (!completedNodeIds.includes(node.node_id)) {
        return node.node_id;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting next recommended node:', error);
    return null;
  }
}
