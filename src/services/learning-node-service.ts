
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
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
        depends_on, estimated_time_minutes, skill_id, test_id,
        cognitive_level, subject_area, created_at, updated_at,
        skill:skill_id (id, name, code),
        test:test_id (id, name, code)
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
    
    // Then fetch nodes for those skills with all required data
    const { data: nodesData, error: nodesError } = await supabase
      .from('learning_nodes')
      .select(`
        id, code, title, description, difficulty, position, 
        depends_on, estimated_time_minutes, skill_id, test_id,
        cognitive_level, subject_area, created_at, updated_at,
        skill:skill_id (id, name, code),
        test:test_id (id, name, code)
      `)
      .in('skill_id', skillIds)
      .order('difficulty', { ascending: true })
      .limit(10); // Limit to avoid too many nodes
    
    if (nodesError) throw nodesError;
    
    if (!nodesData || nodesData.length === 0) {
      return [];
    }
    
    return nodesData.map(node => mapDbNodeToLearningNode(node));
  } catch (error) {
    console.error("Error fetching nodes by skills:", error);
    return [];
  }
};

/**
 * Maps a raw database node to the TLearningNode type with all required properties
 */
const mapDbNodeToLearningNode = (data: any): TLearningNode => {
  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    code: data.code || `${data.id.slice(0, 8)}`,
    position: data.position || 0,
    difficulty: data.difficulty || 'basic',
    estimatedTimeMinutes: data.estimated_time_minutes || 30,
    skill: data.skill?.code as TPAESHabilidad || 'MODEL',
    prueba: data.test?.code as TPAESPrueba || 'COMPETENCIA_LECTORA',
    skillId: data.skill_id || 1,
    testId: data.test_id || 1,
    dependsOn: data.depends_on || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    // Propiedades ahora requeridas con valores seguros
    cognitive_level: data.cognitive_level || 'COMPRENDER',
    subject_area: data.subject_area || data.test?.code || 'COMPETENCIA_LECTORA',
    content: {
      theory: '',
      examples: [],
      exerciseCount: 15
    } as any
  };
};
