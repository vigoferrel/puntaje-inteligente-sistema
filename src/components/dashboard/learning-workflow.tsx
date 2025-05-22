
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLearningWorkflow } from "@/hooks/use-learning-workflow";
import { Skeleton } from "@/components/ui/skeleton";
import { PhaseGrid } from "./learning-cycle/phase-grid";
import { ActionButtons } from "./learning-cycle/action-buttons";

interface LearningWorkflowProps {
  className?: string;
}

export const LearningWorkflow = ({ className }: LearningWorkflowProps) => {
  const { 
    loading, 
    currentPhase, 
    calculatePhaseProgress, 
    handleLectoGuiaClick, 
    currentPhaseIndex,
    completionPercentage
  } = useLearningWorkflow();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Tu Ciclo de Aprendizaje</CardTitle>
        <CardDescription>
          Fase actual: {currentPhaseIndex + 1}/8 - 
          Progreso general: {completionPercentage}%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array(8).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <PhaseGrid 
              currentPhase={currentPhase} 
              calculatePhaseProgress={calculatePhaseProgress} 
            />
            
            <ActionButtons 
              currentPhase={currentPhase}
              onLectoGuiaClick={handleLectoGuiaClick}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
