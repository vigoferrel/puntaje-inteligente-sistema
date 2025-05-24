
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { getSkillId } from "@/utils/lectoguia-utils";
import { testIdToPrueba } from "@/types/paes-types";
import { autoCorrectNodeIssues } from "@/utils/node-validation";

/**
 * Maps database nodes to frontend type with improved consistency and auto-correction
 * ACTUALIZADO POST-MIGRACIÓN
 */
export const mapDatabaseNodeToLearningNode = (node: any): TLearningNode => {
  console.log('Mapeando nodo desde DB con auto-corrección POST-MIGRACIÓN:', {
    id: node.id,
    skill_id: node.skill_id,
    test_id: node.test_id,
    subject_area: node.subject_area,
    cognitive_level: node.cognitive_level
  });

  // Mapeo mejorado de skill_id con validación por test ACTUALIZADO
  let skill: TPAESHabilidad = 'MODEL';
  
  if (node.skill && node.skill.code) {
    skill = node.skill.code as TPAESHabilidad;
  } else if (node.skill_id) {
    try {
      const skillMap: Record<number, TPAESHabilidad> = {
        // COMPETENCIA_LECTORA (test_id: 1)
        1: 'TRACK_LOCATE',
        2: 'INTERPRET_RELATE', 
        3: 'EVALUATE_REFLECT',
        // MATEMATICA_1 y MATEMATICA_2 (test_id: 2, 3)
        4: 'SOLVE_PROBLEMS',
        5: 'REPRESENT',
        6: 'MODEL',
        7: 'ARGUE_COMMUNICATE',
        // CIENCIAS (test_id: 5) - CORREGIDO
        8: 'IDENTIFY_THEORIES',
        9: 'PROCESS_ANALYZE',
        10: 'APPLY_PRINCIPLES',
        11: 'SCIENTIFIC_ARGUMENT',
        // HISTORIA (test_id: 4) - CORREGIDO
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
  
  // Mapeo seguro para test_id a prueba con validación actualizada
  let prueba: TPAESPrueba = 'COMPETENCIA_LECTORA';
  
  try {
    if (node.test_id) {
      prueba = testIdToPrueba(node.test_id);
    }
  } catch (e) {
    console.error(`Error mapeando test_id ${node.test_id}:`, e);
  }

  // Crear nodo base
  const baseNode: TLearningNode = {
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
    cognitive_level: node.cognitive_level || 'COMPRENDER',
    subject_area: node.subject_area || prueba,
    code: node.code || `${node.id.slice(0, 8)}`,
    skillId: node.skill_id || 1,
    testId: node.test_id || 1,
    createdAt: node.created_at,
    updatedAt: node.updated_at
  };

  // Aplicar auto-corrección con validaciones actualizadas
  const correctedNode = autoCorrectNodeIssues(baseNode);
  
  if (JSON.stringify(baseNode) !== JSON.stringify(correctedNode)) {
    console.log(`🔧 Nodo auto-corregido POST-MIGRACIÓN: ${correctedNode.title}`);
  }

  return correctedNode;
};

/**
 * Función mejorada para mapear skills y pruebas con validación ACTUALIZADA
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
    console.warn(`Skill ID ${skillId} not found in mapping, using MODEL as fallback`);
    return 'MODEL';
  }
  
  return skillMap[skillId];
};

export const mapTestIdToEnum = (testId: number): TPAESPrueba => {
  try {
    return testIdToPrueba(testId);
  } catch (e) {
    console.warn(`Test ID ${testId} not found in mapping, using COMPETENCIA_LECTORA as fallback`);
    return 'COMPETENCIA_LECTORA';
  }
};

/**
 * Validar coherencia entre skill_id y test_id ACTUALIZADO POST-MIGRACIÓN
 */
export const validateSkillTestCoherence = (skillId: number, testId: number): boolean => {
  const validSkillsByTest: Record<number, number[]> = {
    1: [1, 2, 3], // COMPETENCIA_LECTORA
    2: [4, 5, 6, 7], // MATEMATICA_1
    3: [4, 5, 6, 7], // MATEMATICA_2
    4: [12, 13, 14, 15, 16], // HISTORIA (CORREGIDO)
    5: [8, 9, 10, 11] // CIENCIAS (CORREGIDO)
  };
  
  const validSkills = validSkillsByTest[testId];
  const isValid = validSkills ? validSkills.includes(skillId) : false;
  
  if (!isValid) {
    console.warn(`⚠️ Skill ID ${skillId} no es válido para test_id ${testId}. Válidos: ${validSkills?.join(', ') || 'ninguno'}`);
  }
  
  return isValid;
};
