
import { supabase } from '@/integrations/supabase/client';
import { ExerciseAttempt, UserPreference } from '@/types/lectoguia-types';
import { Exercise } from '@/types/ai-types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchUserExerciseHistory(userId: string): Promise<ExerciseAttempt[]> {
  const { data, error } = await supabase
    .from('lectoguia_exercise_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) throw error;
  
  return data ? data.map((attempt: any) => ({
    id: attempt.id,
    exerciseId: attempt.exercise_id,
    userId: attempt.user_id,
    selectedOption: attempt.selected_option,
    isCorrect: attempt.is_correct,
    skillType: attempt.skill_type,
    completedAt: attempt.completed_at
  })) : [];
}

export async function fetchUserPreferences(userId: string): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from('lectoguia_user_preferences')
    .select('key, value')
    .eq('user_id', userId);
    
  if (error) throw error;
  
  const preferences: Record<string, string> = {};
  if (data) {
    data.forEach((pref: UserPreference) => {
      preferences[pref.key] = pref.value;
    });
  }
  
  return preferences;
}

export async function fetchSkillLevels(userId: string): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('user_skill_levels')
    .select('skill_id, level')
    .eq('user_id', userId);
    
  if (error) throw error;
  
  const skillLevels: Record<string, number> = {
    'TRACK_LOCATE': 0,
    'INTERPRET_RELATE': 0, 
    'EVALUATE_REFLECT': 0
  };
  
  if (data) {
    data.forEach(skill => {
      if (skill.skill_id === 1) skillLevels['TRACK_LOCATE'] = skill.level;
      if (skill.skill_id === 2) skillLevels['INTERPRET_RELATE'] = skill.level;
      if (skill.skill_id === 3) skillLevels['EVALUATE_REFLECT'] = skill.level;
    });
  }
  
  return skillLevels;
}

export async function saveExerciseAttemptToDb(
  userId: string,
  exercise: Exercise, 
  selectedOption: number, 
  isCorrect: boolean,
  skillType: string
): Promise<ExerciseAttempt> {
  const attemptId = uuidv4();
  const exerciseId = exercise.id || uuidv4();
  
  // Preparar los datos para guardar
  const attemptData = {
    id: attemptId,
    user_id: userId,
    exercise_id: exerciseId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    skill_type: skillType,
    completed_at: new Date().toISOString()
  };
  
  // Guardar en Supabase
  const { error } = await supabase
    .from('lectoguia_exercise_attempts')
    .insert(attemptData);
  
  if (error) throw error;
  
  const newAttempt: ExerciseAttempt = {
    id: attemptId,
    exerciseId: exerciseId,
    userId: userId,
    selectedOption,
    isCorrect,
    skillType: skillType,
    completedAt: new Date().toISOString()
  };
  
  return newAttempt;
}

export async function updateSkillLevelInDb(
  userId: string,
  skillId: number,
  newLevel: number
): Promise<void> {
  const { error } = await supabase
    .from('user_skill_levels')
    .upsert({
      user_id: userId,
      skill_id: skillId,
      level: newLevel
    });
  
  if (error) throw error;
}

export async function saveUserPreference(
  userId: string,
  key: string,
  value: string
): Promise<void> {
  const preferenceData = {
    user_id: userId,
    key,
    value
  };
  
  const { error } = await supabase
    .from('lectoguia_user_preferences')
    .upsert(preferenceData);
  
  if (error) throw error;
}
