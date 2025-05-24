
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
        // Obtener datos de ejercicios realizados para calcular niveles de habilidad
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('user_exercise_attempts')
          .select('skill_demonstrated, is_correct')
          .eq('user_id', userId);
          
        if (exerciseError) {
          console.warn('Error obteniendo datos de ejercicios:', exerciseError);
        }
        
        // Crear niveles de habilidad basados en rendimiento en ejercicios
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
        
        // Actualizar niveles de habilidad basados en datos de ejercicios disponibles
        if (exerciseData && exerciseData.length > 0) {
          const skillStats: Record<string, { total: number; correct: number }> = {};
          
          exerciseData.forEach(item => {
            if (item.skill_demonstrated) {
              if (!skillStats[item.skill_demonstrated]) {
                skillStats[item.skill_demonstrated] = { total: 0, correct: 0 };
              }
              skillStats[item.skill_demonstrated].total++;
              if (item.is_correct) {
                skillStats[item.skill_demonstrated].correct++;
              }
            }
          });
          
          // Actualizar niveles basados en rendimiento real
          Object.entries(skillStats).forEach(([skill, stats]) => {
            if (stats.total > 0) {
              const accuracy = stats.correct / stats.total;
              if (skill in skillLevels) {
                skillLevels[skill as TPAESHabilidad] = Math.min(1, accuracy);
              }
            }
          });
        }
        
        // Get learning cycle phase
        let learningCyclePhase: TLearningCyclePhase | undefined = undefined;
        
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
      
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      return null;
    }
  };

  return { fetchProfile, updateProfile };
};
