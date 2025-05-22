
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLearningPlan } from "@/hooks/use-learning-plan";
import { useNavigate } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";

export const StudyPlan = () => {
  const navigate = useNavigate();
  const { currentPlan, loading, initializing } = useLearningPlan();

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodesToShow.length > 0 ? (
              nodesToShow.map((node, index) => {
                const colors = getColorScheme(index);
                return (
                  <Card className={`${colors.bg}`} key={node.id}>
                    <CardContent className="p-4">
                      <div className={`${colors.accent} h-10 w-10 rounded-full flex items-center justify-center mb-3`}>
                        {index + 1}
                      </div>
                      <h3 className="font-medium text-gray-900">{node.nodeSkill || "Habilidad"}</h3>
                      <p className="text-sm text-gray-600 mt-1">{node.nodeName || `Módulo ${index + 1}`}</p>
                      <Button className={`mt-3 w-full ${colors.button}`} onClick={() => navigate("/plan")}>
                        {index === 0 ? "Continuar" : "Comenzar"}
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
