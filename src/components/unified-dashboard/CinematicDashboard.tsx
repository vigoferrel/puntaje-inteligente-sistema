
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  Award,
  BookOpen,
  BarChart3,
  Zap,
  Sparkles,
  Rocket,
  Eye
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';

interface CinematicDashboardProps {
  onNavigateToTool: (tool: string, context?: any) => void;
}

export const CinematicDashboard: React.FC<CinematicDashboardProps> = ({
  onNavigateToTool
}) => {
  const { user } = useAuth();
  const { getStats } = useLectoGuiaSimplified();
  const [dashboardData, setDashboardData] = useState<any>(null);

  const stats = getStats();

  // Datos memoizados para evitar recálculos
  const dashboardContent = useMemo(() => {
    const data = {
      profile: {
        name: user?.email?.split('@')[0] || 'Estudiante',
        level: Math.floor(stats.exercisesCompleted / 10) + 1,
        experience: (stats.exercisesCompleted * 25) % 100
      },
      metrics: {
        overallProgress: stats.averageScore || 0,
        strongAreas: stats.averageScore > 70 ? ['Comprensión Lectora', 'Análisis'] : [],
        weakAreas: stats.averageScore < 50 ? ['Matemática', 'Ciencias'] : [],
        studyEfficiency: Math.min(100, stats.streak * 15),
        paesReadiness: {
          score: Math.min(100, stats.averageScore + stats.streak * 5)
        }
      },
      todayGoals: [
        {
          id: 'exercises',
          title: 'Completar 3 ejercicios',
          progress: Math.min(100, (stats.exercisesCompleted % 3) * 33),
          completed: stats.exercisesCompleted % 3 >= 3
        },
        {
          id: 'chat',
          title: 'Usar LectoGuía IA',
          progress: Math.min(100, stats.totalMessages * 20),
          completed: stats.totalMessages > 5
        },
        {
          id: 'time',
          title: '30 min de estudio',
          progress: Math.min(100, stats.streak * 25),
          completed: stats.streak >= 4
        }
      ],
      recentActivity: [
        {
          type: 'exercise',
          subject: 'Comprensión Lectora',
          result: 'Completado',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          type: 'chat',
          subject: 'LectoGuía IA',
          result: `${stats.totalMessages} mensajes`,
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
        }
      ]
    };
    
    return data;
  }, [user, stats]);

  // Carga inmediata sin delay artificial
  useEffect(() => {
    setDashboardData(dashboardContent);
  }, [dashboardContent]);

  // Skeleton optimizado y rápido
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full"
            />
            <Brain className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-400" />
          </div>
          <h2 className="text-xl font-semibold text-white cinematic-text-glow">
            Cargando Dashboard
          </h2>
        </motion.div>
      </div>
    );
  }

  const { profile, metrics, todayGoals, recentActivity } = dashboardData;

  const quickActions = [
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Asistente inteligente de aprendizaje',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      action: () => onNavigateToTool('lectoguia')
    },
    {
      id: 'exercises',
      title: 'Ejercicios Adaptativos',
      description: 'Práctica personalizada',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      action: () => onNavigateToTool('exercises')
    },
    {
      id: 'diagnostic',
      title: 'Evaluación Diagnóstica',
      description: 'Mide tu nivel actual',
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      action: () => onNavigateToTool('diagnostic')
    },
    {
      id: 'plan',
      title: 'Plan de Estudio',
      description: 'Organiza tu preparación',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      action: () => onNavigateToTool('plan')
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8 font-poppins">
      {/* Header de Bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <h1 className="text-4xl font-bold cinematic-gradient-text mb-2">
            ¡Bienvenido, {profile.name}! 🚀
          </h1>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-3 -right-6"
          >
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </div>
        <p className="text-lg text-white/80">
          Tu progreso PAES está en{' '}
          <span className="text-cyan-400 font-bold cinematic-text-glow">
            {metrics.overallProgress}%
          </span>
          {' '}• Nivel {profile.level}
        </p>
      </motion.div>

      {/* Métricas Principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            title: 'Progreso General',
            value: `${metrics.overallProgress}%`,
            icon: TrendingUp,
            color: 'from-green-400 to-emerald-600'
          },
          {
            title: 'Preparación PAES',
            value: `${metrics.paesReadiness.score}%`,
            icon: Target,
            color: 'from-purple-400 to-pink-600'
          },
          {
            title: 'Eficiencia',
            value: `${metrics.studyEfficiency}%`,
            icon: Zap,
            color: 'from-blue-400 to-cyan-600'
          },
          {
            title: 'Experiencia',
            value: `${profile.experience}/100`,
            icon: Award,
            color: 'from-yellow-400 to-orange-600'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="cinematic-card group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full bg-gradient-to-r ${metric.color} group-hover:scale-105 transition-transform`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>
                <Badge className="bg-white/10 text-white border-white/20">
                  Nivel {profile.level}
                </Badge>
              </div>
              <div className="space-y-1">
                <h3 className="text-white/80 text-sm font-medium">{metric.title}</h3>
                <p className="text-2xl font-bold text-white cinematic-text-glow">
                  {metric.value}
                </p>
              </div>
            </CardContent>
          </motion.div>
        ))}
      </motion.div>

      {/* Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="cinematic-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Rocket className="w-6 h-6 text-cyan-400" />
              Acciones Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 + 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={action.action}
                    className={`h-auto p-6 w-full bg-gradient-to-r ${action.color} hover:opacity-90 transition-all duration-200`}
                  >
                    <div className="text-center space-y-3">
                      <action.icon className="w-8 h-8 mx-auto" />
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Objetivos y Actividad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <Card className="cinematic-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-400" />
              Objetivos de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayGoals.map((goal, index) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium">{goal.title}</span>
                  {goal.completed && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      ✓ Completado
                    </Badge>
                  )}
                </div>
                <Progress value={goal.progress} className="h-2 bg-white/10" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="cinematic-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 cinematic-glass rounded-lg"
              >
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{activity.subject}</p>
                  <p className="text-white/60 text-xs">{activity.result}</p>
                </div>
                <span className="text-xs text-white/50">
                  {activity.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
