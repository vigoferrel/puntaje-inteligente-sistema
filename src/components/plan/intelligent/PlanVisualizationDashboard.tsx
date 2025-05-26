
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, Calendar, TrendingUp, Target,
  Clock, Zap, Award, Brain
} from 'lucide-react';

interface PlanMetrics {
  totalPlans: number;
  activePlans: number;
  completedPlans: number;
  totalStudyTime: number;
  averageCompletion: number;
  streakDays: number;
}

interface WeeklyProgress {
  day: string;
  planned: number;
  completed: number;
  efficiency: number;
}

interface SubjectPerformance {
  subject: string;
  progress: number;
  timeSpent: number;
  efficiency: number;
  trend: 'up' | 'down' | 'stable';
}

interface PlanVisualizationDashboardProps {
  metrics: PlanMetrics;
  weeklyProgress: WeeklyProgress[];
  subjectPerformance: SubjectPerformance[];
}

export const PlanVisualizationDashboard: React.FC<PlanVisualizationDashboardProps> = ({
  metrics,
  weeklyProgress,
  subjectPerformance
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con métricas principales */}
      <Card className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 backdrop-blur-xl border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-cyan-400" />
            Dashboard de Planificación Inteligente
            <Brain className="w-5 h-5 text-purple-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{metrics.totalPlans}</div>
              <div className="text-sm text-gray-300">Planes Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">{metrics.activePlans}</div>
              <div className="text-sm text-gray-300">Planes Activos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">{metrics.totalStudyTime}h</div>
              <div className="text-sm text-gray-300">Tiempo Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{metrics.streakDays}</div>
              <div className="text-sm text-gray-300">Días Consecutivos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progreso Semanal */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Progreso Semanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{day.day}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {day.efficiency}% eficiencia
                      </Badge>
                      <span className="text-sm text-gray-400">
                        {day.completed}/{day.planned}
                      </span>
                    </div>
                  </div>
                  <Progress value={(day.completed / day.planned) * 100} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rendimiento por Materia */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Rendimiento por Materia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((subject, index) => (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium">
                        {subject.subject.replace('_', ' ')}
                      </h4>
                      <p className="text-sm text-gray-400">
                        {subject.timeSpent}h estudiadas
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTrendColor(subject.trend)}`}>
                        {subject.efficiency}% {getTrendIcon(subject.trend)}
                      </div>
                      <Badge className={
                        subject.progress >= 80 ? 'bg-green-600' :
                        subject.progress >= 60 ? 'bg-blue-600' :
                        subject.progress >= 40 ? 'bg-yellow-600' : 'bg-red-600'
                      }>
                        {subject.progress}% progreso
                      </Badge>
                    </div>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas de Eficiencia */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Análisis de Eficiencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto" />
              <div className="text-2xl font-bold text-yellow-400">
                {metrics.averageCompletion}%
              </div>
              <div className="text-sm text-gray-300">Tasa de Finalización</div>
              <p className="text-xs text-gray-500">
                Promedio de tareas completadas exitosamente
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <Clock className="w-8 h-8 text-blue-400 mx-auto" />
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(metrics.totalStudyTime / metrics.totalPlans)}h
              </div>
              <div className="text-sm text-gray-300">Tiempo por Plan</div>
              <p className="text-xs text-gray-500">
                Promedio de tiempo invertido por plan
              </p>
            </div>
            
            <div className="text-center space-y-2">
              <Award className="w-8 h-8 text-green-400 mx-auto" />
              <div className="text-2xl font-bold text-green-400">
                {Math.round((metrics.completedPlans / metrics.totalPlans) * 100)}%
              </div>
              <div className="text-sm text-gray-300">Planes Exitosos</div>
              <p className="text-xs text-gray-500">
                Porcentaje de planes completados totalmente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendaciones IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Recomendaciones de IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-lg border-l-4 border-green-500">
                <p className="text-green-400 font-medium">✨ Fortaleza Detectada</p>
                <p className="text-sm text-gray-300">
                  Tu consistencia en matemáticas es excelente. Considera aumentar la dificultad.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border-l-4 border-yellow-500">
                <p className="text-yellow-400 font-medium">⚡ Optimización Sugerida</p>
                <p className="text-sm text-gray-300">
                  Redistribuye 30 minutos de lectura a ejercicios para mejor balance.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-400 font-medium">🎯 Meta Recomendada</p>
                <p className="text-sm text-gray-300">
                  Enfócate en ciencias esta semana para mantener el momentum.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
