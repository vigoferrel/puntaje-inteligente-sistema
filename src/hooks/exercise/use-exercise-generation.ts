
// DEPRECATED: Hook simulado reemplazado por useExerciseGenerationReal
// Este archivo se mantiene solo para compatibilidad durante la migración

import { useExerciseGenerationReal } from './use-exercise-generation-real';

export const useExerciseGeneration = () => {
  // Redirigir al hook real
  return useExerciseGenerationReal();
};
