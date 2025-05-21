
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { useUserData } from "@/hooks/use-user-data";
import { LEARNING_CYCLE_PHASES_ORDER, TLearningCyclePhase, TPAESHabilidad } from "@/types/system-types";
import { StatCards } from "@/components/dashboard/stat-cards";
import { SearchBar } from "@/components/dashboard/search-bar";
import { TopSkills } from "@/components/dashboard/top-skills";
import { StudyPlan } from "@/components/dashboard/study-plan";
import { AIFeatures } from "@/components/dashboard/ai-features";
import { LearningCycle } from "@/components/dashboard/learning-cycle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, BookOpen, BarChart3 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading, updateLearningPhase } = useUserData();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  
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

  // Default to diagnosis phase if none is set
  const currentPhase = user?.learningCyclePhase || "DIAGNOSIS";

  const handlePhaseSelect = async (phase: TLearningCyclePhase) => {
    // Check if the selected phase is available based on progress
    const currentIndex = LEARNING_CYCLE_PHASES_ORDER.indexOf(currentPhase);
    const selectedIndex = LEARNING_CYCLE_PHASES_ORDER.indexOf(phase);
    
    // Only allow selecting current phase or earlier phases
    if (selectedIndex > currentIndex) {
      toast({
        title: "Fase no disponible",
        description: "Debes completar la fase actual antes de avanzar",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the appropriate page based on the phase
    switch(phase) {
      case "DIAGNOSIS":
        navigate("/diagnostico");
        break;
      case "PERSONALIZED_PLAN":
        navigate("/plan");
        break;
      default:
        // For other phases that might not have pages yet
        if (phase !== currentPhase) {
          await updateLearningPhase(phase);
        }
        break;
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {!loading && user ? `Bienvenido, ${user.name}` : 'Cargando...'}
          </h1>
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <StatCards
          loading={loading}
          completedExercises={completedExercises}
          accuracyPercentage={accuracyPercentage}
          totalTimeMinutes={totalTimeMinutes}
        />
        
        <div className="mb-8">
          <LearningCycle 
            currentPhase={currentPhase}
            loading={loading}
            onPhaseSelect={handlePhaseSelect}
          />
        </div>
        
        <div className="mb-8">
          <Card className="border-border bg-card/50 backdrop-blur-sm animated-gradient bg-opacity-10">
            <CardHeader>
              <CardTitle className="text-2xl text-gradient">LectoGuía AI - Nuevo</CardTitle>
              <CardDescription>Tu asistente personalizado para mejorar en la PAES</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-2/3">
                  <p className="text-foreground/80 mb-4">
                    LectoGuía es un tutor inteligente especializado en comprensión lectora que te ayudará a mejorar tus habilidades
                    a través de ejercicios personalizados, análisis de tu desempeño y recomendaciones específicas.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                      <MessageCircleQuestion className="h-4 w-4 text-primary" />
                      <span>Chat interactivo</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                      <BookOpen className="h-4 w-4 text-primary" />
                      <span>Ejercicios personalizados</span>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1 rounded-full text-sm">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span>Análisis de progreso</span>
                    </div>
                  </div>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
                    onClick={() => navigate('/lectoguia')}
                  >
                    Probar ahora
                  </Button>
                </div>
                <div className="md:w-1/3 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 bg-primary/20 rounded-full pulse-animation"></div>
                    <div className="absolute inset-2 bg-primary/30 rounded-full pulse-animation animation-delay-150"></div>
                    <div className="absolute inset-4 bg-primary/40 rounded-full pulse-animation animation-delay-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MessageCircleQuestion className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <StudyPlan />
            <AIFeatures />
          </div>
          <div>
            <TopSkills 
              topSkills={topSkills} 
              loading={loading} 
              skillLevels={skillLevels}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
