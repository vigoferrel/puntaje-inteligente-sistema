
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Award, TrendingUp, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface PAESProgressIndicatorProps {
  phaseProgress: Record<string, {
    total: number;
    correct: number;
    accuracy: number;
  }>;
  predictedScore: number | null;
  loading?: boolean;
}

export const PAESProgressIndicator: React.FC<PAESProgressIndicatorProps> = ({
  phaseProgress,
  predictedScore,
  loading = false
}) => {
  const phases = Object.keys(phaseProgress);
  const totalQuestions = phases.reduce((sum, phase) => sum + phaseProgress[phase].total, 0);
  const totalCorrect = phases.reduce((sum, phase) => sum + phaseProgress[phase].correct, 0);
  const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Progreso PAES Oficial
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Award className="h-5 w-5" />
            Progreso en Preguntas Oficiales PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progreso General */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-700">Precisión General</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {Math.round(overallAccuracy)}%
              </Badge>
            </div>
            <Progress 
              value={overallAccuracy} 
              className="h-3"
            />
            <div className="flex justify-between text-xs text-green-600">
              <span>{totalCorrect} correctas</span>
              <span>{totalQuestions} preguntas oficiales</span>
            </div>
          </div>

          {/* Puntaje Predicho */}
          {predictedScore && (
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Puntaje Predicho</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-green-800">{predictedScore}</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-1">
                Basado en {totalQuestions} preguntas oficiales resueltas
              </p>
            </div>
          )}

          {/* Progreso por Fase */}
          {phases.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-700">Por Fase del Ciclo</h4>
              {phases.slice(0, 3).map(phase => {
                const stats = phaseProgress[phase];
                const phaseAccuracy = (stats.correct / stats.total) * 100;
                
                return (
                  <div key={phase} className="flex items-center gap-2">
                    <span className="text-xs text-green-600 w-20 truncate">
                      {phase.replace('_', ' ')}
                    </span>
                    <Progress value={phaseAccuracy} className="h-2 flex-1" />
                    <span className="text-xs text-green-600 w-12">
                      {Math.round(phaseAccuracy)}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-xs text-green-600 border-t border-green-200 pt-2">
            <Award className="h-3 w-3 inline mr-1" />
            Ejercicios basados en preguntas reales de PAES 2024
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
