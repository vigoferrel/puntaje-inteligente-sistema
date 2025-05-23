
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { Skeleton } from "@/components/ui/skeleton";
import { PhaseGrid } from "./learning-cycle/phase-grid";
import { ActionButtons } from "./learning-cycle/action-buttons";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Award, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

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
    completionPercentage,
    nodes,
    nodeProgress
  } = useLearningNodes();

  // Calcular métricas adicionales para el dashboard
  const totalNodes = nodes?.length || 0;
  const completedNodes = Object.values(nodeProgress || {}).filter(p => p.status === 'completed').length;
  const inProgressNodes = Object.values(nodeProgress || {}).filter(p => p.status === 'in_progress').length;
  
  // Calcular tiempo estimado restante
  const remainingNodes = nodes?.filter(node => 
    !nodeProgress[node.id] || nodeProgress[node.id].status !== 'completed'
  ) || [];
  const estimatedTimeRemaining = remainingNodes.reduce((total, node) => 
    total + (node.estimatedTimeMinutes || 30), 0
  );
  
  // Variantes de animación para elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <Card className={`${className} overflow-hidden border-border`}>
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <span>Tu Ciclo de Aprendizaje</span>
              <Badge variant="default" className="ml-2">Fase {currentPhaseIndex + 1}/8</Badge>
            </CardTitle>
            <CardDescription className="mt-1 flex items-center gap-1">
              <Target className="h-4 w-4 text-primary" />
              <span>Progreso general: {completionPercentage}%</span>
            </CardDescription>
          </div>
        </div>
        <Progress value={completionPercentage} className="h-2 mt-2" />
      </CardHeader>

      <CardContent className="space-y-6 pt-5">
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Métricas de aprendizaje */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-primary/5 border border-primary/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Nodos Completados</p>
                    <p className="text-2xl font-bold">{completedNodes}/{totalNodes}</p>
                  </div>
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-amber-500/5 border border-amber-500/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">En Progreso</p>
                    <p className="text-2xl font-bold">{inProgressNodes}</p>
                  </div>
                  <div className="h-10 w-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-amber-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-purple-500/5 border border-purple-500/10">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tiempo Restante</p>
                    <p className="text-2xl font-bold">{Math.round(estimatedTimeRemaining / 60)}h</p>
                  </div>
                  <div className="h-10 w-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <PhaseGrid 
                currentPhase={currentPhase} 
                calculatePhaseProgress={calculatePhaseProgress} 
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ActionButtons 
                currentPhase={currentPhase}
                onLectoGuiaClick={handleLectoGuiaClick}
              />
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
