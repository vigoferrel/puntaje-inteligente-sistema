
import React, { useState } from "react";
import { LearningPlan } from "@/types/learning-plan";
import { EmptyPlanState } from "./EmptyPlanState";
import { CurrentPlan } from "./current-plan";
import { PlanSelector } from "./PlanSelector";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlayCircle, CalendarDays, BarChart2, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface PlanContentProps {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  currentPlanProgress: any;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  onCreatePlan: () => void;
  onSelectPlan: (plan: LearningPlan) => void;
  onUpdateProgress: () => void;
}

export const PlanContent = ({
  plans,
  currentPlan,
  currentPlanProgress,
  progressLoading,
  recommendedNodeId,
  onCreatePlan,
  onSelectPlan,
  onUpdateProgress
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
      navigate(`/node/${continueNode.nodeId}`);
    }
  };
  
  const getStudyStreak = () => {
    // Placeholder for study streak - would be calculated from actual data
    return 3; // Example: 3 days streak
  };
  
  const streak = getStudyStreak();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="plan-content"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {plans.length === 0 ? (
          <EmptyPlanState onCreatePlan={onCreatePlan} />
        ) : (
          <>
            {/* Quick Actions */}
            {currentPlan && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Continue Learning */}
                <Card className="col-span-1 md:col-span-2 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <PlayCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Continuar aprendiendo</h3>
                        <p className="text-sm text-muted-foreground">
                          {continueNode ? 
                            `Continuar con "${continueNode.nodeName || `Módulo ${continueNode.position}`}"` : 
                            "Comienza tu próximo módulo"}
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleContinue}
                      disabled={!continueNode}
                      className="mt-3 md:mt-0"
                    >
                      Continuar
                    </Button>
                  </CardContent>
                </Card>
                
                {/* Study Streak */}
                <Card className="col-span-1 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                      <CalendarDays className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Racha de estudio</h3>
                      <p className="text-sm text-muted-foreground">
                        {streak > 0 ? 
                          `${streak} día${streak !== 1 ? 's' : ''} consecutivo${streak !== 1 ? 's' : ''}` : 
                          "Comienza hoy"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Completion Status */}
                <Card className="col-span-1 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">Completado</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentPlanProgress ? 
                          `${currentPlanProgress.completedNodes}/${currentPlanProgress.totalNodes} módulos` : 
                          "0/0 módulos"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Plans Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="current-plan">Plan Actual</TabsTrigger>
                <TabsTrigger value="all-plans">Todos los Planes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current-plan">
                {currentPlan && (
                  <CurrentPlan 
                    plan={currentPlan}
                    loading={progressLoading}
                    progress={currentPlanProgress}
                    recommendedNodeId={recommendedNodeId}
                    onUpdateProgress={onUpdateProgress}
                    onCreatePlan={onCreatePlan}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="all-plans">
                <PlanSelector 
                  plans={plans} 
                  currentPlanId={currentPlan?.id} 
                  onSelectPlan={onSelectPlan} 
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
