/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Progress } from "../../../components/ui/progress";
import { BookOpen, Play, CheckCircle, Clock, ArrowRight, Plus } from "lucide-react";
import { LearningPlan, PlanProgress } from "../../../types/learning-plan";
import { motion } from "framer-motion";

interface PlanPersonalizadoProps {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  currentPlanProgress: PlanProgress | null;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  onCreatePlan: () => void;
  onSelectPlan: (plan: LearningPlan) => void;
  onUpdateProgress: () => void;
  streakData: unknown;
  onStudyActivity: () => void;
}

export const PlanPersonalizado = ({
  plans,
  currentPlan,
  currentPlanProgress,
  progressLoading,
  recommendedNodeId,
  onCreatePlan,
  onSelectPlan,
  onUpdateProgress,
  streakData,
  onStudyActivity
}: PlanPersonalizadoProps) => {
  
  if (!currentPlan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <Card className="bg-gray-800 border-gray-700 max-w-md mx-auto">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Â¡Crea tu primer plan!
            </h3>
            <p className="text-gray-400 mb-6">
              Genera un plan personalizado basado en tus objetivos y nivel actual
            </p>
            <Button onClick={onCreatePlan} className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Crear Plan Personalizado
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const nextNode = currentPlan.nodes.find(node => {
    const nodeProgress = currentPlanProgress?.nodeProgress?.[node.nodeId] || 0;
    return nodeProgress < 100;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Current Plan Header */}
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-700/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-white text-xl">{currentPlan.title}</CardTitle>
              <p className="text-gray-300 mt-1">{currentPlan.description}</p>
            </div>
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">
              Activo
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm text-gray-300">Progreso General</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {currentPlanProgress ? Math.round(currentPlanProgress.overallProgress) : 0}%
              </div>
              <Progress 
                value={currentPlanProgress ? currentPlanProgress.overallProgress : 0} 
                className="h-2"
              />
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-gray-300">Nodos Completados</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {currentPlanProgress ? currentPlanProgress.completedNodes : 0}
                <span className="text-sm text-gray-400 ml-1">
                  / {currentPlanProgress ? currentPlanProgress.totalNodes : 0}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-gray-300">En Progreso</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {currentPlanProgress ? currentPlanProgress.inProgressNodes : 0}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Recommended Activity */}
      {nextNode && (
        <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="h-5 w-5 text-green-400" />
              ContinÃºa tu aprendizaje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-white mb-1">
                  {nextNode.nodeName || `Nodo ${nextNode.position}`}
                </h4>
                <p className="text-gray-300 text-sm mb-2">
                  {nextNode.nodeDescription || "ContinÃºa con tu plan de estudio"}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                    {nextNode.nodeSkill || "Habilidad General"}
                  </Badge>
                  <span className="text-gray-400">
                    Dificultad: {nextNode.nodeDifficulty || "BÃ¡sica"}
                  </span>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                Continuar Estudiando
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPlan.nodes.slice(0, 6).map((node, index) => {
          const nodeProgress = currentPlanProgress?.nodeProgress?.[node.nodeId] || 0;
          const isCompleted = nodeProgress === 100;
          const isInProgress = nodeProgress > 0 && nodeProgress < 100;
          const isNext = node.nodeId === recommendedNodeId;
          
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`
                bg-gray-800 border-gray-700 hover:border-blue-600/50 transition-all cursor-pointer
                ${isNext ? 'ring-2 ring-blue-500/50 border-blue-500/50' : ''}
                ${isCompleted ? 'bg-green-900/20 border-green-700/50' : ''}
              `}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      ${isCompleted ? 'bg-green-600 text-white' : 
                        isInProgress ? 'bg-blue-600 text-white' : 
                        'bg-gray-700 text-gray-300'}
                    `}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    {isNext && (
                      <Badge className="bg-blue-600/20 text-blue-400 text-xs">
                        Siguiente
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-medium text-white text-sm mb-1">
                    {node.nodeName || `Nodo ${node.position}`}
                  </h4>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                    {node.nodeDescription || "DescripciÃ³n del nodo"}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Progreso</span>
                      <span className="text-white">{Math.round(nodeProgress)}%</span>
                    </div>
                    <Progress value={nodeProgress} className="h-1" />
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3 border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    {isCompleted ? "Revisar" : isInProgress ? "Continuar" : "Comenzar"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          variant="outline" 
          onClick={onUpdateProgress}
          disabled={progressLoading}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Actualizar Progreso
        </Button>
        <Button onClick={onCreatePlan} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Crear Nuevo Plan
        </Button>
      </div>
    </motion.div>
  );
};

