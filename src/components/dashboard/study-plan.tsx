
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearningPlan } from "@/hooks/use-learning-plan";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight, CheckCircle, Clock, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const StudyPlan = () => {
  const navigate = useNavigate();
  const { currentPlan, loading, initializing, getPlanProgress } = useLearningPlan();

  // Get progress for the current plan
  const currentPlanProgress = currentPlan ? getPlanProgress(currentPlan.id) : null;

  // Loading state
  if (loading || initializing) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-9 w-40" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No plan state
  if (!currentPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan de Estudio</CardTitle>
          <CardDescription>
            Crea tu plan personalizado de estudios PAES
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Sin plan de estudio</h3>
          <p className="mb-6 text-muted-foreground max-w-md">
            Aún no tienes un plan de estudio creado. Haz clic en el botón para crear uno personalizado.
          </p>
          <Button onClick={() => navigate("/plan")}>Crear Plan de Estudio</Button>
        </CardContent>
      </Card>
    );
  }

  // Default nodes to show if available
  const nodesToShow = currentPlan?.nodes.slice(0, 3) || [];
  
  // Find the next recommended node (first incomplete node)
  const findNextNode = () => {
    if (!currentPlan || !currentPlanProgress?.nodeProgress) return null;
    
    // First look for in-progress nodes
    const inProgressNode = currentPlan.nodes.find(node => {
      const progress = currentPlanProgress.nodeProgress[node.nodeId];
      return progress && progress > 0 && progress < 100;
    });
    
    if (inProgressNode) return inProgressNode;
    
    // Then look for not started nodes
    const notStartedNode = currentPlan.nodes.find(node => {
      const progress = currentPlanProgress.nodeProgress[node.nodeId];
      return !progress || progress === 0;
    });
    
    return notStartedNode || null;
  };
  
  const nextNode = findNextNode();
  
  // Helper function to get color scheme by index
  const getColorScheme = (index: number) => {
    const schemes = [
      {
        bg: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
        accent: "bg-blue-100 text-blue-600",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      {
        bg: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200",
        accent: "bg-purple-100 text-purple-600",
        button: "bg-purple-600 hover:bg-purple-700"
      },
      {
        bg: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
        accent: "bg-green-100 text-green-600",
        button: "bg-green-600 hover:bg-green-700"
      }
    ];
    return schemes[index % schemes.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentPlan.title}</CardTitle>
        <CardDescription>
          {currentPlan.description || "Basado en tu diagnóstico y objetivos de aprendizaje"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="rounded-lg border p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Progreso General</h3>
              <span className="text-sm font-medium">
                {currentPlanProgress ? `${Math.round(currentPlanProgress.overallProgress)}%` : "0%"}
              </span>
            </div>
            <Progress 
              value={currentPlanProgress ? currentPlanProgress.overallProgress : 0} 
              className="h-2 mb-2"
            />
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mt-2">
              <div className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                <span>
                  {currentPlanProgress ? 
                    `${currentPlanProgress.completedNodes}/${currentPlanProgress.totalNodes} completados` : 
                    "0/0 completados"}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1 text-blue-500" />
                <span>
                  {currentPlanProgress ? 
                    `${currentPlanProgress.inProgressNodes} en progreso` : 
                    "0 en progreso"}
                </span>
              </div>
              <div className="flex items-center">
                <Award className="h-3 w-3 mr-1 text-purple-500" />
                <span>
                  {nextNode ? "Continúa aprendiendo" : "¡Plan completado!"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Next Module or Recommended Modules */}
          {nextNode ? (
            <div className="bg-primary/5 rounded-lg p-4 mb-4 border border-primary/20">
              <h3 className="font-medium flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Continúa tu aprendizaje
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                {nextNode.nodeName || `Módulo ${nextNode.position}`}
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate(`/node/${nextNode.nodeId}`)}
                className="w-full"
              >
                Continuar <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
              <h3 className="font-medium flex items-center text-green-700">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                ¡Plan Completado!
              </h3>
              <p className="text-sm text-green-600/80 mt-1 mb-3">
                Has completado todos los módulos de este plan.
              </p>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => navigate("/plan")}
                className="w-full border-green-200 text-green-700 hover:bg-green-100"
              >
                Ver detalles
              </Button>
            </div>
          )}
          
          {/* Module Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodesToShow.length > 0 ? (
              nodesToShow.map((node, index) => {
                const colors = getColorScheme(index);
                const nodeProgress = currentPlanProgress?.nodeProgress?.[node.nodeId] || 0;
                
                let statusLabel = "Por comenzar";
                if (nodeProgress === 100) statusLabel = "Completado";
                else if (nodeProgress > 0) statusLabel = "En progreso";
                
                return (
                  <Card className={`${colors.bg} border`} key={node.id}>
                    <CardContent className="p-4">
                      <div className={`${colors.accent} h-10 w-10 rounded-full flex items-center justify-center mb-3`}>
                        {index + 1}
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">{node.nodeSkill || "Habilidad"}</h3>
                        <p className="text-sm text-gray-600">{node.nodeName || `Módulo ${index + 1}`}</p>
                        
                        <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-current rounded-full" 
                            style={{ 
                              width: `${nodeProgress}%`,
                              color: nodeProgress === 100 ? '#10b981' : '#6366f1'
                            }}
                          />
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{statusLabel}</span>
                          <span>{nodeProgress}%</span>
                        </div>
                      </div>
                      
                      <Button 
                        className={`mt-3 w-full ${colors.button}`} 
                        onClick={() => navigate(`/node/${node.nodeId}`)}
                      >
                        {nodeProgress > 0 && nodeProgress < 100 ? "Continuar" : 
                         nodeProgress === 100 ? "Repasar" : "Comenzar"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              // Backup content if no nodes
              [1, 2, 3].map((i) => (
                <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                  <CardContent className="p-4">
                    <div className="bg-gray-200 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                      {i}
                    </div>
                    <h3 className="font-medium text-gray-900">Contenido por definir</h3>
                    <p className="text-sm text-gray-600 mt-1">Módulo pendiente</p>
                    <Button className="mt-3 w-full bg-gray-600 hover:bg-gray-700" onClick={() => navigate("/plan")}>
                      Ver plan
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/plan")} className="flex items-center gap-2">
              Ver Plan Completo <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
