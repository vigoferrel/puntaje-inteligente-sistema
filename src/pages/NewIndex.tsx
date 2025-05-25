
import React from "react";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { HeroSection } from "@/components/home/HeroSection";
import { SubjectProgressGrid } from "@/components/home/SubjectProgressGrid";
import { SmartRecommendations } from "@/components/home/SmartRecommendations";
import { TierProgressVisualizer } from "@/components/home/TierProgressVisualizer";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { motion } from "framer-motion";

const NewIndex = () => {
  const { profile } = useAuth();
  const { 
    loading, 
    stats, 
    completedExercises, 
    accuracyPercentage,
    skillLevels,
    topSkills 
  } = useDashboardStats();
  const { currentPhase, nodes, nodeProgress } = useLearningNodes();

  // Mock data basado en el sistema real de 277 nodos
  const mockSubjects = [
    {
      code: 'COMPETENCIA_LECTORA',
      name: 'Competencia Lectora',
      totalNodes: 30,
      completedNodes: 18,
      progress: 60,
      projectedScore: 675,
      criticalAreas: 3,
      strengths: 8,
      priority: 'medium' as const
    },
    {
      code: 'MATEMATICA_1',
      name: 'Matemática M1',
      totalNodes: 25,
      completedNodes: 12,
      progress: 48,
      projectedScore: 620,
      criticalAreas: 6,
      strengths: 4,
      priority: 'high' as const
    },
    {
      code: 'MATEMATICA_2',
      name: 'Matemática M2',
      totalNodes: 22,
      completedNodes: 8,
      progress: 36,
      projectedScore: 590,
      criticalAreas: 8,
      strengths: 2,
      priority: 'high' as const
    },
    {
      code: 'HISTORIA',
      name: 'Historia y Cs. Sociales',
      totalNodes: 65,
      completedNodes: 35,
      progress: 54,
      projectedScore: 640,
      criticalAreas: 12,
      strengths: 15,
      priority: 'medium' as const
    },
    {
      code: 'CIENCIAS',
      name: 'Ciencias',
      totalNodes: 135,
      completedNodes: 67,
      progress: 50,
      projectedScore: 655,
      criticalAreas: 25,
      strengths: 28,
      priority: 'low' as const
    }
  ];

  const mockRecommendations = [
    {
      id: '1',
      type: 'critical' as const,
      title: 'Álgebra Básica requiere atención',
      description: 'Tienes dificultades en ecuaciones lineales. Es fundamental para M1.',
      subject: 'Matemática M1',
      estimatedTime: 45,
      impact: 'high' as const,
      action: {
        label: 'Practicar ahora',
        route: '/practice/algebra-basica'
      },
      aiReason: 'Detecté 3 errores consecutivos en esta área y es prerequisito para 8 nodos adicionales.'
    },
    {
      id: '2',
      type: 'opportunity' as const,
      title: 'Oportunidad en Comprensión Lectora',
      description: 'Estás muy cerca de dominar textos argumentativos.',
      subject: 'Competencia Lectora',
      estimatedTime: 30,
      impact: 'medium' as const,
      action: {
        label: 'Completar dominio',
        route: '/practice/textos-argumentativos'
      },
      aiReason: '85% de aciertos en esta área. Con 2-3 ejercicios más alcanzarías maestría completa.'
    },
    {
      id: '3',
      type: 'next_step' as const,
      title: 'Siguiente paso recomendado',
      description: 'Continúa con Probabilidad Condicional en Ciencias.',
      subject: 'Ciencias',
      estimatedTime: 60,
      impact: 'medium' as const,
      action: {
        label: 'Comenzar nodo',
        route: '/learning/probabilidad-condicional'
      },
      aiReason: 'Has completado todos los prerequisitos y este nodo tiene alta frecuencia en PAES.'
    },
    {
      id: '4',
      type: 'strength' as const,
      title: 'Fortaleza en Historia',
      description: 'Excelente dominio en Chile en el siglo XX.',
      subject: 'Historia',
      estimatedTime: 20,
      impact: 'low' as const,
      action: {
        label: 'Reforzar ventaja',
        route: '/practice/chile-siglo-xx'
      },
      aiReason: '95% de aciertos. Mantener este nivel te dará ventaja competitiva significativa.'
    }
  ];

  const mockTierData = [
    {
      tier: 'tier1_critico' as const,
      name: 'Tier 1 - Crítico',
      total: 89,
      completed: 45,
      inProgress: 12,
      progress: 50.6,
      estimatedTimeRemaining: 1980 // 33 horas
    },
    {
      tier: 'tier2_importante' as const,
      name: 'Tier 2 - Importante',
      total: 108,
      completed: 58,
      inProgress: 15,
      progress: 53.7,
      estimatedTimeRemaining: 2250 // 37.5 horas
    },
    {
      tier: 'tier3_complementario' as const,
      name: 'Tier 3 - Complementario',
      total: 80,
      completed: 37,
      inProgress: 8,
      progress: 46.3,
      estimatedTimeRemaining: 1935 // 32.25 horas
    }
  ];

  // Calcular métricas globales
  const totalNodes = 277;
  const completedNodes = mockTierData.reduce((sum, tier) => sum + tier.completed, 0);
  const globalProgress = (completedNodes / totalNodes) * 100;
  const projectedScore = Math.round(
    mockSubjects.reduce((sum, subject) => sum + subject.projectedScore, 0) / mockSubjects.length
  );

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      } 
    }
  };
  
  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <AppInitializer>
        <AppLayout>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Cargando tu dashboard personalizado...</p>
            </div>
          </div>
        </AppLayout>
      </AppInitializer>
    );
  }

  return (
    <AppInitializer>
      <AppLayout>
        <motion.div 
          className="space-y-8"
          variants={pageVariants}
          initial="initial"
          animate="animate"
        >
          {/* Hero Section */}
          <motion.section variants={sectionVariants}>
            <HeroSection
              userName={profile?.name || 'Estudiante'}
              globalProgress={globalProgress}
              currentPhase={currentPhase}
              totalNodes={totalNodes}
              completedNodes={completedNodes}
              projectedScore={projectedScore}
            />
          </motion.section>

          {/* Tier Progress */}
          <motion.section variants={sectionVariants}>
            <TierProgressVisualizer tierData={mockTierData} />
          </motion.section>

          {/* Subject Progress */}
          <motion.section variants={sectionVariants}>
            <SubjectProgressGrid subjects={mockSubjects} />
          </motion.section>

          {/* Smart Recommendations */}
          <motion.section variants={sectionVariants}>
            <SmartRecommendations recommendations={mockRecommendations} />
          </motion.section>
        </motion.div>
      </AppLayout>
    </AppInitializer>
  );
};

export default NewIndex;
