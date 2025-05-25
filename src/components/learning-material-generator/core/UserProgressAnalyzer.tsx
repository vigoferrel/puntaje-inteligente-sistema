
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TLearningCyclePhase } from '@/types/system-types';
import { TrendingUp, Target, Clock } from 'lucide-react';

interface UserProgressAnalyzerProps {
  selectedSubject: string;
  currentPhase: TLearningCyclePhase;
}

export const UserProgressAnalyzer: React.FC<UserProgressAnalyzerProps> = ({
  selectedSubject,
  currentPhase
}) => {
  // Mock data - en producción vendría de la base de datos
  const progressData = {
    overallProgress: 35,
    weakAreas: ['Interpretar y Relacionar', 'Resolver Problemas'],
    strongAreas: ['Localizar Información'],
    completedNodes: 12,
    totalNodes: 30,
    studyTime: 45,
    lastActivity: new Date()
  };

  const phaseProgress = {
    'EXPERIENCIA_CONCRETA': 75,
    'OBSERVACION_REFLEXIVA': 40,
    'CONCEPTUALIZACION_ABSTRACTA': 20,
    'EXPERIMENTACION_ACTIVA': 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Análisis de Progreso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progreso general */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm text-muted-foreground">{progressData.overallProgress}%</span>
          </div>
          <Progress value={progressData.overallProgress} className="h-2" />
        </div>

        {/* Progreso por fases */}
        <div>
          <h4 className="text-sm font-medium mb-3">Progreso por Fase del Ciclo</h4>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(phaseProgress).map(([phase, progress]) => (
              <div key={phase} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs">{phase.split('_')[0]}</span>
                  <span className="text-xs text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Métricas clave */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-lg font-bold">{progressData.completedNodes}/{progressData.totalNodes}</div>
            <div className="text-xs text-muted-foreground">Nodos</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-lg font-bold">{progressData.studyTime}h</div>
            <div className="text-xs text-muted-foreground">Estudio</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <div className="text-lg font-bold">{progressData.strongAreas.length}</div>
            <div className="text-xs text-muted-foreground">Fortalezas</div>
          </div>
        </div>

        {/* Áreas de enfoque */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Áreas para Reforzar</h4>
            <div className="flex flex-wrap gap-1">
              {progressData.weakAreas.map((area) => (
                <Badge key={area} variant="destructive" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Fortalezas</h4>
            <div className="flex flex-wrap gap-1">
              {progressData.strongAreas.map((area) => (
                <Badge key={area} variant="default" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
