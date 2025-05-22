
import React, { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/components/ui/use-toast";
import { useLearningPlan } from "@/hooks/use-learning-plan";
import { LoadingState } from "@/components/plan/LoadingState";
import { ErrorState } from "@/components/plan/ErrorState";
import { PlanContent } from "@/components/plan/PlanContent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { useAuth } from "@/contexts/AuthContext";

const Plan = () => {
  const { user } = useUserData();
  const { profile } = useAuth();
  
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
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear un plan",
        variant: "destructive"
      });
      return;
    }
    
    const targetCareer = user?.targetCareer || "General";
    await createPlan(
      `Plan PAES ${targetCareer}`,
      `Plan de preparación PAES personalizado para ${targetCareer}`
    );
    
    toast({
      title: "¡Plan creado!",
      description: "Tu nuevo plan de estudio ha sido creado exitosamente."
    });
  };
  
  // Contenido de carga
  if (loading || initializing) {
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
          <LoadingState 
            message={initializing ? "Inicializando datos de aprendizaje..." : "Cargando plan de estudio..."} 
          />
        </div>
      </AppLayout>
    );
  }
  
  // Contenido de error
  if (error) {
    console.error("Error en Plan component:", error);
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
          <ErrorState onRetry={refreshPlans} />
        </div>
      </AppLayout>
    );
  }
  
  // Obtener el progreso del plan actual
  const currentPlanProgress = currentPlan ? getPlanProgress(currentPlan.id) : null;
  
  return (
    <AppLayout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Plan de Estudio</h1>
        </div>
        
        <PlanContent 
          plans={plans}
          currentPlan={currentPlan}
          currentPlanProgress={currentPlanProgress}
          progressLoading={progressLoading}
          recommendedNodeId={recommendedNodeId}
          onCreatePlan={handleCreatePlan}
          onSelectPlan={selectPlan}
          onUpdateProgress={updateCurrentPlanProgress}
        />
      </div>
    </AppLayout>
  );
};

export default Plan;
