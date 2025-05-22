
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { generateExercise as genExerciseFromAPI, generateExercisesBatch } from '@/services/openrouter/exercise-generation';
import { TPAESHabilidad, TPAESPrueba, TLearningNode } from '@/types/system-types';

/**
 * Hook para manejar la generación de ejercicios con mejor integración de tipos de prueba
 */
export function useExerciseGeneration() {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Generar un ejercicio nuevo
  const generateExercise = async (
    skill: TPAESHabilidad, 
    prueba?: TPAESPrueba, 
    difficulty: string = "INTERMEDIATE"
  ): Promise<Exercise | null> => {
    try {
      setIsLoading(true);
      
      console.log(`ExerciseGeneration: Generando ejercicio - skill=${skill}, prueba=${prueba || 'no especificada'}, difficulty=${difficulty}`);
      
      // Si no se especifica una prueba, inferir según la habilidad
      const effectivePrueba = prueba || inferPruebaFromSkill(skill);
      
      const exercise = await genExerciseFromAPI(skill, effectivePrueba, difficulty as any);
      
      // Asegurarse de que el ejercicio tiene la información de prueba correcta
      if (exercise) {
        exercise.prueba = effectivePrueba; // Garantizar que prueba está presente y es correcta
        setCurrentExercise(exercise);
        return exercise;
      }
      
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Generar un ejercicio para un nodo de aprendizaje
  const generateExerciseForNode = async (node: TLearningNode): Promise<Exercise | null> => {
    if (!node || !node.skill || !node.prueba) {
      console.error("Información insuficiente en el nodo para generar ejercicio");
      return null;
    }
    
    try {
      setIsLoading(true);
      
      // Generar ejercicio utilizando la información del nodo
      const exercise = await genExerciseFromAPI(
        node.skill,
        node.prueba,
        node.difficulty as any
      );
      
      if (exercise) {
        // Vincular el ejercicio con el nodo
        exercise.nodeId = node.id;
        exercise.nodeName = node.title;
        exercise.prueba = node.prueba;
        
        setCurrentExercise(exercise);
        return exercise;
      }
      
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio para nodo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Inferir el tipo de prueba según la habilidad
  const inferPruebaFromSkill = (skill: TPAESHabilidad): TPAESPrueba => {
    // Mapeo de habilidades a pruebas
    const skillToPruebaMap: Record<TPAESHabilidad, TPAESPrueba> = {
      'TRACK_LOCATE': 'COMPETENCIA_LECTORA',
      'INTERPRET_RELATE': 'COMPETENCIA_LECTORA',
      'EVALUATE_REFLECT': 'COMPETENCIA_LECTORA',
      'SOLVE_PROBLEMS': 'MATEMATICA_1', // Por defecto usar Mat 1, puede ser sobreescrito
      'REPRESENT': 'MATEMATICA_1',
      'MODEL': 'MATEMATICA_2',
      'ARGUE_COMMUNICATE': 'MATEMATICA_2',
      'IDENTIFY_THEORIES': 'CIENCIAS',
      'PROCESS_ANALYZE': 'CIENCIAS',
      'APPLY_PRINCIPLES': 'CIENCIAS',
      'SCIENTIFIC_ARGUMENT': 'CIENCIAS',
      'TEMPORAL_THINKING': 'HISTORIA',
      'SOURCE_ANALYSIS': 'HISTORIA',
      'MULTICAUSAL_ANALYSIS': 'HISTORIA',
      'CRITICAL_THINKING': 'HISTORIA',
      'REFLECTION': 'HISTORIA'
    };
    
    return skillToPruebaMap[skill] || 'COMPETENCIA_LECTORA';
  };

  return {
    currentExercise,
    setCurrentExercise,
    generateExercise,
    generateExerciseForNode,
    isLoading
  };
}
