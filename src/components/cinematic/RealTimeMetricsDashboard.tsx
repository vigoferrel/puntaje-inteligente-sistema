
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, TrendingUp, Clock, Target, Zap, 
  Award, BookOpen, Calculator, BarChart3 
} from 'lucide-react';

interface UserMetrics {
  totalStudyTime: number;
  exercisesCompleted: number;
  averageScore: number;
  currentStreak: number;
  level: number;
  recentActivity: Array<{
    type: string;
    score: number;
    timestamp: string;
  }>;
}

export const RealTimeMetricsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { state, addAchievement } = useGlobalCinematic();
  const [metrics, setMetrics] = useState<UserMetrics>({
    totalStudyTime: 0,
    exercisesCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
    level: 1,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Cargar métricas reales del usuario
  useEffect(() => {
    const loadUserMetrics = async () => {
      if (!user?.id) return;

      try {
        // Obtener datos de progreso del usuario
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(10);

        // Obtener evaluaciones completadas
        const { data: evaluationsData } = await supabase
          .from('evaluation_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        // Calcular métricas
        const totalExercises = progressData?.length || 0;
        const avgScore = evaluationsData?.length 
          ? evaluationsData.reduce((acc, eval) => acc + (eval.score || 0), 0) / evaluationsData.length
          : 0;
        
        // Calcular racha actual
        let streak = 0;
        const today = new Date();
        const sortedActivity = [...(progressData || [])].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );

        for (const activity of sortedActivity) {
          const activityDate = new Date(activity.updated_at);
          const daysDiff = Math.floor((today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= streak + 1) {
            streak++;
          } else {
            break;
          }
        }

        const newMetrics: UserMetrics = {
          totalStudyTime: progressData?.reduce((acc, p) => acc + (p.time_spent || 0), 0) || 0,
          exercisesCompleted: totalExercises,
          averageScore: Math.round(avgScore),
          currentStreak: streak,
          level: Math.floor(totalExercises / 10) + 1,
          recentActivity: evaluationsData?.slice(0, 5).map(eval => ({
            type: eval.evaluation_type || 'exercise',
            score: eval.score || 0,
            timestamp: eval.created_at
          })) || []
        };

        setMetrics(newMetrics);

        // Verificar logros
        if (newMetrics.currentStreak >= 7) {
          addAchievement('weekly_streak');
        }
        if (newMetrics.exercisesCompleted >= 100) {
          addAchievement('hundred_exercises');
        }
        if (newMetrics.averageScore >= 85) {
          addAchievement('high_performer');
        }

      } catch (error) {
        console.error('Error loading user metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadUserMetrics, 30000);
    return () => clearInterval(interval);
  }, [user?.id, addAchievement]);

  const metricCards = [
    {
      title: 'Tiempo de Estudio',
      value: `${Math.round(metrics.totalStudyTime / 60)}h`,
      icon: Clock,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%'
    },
    {
      title: 'Ejercicios Completados',
      value: metrics.exercisesCompleted.toString(),
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
      trend: '+5'
    },
    {
      title: 'Promedio de Puntuación',
      value: `${metrics.averageScore}%`,
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trend: '+3%'
    },
    {
      title: 'Racha Actual',
      value: `${metrics.currentStreak} días`,
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
                        {activity.type === 'COMPETENCIA_LECTORA' ? 'Comprensión Lectora' :
                         activity.type === 'MATEMATICA_M1' ? 'Matemática M1' :
                         activity.type === 'MATEMATICA_M2' ? 'Matemática M2' :
                         'Ejercicio'}
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
                <p>Comienza a practicar para ver tu actividad aquí</p>
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
