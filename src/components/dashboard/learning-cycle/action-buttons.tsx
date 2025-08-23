
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { TLearningCyclePhase } from "@/types/system-types";
import { getUnifiedPhaseRoute } from "./phase-card";

interface ActionButtonsProps {
  currentPhase: TLearningCyclePhase;
  onLectoGuiaClick: () => void;
}

export const ActionButtons = ({ currentPhase, onLectoGuiaClick }: ActionButtonsProps) => {
  return (
    <div className="flex justify-between items-center">
      <Button 
        size="sm" 
        variant="outline"
        onClick={onLectoGuiaClick}
        asChild
      >
        <Link to="/lectoguia">
          <Sparkles className="h-4 w-4 mr-2" />
          LectoGuía AI
        </Link>
      </Button>

      <Button asChild size="sm">
        <Link to={getUnifiedPhaseRoute(currentPhase)}>
          {getActionText(currentPhase)}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

// Helper function to get appropriate action text
const getActionText = (phase: TLearningCyclePhase) => {
  switch(phase) {
    case 'DIAGNOSIS':
      return 'Realizar diagnóstico';
    case 'PERSONALIZED_PLAN':
      return 'Ver mi plan';
    case 'SKILL_TRAINING':
      return 'Entrenar habilidades';
    case 'CONTENT_STUDY':
      return 'Estudiar contenidos';
    case 'PERIODIC_TESTS':
      return 'Hacer evaluaciones';
    case 'FEEDBACK_ANALYSIS':
      return 'Ver análisis';
    case 'REINFORCEMENT':
      return 'Reforzar habilidades';
    case 'FINAL_SIMULATIONS':
      return 'Hacer simulaciones';
    default:
      return 'Continuar';
  }
};
