
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { ExerciseAttempt } from '@/types/lectoguia-types';
import { Exercise } from '@/types/ai-types';
import { saveExerciseAttemptToDb } from '@/services/lectoguia-service';

export function useExerciseHistory(
  initialHistory: ExerciseAttempt[],
  userId: string | null,
  updateSkillLevel: (skillCode: string, isCorrect: boolean) => Promise<boolean>
) {
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseAttempt[]>(initialHistory);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveExerciseAttempt = async (
    exerciseId: string,
    selectedOption: number,
    isCorrect: boolean,
    timeTakenMs: number,
    metadata: {
      skillType: string;
      prueba: string;
    }
  ): Promise<ExerciseAttempt | null> => {
    if (!userId) {
      setError("No user ID provided. User must be logged in to save exercise attempts.");
      return null;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Create exercise object for the service
      const exercise: Exercise = {
        id: exerciseId,
        question: 'Generated Exercise',
        options: [],
        correctAnswer: '',
        explanation: '',
        skill: metadata.skillType,
        difficulty: 'intermediate'
      };
      
      // Save to database using existing service
      const attempt = await saveExerciseAttemptToDb(
        userId,
        exercise,
        selectedOption,
        isCorrect,
        metadata.skillType,
        metadata.prueba
      );
      
      // Update local state
      setExerciseHistory(prev => [attempt, ...prev]);
      
      // Update skill level based on performance
      await updateSkillLevel(metadata.skillType, isCorrect);
      
      return attempt;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving exercise attempt';
      console.error('Error saving exercise attempt:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to save exercise attempt. Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  return {
    exerciseHistory,
    saveExerciseAttempt,
    setExerciseHistory,
    saving,
    error
  };
}
