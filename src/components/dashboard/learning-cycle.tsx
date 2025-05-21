
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LEARNING_CYCLE_PHASES_ORDER, TLearningCyclePhase, getLearningCyclePhaseDisplayName, getLearningCyclePhaseDescription } from "@/types/system-types";
import { ArrowRightIcon, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface LearningCycleProps {
  currentPhase: TLearningCyclePhase;
  loading: boolean;
  onPhaseSelect: (phase: TLearningCyclePhase) => void;
}

export const LearningCycle = ({ currentPhase, loading, onPhaseSelect }: LearningCycleProps) => {
  // Calculate progress through the learning cycle
  const currentIndex = LEARNING_CYCLE_PHASES_ORDER.indexOf(currentPhase);
  const progressPercent = ((currentIndex + 1) / LEARNING_CYCLE_PHASES_ORDER.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ciclo de Aprendizaje PAES</CardTitle>
        <CardDescription>
          Tu viaje hacia el éxito en la PAES
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 animate-pulse rounded" />
            <div className="h-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-8 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Fase actual: {getLearningCyclePhaseDisplayName(currentPhase)}</h3>
              <p className="text-sm text-gray-500">{getLearningCyclePhaseDescription(currentPhase)}</p>
              <Progress value={progressPercent} className="h-2 mt-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {LEARNING_CYCLE_PHASES_ORDER.map((phase, index) => {
                const isActive = phase === currentPhase;
                const isCompleted = index < currentIndex;
                const isNext = index === currentIndex + 1;
                
                return (
                  <Button
                    key={phase}
                    variant={isActive ? "default" : isCompleted ? "outline" : "secondary"}
                    className={`flex flex-col items-center justify-center p-2 h-auto min-h-[5rem] text-center ${
                      isActive ? "ring-2 ring-primary ring-offset-2" : ""
                    } ${isCompleted ? "bg-green-50 text-green-800 border-green-200" : ""}`}
                    onClick={() => onPhaseSelect(phase)}
                  >
                    {isCompleted && <CheckCircle className="h-4 w-4 mb-1" />}
                    {isNext && <ArrowRightIcon className="h-4 w-4 mb-1" />}
                    <span className="text-xs font-medium">
                      {getLearningCyclePhaseDisplayName(phase)}
                    </span>
                  </Button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                as={Link} 
                to={getPhaseRoute(currentPhase)}
              >
                Continuar {getLearningCyclePhaseDisplayName(currentPhase)}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Helper function to get appropriate route for each phase
const getPhaseRoute = (phase: TLearningCyclePhase): string => {
  switch(phase) {
    case "DIAGNOSIS":
      return "/diagnostico";
    case "PERSONALIZED_PLAN":
      return "/plan";
    case "SKILL_TRAINING":
      return "/entrenamiento";
    case "CONTENT_STUDY":
      return "/contenido";
    case "PERIODIC_TESTS":
      return "/evaluaciones";
    case "FEEDBACK_ANALYSIS":
      return "/analisis";
    case "REINFORCEMENT":
      return "/reforzamiento";
    case "FINAL_SIMULATIONS":
      return "/simulaciones";
    default:
      return "/";
  }
};
