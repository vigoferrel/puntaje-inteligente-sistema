
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingStats } from "@/components/training/TrainingStats";
import { TrainingTabs } from "@/components/training/TrainingTabs";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainingEnhanced } from "@/hooks/use-training-enhanced";

const Entrenamiento = () => {
  const { profile } = useAuth();
  const { sessionStats } = useTrainingEnhanced();
  const [activeTab, setActiveTab] = useState("personalizado");

  return (
    <AppInitializer>
      <AppLayout>
        <div className="min-h-screen bg-gray-900">
          <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <TrainingHeader 
              userName={profile?.name}
              weeklyProgress={sessionStats.weeklyProgress}
              weeklyGoal={sessionStats.weeklyGoal}
              streakDays={sessionStats.streakDays}
              totalSessions={sessionStats.totalSessions}
            />
            
            {/* Stats */}
            <div className="mt-8">
              <TrainingStats stats={sessionStats} />
            </div>
            
            {/* Main Content */}
            <div className="mt-8">
              <TrainingTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>
          </div>
        </div>
      </AppLayout>
    </AppInitializer>
  );
};

export default Entrenamiento;
