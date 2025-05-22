
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Clock } from "lucide-react";
import { LEARNING_CYCLE_PHASES_ORDER } from "@/types/system-types";
import { Skeleton } from "@/components/ui/skeleton";
import { PhaseGrid } from "./learning-cycle/phase-grid";
import { ActionButtons } from "./learning-cycle/action-buttons";
import { useLearningWorkflow } from "@/hooks/use-learning-workflow";

interface LearningWorkflowProps {
  className?: string;
}

export const LearningWorkflow = ({ className }: LearningWorkflowProps) => {
  const {
    loading,
    currentPhase,
    timeInPhase,
    calculatePhaseProgress,
    handleLectoGuiaClick,
    completionPercentage
  } = useLearningWorkflow();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Ciclo de Aprendizaje Personalizado
        </CardTitle>
        <CardDescription>
          Tu progreso actual: {completionPercentage}% completado
          {timeInPhase !== null && (
            <span className="ml-2 flex items-center text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {timeInPhase} min. en fase actual
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={completionPercentage} className="h-2" />
          
          <PhaseGrid 
            currentPhase={currentPhase} 
            calculatePhaseProgress={calculatePhaseProgress} 
          />
          
          <ActionButtons 
            currentPhase={currentPhase}
            onLectoGuiaClick={handleLectoGuiaClick}
          />
        </div>
      </CardContent>
    </Card>
  );
};
