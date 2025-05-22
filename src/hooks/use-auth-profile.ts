
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./use-user-data";
import { TPAESHabilidad, TLearningCyclePhase } from "@/types/system-types";

export const useAuthProfile = () => {
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        // Fetch user skill levels
        const { data: skillData, error: skillError } = await supabase
          .from('user_skill_levels')
          .select('skill_id, level')
          .eq('user_id', userId);
          
        if (skillError) throw skillError;
        
        // Create skill levels map
        const skillLevels: Record<TPAESHabilidad, number> = {
          SOLVE_PROBLEMS: 0.3,
          REPRESENT: 0.4,
          MODEL: 0.5,
          INTERPRET_RELATE: 0.35,
          EVALUATE_REFLECT: 0.45,
          TRACK_LOCATE: 0.6,
          ARGUE_COMMUNICATE: 0.4,
          IDENTIFY_THEORIES: 0.3,
          PROCESS_ANALYZE: 0.5,
          APPLY_PRINCIPLES: 0.45,
          SCIENTIFIC_ARGUMENT: 0.3,
          TEMPORAL_THINKING: 0.5,
          SOURCE_ANALYSIS: 0.6,
          MULTICAUSAL_ANALYSIS: 0.4,
          CRITICAL_THINKING: 0.5,
          REFLECTION: 0.45
        };
        
        // Update skill levels with data from database
        if (skillData && skillData.length > 0) {
          // We need a mapping from database skill_id to our TPAESHabilidad enum
          // In a real implementation, we would have a proper mapping function
          // For now, we'll use a simplified approach
          const skillMapping: Record<number, TPAESHabilidad> = {
            1: "TRACK_LOCATE",         // Rastrear-Localizar (CL)
            2: "INTERPRET_RELATE",     // Interpretar-Relacionar (CL)
            3: "EVALUATE_REFLECT",     // Evaluar-Reflexionar (CL)
            4: "SOLVE_PROBLEMS",       // Resolver Problemas (M1)
            5: "REPRESENT",            // Representar (M1)
            6: "MODEL",                // Modelar (M1)
            7: "ARGUE_COMMUNICATE",    // Argumentar y Comunicar (M1)
            8: "SOLVE_PROBLEMS",       // Resolver Problemas Avanzados (M2)
            9: "REPRESENT",            // Representar Avanzado (M2)
            10: "MODEL",               // Modelar Avanzado (M2)
            11: "ARGUE_COMMUNICATE",   // Argumentar y Comunicar Avanzado (M2)
          };
          
          skillData.forEach(item => {
            const skill = skillMapping[item.skill_id];
            if (skill) {
              skillLevels[skill] = item.level;
            }
          });
        }
        
        // Get learning cycle phase - handle as string first then convert to enum type
        let learningCyclePhase: TLearningCyclePhase | undefined = undefined;
        
        // TypeScript now knows learning_phase exists on data because we've added it to the database
        if (data.learning_phase as TLearningCyclePhase) {
          learningCyclePhase = data.learning_phase as TLearningCyclePhase;
        }
        
        // Map the database profile to our UserProfile type
        const userProfile: UserProfile = {
          id: data.id,
          name: data.name || 'Usuario',
          email: data.email || '',
          targetCareer: data.target_career || undefined,
          learningCyclePhase,
          progress: {
            completedNodes: [],
            completedExercises: 0,
            correctExercises: 0,
            totalTimeMinutes: 0
          },
          skillLevels
        };
        
        return userProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const updateProfile = async (userId: string, profileData: Partial<UserProfile>) => {
    try {
      // Prepare data for update
      const updateData: any = {};
      
      if (profileData.name !== undefined) updateData.name = profileData.name;
      if (profileData.email !== undefined) updateData.email = profileData.email;
      if (profileData.targetCareer !== undefined) updateData.target_career = profileData.targetCareer;
      if (profileData.learningCyclePhase !== undefined) updateData.learning_phase = profileData.learningCyclePhase;
      
      // Update last active at each time we update the profile
      updateData.last_active_at = new Date().toISOString();
      
      // Update profile in database
      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update skill levels if provided
      if (profileData.skillLevels) {
        // For simplicity, we're not implementing this now
        // In a real app, we would need to map TPAESHabilidad to skill_id and update user_skill_levels table
      }
      
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  };

  return { fetchProfile, updateProfile };
};
