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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

const Plan = () => {
  const { profile } = useAuth();
  const { user } = useUserData();
  const navigate = useNavigate();
  const { 
    plans, 
    loading, 
    error,
    currentPlan,
    fetchLearningPlans,
    retryFetchPlans,
    createLearningPlan,
    updatePlanProgress,
    setCurrentPlan
  } = useLearningPlans();
  
  const [planProgress, setPlanProgress] = useState<PlanProgress | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);
  const [progressLoading, setProgressLoading] = useState(false);
  
  useEffect(() => {
    const initializeData = async () => {
      setInitializing(true);
      
      try {
        // Asegurar que existan los nodos de aprendizaje en la BD
        await ensureLearningNodesExist();
        
        // Continuar con la carga normal
        if (profile) {
          await fetchLearningPlans(profile.id);
        }
      } catch (error) {
        console.error("Error initializing learning data:", error);
        toast({
          title: "Error",
          description: "No se pudieron inicializar los datos de aprendizaje",
          variant: "destructive"
        });
      } finally {
        setInitializing(false);
      }
    };
    
    initializeData();
  }, [profile, fetchLearningPlans]);
  
  useEffect(() => {
    const loadPlanProgress = async () => {
      if (!profile || !currentPlan) return;
      
      try {
        setProgressLoading(true);
        const progress = await updatePlanProgress(profile.id, currentPlan.id);
        if (progress) {
          setPlanProgress(progress);
        }
      } catch (error) {
        console.error("Error loading plan progress:", error);
      } finally {
        setProgressLoading(false);
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
      setPlanProgress(null); // Reset progress for new plan
      
      // If this is the user's first plan, update their learning phase
      if (user?.learningCyclePhase === "DIAGNOSIS" || !user?.learningCyclePhase) {
        toast({
          title: "Fase actualizada",
          description: "Ahora estás en la fase de Entrenamiento de Habilidades",
        });
      }
    }
  };
  
  const handlePlanSelect = (plan) => {
    setCurrentPlan(plan);
    setPlanProgress(null); // Reset progress while loading new plan
    
    // Update plan progress after changing plan
    if (profile) {
      updatePlanProgress(profile.id, plan.id).then(progress => {
        if (progress) {
          setPlanProgress(progress);
        }
      });
    }
  };
  
  const handleRefresh = () => {
    if (profile) {
      retryFetchPlans(profile.id);
    }
  };
  
  // Contenido de carga
  if (loading || initializing) {
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
          <Card className="p-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              <p className="text-center text-muted-foreground">
                {initializing ? "Inicializando datos de aprendizaje..." : "Cargando plan de estudio..."}
              </p>
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }
  
  // Contenido de error
  if (error) {
    return (
      <AppLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>No se pudo cargar el plan de estudio. Por favor, intenta de nuevo.</p>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="w-fit flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Plan de Estudio</h1>
        
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
              <EmptyPlanState onCreatePlan={handleCreatePlan} />
            ) : (
              <>
                {/* Current Plan Details */}
                {currentPlan && (
                  <CurrentPlan 
                    plan={currentPlan}
                    loading={progressLoading}
                    progress={planProgress}
                    recommendedNodeId={recommendedNodeId}
                    onUpdateProgress={() => {
                      if (profile && currentPlan) {
                        setProgressLoading(true);
                        updatePlanProgress(profile.id, currentPlan.id).then(progress => {
                          setProgressLoading(false);
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
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Plan;
