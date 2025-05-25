
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Target, 
  Calendar, 
  TrendingUp,
  Sparkles,
  Zap,
  BookOpen,
  Award,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';
import { useUnifiedState } from '@/hooks/useUnifiedState';

interface CinematicDashboardProps {
  onNavigateToTool: (tool: string, context?: any) => void;
}

export const CinematicDashboard: React.FC<CinematicDashboardProps> = ({ 
  onNavigateToTool 
}) => {
  const { systemMetrics } = useUnifiedState();
  const { getStats } = useLectoGuiaSimplified();
  
  const lectoguiaStats = getStats();

  // Métricas cinematográficas del sistema
  const cinematicMetrics = useMemo(() => [
    {
      title: 'Progreso Total',
      value: `${systemMetrics.totalProgress}%`,
      icon: Target,
      color: 'from-cyan-400 to-blue-500',
      description: 'Avance general en PAES',
      trend: '+12% esta semana'
    },
    {
      title: 'Ejercicios Completados',
      value: lectoguiaStats.exercisesCompleted.toString(),
      icon: Brain,
      color: 'from-green-400 to-emerald-500',
      description: 'Práctica realizada',
      trend: `+${Math.floor(lectoguiaStats.exercisesCompleted * 0.2)} hoy`
    },
    {
      title: 'Tiempo de Estudio',
      value: `${systemMetrics.todayStudyTime}m`,
      icon: Clock,
      color: 'from-purple-400 to-pink-500',
      description: 'Sesión actual',
      trend: 'Objetivo: 90min'
    },
    {
      title: 'Racha Activa',
      value: `${systemMetrics.streakDays} días`,
      icon: Zap,
      color: 'from-orange-400 to-red-500',
      description: 'Consistencia de estudio',
      trend: 'Meta: 30 días'
    }
  ], [systemMetrics, lectoguiaStats]);

  // Acciones rápidas cinematográficas
  const quickActions = useMemo(() => [
    {
      title: 'LectoGuía IA',
      description: 'Asistente inteligente de comprensión lectora',
      icon: Brain,
      color: 'from-blue-500 to-purple-600',
      action: () => onNavigateToTool('lectoguia'),
      badge: 'Nuevo chat'
    },
    {
      title: 'Diagnóstico Inteligente',
      description: 'Evaluación adaptativa de competencias',
      icon: Target,
      color: 'from-green-500 to-teal-600',
      action: () => onNavigateToTool('diagnostic'),
      badge: 'Recomendado'
    },
    {
      title: 'Calendario de Estudio',
      description: 'Planificación inteligente personalizada',
      icon: Calendar,
      color: 'from-purple-500 to-pink-600',
      action: () => onNavigateToTool('calendar'),
      badge: 'Próxima sesión'
    },
    {
      title: 'Centro Financiero',
      description: 'Calculadora de becas y financiamiento',
      icon: Award,
      color: 'from-amber-500 to-orange-600',
      action: () => onNavigateToTool('financial'),
      badge: 'FUAS 2024'
    }
  ], [onNavigateToTool]);

  const handleQuickAction = useCallback((action: () => void) => {
    action();
  }, []);

  return (
    <div className="space-y-8 p-6 font-poppins">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative">
          <h1 className="text-4xl font-bold cinematic-gradient-text poppins-heading">
            PAES Pro Dashboard
          </h1>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-2 -right-8 text-cyan-400"
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        </div>
        <p className="text-lg text-white/80 poppins-body">
          Centro de comando inteligente para tu preparación PAES
        </p>
      </motion.div>

      {/* Métricas Cinematográficas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cinematicMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <Card className="cinematic-card h-full hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${metric.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-white/10 text-white border-white/20">
                      {metric.trend}
                    </Badge>
                  </div>
                  
                  <h3 className="text-white/80 text-sm font-medium poppins-body mb-2">
                    {metric.title}
                  </h3>
                  <p className="text-3xl font-bold text-white cinematic-text-glow poppins-title mb-1">
                    {metric.value}
                  </p>
                  <p className="text-white/60 text-xs poppins-caption">
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Progreso General Cinematográfico */}
      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Evolución de Competencias PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {['Competencia Lectora', 'Matemática', 'Ciencias', 'Historia'].map((subject, index) => (
            <div key={subject} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium poppins-subtitle">{subject}</span>
                <span className="text-cyan-400 font-bold">
                  {Math.min(100, 60 + index * 10)}%
                </span>
              </div>
              <Progress 
                value={Math.min(100, 60 + index * 10)} 
                className="h-3 bg-white/10"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Acciones Rápidas Cinematográficas */}
      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            Centro de Herramientas IA
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => handleQuickAction(action.action)}
              >
                <div className="cinematic-glass rounded-xl p-6 space-y-4 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full bg-gradient-to-r ${action.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      {action.badge}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white poppins-subtitle">
                      {action.title}
                    </h3>
                    <p className="text-white/70 text-sm poppins-body">
                      {action.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm poppins-caption">
                      Acceso inmediato
                    </span>
                    <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recomendaciones IA */}
      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <Brain className="w-6 h-6 text-purple-400" />
            Recomendaciones Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: 'Fortalecer Comprensión Lectora',
              description: 'Basado en tu progreso, te recomendamos 15 minutos de práctica diaria',
              action: 'Iniciar LectoGuía',
              color: 'bg-blue-500/20 border-blue-500/30'
            },
            {
              title: 'Diagnóstico de Matemática',
              description: 'Identifica tus fortalezas y áreas de mejora en competencias matemáticas',
              action: 'Realizar Diagnóstico',
              color: 'bg-green-500/20 border-green-500/30'
            },
            {
              title: 'Planificar Semana de Estudio',
              description: 'Organiza tu tiempo de estudio con nuestro calendario inteligente',
              action: 'Abrir Calendario',
              color: 'bg-purple-500/20 border-purple-500/30'
            }
          ].map((recommendation, index) => (
            <motion.div
              key={recommendation.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`p-4 rounded-xl border ${recommendation.color}`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-white poppins-subtitle">
                    {recommendation.title}
                  </h4>
                  <p className="text-white/70 text-sm poppins-body">
                    {recommendation.description}
                  </p>
                </div>
                <Button 
                  className="cinematic-button" 
                  size="sm"
                  onClick={() => {
                    if (recommendation.title.includes('LectoGuía')) {
                      onNavigateToTool('lectoguia');
                    } else if (recommendation.title.includes('Diagnóstico')) {
                      onNavigateToTool('diagnostic');
                    } else if (recommendation.title.includes('Calendario')) {
                      onNavigateToTool('calendar');
                    }
                  }}
                >
                  {recommendation.action}
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
