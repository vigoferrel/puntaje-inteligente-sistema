
import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningPlans } from "@/hooks/use-learning-plans";
import { toast } from "@/components/ui/use-toast";
import { ensureLearningNodesExist } from "@/services/learning/initialize-learning-service";

export const usePlanInitialization = () => {
  const { profile } = useAuth();
  const { 
    plans, 
    loading, 
    error,
    currentPlan,
    fetchLearningPlans,
    retryFetchPlans,
    setCurrentPlan,
    getPlanProgress,
    loadPlanProgress
  } = useLearningPlans();
  
  const [initializing, setInitializing] = useState(true);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  
  // Función para cargar los datos necesarios en paralelo
  const loadInitialData = useCallback(async () => {
    if (!profile) return;
    
    setInitializing(true);
    console.log('Iniciando carga de datos...');
    
    try {
      // Cargar en paralelo para optimizar el tiempo de inicialización
      const [nodesExist, plansData] = await Promise.all([
        ensureLearningNodesExist(),
        fetchLearningPlans(profile.id)
      ]);
      
      console.log('Datos iniciales cargados correctamente');
      
      // Si hay un plan actual, cargamos su progreso
      if (currentPlan) {
        loadPlanProgress(profile.id, currentPlan.id);
      } else if (plansData && plansData.length > 0) {
        // Si no hay plan actual pero se cargaron planes, usamos el primero
        const firstPlan = plansData[0];
        loadPlanProgress(profile.id, firstPlan.id);
      }
    } catch (error) {
      console.error("Error en la carga inicial:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar los datos. Intente de nuevo.",
        variant: "destructive"
      });
    } finally {
      setInitializing(false);
    }
  }, [profile, fetchLearningPlans, currentPlan, loadPlanProgress]);
  
  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
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
    initializing,
    recommendedNodeId,
    progressLoading,
    getPlanProgress,
    loadPlanProgress,
    handleRefresh,
    handlePlanSelect,
    updateCurrentPlanProgress
  };
};
