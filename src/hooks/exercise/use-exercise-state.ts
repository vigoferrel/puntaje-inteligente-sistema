
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { useExerciseGeneration } from './use-exercise-generation';
import { useExerciseInteraction } from './use-exercise-interaction';

/**
 * Hook que combina la generación de ejercicios y la interacción del usuario
 * con mejor manejo de errores y estados de carga
 */
export function useExerciseState() {
  const {
    currentExercise,
    setCurrentExercise,
    generateExercise,
    generateExerciseForNode,
    isLoading
  } = useExerciseGeneration();
  
  const {
    selectedOption,
    showFeedback,
    handleOptionSelect,
    resetInteraction
  } = useExerciseInteraction();
  
  // Estado de carga combinado
  const [processingAction, setProcessingAction] = useState(false);
  
  // Combina reseteo de interacción con cambio de ejercicio
  const resetExercise = () => {
    resetInteraction();
    // No limpiamos currentExercise para mantener la UI hasta que haya un nuevo ejercicio
  };
  
  // Función mejorada para generar un ejercicio con manejo de estados
  const generateExerciseWithState = async (skill: any, difficulty: string = "INTERMEDIATE") => {
    setProcessingAction(true);
    try {
      const result = await generateExercise(skill, difficulty);
      return result;
    } finally {
      setProcessingAction(false);
    }
  };
  
  // Función mejorada para generar un ejercicio para un nodo con manejo de estados
  const generateExerciseForNodeWithState = async (node: any) => {
    setProcessingAction(true);
    try {
      const result = await generateExerciseForNode(node);
      return result;
    } finally {
      setProcessingAction(false);
    }
  };
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    generateExercise: generateExerciseWithState,
    generateExerciseForNode: generateExerciseForNodeWithState,
    handleOptionSelect,
    resetExercise,
    setCurrentExercise,
    isLoading: isLoading || processingAction
  };
}
