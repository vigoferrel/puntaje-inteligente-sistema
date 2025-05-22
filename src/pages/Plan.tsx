
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/components/ui/use-toast";
import { useLearningPlan } from "@/hooks/use-learning-plan";
import { LoadingState } from "@/components/plan/LoadingState";
import { ErrorState } from "@/components/plan/ErrorState";
import { PlanContent } from "@/components/plan/PlanContent";

const Plan = () => {
  const { user } = useUserData();
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
        <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
        
        <PlanContent 
          plans={plans}
          currentPlan={currentPlan}
          currentPlanProgress={currentPlanProgress}
          progressLoading={progressLoading}
          recommendedNodeId={null}
          onCreatePlan={handleCreatePlan}
          onSelectPlan={selectPlan}
          onUpdateProgress={updateCurrentPlanProgress}
        />
      </div>
    </AppLayout>
  );
};

export default Plan;
