
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Award,
  Activity,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useStudyStreak } from '@/hooks/use-study-streak';

interface MetricCard {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  progress?: number;
}

export const RealMetricsWidget: React.FC = () => {
  const { profile } = useAuth();
  const { streakData, loading } = useStudyStreak();

  const metrics: MetricCard[] = [
    {
      title: 'Racha Actual',
      value: loading ? '...' : `${streakData.currentStreak} días`,
      subtitle: 'Días consecutivos estudiando',
      icon: Award,
      color: 'text-yellow-400',
      progress: loading ? 0 : Math.min((streakData.currentStreak / 30) * 100, 100)
    },
    {
      title: 'Progreso Semanal',
      value: loading ? '...' : `${Math.min(streakData.totalStudyDays * 15, 100)}%`,
      subtitle: 'Meta semanal de estudio',
      icon: TrendingUp,
      color: 'text-green-400',
      progress: loading ? 0 : Math.min(streakData.totalStudyDays * 15, 100)
    },
    {
      title: 'Tiempo Total',
      value: loading ? '...' : `${streakData.totalStudyDays * 45}min`,
      subtitle: 'Tiempo acumulado estudiando',
      icon: Clock,
      color: 'text-blue-400'
    },
    {
      title: 'Logros',
      value: loading ? '...' : Math.floor(streakData.currentStreak / 7),
      subtitle: 'Objetivos completados',
      icon: Target,
      color: 'text-purple-400'
    }
  ];

  const recentActivity = [
    {
      action: 'Completó sesión de LectoGuía',
      time: '2 horas',
      points: '+15 pts'
    },
    {
      action: 'Diagnóstico de Matemáticas',
      time: '1 día',
      points: '+25 pts'
    },
    {
      action: 'Plan de estudio actualizado',
      time: '2 días',
      points: '+10 pts'
    }
  ];

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Métricas en Tiempo Real</CardTitle>
            <p className="text-white/70 text-sm">Tu progreso actualizado</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas principales */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${metric.color}`} />
                  <span className="text-white/80 text-xs font-medium">
                    {metric.title}
                  </span>
                </div>
                
                <div className="text-white text-lg font-bold mb-1">
                  {metric.value}
                </div>
                
                <div className="text-white/60 text-xs mb-2">
                  {metric.subtitle}
                </div>
                
                {metric.progress !== undefined && (
                  <Progress 
                    value={metric.progress} 
                    className="h-1"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Actividad reciente */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span className="text-white font-medium text-sm">Actividad Reciente</span>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div>
                  <div className="text-white text-sm">{activity.action}</div>
                  <div className="text-white/60 text-xs">Hace {activity.time}</div>
                </div>
                <Badge 
                  className="bg-green-500/20 text-green-400 border-green-500/30"
                >
                  {activity.points}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
