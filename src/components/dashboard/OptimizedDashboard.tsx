
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useUnifiedState } from '@/hooks/useUnifiedState';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';
import { UnifiedNavigationCore } from '@/components/navigation/UnifiedNavigationCore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Target, 
  Award,
  Clock,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface OptimizedDashboardProps {
  onNavigateToTool?: (tool: string, context?: any) => void;
}

export const OptimizedDashboard: React.FC<OptimizedDashboardProps> = ({
  onNavigateToTool
}) => {
  const { user } = useAuth();
  const { isIntersectionalReady, neuralHealth, generateIntersectionalInsights } = useIntersectional();
  const { currentTool, systemMetrics, userProgress, setCurrentTool } = useUnifiedState();
  
  const [selectedView, setSelectedView] = useState<'overview' | 'lectoguia' | 'navigation'>('overview');

  // Métricas en tiempo real consolidadas
  const realTimeMetrics = useMemo(() => ({
    neuralEfficiency: Math.round(neuralHealth.neural_efficiency),
    adaptiveLearning: Math.round(neuralHealth.adaptive_learning_score),
    userExperience: Math.round(neuralHealth.user_experience_harmony),
    systemPerformance: Math.round((neuralHealth.neural_efficiency + neuralHealth.adaptive_learning_score + neuralHealth.user_experience_harmony) / 3),
    streak: userProgress.streakDays,
    studyTime: systemMetrics.todayStudyTime,
    completedNodes: systemMetrics.completedNodes,
    totalNodes: systemMetrics.totalNodes
  }), [neuralHealth, userProgress, systemMetrics]);

  // Insights inteligentes
  const smartInsights = useMemo(() => {
    const insights = generateIntersectionalInsights();
    return insights.slice(0, 3).map(insight => ({
      ...insight,
      priority: insight.level === 'excellent' ? 'low' : 'high',
      icon: insight.level === 'excellent' ? Award : Target
    }));
  }, [generateIntersectionalInsights]);

  // Navegación optimizada
  const handleNavigation = useCallback((tool: string, context?: any) => {
    setCurrentTool(tool);
    if (onNavigateToTool) {
      onNavigateToTool(tool, context);
    }
  }, [setCurrentTool, onNavigateToTool]);

  // Cambio de vista con animación
  const handleViewChange = useCallback((view: 'overview' | 'lectoguia' | 'navigation') => {
    setSelectedView(view);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header Principal */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="w-10 h-10 text-cyan-400" />
                <div>
                  <CardTitle className="text-white text-3xl">Dashboard Neural</CardTitle>
                  <p className="text-cyan-300">Sistema Unificado de Aprendizaje PAES</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Neural: {realTimeMetrics.neuralEfficiency}%
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  <Zap className="w-4 h-4 mr-1" />
                  Sistema: {realTimeMetrics.systemPerformance}%
                </Badge>
                {isIntersectionalReady && (
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                    <Brain className="w-4 h-4 mr-1" />
                    Intersectional Ready
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Selector de Vista */}
        <div className="flex justify-center">
          <div className="bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-1">
            <div className="flex gap-1">
              {[
                { id: 'overview', label: 'Vista General', icon: BarChart3 },
                { id: 'lectoguia', label: 'LectoGuía IA', icon: Brain },
                { id: 'navigation', label: 'Navegación', icon: Target }
              ].map((view) => (
                <Button
                  key={view.id}
                  onClick={() => handleViewChange(view.id as any)}
                  variant={selectedView === view.id ? 'default' : 'ghost'}
                  className={`${
                    selectedView === view.id 
                      ? 'bg-cyan-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <view.icon className="w-4 h-4 mr-2" />
                  {view.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenido Principal */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedView === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Métricas Principales */}
                <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
                  <CardContent className="p-6 text-center">
                    <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">{realTimeMetrics.neuralEfficiency}%</div>
                    <div className="text-sm text-cyan-300">Eficiencia Neural</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">{realTimeMetrics.adaptiveLearning}%</div>
                    <div className="text-sm text-purple-300">Aprendizaje Adaptativo</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-green-500/30">
                  <CardContent className="p-6 text-center">
                    <Award className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">{realTimeMetrics.streak}</div>
                    <div className="text-sm text-green-300">Días de Racha</div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-xl border-orange-500/30">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-white">{realTimeMetrics.studyTime}</div>
                    <div className="text-sm text-orange-300">Minutos Hoy</div>
                  </CardContent>
                </Card>

                {/* Insights Inteligentes */}
                <Card className="md:col-span-2 lg:col-span-4 bg-black/40 backdrop-blur-xl border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-400 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Insights Inteligentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {smartInsights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-gray-800/50 rounded-lg"
                        >
                          <div className="flex items-start gap-3">
                            <insight.icon className={`w-5 h-5 mt-1 ${
                              insight.priority === 'high' ? 'text-red-400' : 'text-green-400'
                            }`} />
                            <div>
                              <h4 className="font-medium text-white mb-1">{insight.title}</h4>
                              <p className="text-sm text-gray-300">{insight.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {selectedView === 'lectoguia' && (
              <LectoGuiaUnified onNavigateToTool={handleNavigation} />
            )}

            {selectedView === 'navigation' && (
              <UnifiedNavigationCore 
                onNavigate={handleNavigation}
                currentTool={currentTool}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
