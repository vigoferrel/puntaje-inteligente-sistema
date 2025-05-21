
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { Exercise } from "@/types/ai-types";
import { openRouterService } from "./openrouter-service";

export const generateExercise = async (
  skill: TPAESHabilidad,
  prueba: TPAESPrueba,
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
  previousExercises: Exercise[] = []
): Promise<Exercise | null> => {
  return await openRouterService<Exercise>({
    action: 'generate_exercise',
    payload: {
      skill,
      prueba,
      difficulty,
      previousExercises
    }
  });
};
