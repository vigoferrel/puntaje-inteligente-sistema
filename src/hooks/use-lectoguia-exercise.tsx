
import { useExerciseState } from './exercise';
import { TPAESPrueba, TPAESHabilidad } from '@/types/system-types';

/**
 * Hook principal para gestionar los ejercicios de LectoGuia
 * Refactorizado para usar hooks más pequeños y específicos
 */
export function useLectoGuiaExercise() {
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise: genExercise,
    generateExerciseForNode,
    handleOptionSelect,
    resetExercise,
    setCurrentExercise,
    isLoading
  } = useExerciseState();
  
  // Envolvemos la función para asegurar que se procesa el tipo de prueba
  const generateExercise = async (skill: TPAESHabilidad, prueba?: TPAESPrueba, difficulty: string = "INTERMEDIATE") => {
    console.log(`LectoGuiaExercise: Generando ejercicio con skill=${skill}, prueba=${prueba || 'no especificada'}, difficulty=${difficulty}`);
    return await genExercise(skill, prueba, difficulty);
  };
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    generateExerciseForNode,
    handleOptionSelect: handleOptionSelect,
    resetExercise,
    setCurrentExercise,
    isLoading
  };
}
