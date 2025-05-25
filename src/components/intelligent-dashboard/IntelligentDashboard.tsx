
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, Target, TrendingUp, Zap, Star, PlayCircle,
  BookOpen, Award, Clock, BarChart3, Lightbulb,
  Rocket, Trophy, Eye, Sparkles
} from 'lucide-react';
import { useEducationSystem } from '@/core/unified-education-system/EducationDataHub';
import { useAuth } from '@/contexts/AuthContext';
import { SkillVisualization3D } from './SkillVisualization3D';
import { IntelligentRecommendations } from './IntelligentRecommendations';
import { LearningAnalytics } from './LearningAnalytics';
import { AdaptiveContentGeneration } from './AdaptiveContentGeneration';

export const IntelligentDashboard: React.FC = () => {
  const { user } = useAuth();
  const {
    studentProfile,
    skillNodes,
    currentRecommendations,
    systemMetrics,
    isInitializing,
    initializeSystem,
    generateIntelligentRecommendations,
    analyzePerformancePatterns,
    getPersonalizedInsights
  } = useEducationSystem();

  const [activeView, setActiveView] = useState<'overview' | 'skills' | 'analytics' | 'content'>('overview');
  const [showVisualization3D, setShowVisualization3D] = useState(false);

  // Inicializar sistema
  useEffect(() => {
    if (user?.id && !studentProfile && !isInitializing) {
      initializeSystem(user.id);
    }
  }, [user?.id, studentProfile, isInitializing, initializeSystem]);

  // Obtener insights personalizados
  const personalizedInsights = getPersonalizedInsights();
  const performancePatterns = analyzePerformancePatterns();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto"
          >
            <Brain className="w-10 h-10 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Inicializando Sistema Educativo</h2>
            <p className="text-cyan-400">Analizando tu perfil y generando recomendaciones inteligentes...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-4">Error de Inicialización</h2>
            <p className="text-gray-400 mb-6">No se pudo cargar tu perfil educativo</p>
            <Button onClick={() => user?.id && initializeSystem(user.id)} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const skillNodesArray = Object.values(skillNodes);
  const averageMastery = skillNodesArray.length > 0 
    ? skillNodesArray.reduce((sum, node) => sum + node.masteryLevel, 0) / skillNodesArray.length 
    : 0;
  
  const completedNodes = skillNodesArray.filter(node => node.masteryLevel >= 80).length;
  const totalNodes = skillNodesArray.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Inteligente */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center"
            >
              <Brain className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Hola, {studentProfile.name}
              </h1>
              <p className="text-cyan-400">Sistema Educativo Inteligente PAES</p>
            </div>
          </div>

          <div className="flex justify-center space-x-2">
            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600">
              <Star className="w-4 h-4 mr-2" />
              Nivel {studentProfile.currentLevel}
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Target className="w-4 h-4 mr-2" />
              Meta: {studentProfile.academicGoals.targetScore} pts
            </Badge>
            <Badge className="bg-gradient-to-r from-orange-600 to-red-600">
              <Trophy className="w-4 h-4 mr-2" />
              {completedNodes}/{totalNodes} Nodos
            </Badge>
          </div>
        </motion.div>

        {/* Navegación de Vistas */}
        <div className="flex justify-center space-x-2">
          {[
            { id: 'overview', label: 'Resumen', icon: Eye },
            { id: 'skills', label: 'Habilidades 3D', icon: Sparkles },
            { id: 'analytics', label: 'Análisis IA', icon: BarChart3 },
            { id: 'content', label: 'Contenido Adaptativo', icon: Rocket }
          ].map(view => {
            const Icon = view.icon;
            return (
              <Button
                key={view.id}
                variant={activeView === view.id ? "default" : "ghost"}
                onClick={() => setActiveView(view.id as any)}
                className={`${activeView === view.id 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600' 
                  : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {view.label}
              </Button>
            );
          })}
        </div>

        {/* Contenido Principal */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Panel Principal de Progreso */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-cyan-400" />
                      Progreso General
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium">Dominio Promedio</span>
                        <span className="text-cyan-400 font-bold">{Math.round(averageMastery)}%</span>
                      </div>
                      <Progress value={averageMastery} className="h-3" />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {systemMetrics.totalStudyTime.toFixed(0)}h
                        </div>
                        <div className="text-sm text-gray-400">Tiempo Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(systemMetrics.averagePerformance)}%
                        </div>
                        <div className="text-sm text-gray-400">Rendimiento</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {Math.round(systemMetrics.learningVelocity * 100)}%
                        </div>
                        <div className="text-sm text-gray-400">Velocidad</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Insights Personalizados */}
                <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Lightbulb className="w-6 h-6 text-purple-400" />
                      Insights Personalizados
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {personalizedInsights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-purple-600/20 rounded-lg border-l-4 border-purple-400"
                        >
                          <p className="text-white text-sm">{insight}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Panel de Recomendaciones */}
              <div className="space-y-6">
                <IntelligentRecommendations recommendations={currentRecommendations} />
                
                <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-orange-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3">
                      <Zap className="w-6 h-6 text-orange-400" />
                      Acción Rápida
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => setShowVisualization3D(true)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Diagnóstico Inteligente
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-purple-500/50 text-white hover:bg-purple-500/20"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Generar Contenido IA
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full border-green-500/50 text-white hover:bg-green-500/20"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Ver Análisis 3D
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeView === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SkillVisualization3D skillNodes={skillNodesArray} />
            </motion.div>
          )}

          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              <LearningAnalytics 
                patterns={performancePatterns}
                metrics={systemMetrics}
                skillNodes={skillNodesArray}
              />
            </motion.div>
          )}

          {activeView === 'content' && (
            <motion.div
              key="content"
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
            >
              <AdaptiveContentGeneration 
                studentProfile={studentProfile}
                recommendations={currentRecommendations}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
