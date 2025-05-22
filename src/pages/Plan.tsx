
import React, { useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { usePlanInitialization } from "@/hooks/use-plan-initialization";
import { LoadingState } from "@/components/plan/LoadingState";
import { ErrorState } from "@/components/plan/ErrorState";
import { PlanContent } from "@/components/plan/PlanContent";
import { diagnoseMapperImports } from "@/utils/diagnostic-mappers";

const Plan = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { 
    profile,
    plans, 
    loading, 
    error,
    initializing,
    currentPlan,
    recommendedNodeId,
    progressLoading,
    getPlanProgress,
    handleRefresh,
    handlePlanSelect,
    updateCurrentPlanProgress
  } = usePlanInitialization();
  
  const { createLearningPlan } = useUserData();
  
  // Realizar diagnóstico al montar el componente
  useEffect(() => {
    console.log("Plan component mounted");
    try {
      const diagnosis = diagnoseMapperImports();
      console.log("Diagnóstico de mapeo desde Plan:", diagnosis);
    } catch (err) {
      console.error("Error en diagnóstico desde Plan:", err);
    }
  }, []);
  
  const handleCreatePlan = async () => {
    if (!profile) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para crear un plan",
        variant: "destructive"
      });
      return;
    }
    
    const targetCareer = user?.targetCareer || "General";
    
    const newPlan = await createLearningPlan(
      profile.id,
      `Plan PAES ${targetCareer}`,
      `Plan de preparación PAES personalizado para ${targetCareer}`,
      // Set target date to 3 months from now
      new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
    );
    
    if (newPlan) {
      // Si este es el primer plan del usuario, actualizamos su fase de aprendizaje
      if (user?.learningCyclePhase === "DIAGNOSIS" || !user?.learningCyclePhase) {
        toast({
          title: "Fase actualizada",
          description: "Ahora estás en la fase de Entrenamiento de Habilidades",
        });
      }
    }
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
          <ErrorState onRetry={handleRefresh} />
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
          recommendedNodeId={recommendedNodeId}
          onCreatePlan={handleCreatePlan}
          onSelectPlan={handlePlanSelect}
          onUpdateProgress={updateCurrentPlanProgress}
        />
      </div>
    </AppLayout>
  );
};

export default Plan;
