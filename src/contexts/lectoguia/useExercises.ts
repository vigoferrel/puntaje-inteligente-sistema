
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';
import { Exercise } from '@/types/ai-types';
import { supabase } from '@/integrations/supabase/client';
import { UseExerciseState } from './types';
import { v4 as uuidv4 } from 'uuid';
import { TPAESHabilidad } from '@/types/system-types';

export function useExercises(userId: string | null, updateSkill: (skillId: number, isCorrect: boolean) => Promise<void>, getSkillIdFromCode: (skillCode: TPAESHabilidad) => number | null) {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Manejo de opciones de ejercicio
  const handleOptionSelect = useCallback((index: number) => {
    if (showFeedback || !currentExercise) return;
    
    setSelectedOption(index);
    setShowFeedback(true);
    
    // Encontrar la respuesta correcta
    const correctAnswerIndex = currentExercise.options.findIndex(
      option => option === currentExercise.correctAnswer
    );
    
    const isCorrect = index === correctAnswerIndex;
    
    // Actualizar nivel de habilidad si el usuario está autenticado
    if (userId && currentExercise.skill) {
      // Guardar en la base de datos
      saveExerciseAttempt(currentExercise, index, isCorrect);
    }
  }, [currentExercise, showFeedback, userId]);
  
  // Guardar intento de ejercicio en la base de datos usando la nueva tabla
  const saveExerciseAttempt = useCallback(async (exercise: Exercise, selectedOption: number, isCorrect: boolean) => {
    if (!userId || !exercise) return;
    
    try {
      // Usar la nueva tabla user_exercise_attempts
      await supabase.from('user_exercise_attempts').insert({
        user_id: userId,
        exercise_id: exercise.id || uuidv4(),
        answer: selectedOption.toString(),
        is_correct: isCorrect,
        skill_demonstrated: exercise.skill as TPAESHabilidad,
        created_at: new Date().toISOString()
      });
      
      // Actualizar nivel de habilidad en la base de datos
      if (exercise.skill) {
        const skillId = getSkillIdFromCode(exercise.skill as TPAESHabilidad);
        if (skillId) {
          updateSkill(skillId, isCorrect);
        }
      }
    } catch (error) {
      console.error("Error al guardar intento de ejercicio:", error);
    }
  }, [userId, getSkillIdFromCode, updateSkill]);
  
  // Manejador para nuevo ejercicio
  const handleNewExercise = useCallback(() => {
    setSelectedOption(null);
    setShowFeedback(false);
    // generateExercise será implementado en el provider
    console.log("New exercise requested");
  }, []);
  
  return {
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    isLoading,
    setCurrentExercise,
    setIsLoading
  };
}
