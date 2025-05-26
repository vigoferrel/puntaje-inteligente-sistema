
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, BarChart3, Sparkles } from 'lucide-react';
import { IntelligentPlanGenerator } from './IntelligentPlanGenerator';
import { PlanProgressTracker } from './PlanProgressTracker';
import { PlanVisualizationDashboard } from './PlanVisualizationDashboard';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';

export const IntelligentPlanWrapper: React.FC = () => {
  const { metrics, isLoading } = useOptimizedRealNeuralMetrics();
  const [activePlan, setActivePlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('generator');

  // Datos simulados basados en métricas reales
  const userMetrics = {
    strengths: ['MATEMATICA_1', 'CIENCIAS'],
    weaknesses: ['COMPETENCIA_LECTORA', 'HISTORIA'],
    studyTime: Math.round((metrics?.adaptive_learning_score || 70) / 10),
    performance: Math.round(metrics?.neural_efficiency || 85),
    completionRate: Math.round(metrics?.user_experience_harmony || 78)
  };

  // Datos de ejemplo para visualización
  const planMetrics = {
    totalPlans: 12,
    activePlans: 3,
    completedPlans: 8,
    totalStudyTime: Math.round((metrics?.adaptive_learning_score || 70) * 2),
    averageCompletion: Math.round(metrics?.user_experience_harmony || 78),
    streakDays: Math.floor((metrics?.neural_efficiency || 85) / 10)
  };

  const weeklyProgress = [
    { day: 'Lunes', planned: 4, completed: 4, efficiency: 100 },
    { day: 'Martes', planned: 3, completed: 2, efficiency: 67 },
    { day: 'Miércoles', planned: 5, completed: 4, efficiency: 80 },
    { day: 'Jueves', planned: 3, completed: 3, efficiency: 100 },
    { day: 'Viernes', planned: 4, completed: 3, efficiency: 75 },
    { day: 'Sábado', planned: 2, completed: 2, efficiency: 100 },
    { day: 'Domingo', planned: 1, completed: 1, efficiency: 100 }
  ];

  const subjectPerformance = [
    {
      subject: 'MATEMATICA_1',
      progress: Math.round(metrics?.cross_pollination_rate || 85),
      timeSpent: 24,
      efficiency: 92,
      trend: 'up' as const
    },
    {
      subject: 'COMPETENCIA_LECTORA',
      progress: Math.round(metrics?.adaptive_learning_score || 68),
      timeSpent: 18,
      efficiency: 75,
      trend: 'stable' as const
    },
    {
      subject: 'CIENCIAS',
      progress: Math.round((metrics?.neural_efficiency || 80) * 0.9),
      timeSpent: 20,
      efficiency: 88,
      trend: 'up' as const
    },
    {
      subject: 'HISTORIA',
      progress: Math.round((metrics?.user_experience_harmony || 70) * 0.8),
      timeSpent: 12,
      efficiency: 65,
      trend: 'down' as const
    }
  ];

  const handlePlanGenerated = (plan: any) => {
    setActivePlan(plan);
    setActiveTab('tracker');
  };

  const handleTaskStart = (taskId: string) => {
    console.log('Task started:', taskId);
  };

  const handleTaskComplete = (taskId: string) => {
    if (activePlan) {
      const updatedTasks = activePlan.tasks.map((task: any) =>
        task.id === taskId ? { ...task, completed: true, progress: 100 } : task
      );
      const completedCount = updatedTasks.filter((t: any) => t.completed).length;
      const totalProgress = (completedCount / updatedTasks.length) * 100;
      
      setActivePlan({
        ...activePlan,
        tasks: updatedTasks,
        totalProgress
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-purple-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white mb-2">Cargando Datos Neurales</h2>
            <p className="text-white/70">Preparando sistema de planificación inteligente...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header Mejorado */}
        <Card className="bg-gradient-to-r from-black/60 to-purple-900/60 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Brain className="w-12 h-12 text-purple-400" />
                  <motion.div
                    className="absolute inset-0 w-12 h-12 bg-purple-400 rounded-full"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <div>
                  <CardTitle className="text-white text-3xl flex items-center gap-3">
                    Plan Inteligente Avanzado
                    <Sparkles className="w-8 h-8 text-yellow-400" />
                  </CardTitle>
                  <p className="text-purple-200 text-lg">
                    Sistema de planificación con IA basado en tus datos reales
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-purple-300">Rendimiento Neural</div>
                <div className="text-2xl font-bold text-green-400">
                  {userMetrics.performance}%
                </div>
                {activePlan && (
                  <Badge className="bg-green-600 text-white mt-2">
                    Plan Activo
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Navegación por Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-xl">
            <TabsTrigger 
              value="generator" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Generador IA
            </TabsTrigger>
            <TabsTrigger 
              value="tracker"
              disabled={!activePlan}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Seguimiento
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Análisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="mt-6">
            <IntelligentPlanGenerator
              userMetrics={userMetrics}
              onPlanGenerated={handlePlanGenerated}
            />
          </TabsContent>

          <TabsContent value="tracker" className="mt-6">
            {activePlan ? (
              <PlanProgressTracker
                activePlan={activePlan}
                onTaskStart={handleTaskStart}
                onTaskComplete={handleTaskComplete}
                userMetrics={userMetrics}
              />
            ) : (
              <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    No hay plan activo
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Genera un plan inteligente para comenzar el seguimiento
                  </p>
                  <Button 
                    onClick={() => setActiveTab('generator')}
                    className="bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Plan
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <PlanVisualizationDashboard
              metrics={planMetrics}
              weeklyProgress={weeklyProgress}
              subjectPerformance={subjectPerformance}
            />
          </TabsContent>
        </Tabs>

        {/* Footer con métricas rápidas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-blue-400">
                {userMetrics.studyTime}h
              </div>
              <div className="text-xs text-gray-400">Tiempo Semanal</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-green-400">
                {userMetrics.completionRate}%
              </div>
              <div className="text-xs text-gray-400">Tasa Finalización</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-400">
                {userMetrics.strengths.length}
              </div>
              <div className="text-xs text-gray-400">Áreas Fuertes</div>
            </CardContent>
          </Card>
          <Card className="bg-black/20 backdrop-blur-lg border-white/10">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-yellow-400">
                {planMetrics.streakDays}
              </div>
              <div className="text-xs text-gray-400">Días Consecutivos</div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};
