import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/types/ai-types';
import { ExerciseAttempt } from '@/types/lectoguia-types';
import { TPAESHabilidad } from '@/types/system-types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchUserExerciseHistory(userId: string): Promise<ExerciseAttempt[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch exercise history");
  }

  // Use the existing user_exercise_attempts table
  const { data, error } = await supabase
    .from('user_exercise_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Transform the data to match ExerciseAttempt interface
  return data ? data.map((attempt: any) => ({
    id: attempt.id,
    exerciseId: attempt.exercise_id,
    userId: attempt.user_id,
    selectedOption: parseInt(attempt.answer) || 0, // Convert string answer to number
    isCorrect: attempt.is_correct,
    skillType: attempt.skill_demonstrated || 'INTERPRET_RELATE',
    prueba: 'COMPETENCIA_LECTORA', // Default fallback
    completedAt: attempt.created_at
  })) : [];
}

export async function saveExerciseAttemptToDb(
  userId: string,
  exercise: Exercise,
  selectedOption: number,
  isCorrect: boolean,
  skillType: string,
  prueba: string = 'COMPETENCIA_LECTORA'
): Promise<ExerciseAttempt> {
  console.log(`Saving attempt with prueba: ${prueba}`);
  
  // Convertir exercise.id a string si es necesario
  const exerciseId = typeof exercise.id === 'string' ? exercise.id : String(exercise.id || uuidv4());
  
  // Use the existing user_exercise_attempts table
  const { data, error } = await supabase
    .from('user_exercise_attempts')
    .insert({
      user_id: userId,
      exercise_id: exerciseId,
      answer: selectedOption.toString(), // Convert number to string for answer field
      is_correct: isCorrect,
      skill_demonstrated: skillType as TPAESHabilidad
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    exerciseId: data.exercise_id,
    userId: data.user_id,
    selectedOption: parseInt(data.answer) || 0,
    isCorrect: data.is_correct,
    skillType: data.skill_demonstrated || skillType,
    prueba: prueba,
    completedAt: data.created_at
  };
}

export async function fetchUserPreferences(userId: string): Promise<Record<string, string>> {
  if (!userId) {
    return {};
  }

  // Use the profiles table to store preferences as a JSON field
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.warn('User profile not found, returning empty preferences');
    return {};
  }
  
  // For now, return empty preferences since we don't have a preferences JSON field
  // This can be extended later by adding a preferences jsonb column to profiles
  return {};
}

export async function saveUserPreference(userId: string, key: string, value: string): Promise<boolean> {
  // For now, we'll just log the preference save attempt
  // This can be implemented later by adding a preferences jsonb column to profiles
  console.log(`Preference save attempt: ${userId} - ${key}: ${value}`);
  return true;
}

export async function fetchSkillLevels(userId: string): Promise<Record<string, number>> {
  if (!userId) {
    return {};
  }

  // Calculate skill levels from user_exercise_attempts
  const { data: attempts, error } = await supabase
    .from('user_exercise_attempts')
    .select('skill_demonstrated, is_correct')
    .eq('user_id', userId);
  
  if (error) {
    console.warn('Error fetching skill levels:', error);
    return {};
  }
  
  // Calculate skill levels based on performance
  const skillLevels: Record<string, number> = {};
  const skillStats: Record<string, { correct: number; total: number }> = {};
  
  if (attempts) {
    attempts.forEach((attempt: any) => {
      if (attempt.skill_demonstrated) {
        const skill = attempt.skill_demonstrated as string;
        if (!skillStats[skill]) {
          skillStats[skill] = { correct: 0, total: 0 };
        }
        skillStats[skill].total += 1;
        if (attempt.is_correct) {
          skillStats[skill].correct += 1;
        }
      }
    });
    
    // Convert stats to levels (0-1 range)
    Object.entries(skillStats).forEach(([skill, stats]) => {
      skillLevels[skill] = stats.total > 0 ? stats.correct / stats.total : 0;
    });
  }
  
  return skillLevels;
}

export async function updateSkillLevelInDb(userId: string, skillId: number, newLevel: number): Promise<boolean> {
  // Since we don't have a user_skill_levels table, we'll track skill levels
  // dynamically through user_exercise_attempts. This function is kept for
  // compatibility but doesn't need to do anything since skill levels are calculated.
  console.log(`Skill level update: user ${userId}, skill ${skillId}, level ${newLevel}`);
  return true;
}
