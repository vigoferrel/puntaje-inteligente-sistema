
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "./use-user-data";

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
        // Map the database profile to our UserProfile type
        const userProfile: UserProfile = {
          id: data.id,
          name: data.name || 'Usuario',
          email: data.email || '',
          targetCareer: data.target_career || undefined,
          skillLevels: {
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
          },
          progress: {
            completedNodes: [],
            completedExercises: 0,
            correctExercises: 0,
            totalTimeMinutes: 0
          }
        };
        
        return userProfile;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  return { fetchProfile };
};
