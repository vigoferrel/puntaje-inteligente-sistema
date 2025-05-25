
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Sparkles, Target, Zap, Award, Map, 
  Gamepad2, Trophy, TrendingUp, Eye, Cpu, Rocket
} from 'lucide-react';
import { useEducationSystem } from '@/core/unified-education-system/EducationDataHub';
import { AdaptiveContentGeneration } from './AdaptiveContentGeneration';
import { LearningAnalytics } from './LearningAnalytics';
import { IntelligentRecommendations } from './IntelligentRecommendations';
import { ImmersiveVisualization3D } from './ImmersiveVisualization3D';
import { AdaptiveDiagnostics3D } from './AdaptiveDiagnostics3D';
import { SystemicGamification } from './SystemicGamification';
import { PredictiveAnalysis } from './PredictiveAnalysis';
import { HolographicDashboard } from './HolographicDashboard';

export const IntelligentDashboard: React.FC = () => {
  const {
    studentProfile,
    skillNodes,
    currentRecommendations,
    systemMetrics,
    isInitializing,
    initializeSystem,
    generateIntelligentRecommendations,
    analyzePerformancePatterns
  } = useEducationSystem();

  const [activePhase, setActivePhase] = useState<'analytics' | 'adaptive' | 'immersive' | 'gamification'>('analytics');

  useEffect(() => {
    if (!studentProfile) {
      // Simular un ID de usuario para el demo
      initializeSystem('demo-user-id');
    }
  }, [studentProfile, initializeSystem]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <Brain className="w-20 h-20 mx-auto text-cyan-400 animate-pulse" />
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-cyan-400/30 rounded-full animate-spin border-t-cyan-400"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Inicializando Sistema Educativo Avanzado</h2>
            <p className="text-cyan-300">Activando IA, diagnósticos 3D y gamificación...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  const patterns = analyzePerformancePatterns();

  const phaseData = {
    analytics: {
      icon: TrendingUp,
      title: 'Fase 1: Análisis Inteligente',
      description: 'Dashboard neural con métricas en tiempo real',
      color: 'from-blue-600 to-cyan-600'
    },
    adaptive: {
      icon: Rocket,
      title: 'Fase 2: Contenido Adaptativo IA',
      description: 'Generación inteligente y recomendaciones predictivas',
      color: 'from-purple-600 to-pink-600'
    },
    immersive: {
      icon: Eye,
      title: 'Fase 3: Experiencia Inmersiva 3D',
      description: 'Diagnósticos adaptativos y visualización holográfica',
      color: 'from-green-600 to-emerald-600'
    },
    gamification: {
      icon: Trophy,
      title: 'Fase 4: Gamificación Sistémica',
      description: 'Logros dinámicos y validación integral',
      color: 'from-orange-600 to-red-600'
    }
  };

  const currentPhase = phaseData[activePhase];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-6">
      {/* Header Revolucionario */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="bg-gradient-to-r from-black/50 to-slate-900/50 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Brain className="w-12 h-12 text-cyan-400" />
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">
                    Sistema Educativo Revolucionario PAES
                  </CardTitle>
                  <p className="text-cyan-300">
                    IA Avanzada • Experiencia 3D • Gamificación Sistémica
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                  <Cpu className="w-4 h-4 mr-1" />
                  IA 100% Activa
                </Badge>
                <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
                  Nivel {studentProfile?.currentLevel}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Navegación de Fases */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Tabs value={activePhase} onValueChange={(value) => setActivePhase(value as any)}>
          <TabsList className="grid w-full grid-cols-4 bg-black/20 backdrop-blur-lg">
            {Object.entries(phaseData).map(([key, phase]) => {
              const Icon = phase.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  Fase {Object.keys(phaseData).indexOf(key) + 1}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Fase 1: Análisis Inteligente */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 backdrop-blur-xl border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    {currentPhase.title}
                  </CardTitle>
                  <p className="text-blue-200">{currentPhase.description}</p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LearningAnalytics 
                  patterns={patterns}
                  metrics={systemMetrics}
                  skillNodes={Object.values(skillNodes)}
                />
                <IntelligentRecommendations 
                  recommendations={currentRecommendations}
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Fase 2: Contenido Adaptativo */}
          <TabsContent value="adaptive" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    {currentPhase.title}
                  </CardTitle>
                  <p className="text-purple-200">{currentPhase.description}</p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <AdaptiveContentGeneration
                  studentProfile={studentProfile!}
                  recommendations={currentRecommendations}
                />
                <PredictiveAnalysis
                  skillNodes={Object.values(skillNodes)}
                  patterns={patterns}
                />
              </div>
            </motion.div>
          </TabsContent>

          {/* Fase 3: Experiencia Inmersiva 3D */}
          <TabsContent value="immersive" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-xl border-green-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Eye className="w-6 h-6 text-green-400" />
                    {currentPhase.title}
                  </CardTitle>
                  <p className="text-green-200">{currentPhase.description}</p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ImmersiveVisualization3D
                  skillNodes={Object.values(skillNodes)}
                  studentProfile={studentProfile!}
                />
                <div className="space-y-6">
                  <AdaptiveDiagnostics3D
                    recommendations={currentRecommendations}
                    studentProfile={studentProfile!}
                  />
                  <HolographicDashboard
                    metrics={systemMetrics}
                    patterns={patterns}
                  />
                </div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Fase 4: Gamificación Sistémica */}
          <TabsContent value="gamification" className="space-y-6 mt-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="bg-gradient-to-r from-orange-900/40 to-red-900/40 backdrop-blur-xl border-orange-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-orange-400" />
                    {currentPhase.title}
                  </CardTitle>
                  <p className="text-orange-200">{currentPhase.description}</p>
                </CardHeader>
              </Card>

              <SystemicGamification
                studentProfile={studentProfile!}
                skillNodes={Object.values(skillNodes)}
                systemMetrics={systemMetrics}
              />
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};
