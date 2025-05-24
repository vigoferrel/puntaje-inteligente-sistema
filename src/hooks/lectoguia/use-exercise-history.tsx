
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
    exercise: Exercise,
    selectedOption: number,
    isCorrect: boolean,
    skillType: string = 'INTERPRET_RELATE',
    prueba: string = 'COMPETENCIA_LECTORA'
  ): Promise<ExerciseAttempt | null> => {
    if (!userId) {
      setError("No user ID provided. User must be logged in to save exercise attempts.");
      return null;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Save to database using existing table
      const attempt = await saveExerciseAttemptToDb(
        userId,
        exercise,
        selectedOption,
        isCorrect,
        skillType,
        prueba
      );
      
      // Update local state
      setExerciseHistory(prev => [attempt, ...prev]);
      
      // Update skill level based on performance
      await updateSkillLevel(skillType, isCorrect);
      
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
