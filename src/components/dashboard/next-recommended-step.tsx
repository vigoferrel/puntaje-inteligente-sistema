
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TLearningCyclePhase } from "@/types/system-types";
import { getPhaseIcon } from "./learning-cycle/phase-utils";
import { ArrowRight } from "lucide-react";
import { getPhaseRoute } from "./learning-cycle/phase-card";

interface NextRecommendedStepProps {
  currentPhase: TLearningCyclePhase;
  nextNodeId?: string | null;
  className?: string;
}

export const NextRecommendedStep = ({ 
  currentPhase, 
  nextNodeId, 
  className 
}: NextRecommendedStepProps) => {
  const Icon = getPhaseIcon(currentPhase);
  
  // Determine the recommendation text based on the current phase
  const getRecommendationText = () => {
    switch (currentPhase) {
      case "DIAGNOSIS":
        return "Completa tu diagnóstico inicial para crear un plan personalizado";
      case "PERSONALIZED_PLAN":
        return "Revisa y confirma tu plan de estudio personalizado";
      case "SKILL_TRAINING":
        return nextNodeId 
          ? "Continúa con tu próxima actividad de entrenamiento de habilidades" 
          : "Comienza con el entrenamiento de habilidades según tu plan";
      case "CONTENT_STUDY":
        return "Estudia el contenido teórico relacionado con tus áreas de mejora";
      case "PERIODIC_TESTS":
        return "Realiza evaluaciones periódicas para medir tu progreso";
      case "FEEDBACK_ANALYSIS":
        return "Revisa el análisis de tu desempeño y áreas de mejora";
      case "REINFORCEMENT":
        return "Refuerza las habilidades en las que necesitas más práctica";
      case "FINAL_SIMULATIONS":
        return "Practica con simulaciones completas del examen PAES";
      default:
        return "Continúa con tu plan de aprendizaje personalizado";
    }
  };

  // Determine the button text based on the current phase
  const getButtonText = () => {
    switch (currentPhase) {
      case "DIAGNOSIS":
        return "Realizar diagnóstico";
      case "PERSONALIZED_PLAN":
        return "Ver mi plan";
      case "SKILL_TRAINING":
        return nextNodeId ? "Continuar entrenamiento" : "Comenzar entrenamiento";
      case "CONTENT_STUDY":
        return "Estudiar contenido";
      case "PERIODIC_TESTS":
        return "Realizar evaluación";
      case "FEEDBACK_ANALYSIS":
        return "Ver análisis";
      case "REINFORCEMENT":
        return "Reforzar habilidades";
      case "FINAL_SIMULATIONS":
        return "Hacer simulación";
      default:
        return "Continuar";
    }
  };

  // Determine the route based on the current phase and nextNodeId
  const getRoute = () => {
    if (currentPhase === "SKILL_TRAINING" && nextNodeId) {
      return `/node/${nextNodeId}`;
    }
    return getPhaseRoute(currentPhase);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          Siguiente paso recomendado
        </CardTitle>
        <CardDescription>
          Basado en tu progreso actual
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{getRecommendationText()}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full group">
          <Link to={getRoute()}>
            {getButtonText()}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
