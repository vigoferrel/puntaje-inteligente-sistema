
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";
// Importamos directamente desde supabase-mappers para evitar problemas con el archivo barril
import { mapSkillIdToEnum, mapTestIdToEnum } from "@/utils/supabase-mappers";

/**
 * Maps database nodes to frontend type
 */
export const mapDatabaseNodeToLearningNode = (node: any): TLearningNode => {
  // Verificamos los valores de entrada para diagnóstico
  console.log('Mapeando nodo desde DB:', {
    id: node.id,
    skill_id: node.skill_id,
    test_id: node.test_id
  });

  // Mapeo seguro para skill_id
  let skill;
  try {
    skill = mapSkillIdToEnum(node.skill_id);
  } catch (e) {
    console.error(`Error mapeando skill_id ${node.skill_id}:`, e);
    skill = 'MODEL'; // valor por defecto
  }
  
  // Mapeo seguro para test_id
  let prueba;
  try {
    prueba = mapTestIdToEnum(node.test_id);
  } catch (e) {
    console.error(`Error mapeando test_id ${node.test_id}:`, e);
    prueba = 'COMPETENCIA_LECTORA'; // valor por defecto
  }

  return {
    id: node.id,
    title: node.title,
    description: node.description || '',
    skill: skill,
    prueba: prueba,
    difficulty: node.difficulty,
    position: node.position,
    dependsOn: node.depends_on || [],
    estimatedTimeMinutes: node.estimated_time_minutes || 30,
    content: {
      theory: '',
      examples: [],
      exerciseCount: 15
    }
  };
};
