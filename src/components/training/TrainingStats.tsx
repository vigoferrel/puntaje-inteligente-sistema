
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, CheckCircle, TrendingUp } from 'lucide-react';
import { TrainingStats as Stats } from '@/hooks/use-training';

interface TrainingStatsProps {
  stats: Stats;
}

export const TrainingStats: React.FC<TrainingStatsProps> = ({ stats }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Ejercicios Completados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.totalExercises}
          </div>
          <div className="text-xs text-gray-400">
            {stats.correctAnswers} correctos
          </div>
          <Progress 
            value={stats.averageAccuracy} 
            className="mt-2 h-2"
          />
          <div className="text-xs text-gray-400 mt-1">
            {stats.averageAccuracy.toFixed(1)}% precisión
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            Tiempo Invertido
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {formatTime(stats.timeSpent)}
          </div>
          <div className="text-xs text-gray-400">
            ~{Math.round(stats.timeSpent / stats.totalSessions)}m por sesión
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-400" />
            Sesiones Totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.totalSessions}
          </div>
          <div className="text-xs text-gray-400">
            Racha de {stats.streakDays} días
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            Meta Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white mb-1">
            {stats.weeklyProgress}
          </div>
          <div className="text-xs text-gray-400">
            de {stats.weeklyGoal} ejercicios
          </div>
          <Progress 
            value={(stats.weeklyProgress / stats.weeklyGoal) * 100} 
            className="mt-2 h-2"
          />
          <div className="text-xs text-gray-400 mt-1">
            {Math.round((stats.weeklyProgress / stats.weeklyGoal) * 100)}% completado
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
