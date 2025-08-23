
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan, LearningPlanNode } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { mapSkillIdToEnum } from "@/utils/supabase-mappers";

/**
 * Create virtual learning plans based on user progress and learning nodes
 */
export const fetchLearningPlans = async (userId: string): Promise<LearningPlan[]> => {
  try {
    console.log(`Creating virtual learning plans for user ${userId}`);
    
    // Get user's current progress to understand their learning state
    const { data: userProgress, error: progressError } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_activity_at', { ascending: false });
    
    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      throw progressError;
    }
    
    // Get available learning nodes
    const { data: allNodes, error: nodesError } = await supabase
      .from('learning_nodes')
      .select('*')
      .order('position', { ascending: true });
    
    if (nodesError) {
      console.error('Error fetching learning nodes:', nodesError);
      throw nodesError;
    }
    
    if (!allNodes || allNodes.length === 0) {
      console.log('No learning nodes found');
      return [];
    }
    
    // Create virtual plans based on different strategies
    const plans: LearningPlan[] = [];
    
    // Plan 1: General Progress Plan
    const generalPlan = createGeneralProgressPlan(userId, allNodes, userProgress || []);
    plans.push(generalPlan);
    
    // Plan 2: PAES Focused Plan (if PAES nodes exist)
    const paesNodes = allNodes.filter(node => 
      node.subject_area === 'PAES' || 
      node.code.startsWith('PAES_') ||
      node.domain_category?.includes('PAES')
    );
    
    if (paesNodes.length > 0) {
      const paesPlan = createPAESFocusedPlan(userId, paesNodes, userProgress || []);
      plans.push(paesPlan);
    }
    
    // Plan 3: Skill-Based Plan
    const skillBasedPlan = createSkillBasedPlan(userId, allNodes, userProgress || []);
    plans.push(skillBasedPlan);
    
    console.log(`Created ${plans.length} virtual learning plans`);
    return plans;
    
  } catch (error) {
    console.error("Error creating virtual learning plans:", error);
    throw error;
  }
};

function createGeneralProgressPlan(
  userId: string, 
  nodes: any[], 
  userProgress: any[]
): LearningPlan {
  const completedNodeIds = new Set(
    userProgress
      .filter(p => p.status === 'completed')
      .map(p => p.node_id)
  );
  
  // Select nodes that aren't completed yet
  const availableNodes = nodes.filter(node => !completedNodeIds.has(node.id));
  
  // Take first 10 nodes for the plan
  const selectedNodes = availableNodes.slice(0, 10);
  
  const planNodes: LearningPlanNode[] = selectedNodes.map((node, index) => ({
    id: `virtual-general-${node.id}`,
    nodeId: node.id,
    nodeName: node.title,
    nodeDescription: node.description || '',
    nodeDifficulty: node.difficulty,
    nodeSkill: mapSkillIdToEnum(node.skill_id) || 'MODEL',
    position: index,
    planId: `virtual-general-${userId}`
  }));
  
  return {
    id: `virtual-general-${userId}`,
    title: "Plan de Progreso General",
    description: "Plan basado en tu progreso actual y nodos disponibles",
    userId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetDate: null,
    nodes: planNodes
  };
}

function createPAESFocusedPlan(
  userId: string, 
  paesNodes: any[], 
  userProgress: any[]
): LearningPlan {
  const completedNodeIds = new Set(
    userProgress
      .filter(p => p.status === 'completed')
      .map(p => p.node_id)
  );
  
  // Focus on incomplete PAES nodes
  const availableNodes = paesNodes.filter(node => !completedNodeIds.has(node.id));
  
  const planNodes: LearningPlanNode[] = availableNodes.map((node, index) => ({
    id: `virtual-paes-${node.id}`,
    nodeId: node.id,
    nodeName: node.title,
    nodeDescription: node.description || '',
    nodeDifficulty: node.difficulty,
    nodeSkill: mapSkillIdToEnum(node.skill_id) || 'MODEL',
    position: index,
    planId: `virtual-paes-${userId}`
  }));
  
  return {
    id: `virtual-paes-${userId}`,
    title: "Plan Enfocado PAES",
    description: "Plan especializado en preparación PAES",
    userId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetDate: null,
    nodes: planNodes
  };
}

function createSkillBasedPlan(
  userId: string, 
  nodes: any[], 
  userProgress: any[]
): LearningPlan {
  // Group nodes by skill and select diverse skills
  const nodesBySkill = nodes.reduce((acc, node) => {
    const skillKey = node.skill_id || 'unknown';
    if (!acc[skillKey]) acc[skillKey] = [];
    acc[skillKey].push(node);
    return acc;
  }, {} as Record<string, any[]>);
  
  // Select one node from each skill (up to 8 skills)
  const selectedNodes: any[] = [];
  const skillKeys = Object.keys(nodesBySkill).slice(0, 8);
  
  skillKeys.forEach(skillKey => {
    const skillNodes = nodesBySkill[skillKey];
    if (skillNodes.length > 0) {
      // Pick the first node from this skill that user hasn't completed
      const progressMap = new Set(userProgress.filter(p => p.status === 'completed').map(p => p.node_id));
      const availableNode = skillNodes.find(node => !progressMap.has(node.id)) || skillNodes[0];
      selectedNodes.push(availableNode);
    }
  });
  
  const planNodes: LearningPlanNode[] = selectedNodes.map((node, index) => ({
    id: `virtual-skill-${node.id}`,
    nodeId: node.id,
    nodeName: node.title,
    nodeDescription: node.description || '',
    nodeDifficulty: node.difficulty,
    nodeSkill: mapSkillIdToEnum(node.skill_id) || 'MODEL',
    position: index,
    planId: `virtual-skill-${userId}`
  }));
  
  return {
    id: `virtual-skill-${userId}`,
    title: "Plan Basado en Habilidades",
    description: "Plan que cubre diversas habilidades de aprendizaje",
    userId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetDate: null,
    nodes: planNodes
  };
}
