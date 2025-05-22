
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode } from "@/types/system-types";
// Importamos desde el archivo barril para asegurar las exportaciones
import { mapSkillIdToEnum, mapTestIdToEnum } from "@/utils/mappers";

/**
 * Maps database nodes to frontend type
 */
export const mapDatabaseNodeToLearningNode = (node: any): TLearningNode => {
  return {
    id: node.id,
    title: node.title,
    description: node.description || '',
    skill: mapSkillIdToEnum(node.skill_id),
    prueba: mapTestIdToEnum(node.test_id),
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
