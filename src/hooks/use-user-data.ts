
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
  const { profile, isLoading } = useAuth();
  const [loading, setLoading] = useState(isLoading);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (profile) {
        setUser(profile);
      } else {
        // Fallback to mock data if no profile is available (for demonstration purposes)
        setUser(MOCK_USER);
      }
      setLoading(false);
    }
  }, [profile, isLoading]);

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
    
    // In a real implementation, we would also update this in the database
    // For now, just simulate it with a console log
    console.log(`Updated skill ${skill} to level ${normalizedLevel}`);
  };

  return {
    user,
    loading,
    updateSkillLevel
  };
};
