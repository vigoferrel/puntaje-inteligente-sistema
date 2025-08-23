/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { TLearningCyclePhase } from "../../types/system-types";
import { getPhaseIcon } from "./learning-cycle/phase-utils";
import { ArrowRight } from "lucide-react";
import { getUnifiedPhaseRoute } from "./learning-cycle/phase-card";

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
        return "Completa tu diagnÃ³stico inicial para crear un plan personalizado";
      case "PERSONALIZED_PLAN":
        return "Revisa y confirma tu plan de estudio personalizado";
      case "SKILL_TRAINING":
        return nextNodeId 
          ? "ContinÃºa con tu prÃ³xima actividad de entrenamiento de habilidades" 
          : "Comienza con el entrenamiento de habilidades segÃºn tu plan";
      case "CONTENT_STUDY":
        return "Estudia el contenido teÃ³rico relacionado con tus Ã¡reas de mejora";
      case "PERIODIC_TESTS":
        return "Realiza evaluaciones periÃ³dicas para medir tu progreso";
      case "FEEDBACK_ANALYSIS":
        return "Revisa el anÃ¡lisis de tu desempeÃ±o y Ã¡reas de mejora";
      case "REINFORCEMENT":
        return "Refuerza las habilidades en las que necesitas mÃ¡s prÃ¡ctica";
      case "FINAL_SIMULATIONS":
        return "Practica con simulaciones completas del examen PAES";
      default:
        return "ContinÃºa con tu plan de aprendizaje personalizado";
    }
  };

  // Determine the button text based on the current phase
  const getButtonText = () => {
    switch (currentPhase) {
      case "DIAGNOSIS":
        return "Realizar diagnÃ³stico";
      case "PERSONALIZED_PLAN":
        return "Ver mi plan";
      case "SKILL_TRAINING":
        return nextNodeId ? "Continuar entrenamiento" : "Comenzar entrenamiento";
      case "CONTENT_STUDY":
        return "Estudiar contenido";
      case "PERIODIC_TESTS":
        return "Realizar evaluaciÃ³n";
      case "FEEDBACK_ANALYSIS":
        return "Ver anÃ¡lisis";
      case "REINFORCEMENT":
        return "Reforzar habilidades";
      case "FINAL_SIMULATIONS":
        return "Hacer simulaciÃ³n";
      default:
        return "Continuar";
    }
  };

  // Determine the route based on the current phase and nextNodeId
  const getRoute = () => {
    if (currentPhase === "SKILL_TRAINING" && nextNodeId) {
      return `/node/${nextNodeId}`;
    }
    return getUnifiedPhaseRoute(currentPhase);
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

