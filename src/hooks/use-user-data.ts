
import { useState, useEffect } from "react";
import { TPAESHabilidad } from "../types/system-types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  targetCareer?: string;
  skillLevels: Record<TPAESHabilidad, number>;
  progress: {
    completedNodes: string[];
    completedExercises: number;
    correctExercises: number;
    totalTimeMinutes: number;
  };
}

// Mock data for demonstration
const MOCK_USER: UserProfile = {
  id: "user-1",
  name: "Estudiante",
  email: "estudiante@example.com",
  targetCareer: "Ingeniería Civil",
  skillLevels: {
    SOLVE_PROBLEMS: 0.65,
    REPRESENT: 0.45,
    MODEL: 0.70,
    INTERPRET_RELATE: 0.60,
    EVALUATE_REFLECT: 0.55,
    TRACK_LOCATE: 0.75,
    ARGUE_COMMUNICATE: 0.50,
    IDENTIFY_THEORIES: 0.40,
    PROCESS_ANALYZE: 0.60,
    APPLY_PRINCIPLES: 0.55,
    SCIENTIFIC_ARGUMENT: 0.35,
    TEMPORAL_THINKING: 0.60,
    SOURCE_ANALYSIS: 0.65,
    MULTICAUSAL_ANALYSIS: 0.50,
    CRITICAL_THINKING: 0.70,
    REFLECTION: 0.55
  },
  progress: {
    completedNodes: ["math1-solve-problems-basic-1"],
    completedExercises: 45,
    correctExercises: 32,
    totalTimeMinutes: 180
  }
};

export const useUserData = () => {
  const { profile, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(authLoading);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [skillLevels, setSkillLevels] = useState<Record<string, number>>({});

  // Fetch user skill levels from the database
  useEffect(() => {
    const fetchUserSkills = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('user_skill_levels')
          .select('skill_id, level')
          .eq('user_id', userId);
        
        if (error) throw error;
        
        // Map skill levels to our format if available
        if (data && data.length > 0) {
          const skillMap: Record<string, number> = {};
          data.forEach(item => {
            // We'll need to map database skill IDs to our frontend skill codes
            // This is a simplification, in a real app we'd have a mapping function
            skillMap[`SKILL_${item.skill_id}`] = item.level;
          });
          setSkillLevels(skillMap);
        }
      } catch (error) {
        console.error('Error fetching skill levels:', error);
      }
    };

    if (!authLoading) {
      if (profile) {
        setUser({
          ...profile,
          // Merge any skills from the database with profile data
          skillLevels: {
            ...profile.skillLevels,
            ...skillLevels
          }
        });
        
        // Fetch additional skill data from the database
        fetchUserSkills(profile.id);
      } else {
        // Fallback to mock data if no profile is available (for demonstration purposes)
        setUser(MOCK_USER);
      }
      setLoading(false);
    }
  }, [profile, authLoading, skillLevels]);

  const updateSkillLevel = async (skill: TPAESHabilidad, level: number) => {
    if (!user) return;
    
    const normalizedLevel = Math.max(0, Math.min(1, level));
    
    // Update local state
    setUser(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        skillLevels: {
          ...prev.skillLevels,
          [skill]: normalizedLevel
        }
      };
    });
    
    // Update in database if we have a real user
    if (profile) {
      try {
        // In a real implementation, you would map from frontend skill code to database ID
        // This is just a placeholder for the actual implementation
        console.log(`Updated skill ${skill} to level ${normalizedLevel} in database`);
        
        // TODO: Implement the actual database update when we have the skill mapping
        // const { error } = await supabase
        //   .from('user_skill_levels')
        //   .upsert({
        //     user_id: profile.id,
        //     skill_id: skillIdMap[skill], // We'd need a mapping function
        //     level: normalizedLevel
        //   });
        
        // if (error) throw error;
      } catch (error) {
        console.error('Error updating skill level:', error);
      }
    }
  };

  return {
    user,
    loading,
    updateSkillLevel
  };
};
