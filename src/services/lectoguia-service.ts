
import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/types/ai-types';
import { ExerciseAttempt } from '@/types/lectoguia-types';
import { TPAESHabilidad } from '@/types/system-types';

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
    prueba: attempt.prueba || 'COMPETENCIA_LECTORA', // Include prueba with fallback
    completedAt: attempt.completed_at
  })) : [];
}

// Add the missing exports for functions referenced in the hooks
export async function saveExerciseAttemptToDb(
  userId: string,
  exercise: Exercise,
  selectedOption: number,
  isCorrect: boolean,
  skillType: string,
  prueba: string = 'COMPETENCIA_LECTORA'
): Promise<ExerciseAttempt> {
  console.log(`Saving attempt with prueba: ${prueba}`);
  
  const { data, error } = await supabase
    .from('lectoguia_exercise_attempts')
    .insert({
      user_id: userId,
      exercise_id: exercise.id,
      selected_option: selectedOption,
      is_correct: isCorrect,
      skill_type: skillType,
      prueba: prueba
    })
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    id: data.id,
    exerciseId: data.exercise_id,
    userId: data.user_id,
    selectedOption: data.selected_option,
    isCorrect: data.is_correct,
    skillType: data.skill_type,
    prueba: data.prueba,
    completedAt: data.completed_at
  };
}

export async function fetchUserPreferences(userId: string): Promise<Record<string, string>> {
  if (!userId) {
    return {};
  }

  const { data, error } = await supabase
    .from('lectoguia_user_preferences')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  const preferences: Record<string, string> = {};
  if (data) {
    data.forEach((pref: any) => {
      preferences[pref.key] = pref.value;
    });
  }
  
  return preferences;
}

export async function saveUserPreference(userId: string, key: string, value: string): Promise<boolean> {
  // Check if the preference already exists
  const { data: existingPref } = await supabase
    .from('lectoguia_user_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('key', key)
    .maybeSingle();
  
  let result;
  
  if (existingPref) {
    // Update existing preference
    result = await supabase
      .from('lectoguia_user_preferences')
      .update({ value })
      .eq('id', existingPref.id);
  } else {
    // Insert new preference
    result = await supabase
      .from('lectoguia_user_preferences')
      .insert({ user_id: userId, key, value });
  }
  
  if (result.error) throw result.error;
  
  return true;
}

export async function fetchSkillLevels(userId: string): Promise<Record<string, number>> {
  if (!userId) {
    return {};
  }

  // Query for user's skill levels
  const { data, error } = await supabase
    .from('user_skill_levels')
    .select('*,paes_skills(code)')
    .eq('user_id', userId);
  
  if (error) throw error;
  
  // Map to a simplified object with skill code as key and level as value
  const skillLevels: Record<string, number> = {};
  if (data) {
    data.forEach((skillLevel: any) => {
      if (skillLevel.paes_skills && skillLevel.paes_skills.code) {
        skillLevels[skillLevel.paes_skills.code] = skillLevel.level;
      }
    });
  }
  
  return skillLevels;
}

export async function updateSkillLevelInDb(userId: string, skillId: number, newLevel: number): Promise<boolean> {
  // Check if a skill level record already exists
  const { data: existingLevel } = await supabase
    .from('user_skill_levels')
    .select('*')
    .eq('user_id', userId)
    .eq('skill_id', skillId)
    .maybeSingle();
  
  let result;
  
  if (existingLevel) {
    // Update existing skill level
    result = await supabase
      .from('user_skill_levels')
      .update({ level: newLevel })
      .eq('id', existingLevel.id);
  } else {
    // Insert new skill level
    result = await supabase
      .from('user_skill_levels')
      .insert({ user_id: userId, skill_id: skillId, level: newLevel });
  }
  
  if (result.error) throw result.error;
  
  return true;
}
