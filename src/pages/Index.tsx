
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { TPAESHabilidad } from "@/types/system-types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SearchBar } from "@/components/dashboard/search-bar";
import { TopSkills } from "@/components/dashboard/top-skills";
import { AIFeatures } from "@/components/dashboard/ai-features";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircleQuestion, BookOpen, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { LearningWorkflow } from "@/components/dashboard/learning-workflow";

const Index = () => {
  const { user, loading } = useUserData();
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Default skill levels to ensure they're never undefined
  const defaultSkillLevels: Record<TPAESHabilidad, number> = {
    SOLVE_PROBLEMS: 0,
    REPRESENT: 0,
    MODEL: 0,
    INTERPRET_RELATE: 0,
    EVALUATE_REFLECT: 0,
    TRACK_LOCATE: 0,
    ARGUE_COMMUNICATE: 0,
    IDENTIFY_THEORIES: 0,
    PROCESS_ANALYZE: 0,
    APPLY_PRINCIPLES: 0,
    SCIENTIFIC_ARGUMENT: 0,
    TEMPORAL_THINKING: 0,
    SOURCE_ANALYSIS: 0,
    MULTICAUSAL_ANALYSIS: 0,
    CRITICAL_THINKING: 0,
    REFLECTION: 0
  };
  
  // Use the user skills if available, or the default ones
  const skillLevels = user?.skillLevels || defaultSkillLevels;
  
  // Calculate stats
  const completedExercises = user?.progress?.completedExercises || 0;
  const correctExercises = user?.progress?.correctExercises || 0;
  const accuracyPercentage = completedExercises > 0 
    ? Math.round((correctExercises / completedExercises) * 100) 
    : 0;
  const totalTimeMinutes = user?.progress?.totalTimeMinutes || 0;

  // Get top skills
  const topSkills = Object.entries(skillLevels)
    .map(([skill, level]) => ({ skill: skill as TPAESHabilidad, level }))
    .sort((a, b) => b.level - a.level)
    .slice(0, 5)
    .map(item => item.skill);

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {!loading && user ? `Bienvenido, ${user.name}` : 'Cargando...'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Continúa tu preparación para la PAES
            </p>
          </div>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <StatCards
          loading={loading}
          completedExercises={completedExercises}
          accuracyPercentage={accuracyPercentage}
          totalTimeMinutes={totalTimeMinutes}
          className="mb-8"
        />

        <div className="grid gap-6 md:grid-cols-7 mb-8">
          <div className="md:col-span-4">
            <LearningWorkflow className="h-full" />
          </div>
          <div className="md:col-span-3">
            <TopSkills 
              loading={loading} 
              topSkills={topSkills} 
              skillLevels={skillLevels} 
              className="h-full" 
            />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-purple-200 shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                LectoGuía AI
              </CardTitle>
              <CardDescription>
                Asistente inteligente de comprensión lectora
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Entrenamiento personalizado con IA para mejorar tus habilidades de comprensión lectora. Genera ejercicios adaptados a tu nivel.
              </p>
              <Button asChild className="w-full bg-violet-500 hover:bg-violet-600">
                <Link to="/lectoguia" className="flex items-center justify-center gap-2">
                  Practicar con IA <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200 shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Diagnóstico
              </CardTitle>
              <CardDescription>
                Evalúa tus conocimientos actuales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Realiza un test diagnóstico para identificar tus fortalezas y áreas de mejora en las diferentes pruebas de la PAES.
              </p>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-600">
                <Link to="/diagnostico" className="flex items-center justify-center gap-2">
                  Iniciar Diagnóstico <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-emerald-200 shadow hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-500" />
                Biblioteca
              </CardTitle>
              <CardDescription>
                Recursos de estudio y material complementario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                Accede a material de estudio, guías y contenido seleccionado específicamente para mejorar tu rendimiento en la PAES.
              </p>
              <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600">
                <Link to="/biblioteca" className="flex items-center justify-center gap-2">
                  Explorar Biblioteca <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <AIFeatures />
      </div>
    </AppLayout>
  );
};

export default Index;
