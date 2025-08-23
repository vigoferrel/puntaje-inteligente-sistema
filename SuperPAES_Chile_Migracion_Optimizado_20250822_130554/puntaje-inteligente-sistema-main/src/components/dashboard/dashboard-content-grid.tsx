/* eslint-disable react-refresh/only-export-components */

import { LearningWorkflow } from "../../components/dashboard/learning-workflow";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { TopSkills } from "../../components/dashboard/top-skills";
import { NextRecommendedStep } from "../../components/dashboard/next-recommended-step";
import { TPAESHabilidad, TLearningCyclePhase } from "../../types/system-types";

interface DashboardContentGridProps {
  loading: boolean;
  topSkills: TPAESHabilidad[];
  skillLevels: Record<TPAESHabilidad, number>;
  currentPhase: TLearningCyclePhase;
  nextRecommendedNodeId?: string | null;
  className?: string;
}

export const DashboardContentGrid = ({
  loading,
  topSkills,
  skillLevels,
  currentPhase,
  nextRecommendedNodeId,
  className
}: DashboardContentGridProps) => {
  return (
    <div className={`grid gap-6 md:grid-cols-7 ${className || ''}`}>
      <div className="md:col-span-4">
        <LearningWorkflow className="h-full" />
      </div>
      <div className="md:col-span-3 space-y-6">
        <TopSkills 
          loading={loading} 
          topSkills={topSkills} 
          skillLevels={skillLevels} 
          className="h-full" 
        />
        <NextRecommendedStep 
          currentPhase={currentPhase} 
          nextNodeId={nextRecommendedNodeId} 
        />
      </div>
    </div>
  );
};

