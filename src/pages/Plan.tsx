import React, { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningPlans, LearningPlan } from "@/hooks/use-learning-plans";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, BookOpenIcon, ClockIcon, CheckCircleIcon, PlusCircleIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useUserData } from "@/hooks/use-user-data";

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
  
  const [planProgress, setPlanProgress] = useState<{ 
    totalNodes: number;
    completedNodes: number;
    inProgressNodes: number;
    overallProgress: number;
  } | null>(null);
  
  useEffect(() => {
    if (profile) {
      fetchLearningPlans(profile.id);
    }
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
  
  const handlePlanSelect = (plan: LearningPlan) => {
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
  
  if (loading) {
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
        
        {plans.length === 0 ? (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Crea tu Plan de Estudio</CardTitle>
              <CardDescription>
                Aún no tienes un plan de estudio personalizado. Vamos a crear uno basado en tu diagnóstico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <BookOpenIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Plan Personalizado</h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Crearemos un plan adaptado a tus necesidades según tu diagnóstico y carrera objetivo.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={handleCreatePlan}>
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Crear mi Plan de Estudio
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Current Plan Details */}
            {currentPlan && (
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{currentPlan.title}</CardTitle>
                      <CardDescription>{currentPlan.description}</CardDescription>
                    </div>
                    {plans.length > 1 && (
                      <Button variant="outline" size="sm">
                        Cambiar Plan
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Plan Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Fecha Objetivo</p>
                        <p className="font-semibold">
                          {currentPlan.targetDate 
                            ? format(new Date(currentPlan.targetDate), "dd 'de' MMMM, yyyy", { locale: es })
                            : "No definida"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <BookOpenIcon className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Total de Módulos</p>
                        <p className="font-semibold">{currentPlan.nodes.length} módulos</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                      <ClockIcon className="h-5 w-5 text-primary mr-2" />
                      <div>
                        <p className="text-xs font-medium text-gray-600">Progreso General</p>
                        <p className="font-semibold">
                          {planProgress ? `${Math.round(planProgress.overallProgress * 100)}%` : "0%"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Plan Nodes */}
                  <div className="space-y-2">
                    <h3 className="font-medium">Módulos de estudio</h3>
                    
                    <div className="space-y-3">
                      {currentPlan.nodes.map((node, index) => (
                        <div 
                          key={node.id} 
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{node.nodeName}</p>
                              <p className="text-xs text-gray-500">
                                {node.nodeSkill 
                                  ? `Habilidad: ${node.nodeSkill}` 
                                  : "Módulo de estudio"}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            {/* In a real implementation, we would show the actual status */}
                            <Badge variant={index === 0 ? "default" : "outline"}>
                              {index === 0 ? "En progreso" : "Pendiente"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => navigate("/")}>
                    Volver al Dashboard
                  </Button>
                  <Button onClick={() => navigate("/entrenamiento")}>
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Iniciar Estudio
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Other Plans List (if there are multiple) */}
            {plans.length > 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Otros planes disponibles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {plans
                    .filter(plan => plan.id !== currentPlan?.id)
                    .map(plan => (
                      <Card 
                        key={plan.id} 
                        className="cursor-pointer hover:border-primary/50 transition-colors"
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <CardHeader>
                          <CardTitle className="text-lg">{plan.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{plan.description}</CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Button variant="outline" className="w-full" onClick={() => handlePlanSelect(plan)}>
                            Seleccionar Plan
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Plan;
