
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { TLearningCyclePhase, getLearningCyclePhaseDisplayName } from "@/types/system-types";
import { LucideIcon } from "lucide-react";

interface PhaseCardProps {
  phase: TLearningCyclePhase;
  isActive: boolean;
  isCompleted: boolean;
  isPending: boolean;
  phaseProgress: number;
  icon: LucideIcon;
}

export const PhaseCard = ({
  phase,
  isActive,
  isCompleted,
  isPending,
  phaseProgress,
  icon: Icon
}: PhaseCardProps) => {
  return (
    <Link to={getPhaseRoute(phase)}>
      <Card className={`h-full transition-all hover:shadow-md ${
        isActive ? "bg-primary/10 border-primary" : 
        isCompleted ? "bg-green-50 border-green-200" : 
        "bg-background"
      } ${isPending ? "opacity-70" : ""}`}>
        <CardContent className="p-4 flex flex-col items-center text-center gap-2">
          <div className={`rounded-full p-2 ${
            isActive ? "bg-primary/20" : 
            isCompleted ? "bg-green-100" : 
            "bg-secondary/50"
          }`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium text-sm">
              {getLearningCyclePhaseDisplayName(phase)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isActive ? "En curso" : isCompleted ? "Completado" : "Pendiente"}
            </p>
          </div>
          {phaseProgress > 0 && (
            <Progress 
              value={phaseProgress} 
              className="h-1 w-full mt-1" 
              indicatorClassName={isCompleted ? "bg-green-500" : undefined}
            />
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

// Helper function to get route for each phase
export const getPhaseRoute = (phase: TLearningCyclePhase) => {
  const routes = {
    DIAGNOSIS: "/diagnostico",
    PERSONALIZED_PLAN: "/plan",
    SKILL_TRAINING: "/entrenamiento",
    CONTENT_STUDY: "/contenido",
    PERIODIC_TESTS: "/evaluaciones",
    FEEDBACK_ANALYSIS: "/analisis",
    REINFORCEMENT: "/reforzamiento",
    FINAL_SIMULATIONS: "/simulaciones",
  };
  
  return routes[phase] || "/";
};
