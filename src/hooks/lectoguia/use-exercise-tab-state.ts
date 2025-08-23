
import { useState, useEffect, useCallback } from 'react';
import { Exercise } from '@/types/ai-types';

export function useExerciseTabState() {
  const [exerciseProgress, setExerciseProgress] = useState(0);
  const [showCompletionCard, setShowCompletionCard] = useState(false);

  const resetState = useCallback(() => {
    setExerciseProgress(0);
    setShowCompletionCard(false);
  }, []);

  const updateProgress = useCallback((progress: number | ((prev: number) => number)) => {
    if (typeof progress === 'function') {
      setExerciseProgress(prev => Math.min(Math.max(progress(prev), 0), 100));
    } else {
      setExerciseProgress(Math.min(Math.max(progress, 0), 100));
    }
  }, []);

  const completeExercise = useCallback(() => {
    setExerciseProgress(100);
    setTimeout(() => setShowCompletionCard(true), 2000);
  }, []);

  return {
    exerciseProgress,
    showCompletionCard,
    resetState,
    updateProgress,
    completeExercise,
    setShowCompletionCard
  };
}
