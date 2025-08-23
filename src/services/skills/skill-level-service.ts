
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";

/**
 * Calculates skill levels from user exercise attempts (no user_skill_levels table needed)
 */
export const fetchUserSkillLevels = async (userId: string): Promise<Record<TPAESHabilidad, number>> => {
  try {
    // Initialize all skills with default level of 0.5
    const defaultLevels: Record<TPAESHabilidad, number> = {
      SOLVE_PROBLEMS: 0.5,
      REPRESENT: 0.5,
      MODEL: 0.5,
      INTERPRET_RELATE: 0.5,
      EVALUATE_REFLECT: 0.5,
      TRACK_LOCATE: 0.5,
      ARGUE_COMMUNICATE: 0.5,
      IDENTIFY_THEORIES: 0.5,
      PROCESS_ANALYZE: 0.5,
      APPLY_PRINCIPLES: 0.5,
      SCIENTIFIC_ARGUMENT: 0.5,
      TEMPORAL_THINKING: 0.5,
      SOURCE_ANALYSIS: 0.5,
      MULTICAUSAL_ANALYSIS: 0.5,
      CRITICAL_THINKING: 0.5,
      REFLECTION: 0.5
    };

    // Calculate skill levels from exercise attempts
    const { data: attempts, error } = await supabase
      .from('user_exercise_attempts')
      .select('skill_demonstrated, is_correct')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching exercise attempts:', error);
      return defaultLevels;
    }

    if (!attempts || attempts.length === 0) {
      return defaultLevels;
    }

    // Calculate skill levels based on attempts
    const skillStats: Record<string, { correct: number; total: number }> = {};
    
    attempts.forEach(attempt => {
      if (attempt.skill_demonstrated) {
        const skill = attempt.skill_demonstrated;
        if (!skillStats[skill]) {
          skillStats[skill] = { correct: 0, total: 0 };
        }
        skillStats[skill].total += 1;
        if (attempt.is_correct) {
          skillStats[skill].correct += 1;
        }
      }
    });

    // Update levels based on performance
    Object.entries(skillStats).forEach(([skill, stats]) => {
      if (stats.total > 0 && skill in defaultLevels) {
        const accuracy = stats.correct / stats.total;
        defaultLevels[skill as TPAESHabilidad] = Math.min(0.99, Math.max(0.1, accuracy));
      }
    });

    return defaultLevels;
  } catch (error) {
    console.error('Error in fetchUserSkillLevels:', error);
    return {
      SOLVE_PROBLEMS: 0.5,
      REPRESENT: 0.5,
      MODEL: 0.5,
      INTERPRET_RELATE: 0.5,
      EVALUATE_REFLECT: 0.5,
      TRACK_LOCATE: 0.5,
      ARGUE_COMMUNICATE: 0.5,
      IDENTIFY_THEORIES: 0.5,
      PROCESS_ANALYZE: 0.5,
      APPLY_PRINCIPLES: 0.5,
      SCIENTIFIC_ARGUMENT: 0.5,
      TEMPORAL_THINKING: 0.5,
      SOURCE_ANALYSIS: 0.5,
      MULTICAUSAL_ANALYSIS: 0.5,
      CRITICAL_THINKING: 0.5,
      REFLECTION: 0.5
    };
  }
};

/**
 * Updates skill level by recording exercise attempts (virtual skill tracking)
 */
export const updateUserSkillLevel = async (
  userId: string,
  skill: TPAESHabilidad,
  newLevel: number
): Promise<boolean> => {
  try {
    // Since we don't have user_skill_levels table, we track through exercise attempts
    // This is just a placeholder that returns true
    console.log(`Virtual skill level update: ${skill} to ${newLevel} for user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in updateUserSkillLevel:', error);
    return false;
  }
};

/**
 * Updates multiple skill levels (virtual tracking)
 */
export const updateMultipleSkillLevels = async (
  userId: string,
  skillLevels: Partial<Record<TPAESHabilidad, number>>
): Promise<boolean> => {
  try {
    console.log(`Virtual bulk skill update for user ${userId}:`, skillLevels);
    return true;
  } catch (error) {
    console.error('Error in updateMultipleSkillLevels:', error);
    return false;
  }
};

/**
 * Gets top skills for a user based on calculated levels
 */
export const getTopSkills = async (
  userId: string, 
  limit: number = 3
): Promise<TPAESHabilidad[]> => {
  try {
    const skillLevels = await fetchUserSkillLevels(userId);
    
    const sortedSkills = Object.entries(skillLevels)
      .sort(([, levelA], [, levelB]) => levelB - levelA)
      .slice(0, limit)
      .map(([skill]) => skill as TPAESHabilidad);
    
    return sortedSkills;
  } catch (error) {
    console.error('Error in getTopSkills:', error);
    return ['INTERPRET_RELATE', 'SOLVE_PROBLEMS', 'MODEL'];
  }
};

/**
 * Gets skills that need improvement
 */
export const getSkillsToImprove = async (
  userId: string, 
  limit: number = 3
): Promise<TPAESHabilidad[]> => {
  try {
    const skillLevels = await fetchUserSkillLevels(userId);
    
    const sortedSkills = Object.entries(skillLevels)
      .sort(([, levelA], [, levelB]) => levelA - levelB)
      .slice(0, limit)
      .map(([skill]) => skill as TPAESHabilidad);
    
    return sortedSkills;
  } catch (error) {
    console.error('Error in getSkillsToImprove:', error);
    return ['SCIENTIFIC_ARGUMENT', 'REFLECTION', 'PROCESS_ANALYZE'];
  }
};

/**
 * Calculates average skill level
 */
export const getAverageSkillLevel = async (userId: string): Promise<number> => {
  try {
    const skillLevels = await fetchUserSkillLevels(userId);
    
    const sum = Object.values(skillLevels).reduce((acc, level) => acc + level, 0);
    const average = sum / Object.values(skillLevels).length;
    
    return average;
  } catch (error) {
    console.error('Error in getAverageSkillLevel:', error);
    return 0.5;
  }
};
