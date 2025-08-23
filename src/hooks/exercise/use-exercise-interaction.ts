
import { useState } from 'react';

/**
 * Hook para manejar las interacciones del usuario con el ejercicio
 */
export function useExerciseInteraction() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Manejar la selección de una opción
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setShowFeedback(true);
  };
  
  // Resetear el estado de interacción
  const resetInteraction = () => {
    setSelectedOption(null);
    setShowFeedback(false);
  };
  
  return {
    selectedOption,
    showFeedback,
    handleOptionSelect,
    resetInteraction
  };
}
