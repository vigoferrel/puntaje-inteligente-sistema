
import { useState, useEffect } from "react";
import { TPAESHabilidad } from "../types/system-types";

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    setTimeout(() => {
      setUser(MOCK_USER);
      setLoading(false);
    }, 500);
  }, []);

  const updateSkillLevel = (skill: TPAESHabilidad, level: number) => {
    if (!user) return;
    
    setUser(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        skillLevels: {
          ...prev.skillLevels,
          [skill]: Math.max(0, Math.min(1, level)) // Ensure level is between 0 and 1
        }
      };
    });
  };

  return {
    user,
    loading,
    updateSkillLevel
  };
};
