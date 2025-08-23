
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';
import { useRealUserMetrics } from '@/hooks/useRealUserMetrics';
import { 
  Brain, TrendingUp, Clock, Target, Zap, 
  Award, BookOpen, Calculator, BarChart3 
} from 'lucide-react';

export const RealTimeMetricsDashboard: React.FC = () => {
  const { state, addAchievement } = useGlobalCinematic();
  const { metrics, isLoading, error } = useRealUserMetrics();

  // Verificar logros basados en métricas reales
  React.useEffect(() => {
    if (metrics.currentStreak >= 7) {
      addAchievement('weekly_streak');
    }
    if (metrics.exercisesCompleted >= 100) {
      addAchievement('hundred_exercises');
    }
    if (metrics.averageScore >= 85) {
      addAchievement('high_performer');
    }
  }, [metrics, addAchievement]);

  const metricCards = [
    {
      title: 'Tiempo de Estudio',
      value: `${Math.round(metrics.totalStudyTime / 60)}h`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%'
    },
    {
      title: 'Nodos Completados',
      value: metrics.exercisesCompleted.toString(),
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      trend: '+5'
    },
    {
      title: 'Promedio de Habilidad',
      value: `${metrics.averageScore}%`,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trend: '+3%'
    },
    {
      title: 'Progreso Actual',
      value: `${metrics.currentStreak} nodos`,
      icon: Zap,
      color: 'from-orange-500 to-red-500',
      trend: metrics.currentStreak > 0 ? '🔥' : '💪'
    },
    {
      title: 'Nivel Actual',
      value: metrics.level.toString(),
      icon: Award,
      color: 'from-yellow-500 to-orange-500',
      trend: 'LVL'
    }
  ];

  if (error) {
    return (
      <Card className="bg-black/40 backdrop-blur-xl border-red-500/30">
        <CardContent className="p-6 text-center">
          <div className="text-red-400 mb-2">⚠️ Error de conexión</div>
          <div className="text-white/60 text-sm">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="w-8 h-8 bg-gray-600 rounded mb-2" />
                <div className="w-16 h-4 bg-gray-600 rounded mb-1" />
                <div className="w-12 h-3 bg-gray-600 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-black/40 backdrop-blur-xl border-white/10 hover:border-cyan-500/30 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {metric.trend}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {metric.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Actividad reciente */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Actividad Reciente
          </h3>
          
          <div className="space-y-3">
            {metrics.recentActivity.length > 0 ? (
              metrics.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Calculator className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-white text-sm font-medium">
                        {activity.type === 'diagnostic' ? 'Análisis Diagnóstico' : 'Evaluación'}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={
                      activity.score >= 80 ? 'bg-green-600' :
                      activity.score >= 60 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }
                  >
                    {activity.score}%
                  </Badge>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Comienza a estudiar para ver tu actividad aquí</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Salud del sistema */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-white mb-4">
            Sistema Neural - Salud: {state.systemHealth}%
          </h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-cyan-400 text-lg font-bold">
                {state.performanceMetrics.fps} FPS
              </div>
              <div className="text-gray-400 text-xs">Rendimiento</div>
            </div>
            <div className="text-center">
              <div className="text-purple-400 text-lg font-bold">
                {state.performanceMetrics.memoryUsage.toFixed(1)} MB
              </div>
              <div className="text-gray-400 text-xs">Memoria</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 text-lg font-bold">
                {state.achievements.length}
              </div>
              <div className="text-gray-400 text-xs">Logros</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
