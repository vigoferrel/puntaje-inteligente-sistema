
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { ExerciseAttempt } from '@/types/lectoguia-types';
import { toast } from '@/components/ui/use-toast';
import { saveExerciseAttemptToDb } from '@/services/lectoguia-service';

type UpdateSkillLevelFn = (skill: string, isCorrect: boolean) => Promise<boolean>;

interface SaveExerciseResult {
  success: boolean;
  attempt: ExerciseAttempt | null;
  error?: string;
}

export function useExerciseHistory(
  initialHistory: ExerciseAttempt[],
  userId: string | null,
  updateSkillLevel: UpdateSkillLevelFn
) {
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseAttempt[]>(initialHistory);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveExerciseAttempt = async (
    exercise: Exercise, 
    selectedOption: number, 
    isCorrect: boolean,
    skill: string = 'INTERPRET_RELATE'
  ): Promise<SaveExerciseResult> => {
    if (!exercise) {
      setError("No exercise provided");
      return { success: false, attempt: null, error: "No exercise provided" };
    }
    
    if (!userId) {
      console.log('User not logged in, exercise attempt not saved');
      return { success: false, attempt: null, error: "User not logged in" };
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Save to Supabase and get new attempt
      const newAttempt = await saveExerciseAttemptToDb(
        userId,
        exercise,
        selectedOption,
        isCorrect,
        skill
      );
      
      if (!newAttempt) {
        throw new Error("Failed to save exercise attempt");
      }
      
      // Update local state
      setExerciseHistory(prev => [newAttempt, ...prev]);
      
      // Update skill level based on results
      await updateSkillLevel(skill, isCorrect).catch(err => {
        console.error("Failed to update skill level:", err);
      });
      
      return { success: true, attempt: newAttempt };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error saving exercise attempt';
      console.error('Error saving exercise attempt:', error);
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Failed to save exercise results. Please try again.",
        variant: "destructive"
      });
      return { success: false, attempt: null, error: errorMessage };
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
