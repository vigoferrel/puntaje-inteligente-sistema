
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Target, Zap } from 'lucide-react';
import { TLearningCyclePhase } from '@/types/system-types';
import { motion } from 'framer-motion';

interface ProgressDashboardProps {
  phaseProgress: Record<string, any>;
  currentPhase: TLearningCyclePhase;
  learningInsights: any;
  predictedScore: number | null;
}

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  phaseProgress,
  currentPhase,
  learningInsights,
  predictedScore
}) => {
  const getPhaseDisplayName = (phase: string) => {
    const names: Record<string, string> = {
      'DIAGNOSIS': 'Diagnóstico',
      'SKILL_TRAINING': 'Entrenamiento',
      'CONTENT_STUDY': 'Estudio',
      'PERIODIC_TESTS': 'Evaluaciones',
      'FINAL_SIMULATIONS': 'Simulacros'
    };
    return names[phase] || phase;
  };

  return (
    <div className="space-y-6">
      {/* Progreso por Fases */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Progreso por Fases del Ciclo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(phaseProgress).map(([phase, progress], index) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded-lg border ${
                phase === currentPhase ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{getPhaseDisplayName(phase)}</span>
                <Badge variant={phase === currentPhase ? 'default' : 'secondary'}>
                  {Math.round(progress.accuracy || 0)}%
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={progress.accuracy || 0} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.correct || 0}/{progress.total || 0} ejercicios</span>
                  <span>{phase === currentPhase ? 'Activa' : 'Completada'}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Insights Inteligentes */}
      {learningInsights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Insights de Aprendizaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Fortalezas */}
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <div className="font-medium text-green-800 mb-2">Fortalezas Identificadas</div>
              <div className="flex flex-wrap gap-1">
                {learningInsights.strongestSkills?.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="text-green-700 border-green-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Áreas de Mejora */}
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <div className="font-medium text-orange-800 mb-2">Áreas de Mejora</div>
              <div className="flex flex-wrap gap-1">
                {learningInsights.weakestSkills?.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="text-orange-700 border-orange-300">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Próximo Hito */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <Target className="h-4 w-4" />
                <span className="font-medium">Próximo Hito</span>
              </div>
              <p className="text-blue-700 mt-1">{learningInsights.nextMilestone}</p>
            </div>

            {/* Tiempo de Estudio Recomendado */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">Tiempo de Estudio Recomendado Hoy</div>
                <div className="text-sm text-muted-foreground">
                  {learningInsights.estimatedStudyTime} minutos
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
