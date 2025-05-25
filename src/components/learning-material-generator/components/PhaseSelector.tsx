
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TLearningCyclePhase } from '@/types/system-types';
import { PHASE_CONFIG, getPhaseConfigSafe } from '../utils/phase-material-mapping';
import { Clock, Target, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PhaseSelectorProps {
  selectedPhase: TLearningCyclePhase;
  onPhaseChange: (phase: TLearningCyclePhase) => void;
  currentUserPhase?: TLearningCyclePhase | null;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  selectedPhase,
  onPhaseChange,
  currentUserPhase
}) => {
  const mainPhases: TLearningCyclePhase[] = [
    'DIAGNOSIS',
    'SKILL_TRAINING', 
    'CONTENT_STUDY',
    'PERIODIC_TESTS',
    'FINAL_SIMULATIONS'
  ];

  // Validar que PHASE_CONFIG esté disponible
  if (!PHASE_CONFIG || typeof PHASE_CONFIG !== 'object') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error al cargar las fases del ciclo de aprendizaje. Por favor, recarga la página.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Fase del Ciclo de Aprendizaje</h3>
        {currentUserPhase && (
          <Badge variant="outline" className="text-xs">
            Actual: {getPhaseConfigSafe(currentUserPhase).icon} {getPhaseConfigSafe(currentUserPhase).name}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {mainPhases.map((phase) => {
          const config = getPhaseConfigSafe(phase);
          const isSelected = selectedPhase === phase;
          const isCurrent = currentUserPhase === phase;
          
          // Validación adicional por si alguna fase no tiene configuración
          if (!config) {
            console.warn('Configuración no encontrada para fase:', phase);
            return null;
          }
          
          return (
            <Card
              key={phase}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              } ${isCurrent ? 'border-green-500' : ''}`}
              onClick={() => onPhaseChange(phase)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{config.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{config.name}</h4>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{config.estimatedDuration}min</span>
                  </div>
                </div>
                
                <div className="flex gap-1 mt-2">
                  {config.recommendedMaterials.slice(0, 2).map((material) => (
                    <Badge key={material} variant="secondary" className="text-xs px-1">
                      {material === 'exercises' ? 'Ejercicios' :
                       material === 'study_content' ? 'Estudio' :
                       material === 'diagnostic_tests' ? 'Evaluación' :
                       material === 'practice_guides' ? 'Guías' : 'Simulacros'}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
