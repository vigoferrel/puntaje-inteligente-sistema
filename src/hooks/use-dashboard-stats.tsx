
import { useState, useEffect } from "react";
import { useUserData } from "@/hooks/use-user-data";
import { TPAESHabilidad } from "@/types/system-types";
import { StatCardItem } from "@/components/dashboard/stat-cards";

export const useDashboardStats = () => {
  const { user, loading } = useUserData();
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Default skill levels to ensure they're never undefined
  const defaultSkillLevels: Record<TPAESHabilidad, number> = {
    SOLVE_PROBLEMS: 0,
    REPRESENT: 0,
    MODEL: 0,
    INTERPRET_RELATE: 0,
    EVALUATE_REFLECT: 0,
    TRACK_LOCATE: 0,
    ARGUE_COMMUNICATE: 0,
    IDENTIFY_THEORIES: 0,
    PROCESS_ANALYZE: 0,
    APPLY_PRINCIPLES: 0,
    SCIENTIFIC_ARGUMENT: 0,
    TEMPORAL_THINKING: 0,
    SOURCE_ANALYSIS: 0,
    MULTICAUSAL_ANALYSIS: 0,
    CRITICAL_THINKING: 0,
    REFLECTION: 0
  };
  
  // Use the user skills if available, or the default ones
  const skillLevels = user?.skillLevels || defaultSkillLevels;
  
  // Calculate stats
  const completedExercises = user?.progress?.completedExercises || 0;
  const correctExercises = user?.progress?.correctExercises || 0;
  const accuracyPercentage = completedExercises > 0 
    ? Math.round((correctExercises / completedExercises) * 100) 
    : 0;
  const totalTimeMinutes = user?.progress?.totalTimeMinutes || 0;

  // Create stats array for the StatCards component
  const stats: StatCardItem[] = [
    {
      title: "Ejercicios Completados",
      value: completedExercises,
      description: "Total de ejercicios completados",
      trend: "up",
      trendValue: "12"
    },
    {
      title: "Precisión",
      value: `${accuracyPercentage}%`,
      description: "Porcentaje de respuestas correctas",
      trend: "up",
      trendValue: "5"
    },
    {
      title: "Tiempo de Estudio",
      value: `${totalTimeMinutes} min`,
      description: "Tiempo total estudiando",
      trend: "up",
      trendValue: "8"
    },
    {
      title: "Días Consecutivos",
      value: "3",
      description: "Días seguidos estudiando",
      trend: "up",
      trendValue: "2"
    }
  ];

  // Get top skills
  const topSkills = Object.entries(skillLevels)
    .map(([skill, level]) => ({ skill: skill as TPAESHabilidad, level }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 5)
    .map(item => item.skill);

  return {
    user,
    loading,
    searchQuery,
    setSearchQuery,
    stats,
    skillLevels,
    topSkills,
    completedExercises,
    accuracyPercentage,
    totalTimeMinutes
  };
};
