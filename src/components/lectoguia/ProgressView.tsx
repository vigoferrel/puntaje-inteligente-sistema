
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { formatSkillLevel, getSkillName } from "@/utils/lectoguia-utils";

interface ProgressViewProps {
  skillLevels: Record<TPAESHabilidad, number>;
  onStartSimulation: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ 
  skillLevels,
  onStartSimulation
}) => {
  // Agrupar habilidades por área usando las pruebas PAES correctas
  const skillGroups: Record<string, { prueba: TPAESPrueba, skills: TPAESHabilidad[] }> = {
    "Comprensión Lectora": {
      prueba: 'COMPETENCIA_LECTORA',
      skills: ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT']
    },
    "Matemática 1 (7° a 2° medio)": {
      prueba: 'MATEMATICA_1',
      skills: ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE']
    },
    "Matemática 2 (3° y 4° medio)": {
      prueba: 'MATEMATICA_2',
      skills: ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE']
    },
    "Ciencias": {
      prueba: 'CIENCIAS',
      skills: ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT']
    },
    "Historia": {
      prueba: 'HISTORIA',
      skills: ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION']
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold">Tu progreso</div>
      
      <div className="space-y-6">
        {Object.entries(skillGroups).map(([groupName, { prueba, skills }]) => (
          <div key={groupName} className="space-y-4">
            <h3 className="text-xl font-semibold">{groupName}</h3>
            <div className="space-y-3">
              {skills.map(skill => (
                <div key={`${prueba}-${skill}`} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{getSkillName(skill)}</span>
                    <span className="font-medium">{formatSkillLevel(skillLevels[skill as TPAESHabilidad] || 0)}</span>
                  </div>
                  <Progress 
                    value={(skillLevels[skill as TPAESHabilidad] || 0) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <Card className="p-4 mt-6 border-dashed">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium">¿Listo para poner a prueba tus habilidades?</h3>
          <p className="text-muted-foreground">
            Realiza una simulación completa para evaluar tu nivel actual.
          </p>
          <Button onClick={onStartSimulation} className="w-full">
            Iniciar simulación
          </Button>
        </div>
      </Card>
    </div>
  );
};
