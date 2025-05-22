
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { PlanNodesList } from "./PlanNodesList";
import { TPAESHabilidad } from "@/types/system-types";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface CurrentPlanProps {
  plan: LearningPlan | null;
  loading: boolean;
  progress: PlanProgress | null;
  recommendedNodeId: string | null;
  onUpdateProgress: () => void;
  onCreatePlan: (title: string, skillPriorities?: Record<TPAESHabilidad, number>) => void;
}

export function CurrentPlan({
  plan,
  loading,
  progress,
  recommendedNodeId,
  onUpdateProgress,
  onCreatePlan,
}: CurrentPlanProps) {
  const [creating, setCreating] = useState(false);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No establecida";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleCreateSamplePlan = () => {
    setCreating(true);
    
    // Default skill priorities para evitar errores de TypeScript
    const defaultSkillPriorities: Record<TPAESHabilidad, number> = {
      "SOLVE_PROBLEMS": 0.5,
      "REPRESENT": 0.5,
      "MODEL": 0.5,
      "INTERPRET_RELATE": 0.5,
      "EVALUATE_REFLECT": 0.5,
      "TRACK_LOCATE": 0.5,
      "ARGUE_COMMUNICATE": 0.5,
      "IDENTIFY_THEORIES": 0.5,
      "PROCESS_ANALYZE": 0.5,
      "APPLY_PRINCIPLES": 0.5,
      "SCIENTIFIC_ARGUMENT": 0.5,
      "TEMPORAL_THINKING": 0.5,
      "SOURCE_ANALYSIS": 0.5,
      "MULTICAUSAL_ANALYSIS": 0.5,
      "CRITICAL_THINKING": 0.5,
      "REFLECTION": 0.5
    };
    
    onCreatePlan("Mi plan de estudio PAES", defaultSkillPriorities);
  };

  // Reset creating state after plan changes
  useEffect(() => {
    if (plan) {
      setCreating(false);
    }
  }, [plan]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/6" />
                </div>
                <Skeleton className="h-2 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  if (!plan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Ningún plan seleccionado</CardTitle>
            <CardDescription>
              No tienes ningún plan de estudio activo actualmente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Un plan de estudio te ayudará a organizar tu aprendizaje y prepararte
              efectivamente para la PAES. Crea tu primer plan para comenzar.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateSamplePlan}
              disabled={creating}
              className="w-full"
            >
              {creating ? (
                <>
                  <span className="mr-2">Creando plan...</span>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </>
              ) : (
                "Crear mi primer plan"
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl md:text-2xl">{plan.title}</CardTitle>
              <CardDescription>
                {plan.description || "Plan de estudio personalizado"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progreso general</span>
              <span className="font-medium">
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
                ) : (
                  progress ? 
                    `${Math.round(progress.overallProgress)}%` : 
                    "0%"
                )}
              </span>
            </div>
            <Progress
              value={loading ? null : (progress ? progress.overallProgress : 0)}
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                {loading ? (
                  <span className="inline-flex items-center">
                    <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                    Actualizando...
                  </span>
                ) : (
                  progress ?
                    `${progress.completedNodes}/${progress.totalNodes} módulos completados` :
                    "0/0 módulos completados"
                )}
              </span>
              <span>Fecha objetivo: {formatDate(plan.targetDate)}</span>
            </div>
          </div>

          <div className="pt-2">
            <PlanNodesList
              nodes={plan.nodes}
              recommendedNodeId={recommendedNodeId}
              progress={progress}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onUpdateProgress} 
            variant="outline" 
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Actualizando progreso...
              </>
            ) : (
              "Actualizar progreso"
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
