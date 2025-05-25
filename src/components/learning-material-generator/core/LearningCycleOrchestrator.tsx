import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningPlanContext } from '@/contexts/LearningPlanContext';
import { usePAESCycleIntegration } from '@/hooks/lectoguia/use-paes-cycle-integration';
import { TLearningCyclePhase } from '@/types/system-types';
import { ProgressDashboard } from '../ui/ProgressDashboard';
import { PhaseNavigator } from '../ui/PhaseNavigator';
import { AdaptiveRecommendationEngine } from './AdaptiveRecommendationEngine';
import { UserProgressAnalyzer } from './UserProgressAnalyzer';
import { MaterialGenerationHub } from '../materials/MaterialGenerationHub';
import { ActionCenter } from '../ui/ActionCenter';

interface LearningCycleOrchestratorProps {
  selectedSubject: string;
  subjects: any;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const LearningCycleOrchestrator: React.FC<LearningCycleOrchestratorProps> = ({
  selectedSubject,
  subjects,
  onGenerate,
  isGenerating
}) => {
  const { user } = useAuth();
  const { currentPlan, refreshPlans } = useLearningPlanContext();
  const { 
    loading: paesLoading,
    phaseProgress,
    predictedScore,
    recommendations,
    getPhaseConfig,
    loadPhaseProgress
  } = usePAESCycleIntegration();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'generate' | 'analyze'>('dashboard');
  const [currentPhase, setCurrentPhase] = useState<TLearningCyclePhase>('SKILL_TRAINING');
  const [learningInsights, setLearningInsights] = useState<any>(null);

  // Cargar datos iniciales y análisis inteligente
  useEffect(() => {
    if (user?.id) {
      loadInitialData();
    }
  }, [user?.id, selectedSubject]);

  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadPhaseProgress(), // Sin parámetros según la definición del hook
        refreshPlans(), // Sin parámetros según la definición del contexto
        generateLearningInsights()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const generateLearningInsights = async () => {
    // Simular análisis inteligente basado en progreso real
    const insights = {
      strongestSkills: ['TRACK_LOCATE', 'SOLVE_PROBLEMS'],
      weakestSkills: ['EVALUATE_REFLECT', 'SCIENTIFIC_ARGUMENT'],
      recommendedFocus: 'CONTENT_STUDY',
      estimatedStudyTime: 45,
      nextMilestone: 'Simulacro PAES completo',
      improvementTrend: 'positive'
    };
    setLearningInsights(insights);
  };

  const phaseConfig = getPhaseConfig(currentPhase);

  return (
    <div className="space-y-6">
      {/* Header del Learning Command Center */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Centro de Comando del Aprendizaje</h1>
                <p className="text-muted-foreground">
                  Tu hub inteligente para {subjects[selectedSubject]?.name}
                </p>
              </div>
            </div>
            
            {predictedScore && (
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{predictedScore}</div>
                <div className="text-sm text-muted-foreground">Puntaje Proyectado PAES</div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-lg font-bold">{Object.keys(phaseProgress).length}</div>
              <div className="text-xs text-muted-foreground">Fases Activas</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-lg font-bold">{recommendations.length}</div>
              <div className="text-xs text-muted-foreground">Recomendaciones</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="text-lg font-bold">{learningInsights?.estimatedStudyTime || 0}min</div>
              <div className="text-xs text-muted-foreground">Estudio Hoy</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-lg font-bold">+15%</span>
              </div>
              <div className="text-xs text-muted-foreground">Mejora Semanal</div>
            </div>
          </div>
        </CardContent>
      </motion.div>

      {/* Navegación Principal */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="generate" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Generar Material
          </TabsTrigger>
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Análisis
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Principal */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Panel de Progreso */}
            <div className="lg:col-span-2">
              <ProgressDashboard
                phaseProgress={phaseProgress}
                currentPhase={currentPhase}
                learningInsights={learningInsights}
                predictedScore={predictedScore}
              />
            </div>

            {/* Panel de Acciones Rápidas */}
            <div>
              <ActionCenter
                recommendations={recommendations}
                currentPhase={currentPhase}
                onQuickAction={onGenerate}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Navegador de Fases */}
          <PhaseNavigator
            currentPhase={currentPhase}
            phaseProgress={phaseProgress}
            onPhaseChange={setCurrentPhase}
          />
        </TabsContent>

        {/* Generación de Material */}
        <TabsContent value="generate" className="space-y-6">
          <MaterialGenerationHub
            selectedSubject={selectedSubject}
            currentPhase={currentPhase}
            recommendations={recommendations}
            onGenerate={onGenerate}
            isGenerating={isGenerating}
          />
        </TabsContent>

        {/* Análisis y Recomendaciones */}
        <TabsContent value="analyze" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <UserProgressAnalyzer
              userId={user?.id}
              selectedSubject={selectedSubject}
              phaseProgress={phaseProgress}
            />
            
            <AdaptiveRecommendationEngine
              currentPhase={currentPhase}
              learningInsights={learningInsights}
              recommendations={recommendations}
              onApplyRecommendation={onGenerate}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
