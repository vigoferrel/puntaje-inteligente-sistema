
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { useExerciseGeneration } from './use-exercise-generation';
import { useExerciseInteraction } from './use-exercise-interaction';

/**
 * Hook que combina la generación de ejercicios y la interacción del usuario
 */
export function useExerciseState() {
  const {
    currentExercise,
    setCurrentExercise,
    generateExercise,
    generateExerciseForNode
  } = useExerciseGeneration();
  
  const {
    selectedOption,
    showFeedback,
    handleOptionSelect,
    resetInteraction
  } = useExerciseInteraction();
  
  // Combina reseteo de interacción con cambio de ejercicio
  const resetExercise = () => {
    resetInteraction();
    // No limpiamos currentExercise para mantener la UI hasta que haya un nuevo ejercicio
  };
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise,
    generateExerciseForNode,
    handleOptionSelect,
    resetExercise,
    setCurrentExercise
  };
}
