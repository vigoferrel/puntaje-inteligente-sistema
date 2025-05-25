
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProgressAnalyzerProps {
  userId?: string;
  selectedSubject: string;
  phaseProgress: Record<string, any>;
}

export const UserProgressAnalyzer: React.FC<UserProgressAnalyzerProps> = ({
  userId,
  selectedSubject,
  phaseProgress
}) => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    generateAnalytics();
  }, [phaseProgress, selectedSubject]);

  const generateAnalytics = () => {
    // Simulación de análisis avanzado
    const analytics = {
      overallTrend: 'positive',
      strengthAreas: ['TRACK_LOCATE', 'SOLVE_PROBLEMS'],
      improvementAreas: ['EVALUATE_REFLECT', 'SCIENTIFIC_ARGUMENT'],
      studyTimeOptimal: 45,
      difficultyRecommendation: 'intermedio',
      nextPhaseReadiness: 75,
      weeklyImprovement: 12
    };
    setAnalyticsData(analytics);
  };

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Activity className="h-6 w-6 animate-pulse" />
            <span className="ml-2">Analizando progreso...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Análisis de Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tendencia General */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="font-medium">Tendencia Positiva</span>
          </div>
          <Badge variant="outline" className="text-green-700 border-green-300">
            +{analyticsData.weeklyImprovement}% esta semana
          </Badge>
        </div>

        {/* Métricas Clave */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Tiempo Óptimo</div>
            <div className="text-xl font-bold">{analyticsData.studyTimeOptimal}min</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Preparación</div>
            <div className="text-xl font-bold">{analyticsData.nextPhaseReadiness}%</div>
          </div>
        </div>

        {/* Preparación para Siguiente Fase */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Preparación para Siguiente Fase</span>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <Progress value={analyticsData.nextPhaseReadiness} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {analyticsData.nextPhaseReadiness >= 80 ? 
              'Listo para avanzar' : 
              `Necesitas ${100 - analyticsData.nextPhaseReadiness}% más`
            }
          </p>
        </div>

        {/* Recomendaciones de Dificultad */}
        <div className="p-3 rounded-lg border border-border">
          <h4 className="font-medium mb-2">Nivel Recomendado</h4>
          <Badge variant="default">{analyticsData.difficultyRecommendation}</Badge>
          <p className="text-xs text-muted-foreground mt-1">
            Basado en tu rendimiento actual
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
