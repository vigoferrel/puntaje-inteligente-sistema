
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { TPAESHabilidad } from "@/types/system-types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SearchBar } from "@/components/dashboard/search-bar";
import { TopSkills } from "@/components/dashboard/top-skills";
import { StudyPlan } from "@/components/dashboard/study-plan";
import { AIFeatures } from "@/components/dashboard/ai-features";

const Index = () => {
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

  // Get top skills
  const topSkills = Object.entries(skillLevels)
    .map(([skill, level]) => ({ skill: skill as TPAESHabilidad, level }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 5)
    .map(item => item.skill); // Extract just the skill names for the TopSkills component

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-stp-dark">
            {!loading && user ? `Bienvenido, ${user.name}` : 'Cargando...'}
          </h1>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <StatCards
          loading={loading}
          completedExercises={completedExercises}
          accuracyPercentage={accuracyPercentage}
          totalTimeMinutes={totalTimeMinutes}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudyPlan />
            <AIFeatures />
          </div>
          <div>
            <TopSkills 
              topSkills={topSkills} 
              loading={loading} 
              skillLevels={skillLevels}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
