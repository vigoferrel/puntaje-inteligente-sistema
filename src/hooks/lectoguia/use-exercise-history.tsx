
import { useState } from 'react';
import { Exercise } from '@/types/ai-types';
import { ExerciseAttempt } from '@/types/lectoguia-types';
import { toast } from '@/components/ui/use-toast';
import { saveExerciseAttemptToDb } from '@/services/lectoguia-service';

export function useExerciseHistory(
  initialHistory: ExerciseAttempt[],
  userId: string | null,
  updateSkillLevel: (skill: string, isCorrect: boolean) => Promise<void>
) {
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseAttempt[]>(initialHistory);

  const saveExerciseAttempt = async (
    exercise: Exercise, 
    selectedOption: number, 
    isCorrect: boolean,
    skill: string = 'INTERPRET_RELATE'
  ) => {
    if (!userId) {
      // Si no ha iniciado sesión, solo registrar y no guardar
      console.log('Usuario no ha iniciado sesión, intento de ejercicio no guardado');
      return;
    }
    
    try {
      // Guardar en Supabase y obtener el nuevo intento
      const newAttempt = await saveExerciseAttemptToDb(
        userId,
        exercise,
        selectedOption,
        isCorrect,
        skill
      );
      
      // Actualizar el estado local
      setExerciseHistory(prev => [newAttempt, ...prev]);
      
      // Actualizar nivel de habilidad basado en resultados
      await updateSkillLevel(skill, isCorrect);
      
      return newAttempt;
    } catch (error) {
      console.error('Error al guardar intento de ejercicio:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar los resultados del ejercicio",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    exerciseHistory,
    saveExerciseAttempt,
    setExerciseHistory
  };
}
