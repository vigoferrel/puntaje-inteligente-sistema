
import { useExerciseState } from './exercise';

/**
 * Hook principal para gestionar los ejercicios de LectoGuia
 * Refactorizado para usar hooks más pequeños y específicos
 */
export function useLectoGuiaExercise() {
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    generateExerciseForNode,
    handleOptionSelect,
    resetExercise,
    setCurrentExercise
  } = useExerciseState();
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    generateExerciseForNode,
    handleOptionSelect: handleOptionSelect,
    resetExercise,
    setCurrentExercise
  };
}
