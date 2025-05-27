
import { useState, useCallback } from 'react';

interface LectoGuiaState {
  isActive: boolean;
  currentText: string | null;
  exercises: any[];
  progress: number;
}

export const useLectoGuiaSimplified = () => {
  const [state, setState] = useState<LectoGuiaState>({
    isActive: false,
    currentText: null,
    exercises: [],
    progress: 0
  });

  const startSession = useCallback(() => {
    setState(prev => ({ ...prev, isActive: true }));
  }, []);

  const endSession = useCallback(() => {
    setState(prev => ({ ...prev, isActive: false }));
  }, []);

  const loadText = useCallback((textId: string) => {
    console.log(`Cargando texto: ${textId}`);
    setState(prev => ({
      ...prev,
      currentText: `Texto de ejemplo ${textId}`
    }));
  }, []);

  return {
    ...state,
    startSession,
    endSession,
    loadText
  };
};
