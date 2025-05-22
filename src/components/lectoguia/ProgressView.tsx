
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LectoGuiaSkill } from "@/types/lectoguia-types";
import { formatSkillLevel, getSkillName } from "@/utils/lectoguia-utils";

interface ProgressViewProps {
  skillLevels: Record<LectoGuiaSkill, number>;
  onStartSimulation: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ 
  skillLevels,
  onStartSimulation
}) => {
  // Helper para agrupar habilidades por área
  const skillGroups = {
    "Comprensión Lectora": ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
    "Matemáticas": ['ALGEBRA'],
    "Ciencias": ['PHYSICS'],
    "Historia": ['HISTORY']
  };
  
  return (
    <div className="space-y-6">
      <div className="text-2xl font-bold">Tu progreso</div>
      
      <div className="space-y-6">
        {Object.entries(skillGroups).map(([groupName, skills]) => (
          <div key={groupName} className="space-y-4">
            <h3 className="text-xl font-semibold">{groupName}</h3>
            <div className="space-y-3">
              {skills.map(skill => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{getSkillName(skill)}</span>
                    <span className="font-medium">{formatSkillLevel(skillLevels[skill as LectoGuiaSkill] || 0)}</span>
                  </div>
                  <Progress 
                    value={(skillLevels[skill as LectoGuiaSkill] || 0) * 100} 
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
