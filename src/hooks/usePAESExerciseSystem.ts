
import { useState, useCallback } from 'react';

interface ExerciseSystemState {
  isLoading: boolean;
  currentExercise: any | null;
  progress: number;
  totalExercises: number;
}

export const usePAESExerciseSystem = () => {
  const [state, setState] = useState<ExerciseSystemState>({
    isLoading: false,
    currentExercise: null,
    progress: 0,
    totalExercises: 0
  });

  const generateExercise = useCallback((subject: string, difficulty: string) => {
    console.log(`Generando ejercicio de ${subject} con dificultad ${difficulty}`);
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Simulación de generación de ejercicio
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        currentExercise: {
          id: Math.random().toString(36).substr(2, 9),
          subject,
          difficulty,
          question: `Pregunta de ejemplo para ${subject}`,
          options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
          correctAnswer: 0
        }
      }));
    }, 1000);
  }, []);

  const submitAnswer = useCallback((answer: number) => {
    console.log(`Respuesta enviada: ${answer}`);
    setState(prev => ({
      ...prev,
      progress: prev.progress + 1
    }));
  }, []);

  return {
    ...state,
    generateExercise,
    submitAnswer
  };
};
