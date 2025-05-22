
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, LearningPlanNode } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { mapSkillIdToEnum } from "@/utils/supabase-mappers";

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
                skill_id
              )
            `)
            .eq('plan_id', plan.id)
            .order('position', { ascending: true });
          
          if (nodesError) {
            console.error(`Error fetching nodes for plan ${plan.id}:`, nodesError);
            throw nodesError;
          }
          
          console.log(`Found ${planNodes?.length || 0} nodes for plan ${plan.id}`);
          
          // Debugging log para verificar estructura de datos
          if (planNodes && planNodes.length > 0) {
            console.log('Muestra de estructura de nodo:', planNodes[0]);
          }
          
          // Map the nodes to the expected format with proper skill mapping
          const nodes: LearningPlanNode[] = planNodes ? planNodes.map(item => {
            // Asegurar el mapeo correcto de skill_id a TPAESHabilidad
            let nodeSkill: TPAESHabilidad = 'MODEL'; // valor predeterminado
            
            try {
              if (item.node && item.node.skill_id) {
                nodeSkill = mapSkillIdToEnum(item.node.skill_id);
              }
            } catch (err) {
              console.error('Error mapeando skill_id:', item.node.skill_id, err);
            }
            
            return {
              id: item.id,
              nodeId: item.node.id,
              nodeName: item.node.title,
              nodeDescription: item.node.description,
              nodeDifficulty: item.node.difficulty,
              nodeSkill: nodeSkill,
              position: item.position,
              planId: plan.id
            };
          }) : [];
          
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
