import React, { useState } from "react";
import { LearningPlan } from "@/types/learning-plan";
import { EmptyPlanState } from "./EmptyPlanState";
import { CurrentPlan } from "./current-plan";
import { PlanSelector } from "./PlanSelector";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlayCircle, CalendarDays, BarChart2, CheckCircle, Flame, Clock, BookOpen, GraduationCap, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { StudyStreakCard } from "./study-streak/StudyStreakCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
interface PlanContentProps {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  currentPlanProgress: any;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  onCreatePlan: () => void;
  onSelectPlan: (plan: LearningPlan) => void;
  onUpdateProgress: () => void;
  streakData?: {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
    totalStudyDays: number;
  };
  onStudyActivity?: () => void;
}
export const PlanContent = ({
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
}: PlanContentProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("current-plan");

  // Find the first in-progress node to continue
  const findContinueNode = () => {
    if (!currentPlan || !currentPlanProgress?.nodeProgress) return null;
    const inProgressNode = currentPlan.nodes.find(node => {
      const progress = currentPlanProgress.nodeProgress[node.nodeId];
      return progress && progress > 0 && progress < 100;
    });

    // If no in-progress node, use recommended node
    if (!inProgressNode && recommendedNodeId) {
      return currentPlan.nodes.find(node => node.nodeId === recommendedNodeId);
    }
    return inProgressNode || null;
  };
  const continueNode = findContinueNode();
  const handleContinue = () => {
    if (continueNode) {
      if (onStudyActivity) {
        onStudyActivity();
      }
      navigate(`/node/${continueNode.nodeId}`);
    }
  };
  const getCompletionStatus = () => {
    if (!currentPlanProgress) return {
      text: "0/0 módulos",
      percentage: 0
    };
    const {
      completedNodes,
      totalNodes
    } = currentPlanProgress;
    const percentage = totalNodes > 0 ? completedNodes / totalNodes * 100 : 0;
    return {
      text: `${completedNodes}/${totalNodes} módulos`,
      percentage
    };
  };
  const completionStatus = getCompletionStatus();
  const getTimeEstimate = () => {
    if (!currentPlan?.nodes) return "0 min";

    // Assume each node takes about 30 minutes to complete
    const remainingNodes = currentPlanProgress ? currentPlan.nodes.length - currentPlanProgress.completedNodes : currentPlan.nodes.length;
    const remainingMinutes = remainingNodes * 30;
    if (remainingMinutes >= 60) {
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      return `${hours} h${minutes > 0 ? ` ${minutes} min` : ''}`;
    }
    return `${remainingMinutes} min`;
  };
  const getRecommendationText = () => {
    if (!currentPlan || !continueNode) return "";
    const streak = streakData?.currentStreak || 0;
    if (streak >= 3) {
      return "Sigue con tu buena racha. ¡Ya llevas 3 días o más!";
    } else if (streak > 0) {
      return "¡Buen comienzo! Continúa estudiando para mejorar tu racha.";
    } else if (currentPlanProgress && currentPlanProgress.completedNodes > 0) {
      return "Retoma tu plan de estudio para construir una racha.";
    } else {
      return "Comienza tu plan de estudio hoy.";
    }
  };
  return <AnimatePresence mode="wait">
      <motion.div key="plan-content" initial={{
      opacity: 0,
      y: 10
    }} animate={{
      opacity: 1,
      y: 0
    }} exit={{
      opacity: 0
    }} transition={{
      duration: 0.3
    }} className="space-y-6">
        {plans.length === 0 ? <EmptyPlanState onCreatePlan={onCreatePlan} /> : <>
            {/* Dashboard Cards */}
            {currentPlan && <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Main Continue Learning Card */}
                <Card className="col-span-1 md:col-span-6 border-primary/20 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <PlayCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Continuar aprendiendo</h3>
                        <p className="text-sm text-muted-foreground">
                          {getRecommendationText()}
                        </p>
                      </div>
                    </div>
                    
                    {continueNode && <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              {continueNode.nodeName || `Módulo ${continueNode.position}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {continueNode.nodeSkill || "Habilidad"}
                              {continueNode.nodeDifficulty && <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                                  {continueNode.nodeDifficulty.charAt(0).toUpperCase() + continueNode.nodeDifficulty.slice(1)}
                                </Badge>}
                            </p>
                          </div>
                          <Button onClick={handleContinue} className="bg-primary">
                            Continuar
                          </Button>
                        </div>
                      </div>}
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 rounded-lg border border-green-100 bg-zinc-950">
                        <div className="flex items-center text-sm text-green-700 mb-1">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          <span>Completado</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{completionStatus.text}</p>
                          <p className="text-xs">{Math.round(completionStatus.percentage)}%</p>
                        </div>
                        <Progress value={completionStatus.percentage} className="h-1.5 mt-1 bg-green-200" indicatorClassName="bg-green-600" />
                      </div>
                      
                      <div className="p-2 rounded-lg border border-blue-100 bg-gray-950">
                        <div className="flex items-center text-sm text-blue-700 mb-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Tiempo restante</span>
                        </div>
                        <p className="font-medium">{getTimeEstimate()}</p>
                        <p className="text-xs text-blue-700 mt-1">Estimado para completar</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Study Streak Card */}
                <div className="col-span-1 md:col-span-3">
                  <StudyStreakCard streakData={streakData} />
                </div>
                
                {/* Quick Stats Card */}
                <Card className="col-span-1 md:col-span-3 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3 flex items-center">
                      <BarChart2 className="h-5 w-5 text-primary mr-2" />
                      Estadísticas
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                          <span className="text-sm">Nodos en progreso</span>
                        </div>
                        <Badge variant="outline" className="bg-zinc-50">
                          {currentPlanProgress?.inProgressNodes || 0}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <GraduationCap className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">Nivel completado</span>
                        </div>
                        <Badge variant="outline" className="bg-zinc-950">
                          {Math.round(completionStatus.percentage)}%
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <BrainCircuit className="h-4 w-4 text-purple-600 mr-2" />
                          <span className="text-sm">Dominio promedio</span>
                        </div>
                        <Badge variant="outline" className="bg-zinc-950">
                          {currentPlanProgress?.overallProgress ? Math.round(currentPlanProgress.overallProgress) : 0}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>}
            
            {/* Plans Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
              <TabsList className="mb-4">
                <TabsTrigger value="current-plan" className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Plan Actual
                </TabsTrigger>
                <TabsTrigger value="all-plans" className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Todos los Planes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="current-plan">
                {currentPlan && <CurrentPlan plan={currentPlan} loading={progressLoading} progress={currentPlanProgress} recommendedNodeId={recommendedNodeId} onUpdateProgress={onUpdateProgress} onCreatePlan={onCreatePlan} />}
              </TabsContent>
              
              <TabsContent value="all-plans">
                <PlanSelector plans={plans} currentPlanId={currentPlan?.id} onSelectPlan={onSelectPlan} />
              </TabsContent>
            </Tabs>
          </>}
      </motion.div>
    </AnimatePresence>;
};