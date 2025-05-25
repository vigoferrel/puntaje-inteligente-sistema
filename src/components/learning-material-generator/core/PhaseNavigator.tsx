
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TLearningCyclePhase } from '@/types/system-types';
import { ChevronRight, Circle } from 'lucide-react';

interface PhaseNavigatorProps {
  currentPhase: TLearningCyclePhase;
  onPhaseChange: (phase: TLearningCyclePhase) => void;
}

export const PhaseNavigator: React.FC<PhaseNavigatorProps> = ({
  currentPhase,
  onPhaseChange
}) => {
  const phases: { key: TLearningCyclePhase; name: string; icon: string }[] = [
    { key: 'EXPERIENCIA_CONCRETA', name: 'Experiencia', icon: '🎯' },
    { key: 'OBSERVACION_REFLEXIVA', name: 'Reflexión', icon: '🔍' },
    { key: 'CONCEPTUALIZACION_ABSTRACTA', name: 'Conceptos', icon: '🧠' },
    { key: 'EXPERIMENTACION_ACTIVA', name: 'Aplicación', icon: '⚡' }
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => (
            <React.Fragment key={phase.key}>
              <Button
                variant={currentPhase === phase.key ? "default" : "outline"}
                size="sm"
                onClick={() => onPhaseChange(phase.key)}
                className="flex flex-col h-auto py-3 px-4"
              >
                <span className="text-lg mb-1">{phase.icon}</span>
                <span className="text-xs">{phase.name}</span>
                {currentPhase === phase.key && (
                  <Circle className="w-2 h-2 fill-current mt-1" />
                )}
              </Button>
              {index < phases.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
