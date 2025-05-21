
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { TPAESHabilidad } from "@/types/system-types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AIFeatures } from "@/components/dashboard/ai-features";
import { TopSkills } from "@/components/dashboard/top-skills";
import { StudyPlan } from "@/components/dashboard/study-plan";
import { SearchBar } from "@/components/dashboard/search-bar";

const Index = () => {
  const { user, loading } = useUserData();
  const [searchQuery, setSearchQuery] = useState("");

  // Get top skills (highest 3)
  const topSkills = !loading && user
    ? Object.entries(user.skillLevels)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([skill]) => skill as TPAESHabilidad)
    : [];

  // Calculate accuracy percentage
  const accuracyPercentage = !loading && user
    ? Math.round((user.progress.correctExercises / user.progress.completedExercises) * 100) || 0
    : 0;

  return (
    <AppLayout>
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido a SubeTuPuntaje
            </h1>
            <p className="text-gray-500 mt-1">
              Tu plataforma de preparación para la Prueba de Acceso a la Educación Superior
            </p>
          </div>
          
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <StatCards 
          loading={loading}
          completedExercises={user?.progress.completedExercises || 0}
          accuracyPercentage={accuracyPercentage}
          totalTimeMinutes={user?.progress.totalTimeMinutes || 0}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AIFeatures />
          
          <TopSkills 
            loading={loading}
            topSkills={topSkills}
            skillLevels={user?.skillLevels || {}} 
          />
        </div>

        <StudyPlan />
      </div>
    </AppLayout>
  );
};

export default Index;
