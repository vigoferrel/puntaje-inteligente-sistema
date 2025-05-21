
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillProgress } from "@/components/skill-progress";
import { useUserData } from "@/hooks/use-user-data";
import { TPAESHabilidad, getHabilidadDisplayName, TPAESPrueba, getPruebaDisplayName } from "@/types/system-types";
import { Activity, ArrowRight, BarChart3, Brain, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Diagnostico = () => {
  const { user, loading } = useUserData();

  // Group skills by prueba
  const skillsByPrueba: Record<TPAESPrueba, TPAESHabilidad[]> = {
    COMPETENCIA_LECTORA: ["TRACK_LOCATE", "INTERPRET_RELATE"],
    MATEMATICA_1: ["SOLVE_PROBLEMS", "REPRESENT", "MODEL", "ARGUE_COMMUNICATE"],
    MATEMATICA_2: ["SOLVE_PROBLEMS", "REPRESENT", "MODEL", "ARGUE_COMMUNICATE"],
    CIENCIAS: ["IDENTIFY_THEORIES", "PROCESS_ANALYZE", "APPLY_PRINCIPLES", "SCIENTIFIC_ARGUMENT"],
    HISTORIA: ["TEMPORAL_THINKING", "SOURCE_ANALYSIS", "MULTICAUSAL_ANALYSIS", "CRITICAL_THINKING", "REFLECTION"]
  };

  // Calculate overall score
  const overallScore = !loading && user
    ? Math.round(
        (Object.values(user.skillLevels).reduce((sum, level) => sum + level, 0) / 
        Object.values(user.skillLevels).length) * 100
      )
    : 0;

  // Helper function to get score class
  const getScoreClass = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <AppLayout>
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-stp-primary" />
              Diagnóstico
            </h1>
            <p className="text-gray-500 mt-1">
              Analiza tu desempeño por habilidades y pruebas PAES
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-stp-primary hover:bg-stp-primary/90">
              Realizar Nuevo Diagnóstico
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Puntaje Global</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6">
                <div className="relative w-36 h-36 mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getScoreClass(overallScore)}`}>
                      {loading ? "--" : overallScore}
                    </span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eeeeee"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={overallScore >= 70 ? "#22c55e" : overallScore >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="2"
                      strokeDasharray={`${overallScore}, 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-600 mb-2">Puntos</p>
                <div className="flex gap-2 items-center text-sm">
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded">
                    {loading ? "--" : Math.round(overallScore * 8.5)}
                  </div>
                  <span className="text-gray-500">Puntaje PAES estimado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Resumen por Habilidad</CardTitle>
              <CardDescription>Nivel de dominio en las habilidades clave PAES</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(user?.skillLevels || {}).slice(0, 6).map(([skill, level]) => (
                    <SkillProgress
                      key={skill}
                      skill={skill as TPAESHabilidad}
                      level={level}
                    />
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  Ver todas las habilidades <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-stp-primary" />
              Recomendaciones Basadas en IA
            </CardTitle>
            <CardDescription>
              Análisis personalizado basado en tu diagnóstico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Áreas de Enfoque Recomendadas</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Fortalecer habilidad de <strong>Interpretar y Relacionar</strong> en Competencia Lectora</li>
                  <li>Priorizar práctica en <strong>Modelar</strong> para Matemática 2</li>
                  <li>Dedicar tiempo adicional a <strong>Argumentación Científica</strong> para mejorar en Ciencias</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex">
                  <div className="mr-4">
                    <Clock className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Tiempo Recomendado de Estudio</h3>
                    <p className="text-gray-700">12 horas semanales, con énfasis en práctica de ejercicios de nivel intermedio</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg flex">
                  <div className="mr-4">
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Progreso Esperado</h3>
                    <p className="text-gray-700">Con tu ritmo actual, podrías alcanzar un nivel avanzado en 8 semanas</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button className="bg-stp-primary hover:bg-stp-primary/90">
                Ver Plan de Estudio Personalizado
              </Button>
            </div>
          </CardContent>
        </Card>

        {Object.entries(skillsByPrueba).map(([prueba, skills]) => (
          <Card key={prueba} className="mb-6">
            <CardHeader>
              <CardTitle>{getPruebaDisplayName(prueba as TPAESPrueba)}</CardTitle>
              <CardDescription>Análisis de habilidades específicas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    <div className="h-10 bg-gray-200 animate-pulse rounded" />
                    <div className="h-10 bg-gray-200 animate-pulse rounded" />
                  </div>
                ) : (
                  skills.map((skill) => (
                    <SkillProgress
                      key={skill}
                      skill={skill}
                      level={user?.skillLevels[skill] || 0}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
};

export default Diagnostico;
