
import React from "react";
import { LEARNING_CYCLE_PHASES_ORDER, TLearningCyclePhase } from "@/types/system-types";
import { PhaseCard } from "./phase-card";
import { getPhaseIcon } from "./phase-utils";

interface PhaseGridProps {
  currentPhase: TLearningCyclePhase;
  calculatePhaseProgress: (phase: TLearningCyclePhase) => number;
}

export const PhaseGrid = ({ currentPhase, calculatePhaseProgress }: PhaseGridProps) => {
  const currentPhaseIndex = LEARNING_CYCLE_PHASES_ORDER.indexOf(currentPhase);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {LEARNING_CYCLE_PHASES_ORDER.map((phase, index) => {
        const isActive = phase === currentPhase;
        const isCompleted = index < currentPhaseIndex;
        const isPending = index > currentPhaseIndex;
        const phaseProgress = calculatePhaseProgress(phase);
        const Icon = getPhaseIcon(phase);
        
        return (
          <PhaseCard
            key={phase}
            phase={phase}
            isActive={isActive}
            isCompleted={isCompleted}
            isPending={isPending}
            phaseProgress={phaseProgress}
            icon={Icon}
          />
        );
      })}
    </div>
  );
};
