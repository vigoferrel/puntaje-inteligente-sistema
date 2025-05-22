
import React from "react";
import { LearningWorkflow } from "@/components/dashboard/learning-workflow";
import { TopSkills } from "@/components/dashboard/top-skills";
import { TPAESHabilidad } from "@/types/system-types";

interface DashboardContentGridProps {
  loading: boolean;
  topSkills: TPAESHabilidad[];
  skillLevels: Record<TPAESHabilidad, number>;
  className?: string;
}

export const DashboardContentGrid = ({
  loading,
  topSkills,
  skillLevels,
  className
}: DashboardContentGridProps) => {
  return (
    <div className={`grid gap-6 md:grid-cols-7 ${className || ''}`}>
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
