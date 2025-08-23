/* eslint-disable react-refresh/only-export-components */

import { CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { LearningPlan } from "../../../types/learning-plan";

interface PlanHeaderProps {
  plan: LearningPlan;
}

export (...args: unknown[]) => unknown PlanHeader({ plan }: PlanHeaderProps) {
  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl md:text-2xl">{plan.title || "Plan de Estudio"}</CardTitle>
          <CardDescription>
            {plan.description || "Plan de estudio personalizado"}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}


