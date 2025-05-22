
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";

// Calculate penalty based on time spent and correctness
export const calculateQuestionPenalty = (
  timeSpentSeconds: number,
  isCorrect: boolean
): number => {
  // Base penalty for incorrect answers
  if (!isCorrect) {
    return 0.2; // Higher penalty for incorrect answers
  }
  
  // Penalty based on time for correct answers
  // Fast answers (under 30 seconds) get a lower penalty
  if (timeSpentSeconds < 30) {
    return 0.05;
  }
  // Medium time answers (30-60 seconds) get a medium penalty
  else if (timeSpentSeconds < 60) {
    return 0.1;
  }
  // Slow answers (over 60 seconds) get a higher penalty
  else {
    return 0.15;
  }
};

// Calculate skill level change based on correctness and penalty
export const calculateSkillLevelChange = (
  isCorrect: boolean,
  penalty: number
): number => {
  // For correct answers, increase skill level
  if (isCorrect) {
    return 0.05 - penalty;
  }
  // For incorrect answers, decrease skill level
  else {
    return -0.1 - penalty;
  }
};

// Update user skill levels based on diagnostic results
export const updateUserSkillLevels = async (
  userId: string,
  results: Record<TPAESHabilidad, number>
): Promise<boolean> => {
  try {
    // Process each skill result
    for (const [skill, level] of Object.entries(results)) {
      const skillId = skill;
      
      // Update the skill level in the database
      const { error } = await supabase
        .from('user_skill_levels')
        .upsert({
          user_id: userId,
          skill_id: Number(skillId), // Convert skill string to number
          level: level
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user skill levels:', error);
    return false;
  }
};
