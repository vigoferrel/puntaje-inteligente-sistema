
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";

/**
 * Updates skill levels for a user based on diagnostic results
 */
export const updateUserSkillLevels = async (userId: string, skillLevels: Record<TPAESHabilidad, number>) => {
  try {
    // For each skill, update the user's skill level
    for (const [skillCode, level] of Object.entries(skillLevels)) {
      // Get skill ID from database
      const { data: skillData, error: skillError } = await supabase
        .from('paes_skills')
        .select('id')
        .eq('code', skillCode)
        .maybeSingle();
      
      if (skillError) throw skillError;
      
      if (!skillData) continue;
      
      // Update or insert skill level
      const { error } = await supabase
        .from('user_skill_levels')
        .upsert({
          user_id: userId,
          skill_id: skillData.id,
          level
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user skill levels:', error);
    return false;
  }
};
