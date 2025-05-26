
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TLearningCyclePhase, getLearningCyclePhaseDisplayName } from "@/types/system-types";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
  const handlePhaseClick = () => {
    const route = getUnifiedPhaseRoute(phase);
    navigate(route);
  };

  return (
    <Button
      onClick={handlePhaseClick}
      variant="ghost"
      className="h-auto p-0 w-full"
      disabled={isPending}
    >
      <Card className={`h-full w-full transition-all hover:shadow-md ${
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
    </Button>
  );
};

/**
 * Mapeo simplificado de fases a rutas estándar
 */
export const getUnifiedPhaseRoute = (phase: TLearningCyclePhase): string => {
  const routes = {
    // Fases principales
    DIAGNOSIS: "/diagnostico",
    PERSONALIZED_PLAN: "/dashboard",
    SKILL_TRAINING: "/lectoguia",
    CONTENT_STUDY: "/lectoguia",
    PERIODIC_TESTS: "/diagnostico",
    FEEDBACK_ANALYSIS: "/dashboard",
    REINFORCEMENT: "/lectoguia",
    FINAL_SIMULATIONS: "/diagnostico",
    
    // Fases de Kolb
    EXPERIENCIA_CONCRETA: "/lectoguia",
    OBSERVACION_REFLEXIVA: "/dashboard",
    CONCEPTUALIZACION_ABSTRACTA: "/lectoguia",
    EXPERIMENTACION_ACTIVA: "/diagnostico",
    
    // Legacy phases
    diagnostic: "/diagnostico",
    exploration: "/lectoguia",
    practice: "/lectoguia",
    application: "/diagnostico"
  };
  
  return routes[phase] || "/dashboard";
};
