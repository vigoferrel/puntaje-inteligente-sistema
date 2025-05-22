
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  BarChart3, 
  Target, 
  Sparkles,
  PenTool, 
  Brain, 
  CheckCircle, 
  ArrowUpRight
} from "lucide-react";
import { 
  LEARNING_CYCLE_PHASES_ORDER, 
  TLearningCyclePhase, 
  getLearningCyclePhaseDisplayName 
} from "@/types/system-types";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { Skeleton } from "@/components/ui/skeleton";

interface LearningWorkflowProps {
  className?: string;
}

export const LearningWorkflow = ({ className }: LearningWorkflowProps) => {
  const { user } = useAuth();
  const { getLearningCyclePhase, nodeProgress, loading } = useLearningNodes();
  const [currentPhase, setCurrentPhase] = useState<TLearningCyclePhase>("DIAGNOSIS");

  useEffect(() => {
    const loadUserPhase = async () => {
      if (user?.id) {
        try {
          const phase = await getLearningCyclePhase(user.id);
          setCurrentPhase(phase);
        } catch (error) {
          console.error("Error cargando fase de aprendizaje:", error);
        }
      }
    };
    
    loadUserPhase();
  }, [user?.id, getLearningCyclePhase]);

  // Calculate completed nodes percentage
  const calculateProgress = () => {
    if (!nodeProgress) return 0;
    
    const nodes = Object.values(nodeProgress);
    if (nodes.length === 0) return 0;
    
    const completedNodes = nodes.filter(node => node.status === 'completed').length;
    return Math.round((completedNodes / nodes.length) * 100);
  };

  // Get phase icon
  const getPhaseIcon = (phase: TLearningCyclePhase) => {
    const icons = {
      DIAGNOSIS: BarChart3,
      PERSONALIZED_PLAN: Target,
      SKILL_TRAINING: Brain,
      CONTENT_STUDY: BookOpen,
      PERIODIC_TESTS: PenTool,
      FEEDBACK_ANALYSIS: Sparkles,
      REINFORCEMENT: CheckCircle,
      FINAL_SIMULATIONS: ArrowUpRight,
    };
    
    const Icon = icons[phase] || BookOpen;
    return <Icon className="h-5 w-5" />;
  };

  // Get route for each phase
  const getPhaseRoute = (phase: TLearningCyclePhase) => {
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

  const currentPhaseIndex = LEARNING_CYCLE_PHASES_ORDER.indexOf(currentPhase);
  const completionPercentage = calculateProgress();

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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={completionPercentage} className="h-2" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {LEARNING_CYCLE_PHASES_ORDER.map((phase, index) => {
              const isActive = phase === currentPhase;
              const isCompleted = index < currentPhaseIndex;
              const isPending = index > currentPhaseIndex;
              
              return (
                <Link to={getPhaseRoute(phase)} key={phase}>
                  <Card className={`h-full transition-all hover:shadow-md ${
                    isActive ? "bg-primary/10 border-primary" : 
                    isCompleted ? "bg-green-50 border-green-200" : 
                    "bg-background"
                  } ${isPending ? "opacity-70" : ""}`}>
                    <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                      <div className={`rounded-full p-2 ${
                        isActive ? "bg-primary/20" : 
                        isCompleted ? "bg-green-100" : 
                        "bg-secondary/50"
                      }`}>
                        {getPhaseIcon(phase)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          {getLearningCyclePhaseDisplayName(phase)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isActive ? "En curso" : isCompleted ? "Completado" : "Pendiente"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          
          <div className="flex justify-end">
            <Button asChild size="sm">
              <Link to={getPhaseRoute(currentPhase)}>
                Continuar con {getLearningCyclePhaseDisplayName(currentPhase)}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
