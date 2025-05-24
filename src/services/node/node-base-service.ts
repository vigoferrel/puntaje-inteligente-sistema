
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { getSkillId } from "@/utils/lectoguia-utils";
import { testIdToPrueba } from "@/types/paes-types";

/**
 * Maps database nodes to frontend type with improved consistency
 */
export const mapDatabaseNodeToLearningNode = (node: any): TLearningNode => {
  console.log('Mapeando nodo desde DB:', {
    id: node.id,
    skill_id: node.skill_id,
    test_id: node.test_id,
    subject_area: node.subject_area,
    cognitive_level: node.cognitive_level
  });

  // Mapeo seguro para skill_id
  let skill: TPAESHabilidad = 'MODEL';
  
  if (node.skill && node.skill.code) {
    skill = node.skill.code as TPAESHabilidad;
  } else if (node.skill_id) {
    try {
      const skillMap: Record<number, TPAESHabilidad> = {
        1: 'TRACK_LOCATE',
        2: 'INTERPRET_RELATE',
        3: 'EVALUATE_REFLECT',
        4: 'SOLVE_PROBLEMS',
        5: 'REPRESENT',
        6: 'MODEL',
        7: 'ARGUE_COMMUNICATE',
        8: 'IDENTIFY_THEORIES',
        9: 'PROCESS_ANALYZE',
        10: 'APPLY_PRINCIPLES',
        11: 'SCIENTIFIC_ARGUMENT',
        12: 'TEMPORAL_THINKING',
        13: 'SOURCE_ANALYSIS',
        14: 'MULTICAUSAL_ANALYSIS',
        15: 'CRITICAL_THINKING',
        16: 'REFLECTION'
      };
      
      skill = skillMap[node.skill_id] || 'MODEL';
    } catch (e) {
      console.error(`Error mapeando skill_id ${node.skill_id}:`, e);
    }
  }
  
  // Mapeo seguro para test_id a prueba
  let prueba: TPAESPrueba = 'COMPETENCIA_LECTORA';
  
  try {
    if (node.test_id) {
      prueba = testIdToPrueba(node.test_id);
    }
  } catch (e) {
    console.error(`Error mapeando test_id ${node.test_id}:`, e);
  }

  // Asegurar coherencia entre subject_area y prueba
  const subject_area = node.subject_area || prueba;
  const cognitive_level = node.cognitive_level || 'COMPRENDER';

  return {
    id: node.id,
    title: node.title,
    description: node.description || '',
    skill,
    prueba,
    difficulty: node.difficulty || 'basic',
    position: node.position || 0,
    dependsOn: node.depends_on || [],
    estimatedTimeMinutes: node.estimated_time_minutes || 30,
    content: {
      theory: node.content?.theory || '',
      examples: node.content?.examples || [],
      exerciseCount: node.content?.exerciseCount || 15
    } as any,
    // Propiedades ahora requeridas con valores seguros
    cognitive_level,
    subject_area,
    code: node.code || `${node.id.slice(0, 8)}`,
    skillId: node.skill_id || 1,
    testId: node.test_id || 1,
    createdAt: node.created_at,
    updatedAt: node.updated_at
  };
};

/**
 * Función mejorada para mapear skills y pruebas
 */
export const mapSkillIdToEnum = (skillId: number): TPAESHabilidad => {
  const skillMap: Record<number, TPAESHabilidad> = {
    1: 'TRACK_LOCATE',
    2: 'INTERPRET_RELATE',
    3: 'EVALUATE_REFLECT',
    4: 'SOLVE_PROBLEMS',
    5: 'REPRESENT',
    6: 'MODEL',
    7: 'ARGUE_COMMUNICATE',
    8: 'IDENTIFY_THEORIES',
    9: 'PROCESS_ANALYZE',
    10: 'APPLY_PRINCIPLES',
    11: 'SCIENTIFIC_ARGUMENT',
    12: 'TEMPORAL_THINKING',
    13: 'SOURCE_ANALYSIS',
    14: 'MULTICAUSAL_ANALYSIS',
    15: 'CRITICAL_THINKING',
    16: 'REFLECTION'
  };
  
  if (!skillMap[skillId]) {
    throw new Error(`Skill ID ${skillId} not found in mapping`);
  }
  
  return skillMap[skillId];
};

export const mapTestIdToEnum = (testId: number): TPAESPrueba => {
  return testIdToPrueba(testId);
};
