
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, Check, Clock, Target } from 'lucide-react';
import { TLearningCyclePhase } from '@/types/system-types';
import { motion } from 'framer-motion';

interface PhaseNavigatorProps {
  currentPhase: TLearningCyclePhase;
  phaseProgress: Record<string, any>;
  onPhaseChange: (phase: TLearningCyclePhase) => void;
}

export const PhaseNavigator: React.FC<PhaseNavigatorProps> = ({
  currentPhase,
  phaseProgress,
  onPhaseChange
}) => {
  const phases: { phase: TLearningCyclePhase; name: string; icon: string; description: string }[] = [
    {
      phase: 'DIAGNOSIS',
      name: 'Diagnóstico',
      icon: '🔍',
      description: 'Evalúa tu nivel actual'
    },
    {
      phase: 'SKILL_TRAINING',
      name: 'Entrenamiento',
      icon: '💪',
      description: 'Desarrolla habilidades específicas'
    },
    {
      phase: 'CONTENT_STUDY',
      name: 'Estudio',
      icon: '📚',
      description: 'Aprende contenidos teóricos'
    },
    {
      phase: 'PERIODIC_TESTS',
      name: 'Evaluaciones',
      icon: '📊',
      description: 'Mide tu progreso'
    },
    {
      phase: 'FINAL_SIMULATIONS',
      name: 'Simulacros',
      icon: '🎯',
      description: 'Practica formato PAES'
    }
  ];

  const getPhaseStatus = (phase: TLearningCyclePhase) => {
    const progress = phaseProgress[phase];
    if (!progress || progress.total === 0) return 'pending';
    if (progress.accuracy >= 80) return 'completed';
    if (phase === currentPhase) return 'active';
    return 'in-progress';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4 text-green-500" />;
      case 'active': return <Target className="h-4 w-4 text-primary" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-500 bg-green-50';
      case 'active': return 'border-primary bg-primary/5';
      case 'in-progress': return 'border-orange-500 bg-orange-50';
      default: return 'border-muted bg-muted/20';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Navegador del Ciclo de Aprendizaje
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map((phaseInfo, index) => {
            const status = getPhaseStatus(phaseInfo.phase);
            const progress = phaseProgress[phaseInfo.phase];
            const isClickable = status !== 'pending' || index === 0;

            return (
              <motion.div
                key={phaseInfo.phase}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => isClickable && onPhaseChange(phaseInfo.phase)}
                  disabled={!isClickable}
                  variant="ghost"
                  className={`w-full h-auto p-4 ${getStatusColor(status)} border-2 hover:bg-opacity-80`}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Icono de estado */}
                    <div className="flex-shrink-0">
                      {getStatusIcon(status)}
                    </div>

                    {/* Icono de fase */}
                    <div className="text-2xl flex-shrink-0">
                      {phaseInfo.icon}
                    </div>

                    {/* Información de la fase */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{phaseInfo.name}</h4>
                        <Badge 
                          variant={status === 'active' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          {status === 'completed' ? 'Completada' :
                           status === 'active' ? 'Activa' :
                           status === 'in-progress' ? 'En Progreso' : 'Pendiente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {phaseInfo.description}
                      </p>
                      
                      {/* Barra de progreso */}
                      {progress && progress.total > 0 && (
                        <div className="mt-2 space-y-1">
                          <Progress 
                            value={progress.accuracy || 0} 
                            className="h-1"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{progress.correct}/{progress.total} ejercicios</span>
                            <span>{Math.round(progress.accuracy || 0)}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Flecha */}
                    <div className="flex-shrink-0">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
