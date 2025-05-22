
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { Exercise } from "@/types/ai-types";
import { generateExercise as generateExerciseApi } from "@/services/openrouter/exercise-generation";

export const generateExercise = async (
  skill: TPAESHabilidad,
  prueba: TPAESPrueba,
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED',
  previousExercises: Exercise[] = []
): Promise<Exercise | null> => {
  return await generateExerciseApi(skill, prueba, difficulty, previousExercises);
};
