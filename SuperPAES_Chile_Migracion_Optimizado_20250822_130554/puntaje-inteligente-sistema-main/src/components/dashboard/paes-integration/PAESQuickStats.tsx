/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Progress } from '../../../components/ui/progress';
import { Award, TrendingUp, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePAESExerciseTracking } from '../../../hooks/lectoguia/use-paes-exercise-tracking';

export const PAESQuickStats: React.FC = () => {
  const { getRecentStats, getProgressBySkill } = usePAESExerciseTracking();
  const [recentStats, setRecentStats] = useState<unknown>(null);
  const [skillProgress, setSkillProgress] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const [recent, skills] = await Promise.all([
          getRecentStats(20),
          getProgressBySkill()
        ]);
        setRecentStats(recent);
        setSkillProgress(skills);
      } catch (error) {
        console.error('Error cargando estadÃ­sticas PAES:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [getRecentStats, getProgressBySkill]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Progreso PAES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recentStats || recentStats.totalQuestions === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-6 text-center">
          <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-2">Comienza con PAES</h3>
          <p className="text-sm text-muted-foreground">
            Resuelve preguntas oficiales PAES para ver tu progreso aquÃ­
          </p>
        </CardContent>
      </Card>
    );
  }

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-blue-600';
    if (accuracy >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const topSkills = skillProgress ? 
    Object.entries(skillProgress)
      .sort(([,a]: unknown, [,b]: unknown) => b.accuracy - a.accuracy)
      .slice(0, 3) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Award className="h-5 w-5" />
            Progreso PAES Oficial
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* EstadÃ­sticas principales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {recentStats.totalQuestions}
              </div>
              <div className="text-xs text-green-600">Preguntas</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getAccuracyColor(recentStats.accuracy)}`}>
                {Math.round(recentStats.accuracy)}%
              </div>
              <div className="text-xs text-green-600">PrecisiÃ³n</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-800">
                {recentStats.correctAnswers}
              </div>
              <div className="text-xs text-green-600">Correctas</div>
            </div>
          </div>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-700">Rendimiento General</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {Math.round(recentStats.accuracy)}%
              </Badge>
            </div>
            <Progress value={recentStats.accuracy} className="h-2" />
          </div>

          {/* Top habilidades */}
          {topSkills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-green-700 flex items-center gap-1">
                <Target className="h-3 w-3" />
                Mejores Habilidades
              </h4>
              <div className="space-y-1">
                {topSkills.map(([skill, stats]: unknown, index) => (
                  <div key={skill} className="flex items-center justify-between text-xs">
                    <span className="text-green-600 truncate flex-1">{skill}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(stats.accuracy)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indicador de tendencia */}
          <div className="flex items-center gap-2 pt-2 border-t border-green-200">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600">
              Ãšltimas {recentStats.totalQuestions} preguntas oficiales
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

