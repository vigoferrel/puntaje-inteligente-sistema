
import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { toast } from "@/components/ui/use-toast";
import { useLearningPlan } from "@/hooks/use-learning-plan";
import { LoadingState } from "@/components/plan/LoadingState";
import { ErrorState } from "@/components/plan/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { useAuth } from "@/contexts/AuthContext";
import { useStudyStreak } from "@/hooks/use-study-streak";
import { PlanMeta } from "@/components/plan/modern/PlanMeta";
import { PlanPersonalizado } from "@/components/plan/modern/PlanPersonalizado";
import { PlanInteligente } from "@/components/plan/modern/PlanInteligente";

const Plan = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("personalizado");
  
  const { 
    plans, 
    currentPlan,
    loading, 
    error, 
    initializing,
    progressLoading,
    getPlanProgress,
    refreshPlans,
    selectPlan,
    createPlan,
    updateCurrentPlanProgress
  } = useLearningPlan();
  
  const {
    fetchUserNodeProgress,
    nodeProgress
  } = useLearningNodes();
  
  const {
    streakData,
    updateStreak
  } = useStudyStreak();
  
  // Fetch node progress data when the component mounts and the user is authenticated
  useEffect(() => {
    if (profile?.id) {
      fetchUserNodeProgress(profile.id);
    }
  }, [profile?.id, fetchUserNodeProgress]);
  
  // Find a recommended node based on current progress
  const findRecommendedNodeId = () => {
    if (!currentPlan || !currentPlan.nodes.length) return null;
    
    // Look for nodes that are not started yet
    const notStartedNodes = currentPlan.nodes.filter(node => 
      !nodeProgress[node.nodeId] || nodeProgress[node.nodeId].progress === 0
    );
    
    if (notStartedNodes.length > 0) {
      // Return the first not started node as recommendation
      return notStartedNodes[0].nodeId;
    }
    
    // If all nodes have some progress, find the one with least progress
    const inProgressNodes = currentPlan.nodes.filter(node => 
      nodeProgress[node.nodeId] && 
      nodeProgress[node.nodeId].progress > 0 && 
      nodeProgress[node.nodeId].progress < 100
    );
    
    if (inProgressNodes.length > 0) {
      // Sort by progress (ascending) and return the first one
      return inProgressNodes.sort((a, b) => 
        (nodeProgress[a.nodeId]?.progress || 0) - (nodeProgress[b.nodeId]?.progress || 0)
      )[0].nodeId;
    }
    
    return null;
  };
  
  const recommendedNodeId = findRecommendedNodeId();
  
  const handleCreatePlan = async () => {
    if (!profile?.id) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información del usuario. Por favor, recarga la página.",
        variant: "destructive"
      });
      return;
    }
    
    const targetCareer = profile?.targetCareer || "General";
    const newPlan = await createPlan(
      `Plan PAES ${targetCareer}`,
      `Plan de preparación PAES personalizado para ${targetCareer}`
    );
    
    if (newPlan) {
      toast({
        title: "¡Plan creado!",
        description: "Tu nuevo plan de estudio ha sido creado exitosamente."
      });
    }
  };
  
  // Show loading only if we're actually initializing
  if (initializing && loading) {
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Mi Plan</h1>
          <LoadingState 
            message="Inicializando datos de aprendizaje..." 
          />
        </div>
      </AppLayout>
    );
  }
  
  // Show error state
  if (error) {
    console.error("Error en Plan component:", error);
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">Mi Plan</h1>
          <ErrorState onRetry={refreshPlans} />
        </div>
      </AppLayout>
    );
  }
  
  // Get the progress of the current plan
  const currentPlanProgress = currentPlan ? getPlanProgress(currentPlan.id) : null;
  
  console.log('Plan component render:', {
    initializing,
    loading,
    plans: plans.length,
    currentPlan: currentPlan?.title,
    currentPlanProgress,
    profile: profile?.id
  });
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Mi Plan</h1>
            <p className="text-gray-400">Gestiona tu preparación PAES de manera inteligente</p>
          </div>
          
          {/* Meta Section */}
          <PlanMeta 
            profile={profile}
            currentPlan={currentPlan}
            currentPlanProgress={currentPlanProgress}
          />
          
          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
              <TabsTrigger 
                value="personalizado" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-300"
              >
                Plan Personalizado
              </TabsTrigger>
              <TabsTrigger 
                value="inteligente"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-300"
              >
                Plan Inteligente
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personalizado" className="mt-6">
              <PlanPersonalizado 
                plans={plans}
                currentPlan={currentPlan}
                currentPlanProgress={currentPlanProgress}
                progressLoading={progressLoading}
                recommendedNodeId={recommendedNodeId}
                onCreatePlan={handleCreatePlan}
                onSelectPlan={selectPlan}
                onUpdateProgress={updateCurrentPlanProgress}
                streakData={streakData}
                onStudyActivity={updateStreak}
              />
            </TabsContent>
            
            <TabsContent value="inteligente" className="mt-6">
              <PlanInteligente 
                profile={profile}
                nodeProgress={nodeProgress}
                onCreatePlan={handleCreatePlan}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default Plan;
