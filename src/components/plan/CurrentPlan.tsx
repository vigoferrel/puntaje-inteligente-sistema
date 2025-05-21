
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircleIcon } from "lucide-react";
import { LearningPlan } from "@/types/learning-plan";
import { PlanMetrics } from "./PlanMetrics";
import { PlanNodesList } from "./PlanNodesList";

interface CurrentPlanProps {
  plan: LearningPlan;
  planProgress: {
    totalNodes: number;
    completedNodes: number;
    inProgressNodes: number;
    overallProgress: number;
  } | null;
  hasMultiplePlans: boolean;
  onNavigateToTraining: () => void;
  onNavigateHome: () => void;
}

export const CurrentPlan = ({
  plan,
  planProgress,
  hasMultiplePlans,
  onNavigateToTraining,
  onNavigateHome,
}: CurrentPlanProps) => {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          {hasMultiplePlans && (
            <Button variant="outline" size="sm">
              Cambiar Plan
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Plan Overview */}
        <PlanMetrics 
          targetDate={plan.targetDate}
          nodesCount={plan.nodes.length}
          progress={planProgress?.overallProgress || 0}
        />
        
        <Separator />
        
        {/* Plan Nodes */}
        <PlanNodesList nodes={plan.nodes} />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onNavigateHome}>
          Volver al Dashboard
        </Button>
        <Button onClick={onNavigateToTraining}>
          <CheckCircleIcon className="h-4 w-4 mr-2" />
          Iniciar Estudio
        </Button>
      </CardFooter>
    </Card>
  );
};
