
import { useEffect } from 'react';
import { Exercise } from '@/types/ai-types';

interface UseExerciseProgressProps {
  exercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  isLoading: boolean;
  updateProgress: (progress: number) => void;
  completeExercise: () => void;
}

export function useExerciseProgress({
  exercise,
  selectedOption,
  showFeedback,
  isLoading,
  updateProgress,
  completeExercise
}: UseExerciseProgressProps) {
  
  // Efecto para progreso inicial
  useEffect(() => {
    if (!exercise || isLoading) {
      updateProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      if (!selectedOption && !showFeedback) {
        updateProgress(prev => Math.min(prev + 0.5, 50));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [exercise, selectedOption, showFeedback, isLoading, updateProgress]);
  
  // Efecto para selección de opción
  useEffect(() => {
    if (selectedOption !== null && !showFeedback) {
      updateProgress(75);
    }
  }, [selectedOption, showFeedback, updateProgress]);
  
  // Efecto para completar ejercicio
  useEffect(() => {
    if (showFeedback) {
      completeExercise();
    }
  }, [showFeedback, completeExercise]);
}
