
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { StatCards } from "@/components/dashboard/stat-cards";
import { AIFeatures } from "@/components/dashboard/ai-features";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { FeatureCards } from "@/components/dashboard/feature-cards";
import { DashboardContentGrid } from "@/components/dashboard/dashboard-content-grid";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";

const Index = () => {
  const {
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
  } = useDashboardStats();

  return (
    <AppLayout>
      <div className="p-6">
        <WelcomeHeader 
          userName={user?.name} 
          loading={loading}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <StatCards
          loading={loading}
          stats={stats}
          completedExercises={completedExercises}
          accuracyPercentage={accuracyPercentage}
          totalTimeMinutes={totalTimeMinutes}
          className="mb-8"
        />

        <DashboardContentGrid 
          loading={loading}
          topSkills={topSkills}
          skillLevels={skillLevels}
        />
        
        <FeatureCards />
        
        <AIFeatures />
      </div>
    </AppLayout>
  );
};

export default Index;
