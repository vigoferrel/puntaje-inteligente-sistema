
import { supabase } from '@/integrations/supabase/client';
import { ExerciseAttempt, UserPreference } from '@/types/lectoguia-types';
import { Exercise } from '@/types/ai-types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchUserExerciseHistory(userId: string): Promise<ExerciseAttempt[]> {
  if (!userId) {
    throw new Error("User ID is required to fetch exercise history");
  }

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
  if (!userId) {
    throw new Error("User ID is required to fetch preferences");
  }

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
  if (!userId) {
    throw new Error("User ID is required to fetch skill levels");
  }

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
  if (!userId) throw new Error("User ID is required to save exercise attempt");
  if (!exercise) throw new Error("Exercise data is required");
  if (selectedOption === undefined || selectedOption === null) throw new Error("Selected option is required");
  if (isCorrect === undefined) throw new Error("isCorrect value is required");
  if (!skillType) throw new Error("Skill type is required");

  const attemptId = uuidv4();
  const exerciseId = exercise.id || uuidv4();
  
  // Prepare data for saving
  const attemptData = {
    id: attemptId,
    user_id: userId,
    exercise_id: exerciseId,
    selected_option: selectedOption,
    is_correct: isCorrect,
    skill_type: skillType,
    completed_at: new Date().toISOString()
  };
  
  // Save to Supabase
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
  if (!userId) throw new Error("User ID is required to update skill level");
  if (!skillId) throw new Error("Skill ID is required");
  if (newLevel === undefined || newLevel === null) throw new Error("New skill level is required");
  
  // Validate level range
  if (newLevel < 0 || newLevel > 1) {
    throw new Error("Skill level must be between 0 and 1");
  }

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
  if (!userId) throw new Error("User ID is required to save preference");
  if (!key) throw new Error("Preference key is required");
  if (value === undefined) throw new Error("Preference value is required");
  
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
