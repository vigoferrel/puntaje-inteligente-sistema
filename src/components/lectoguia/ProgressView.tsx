
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TPAESHabilidad, TPAESPrueba, getHabilidadDisplayName } from "@/types/system-types";
import { formatSkillLevel } from "@/utils/lectoguia-utils";

interface ProgressViewProps {
  skillLevels: Record<TPAESHabilidad, number>;
  selectedPrueba?: TPAESPrueba;
  onStartSimulation: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ 
  skillLevels,
  selectedPrueba,
  onStartSimulation
}) => {
  // Agrupar habilidades por área usando las pruebas PAES correctas
  const skillGroups: Record<TPAESPrueba, TPAESHabilidad[]> = {
    "COMPETENCIA_LECTORA": ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
    "MATEMATICA_1": ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
    "MATEMATICA_2": ['SOLVE_PROBLEMS', 'REPRESENT', 'MODEL', 'ARGUE_COMMUNICATE'],
    "CIENCIAS": ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'],
    "HISTORIA": ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING', 'REFLECTION']
  };
  
  // Pruebas a mostrar: solo la seleccionada o todas
  const testsToShow = selectedPrueba 
    ? [selectedPrueba]
    : ['COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS', 'HISTORIA'] as TPAESPrueba[];
  
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold">Tu progreso</div>
      
      <div className="space-y-6">
        {testsToShow.map((prueba) => {
          const skills = skillGroups[prueba];
          
          if (!skills || skills.length === 0) return null;
          
          return (
            <div key={prueba} className="space-y-4">
              <h3 className="text-xl font-semibold">{prueba}</h3>
              <div className="space-y-3">
                {skills.map(skill => (
                  <div key={`${prueba}-${skill}`} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{getHabilidadDisplayName(skill)}</span>
                      <span className="font-medium">{formatSkillLevel(skillLevels[skill] || 0)}</span>
                    </div>
                    <Progress 
                      value={(skillLevels[skill] || 0) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
}
