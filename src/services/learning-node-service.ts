import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";
import { TLearningNode } from "@/types/system-types";

/**
 * Fetch a specific learning node by its ID
 */
export const fetchNodeById = async (nodeId: string): Promise<TLearningNode | null> => {
  try {
    const { data, error } = await supabase
      .from('learning_nodes')
      .select(`
        id, code, title, description, difficulty, position, 
        depends_on, estimated_time_minutes,
        skill:skill_id (id, name, code)
      `)
      .eq('id', nodeId)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return mapDbNodeToLearningNode(data);
  } catch (error) {
    console.error("Error fetching node by ID:", error);
    return null;
  }
};

/**
 * Fetch learning nodes by skills
 */
export const fetchNodesBySkills = async (skills: TPAESHabilidad[]): Promise<TLearningNode[]> => {
  try {
    // Fetch skill IDs first
    const { data: skillsData, error: skillsError } = await supabase
      .from('paes_skills')
      .select('id, code')
      .in('code', skills);
    
    if (skillsError) throw skillsError;
    
    if (!skillsData || skillsData.length === 0) {
      return [];
    }
    
    const skillIds = skillsData.map(s => s.id);
    
    // Then fetch nodes for those skills
    const { data: nodesData, error: nodesError } = await supabase
      .from('learning_nodes')
      .select(`
        id, code, title, description, difficulty, position, 
        depends_on, estimated_time_minutes,
        skill:skill_id (id, name, code)
      `)
      .in('skill_id', skillIds)
      .order('difficulty', { ascending: true })
      .limit(10); // Limit to avoid too many nodes
    
    if (nodesError) throw nodesError;
    
    if (!nodesData || nodesData.length === 0) {
      return [];
    }
    
    return nodesData.map(node => ({
      id: node.id,
      title: node.title,
      description: node.description || '',
      skill: node.skill?.code as TPAESHabilidad || 'MODEL',
      prueba: 'MATEMATICA_1', // Default value
      difficulty: node.difficulty || 'basic',
      position: node.position || 0,
      dependsOn: node.depends_on || [],
      estimatedTimeMinutes: node.estimated_time_minutes || 30,
      content: {
        theory: '',
        examples: [],
        exerciseCount: 15
      }
    }));
  } catch (error) {
    console.error("Error fetching nodes by skills:", error);
    return [];
  }
};

/**
 * Maps a raw database node to the TLearningNode type
 */
const mapDbNodeToLearningNode = (data: any): TLearningNode => {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    skill: data.skill?.code as TPAESHabilidad || 'MODEL',
    prueba: 'MATEMATICA_1', // Default value
    difficulty: data.difficulty || 'basic',
    position: data.position || 0,
    dependsOn: data.depends_on || [],
    estimatedTimeMinutes: data.estimated_time_minutes || 30,
    content: {
      theory: '',
      examples: [],
      exerciseCount: 15
    }
  };
};
