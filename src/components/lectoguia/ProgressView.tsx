
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Play } from 'lucide-react';

interface ProgressViewProps {
  skillLevels: {
    'TRACK_LOCATE': number;
    'INTERPRET_RELATE': number;
    'EVALUATE_REFLECT': number;
  };
  previousSkillLevels?: {
    'TRACK_LOCATE': number;
    'INTERPRET_RELATE': number;
    'EVALUATE_REFLECT': number;
  };
  onStartSimulation?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ 
  skillLevels, 
  previousSkillLevels,
  onStartSimulation
}) => {
  // Default values for previous if not provided
  const prevLevels = previousSkillLevels || {
    'TRACK_LOCATE': skillLevels['TRACK_LOCATE'] > 0.1 ? skillLevels['TRACK_LOCATE'] - 0.1 : 0,
    'INTERPRET_RELATE': skillLevels['INTERPRET_RELATE'] > 0.1 ? skillLevels['INTERPRET_RELATE'] - 0.1 : 0,
    'EVALUATE_REFLECT': skillLevels['EVALUATE_REFLECT'] > 0.1 ? skillLevels['EVALUATE_REFLECT'] - 0.1 : 0
  };

  // Find weakest skill
  const weakestSkill = Object.entries(skillLevels).reduce(
    (prev, [key, value]) => value < prev.value ? { key, value } : prev,
    { key: 'INTERPRET_RELATE', value: 1 }
  );

  const getSkillDisplayName = (key: string) => {
    switch (key) {
      case 'TRACK_LOCATE': return 'Rastrear-Localizar';
      case 'INTERPRET_RELATE': return 'Interpretar-Relacionar';
      case 'EVALUATE_REFLECT': return 'Evaluar-Reflexionar';
      default: return key;
    }
  };

  const getSkillColor = (key: string) => {
    switch (key) {
      case 'TRACK_LOCATE': return 'green';
      case 'INTERPRET_RELATE': return 'yellow';
      case 'EVALUATE_REFLECT': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="h-full overflow-auto custom-scrollbar">
      <h3 className="text-xl font-semibold mb-6">Tu progreso en Competencia Lectora</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(skillLevels).map(([key, value]) => {
          const color = getSkillColor(key);
          const displayName = getSkillDisplayName(key);
          const prevValue = prevLevels[key as keyof typeof prevLevels];
          const percentValue = Math.round(value * 100);
          const prevPercentValue = Math.round(prevValue * 100);
          
          return (
            <div key={key} className="bg-secondary/30 p-4 rounded-lg border border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{displayName}</h4>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <div 
                  className={`h-full bg-${color}-500 rounded-full`} 
                  style={{ width: `${percentValue}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Previo: {prevPercentValue}%</span>
                <span className={`text-${color}-400`}>Actual: {percentValue}%</span>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Recomendaciones de LectoGuía</h3>
        
        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <div className={`bg-${getSkillColor(weakestSkill.key)}-500/20 p-2 rounded-full text-${getSkillColor(weakestSkill.key)}-400`}>
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">
                Enfócate en {getSkillDisplayName(weakestSkill.key)}
              </h4>
              <p className="text-sm text-muted-foreground">
                Esta es tu área con mayor oportunidad de mejora. Te recomiendo realizar más ejercicios 
                de {weakestSkill.key === 'TRACK_LOCATE' 
                  ? 'identificación de información explícita en el texto' 
                  : weakestSkill.key === 'INTERPRET_RELATE' 
                    ? 'inferencia textual y análisis de relaciones entre ideas' 
                    : 'análisis crítico y reflexión personal sobre el texto'}.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <div className="bg-green-500/20 p-2 rounded-full text-green-400">
              <Play className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Próximo paso sugerido</h4>
              <p className="text-sm text-muted-foreground">
                Realiza el simulacro de Competencia Lectora que hemos preparado para ti. 
                Contiene 20 preguntas balanceadas según tus necesidades de mejora.
              </p>
              <Button 
                variant="link" 
                className="text-primary p-0 h-auto mt-2"
                onClick={onStartSimulation}
              >
                Iniciar simulacro personalizado
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
