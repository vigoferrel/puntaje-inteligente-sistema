
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  BarChart3,
  Zap,
  Calendar,
  CheckCircle,
  PlayCircle,
  AlertTriangle
} from "lucide-react";
import { useRealDashboardData } from '@/hooks/dashboard/useRealDashboardData';

export const CinematicUnifiedDashboard: React.FC = () => {
  const {
    metrics,
    systemStatus,
    isLoading,
    isSystemReady,
    diagnosticData,
    planData,
    calendarData,
    lectoGuiaData,
    navigateToSection,
    getSmartRecommendations,
    refreshData
  } = useRealDashboardData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Cinematográfico */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-white">
            Dashboard Neural PAES 🎯
          </h1>
          <p className="text-white/80 text-xl">
            Sistema de Preparación Adaptativo Inteligente
          </p>
        </motion.div>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Nodos Completados',
              value: metrics.completedNodes,
              icon: CheckCircle,
              color: 'from-green-400 to-emerald-600'
            },
            {
              title: 'Progreso Semanal',
              value: `${metrics.weeklyProgress}%`,
              icon: TrendingUp,
              color: 'from-blue-400 to-indigo-600'
            },
            {
              title: 'Tiempo de Estudio',
              value: `${metrics.totalStudyTime}min`,
              icon: Clock,
              color: 'from-purple-400 to-pink-600'
            },
            {
              title: 'Racha Actual',
              value: `${metrics.currentStreak} días`,
              icon: Award,
              color: 'from-yellow-400 to-orange-600'
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/80 text-sm">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-gradient-to-r ${metric.color}`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Estado del Sistema */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Estado del Sistema Neural
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(systemStatus).map(([key, status]) => (
                <div key={key} className="text-center">
                  <Badge 
                    variant={status.status === 'ready' || status.status === 'active' ? 'default' : 'outline'}
                    className="mb-2"
                  >
                    {status.status === 'ready' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {status.status === 'active' && <PlayCircle className="w-3 h-3 mr-1" />}
                    {status.status === 'error' && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {status.status}
                  </Badge>
                  <p className="text-white/80 text-sm capitalize">{key}</p>
                  <p className="text-white/60 text-xs">{status.data}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5" />
                Centro de Comando Neural
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'LectoGuía IA',
                  description: `${lectoGuiaData.sessionCount} sesiones activas`,
                  icon: Brain,
                  action: () => navigateToSection('lectoguia'),
                  color: 'from-blue-500 to-indigo-600'
                },
                {
                  title: 'Diagnóstico Neural',
                  description: `${diagnosticData.learningNodes.length} nodos disponibles`,
                  icon: BarChart3,
                  action: () => navigateToSection('diagnostico'),
                  color: 'from-purple-500 to-violet-600'
                },
                {
                  title: 'Plan Inteligente',
                  description: planData.currentPlan ? 'Plan activo' : 'Crear plan',
                  icon: BookOpen,
                  action: () => navigateToSection('plan'),
                  color: 'from-green-500 to-emerald-600'
                },
                {
                  title: 'Calendario PAES',
                  description: `${calendarData.events.length} eventos programados`,
                  icon: Calendar,
                  action: () => navigateToSection('calendario'),
                  color: 'from-orange-500 to-red-600'
                },
                {
                  title: 'Generador de Ejercicios',
                  description: 'IA generativa de contenido',
                  icon: Zap,
                  action: () => navigateToSection('ejercicios'),
                  color: 'from-pink-500 to-rose-600'
                },
                {
                  title: 'Centro Financiero',
                  description: 'Simulador de costos PAES',
                  icon: Award,
                  action: () => navigateToSection('finanzas'),
                  color: 'from-yellow-500 to-amber-600'
                }
              ].map((action, index) => (
                <motion.div
                  key={action.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={action.action}
                    className={`h-auto p-6 bg-gradient-to-r ${action.color} hover:opacity-90 transition-all duration-200 w-full`}
                  >
                    <div className="text-center space-y-2">
                      <action.icon className="w-8 h-8 mx-auto" />
                      <div>
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recomendaciones Inteligentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Recomendaciones Neurales Adaptativas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getSmartRecommendations().slice(0, 6).map((rec) => (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    rec.priority === 'urgent' ? 'bg-red-500/20 border-red-500/40' :
                    rec.priority === 'high' ? 'bg-orange-500/20 border-orange-500/40' :
                    rec.priority === 'medium' ? 'bg-yellow-500/20 border-yellow-500/40' :
                    'bg-blue-500/20 border-blue-500/40'
                  }`}
                  onClick={rec.action}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                      <p className="text-white/80 text-sm">{rec.description}</p>
                    </div>
                    <Badge 
                      variant={rec.priority === 'urgent' ? 'destructive' : 'outline'}
                      className="ml-4"
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Progreso de Plan Actual */}
        {planData.currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Plan de Estudio Activo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">{planData.currentPlan.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{planData.currentPlan.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Progreso General</span>
                      <span className="text-white font-semibold">{planData.currentPlan.progress.percentage}%</span>
                    </div>
                    <Progress value={planData.currentPlan.progress.percentage} className="h-2" />
                  </div>
                </div>
                <Button 
                  onClick={() => navigateToSection('plan')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                >
                  Ver Plan Completo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
};
