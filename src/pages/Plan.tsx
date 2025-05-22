import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningPlans } from "@/hooks/use-learning-plans";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useUserData } from "@/hooks/use-user-data";
import { EmptyPlanState } from "@/components/plan/EmptyPlanState";
import { CurrentPlan } from "@/components/plan/CurrentPlan";
import { PlanSelector } from "@/components/plan/PlanSelector";
import { PlanProgress } from "@/types/learning-plan";
import { ensureLearningNodesExist } from "@/services/learning/initialize-learning-service";

const Plan = () => {
  const { profile } = useAuth();
  const { user } = useUserData();
  const navigate = useNavigate();
  const { 
    plans, 
    loading, 
    currentPlan,
    fetchLearningPlans,
    createLearningPlan,
    updatePlanProgress,
    setCurrentPlan
  } = useLearningPlans();
  
  const [planProgress, setPlanProgress] = useState<PlanProgress | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);
  
  useEffect(() => {
    const initializeData = async () => {
      setInitializing(true);
      
      // Asegurar que existan los nodos de aprendizaje en la BD
      await ensureLearningNodesExist();
      
      // Continuar con la carga normal
      if (profile) {
        await fetchLearningPlans(profile.id);
      }
      
      setInitializing(false);
    };
    
    initializeData();
  }, [profile, fetchLearningPlans]);
  
  useEffect(() => {
    const loadPlanProgress = async () => {
      if (profile && currentPlan) {
        const progress = await updatePlanProgress(profile.id, currentPlan.id);
        if (progress) {
          setPlanProgress(progress);
        }
      }
    };
    
    loadPlanProgress();
  }, [profile, currentPlan, updatePlanProgress]);
  
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
      // If this is the user's first plan, update their learning phase
      if (user?.learningCyclePhase === "DIAGNOSIS" || !user?.learningCyclePhase) {
        // In a real implementation, we would update the user's learning phase
        toast({
          title: "Fase actualizada",
          description: "Ahora estás en la fase de Entrenamiento de Habilidades",
        });
      }
    }
  };
  
  const handlePlanSelect = (plan) => {
    setCurrentPlan(plan);
    
    // Update plan progress after changing plan
    if (profile) {
      updatePlanProgress(profile.id, plan.id).then(progress => {
        if (progress) {
          setPlanProgress(progress);
        }
      });
    }
  };
  
  if (loading || initializing) {
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Cargando...
                </span>
              </div>
              <p className="mt-2">Cargando plan de estudio...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
        
        <div className="space-y-6">
          {plans.length === 0 ? (
            <EmptyPlanState onCreatePlan={handleCreatePlan} />
          ) : (
            <>
              {/* Current Plan Details */}
              {currentPlan && (
                <CurrentPlan 
                  plan={currentPlan}
                  loading={loading}
                  progress={planProgress}
                  recommendedNodeId={recommendedNodeId}
                  onUpdateProgress={() => {
                    if (profile && currentPlan) {
                      updatePlanProgress(profile.id, currentPlan.id).then(progress => {
                        if (progress) {
                          setPlanProgress(progress);
                          toast({
                            title: "Progreso actualizado",
                            description: "Se ha actualizado el progreso de tu plan",
                          });
                        }
                      });
                    }
                  }}
                  onCreatePlan={handleCreatePlan}
                />
              )}
              
              {/* Other Plans List */}
              <PlanSelector 
                plans={plans} 
                currentPlanId={currentPlan?.id} 
                onSelectPlan={handlePlanSelect} 
              />
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Plan;
