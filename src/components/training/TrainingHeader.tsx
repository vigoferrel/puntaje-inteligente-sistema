
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Target, Clock, Trophy } from 'lucide-react';

interface TrainingHeaderProps {
  userName?: string;
  weeklyProgress: number;
  weeklyGoal: number;
  streakDays: number;
  totalSessions: number;
}

export const TrainingHeader: React.FC<TrainingHeaderProps> = ({
  userName,
  weeklyProgress,
  weeklyGoal,
  streakDays,
  totalSessions
}) => {
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-blue-400" />
            Entrenamiento
          </h1>
          <p className="text-gray-400">
            Bienvenido {userName}, mejora tus habilidades con ejercicios personalizados
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-600/20 text-purple-300 border-purple-500">
            <Trophy className="h-3 w-3 mr-1" />
            {streakDays} días seguidos
          </Badge>
          <Badge variant="outline" className="bg-blue-600/20 text-blue-300 border-blue-500">
            {totalSessions} sesiones
          </Badge>
        </div>
      </div>

      {/* Progreso semanal */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-400" />
              <span className="text-white font-medium">Progreso Semanal</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {weeklyProgress}<span className="text-gray-400">/{weeklyGoal}</span>
              </div>
              <div className="text-sm text-gray-400">ejercicios completados</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-400">
              {Math.round(progressPercentage)}% completado
            </span>
            <span className="text-gray-400">
              {weeklyGoal - weeklyProgress} ejercicios restantes
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
