
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { SkillProgress } from "@/components/skill-progress";
import { CalendarDays, BookOpen, CheckCircle, Hourglass, Brain } from "lucide-react";
import { useUserData } from "@/hooks/use-user-data";
import { PAESHabilidades } from "@/types/system-types";

const Index = () => {
  const { user, loading } = useUserData();
  const [searchQuery, setSearchQuery] = useState("");

  // Get top skills (highest 3)
  const topSkills = !loading && user
    ? Object.entries(user.skillLevels)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([skill]) => skill as keyof typeof PAESHabilidades)
    : [];

  // Calculate accuracy percentage
  const accuracyPercentage = !loading && user
    ? Math.round((user.progress.correctExercises / user.progress.completedExercises) * 100) || 0
    : 0;

  return (
    <AppLayout>
      <div className="container py-8 px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido a SubeTuPuntaje
            </h1>
            <p className="text-gray-500 mt-1">
              Tu plataforma de preparación para la Prueba de Acceso a la Educación Superior
            </p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-1/3">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar temáticas, ejercicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-stp-primary hover:bg-stp-primary/90"
              >
                Consultar
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Ejercicios Completados" 
            value={loading ? "..." : user?.progress.completedExercises || 0} 
            icon={<CheckCircle className="h-5 w-5 text-stp-primary" />}
            trend={{ value: 12, positive: true }}
          />
          <StatCard 
            title="Precisión" 
            value={`${loading ? "..." : accuracyPercentage}%`} 
            icon={<BookOpen className="h-5 w-5 text-stp-primary" />}
            trend={{ value: 5, positive: true }}
          />
          <StatCard 
            title="Tiempo de Estudio" 
            value={`${loading ? "..." : user?.progress.totalTimeMinutes || 0} min`} 
            icon={<Hourglass className="h-5 w-5 text-stp-primary" />}
            trend={{ value: 8, positive: true }}
          />
          <StatCard 
            title="Días Consecutivos" 
            value="3" 
            icon={<CalendarDays className="h-5 w-5 text-stp-primary" />}
            trend={{ value: 2, positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-stp-primary" />
                Preparación Potenciada por IA
              </CardTitle>
              <CardDescription>
                Nuestro sistema utiliza modelos de lenguaje avanzados para crear una experiencia de preparación PAES personalizada y efectiva.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <div className="h-6 w-6 text-blue-600">🧠</div>
                </div>
                <h3 className="font-medium text-gray-900">Diagnóstico Inteligente</h3>
                <p className="text-sm text-gray-600 mt-2">Análisis personalizado de tus áreas de mejora basado en tu desempeño</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-green-50 text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <div className="h-6 w-6 text-green-600">📚</div>
                </div>
                <h3 className="font-medium text-gray-900">Contenido Adaptativo</h3>
                <p className="text-sm text-gray-600 mt-2">Preguntas y ejercicios que se ajustan automáticamente a tu nivel de dominio</p>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50 text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-3">
                  <div className="h-6 w-6 text-purple-600">💡</div>
                </div>
                <h3 className="font-medium text-gray-900">Retroalimentación Avanzada</h3>
                <p className="text-sm text-gray-600 mt-2">Explicaciones detalladas sobre tus errores y consejos para mejorar</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tus Habilidades Top</CardTitle>
              <CardDescription>
                Las habilidades donde muestras mayor dominio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                  <div className="h-10 bg-gray-200 animate-pulse rounded" />
                </div>
              ) : (
                topSkills.map((skill) => (
                  <SkillProgress 
                    key={skill} 
                    skill={skill} 
                    level={user?.skillLevels[skill] || 0} 
                  />
                ))
              )}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                size="sm"
              >
                Ver todas las habilidades
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plan de Estudio Recomendado</CardTitle>
            <CardDescription>
              Basado en tu diagnóstico y objetivos de aprendizaje
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="bg-blue-100 text-blue-600 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                      1
                    </div>
                    <h3 className="font-medium text-gray-900">Resolución de Problemas</h3>
                    <p className="text-sm text-gray-600 mt-1">Matemática 1 - Nivel Básico</p>
                    <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700">Continuar</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="bg-purple-100 text-purple-600 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                      2
                    </div>
                    <h3 className="font-medium text-gray-900">Rastrear y Localizar</h3>
                    <p className="text-sm text-gray-600 mt-1">Competencia Lectora - Nivel Básico</p>
                    <Button className="mt-3 w-full bg-purple-600 hover:bg-purple-700">Comenzar</Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="bg-green-100 text-green-600 h-10 w-10 rounded-full flex items-center justify-center mb-3">
                      3
                    </div>
                    <h3 className="font-medium text-gray-900">Modelar</h3>
                    <p className="text-sm text-gray-600 mt-1">Matemática 2 - Nivel Intermedio</p>
                    <Button className="mt-3 w-full bg-green-600 hover:bg-green-700">Comenzar</Button>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button variant="outline">Ver Plan Completo</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Index;
