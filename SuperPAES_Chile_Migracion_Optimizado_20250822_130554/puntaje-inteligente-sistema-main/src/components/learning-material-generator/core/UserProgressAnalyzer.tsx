/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Badge } from '../../../components/ui/badge';
import { TLearningCyclePhase } from '../../../types/system-types';
import { TrendingUp, Target, Clock, AlertCircle } from 'lucide-react';
import { useRealProgressData } from '../../../hooks/useRealProgressData';
import { useAuth } from '../../../hooks/useAuth';

interface UserProgressAnalyzerProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
}

export const UserProgressAnalyzer: FC<UserProgressAnalyzerProps> = ({
  selectedSubject,
  currentPhase
}) => {
  const { user } = useAuth();
  const { metrics, isLoading } = useRealProgressData();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            AnÃ¡lisis de Progreso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || !user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Sin Datos de Progreso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No hay datos de progreso disponibles. Comienza estudiando para ver tu anÃ¡lisis.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calcular progreso por fases basado en datos reales
  const phaseProgress = {
    'EXPERIENCIA_CONCRETA': Math.min(100, (metrics.completedNodes / Math.max(metrics.totalNodes, 1)) * 100),
    'OBSERVACION_REFLEXIVA': Math.min(100, metrics.retentionRate),
    'CONCEPTUALIZACION_ABSTRACTA': Math.min(100, metrics.learningVelocity),
    'EXPERIMENTACION_ACTIVA': Math.min(100, (100 - metrics.cognitiveLoad))
  };

  // Identificar Ã¡reas dÃ©biles y fuertes basado en progreso por materia
  const subjectEntries = Object.entries(metrics.subjectProgress || {});
  const weakAreas = subjectEntries
    .filter(([_, progress]) => progress < 50)
    .map(([subject]) => subject.replace(/_/g, ' '));
  
  const strongAreas = subjectEntries
    .filter(([_, progress]) => progress >= 70)
    .map(([subject]) => subject.replace(/_/g, ' '));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          AnÃ¡lisis de Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progreso general */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm text-muted-foreground">{metrics.overallProgress}%</span>
          </div>
          <Progress value={metrics.overallProgress} className="h-2" />
        </div>

        {/* Progreso por fases */}
        <div>
          <h4 className="text-sm font-medium mb-3">Progreso por Fase del Ciclo</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(phaseProgress).map(([phase, progress]) => (
              <div key={phase} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs">{phase.split('_')[0]}</span>
                  <span className="text-xs text-muted-foreground">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* MÃ©tricas clave */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold">{metrics.completedNodes}/{metrics.totalNodes}</div>
            <div className="text-xs text-muted-foreground">Nodos</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold">{metrics.totalStudyTime}h</div>
            <div className="text-xs text-muted-foreground">Estudio</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold">{metrics.streakDays}</div>
            <div className="text-xs text-muted-foreground">Racha</div>
          </div>
        </div>

        {/* Ãreas de enfoque */}
        <div className="space-y-3">
          {weakAreas.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Ãreas para Reforzar</h4>
              <div className="flex flex-wrap gap-1">
                {weakAreas.slice(0, 3).map((area) => (
                  <Badge key={area} variant="destructive" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {strongAreas.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Fortalezas</h4>
              <div className="flex flex-wrap gap-1">
                {strongAreas.slice(0, 3).map((area) => (
                  <Badge key={area} variant="default" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recomendaciones basadas en datos reales */}
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800 mb-1">
            <Target className="h-4 w-4" />
            <span className="font-medium">RecomendaciÃ³n Personalizada</span>
          </div>
          <p className="text-blue-700 text-sm">
            {metrics.learningVelocity < 50 
              ? "EnfÃ³cate en ejercicios de refuerzo para mejorar tu velocidad de aprendizaje"
              : metrics.overallProgress < 30
              ? "MantÃ©n el ritmo actual, estÃ¡s progresando bien"
              : "Considera agregar ejercicios de mayor dificultad para desafiarte mÃ¡s"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

