
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CardContent } from "@/components/ui/card";
import { LearningPlan, PlanProgress as PlanProgressType } from "@/types/learning-plan";

interface PlanProgressProps {
  progress: PlanProgressType | null;
  plan: LearningPlan;
}

export function PlanProgress({ progress, plan }: PlanProgressProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No establecida";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progreso general</span>
          <span className="font-medium">
            {progress ? 
              `${Math.round(progress.overallProgress)}%` : 
              "0%"
            }
          </span>
        </div>
        <Progress
          value={progress ? progress.overallProgress : 0}
          className="h-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {progress ?
              `${progress.completedNodes}/${progress.totalNodes} módulos completados` :
              "0/0 módulos completados"
            }
          </span>
          <span>Fecha objetivo: {formatDate(plan.targetDate)}</span>
        </div>
      </div>
    </CardContent>
  );
}
