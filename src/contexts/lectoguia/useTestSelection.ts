
import { useState, useCallback } from 'react';
import { TPAESPrueba } from '@/types/system-types';

export function useTestSelection() {
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  
  const handlePruebaChange = useCallback((prueba: TPAESPrueba) => {
    setSelectedPrueba(prueba);
  }, []);
  
  // Mapeo de prueba a testId
  const getTestIdFromPrueba = useCallback((prueba: TPAESPrueba): number => {
    const pruebaToTestId = {
      'COMPETENCIA_LECTORA': 1,
      'MATEMATICA_1': 2,
      'MATEMATICA_2': 3,
      'CIENCIAS': 4,
      'HISTORIA': 5
    };
    return pruebaToTestId[prueba];
  }, []);
  
  return {
    selectedPrueba,
    handlePruebaChange,
    getTestIdFromPrueba
  };
}
