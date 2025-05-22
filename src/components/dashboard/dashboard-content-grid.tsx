
import React from "react";
import { LearningWorkflow } from "@/components/dashboard/learning-workflow";
import { TopSkills } from "@/components/dashboard/top-skills";
import { TPAESHabilidad } from "@/types/system-types";

interface DashboardContentGridProps {
  loading: boolean;
  topSkills: TPAESHabilidad[];
  skillLevels: Record<TPAESHabilidad, number>;
}

export const DashboardContentGrid = ({
  loading,
  topSkills,
  skillLevels
}: DashboardContentGridProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-7 mb-8">
      <div className="md:col-span-4">
        <LearningWorkflow className="h-full" />
      </div>
      <div className="md:col-span-3">
        <TopSkills 
          loading={loading} 
          topSkills={topSkills} 
          skillLevels={skillLevels} 
          className="h-full" 
        />
      </div>
    </div>
  );
};
