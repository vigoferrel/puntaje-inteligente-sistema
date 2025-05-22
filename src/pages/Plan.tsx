import React, { useEffect, useState, useCallback } from "react";
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
    setCurrentPlan,
    getPlanProgress
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
  }, [profile, fetchLearningPlans, currentPlan]);
  
  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);
  
  // Función para cargar el progreso de un plan específico
  const loadPlanProgress = useCallback(async (userId: string, planId: string) => {
    if (!userId || !planId) return;
    
    try {
      setProgressLoading(true);
      console.log(`Cargando progreso para plan ${planId}...`);
      
      // Verificar si ya tenemos el progreso en caché
      const cachedProgress = getPlanProgress(planId);
      if (cachedProgress) {
        console.log('Usando progreso en caché mientras se actualiza');
      }
      
      const progress = await updatePlanProgress(userId, planId);
      if (progress) {
        // El progreso se actualiza en el hook
        console.log('Progreso actualizado correctamente');
      }
    } catch (error) {
      console.error("Error loading plan progress:", error);
    } finally {
      setProgressLoading(false);
    }
  }, [updatePlanProgress, getPlanProgress]);
  
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
      
      // Cargar el progreso del nuevo plan
      loadPlanProgress(profile.id, newPlan.id);
    }
  };
  
  const handlePlanSelect = (plan) => {
    setCurrentPlan(plan);
    
    // Cargar el progreso del plan seleccionado
    if (profile) {
      loadPlanProgress(profile.id, plan.id);
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
  
  // Obtener el progreso del plan actual
  const currentPlanProgress = currentPlan ? getPlanProgress(currentPlan.id) : null;
  
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
                    progress={currentPlanProgress}
                    recommendedNodeId={recommendedNodeId}
                    onUpdateProgress={() => {
                      if (profile && currentPlan) {
                        loadPlanProgress(profile.id, currentPlan.id);
                        toast({
                          title: "Actualizando",
                          description: "Actualizando el progreso de tu plan...",
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
