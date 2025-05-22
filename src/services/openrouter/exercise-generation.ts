
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { Exercise } from "@/types/ai-types";
import { openRouterService } from "./core";

/**
 * Genera un ejercicio específico
 */
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

/**
 * Genera un lote de ejercicios para un nodo y habilidad específicos
 */
export const generateExercisesBatch = async (
  nodeId: string,
  skill: string,
  testId: number,
  count: number = 5,
  difficulty: string = 'INTERMEDIATE'
): Promise<Exercise[]> => {
  try {
    console.log(`Generando lote de ${count} ejercicios para skill ${skill}, testId ${testId}`);
    
    const result = await openRouterService<Exercise[]>({
      action: 'generate_exercises_batch',
      payload: {
        nodeId,
        skill,
        testId,
        count,
        difficulty,
        retry: true,
        retryCount: 0
      }
    });
    
    if (!result || !Array.isArray(result)) {
      console.error('No se generaron ejercicios en el lote o el formato es inválido');
      return [];
    }
    
    console.log(`Generados ${result.length} ejercicios para el nodo ${nodeId}`);
    return result;
  } catch (error) {
    console.error('Error al generar lote de ejercicios:', error);
    return [];
  }
};
