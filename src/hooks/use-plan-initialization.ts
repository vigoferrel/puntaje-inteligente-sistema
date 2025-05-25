
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningPlans } from "@/hooks/learning-plans";
import { toast } from "@/components/ui/use-toast";

export const usePlanInitialization = () => {
  const { profile } = useAuth();
  const { 
    plans, 
    loading, 
    error,
    currentPlan,
    retryFetchPlans,
    setCurrentPlan,
    getPlanProgress,
    loadPlanProgress
  } = useLearningPlans();
  
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  
  // Effect to handle plan progress loading when plans are available
  useEffect(() => {
    if (plans.length > 0 && profile && currentPlan) {
      loadPlanProgress(profile.id, currentPlan.id);
    }
  }, [plans, currentPlan, profile, loadPlanProgress]);
  
  // Función para actualizar el progreso del plan actual
  const updateCurrentPlanProgress = useCallback(() => {
    if (profile && currentPlan) {
      setProgressLoading(true);
      loadPlanProgress(profile.id, currentPlan.id)
        .finally(() => setProgressLoading(false));
      
      toast({
        title: "Actualizando",
        description: "Actualizando el progreso de tu plan...",
      });
    }
  }, [profile, currentPlan, loadPlanProgress]);
  
  // Función para reintentar la carga de planes
  const handleRefresh = useCallback(() => {
    if (profile) {
      retryFetchPlans(profile.id);
    }
  }, [profile, retryFetchPlans]);
  
  // Manejar selección de un plan
  const handlePlanSelect = useCallback((plan) => {
    setCurrentPlan(plan);
    
    // Cargar el progreso del plan seleccionado
    if (profile) {
      loadPlanProgress(profile.id, plan.id);
    }
  }, [profile, setCurrentPlan, loadPlanProgress]);
  
  return {
    profile,
    plans,
    loading,
    error,
    currentPlan,
    recommendedNodeId,
    progressLoading,
    getPlanProgress,
    loadPlanProgress,
    handleRefresh,
    handlePlanSelect,
    updateCurrentPlanProgress
  };
};
