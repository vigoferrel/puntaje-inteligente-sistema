
import React from "react";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LearningPlan } from "@/types/learning-plan";

interface PlanHeaderProps {
  plan: LearningPlan;
}

export function PlanHeader({ plan }: PlanHeaderProps) {
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
