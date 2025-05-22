
import React from 'react';
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatSkillLevel, getSkillsByPrueba } from '@/utils/lectoguia-utils';

export interface SkillNodeConnectionProps {
  skillLevels: Record<TPAESHabilidad, number>;
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  onNodeSelect?: (nodeId: string) => void;
  selectedTest?: TPAESPrueba;
  className?: string;
}

export const SkillNodeConnection: React.FC<SkillNodeConnectionProps> = ({
  skillLevels,
  nodes,
  nodeProgress,
  onNodeSelect,
  selectedTest,
  className
}) => {
  // Filtrar nodos por la prueba seleccionada si existe
  const filteredNodes = selectedTest 
    ? nodes.filter(node => node.prueba === selectedTest)
    : nodes;
  
  // Inicializar un objeto vacío para agrupar nodos por habilidad
  const initialNodesBySkill = {} as Record<TPAESHabilidad, TLearningNode[]>;
  
  // Obtener todas las habilidades del enum TPAESHabilidad
  Object.values(TPAESHabilidad).forEach(skill => {
    initialNodesBySkill[skill as TPAESHabilidad] = [];
  });
  
  // Agrupar nodos por habilidad
  const nodesBySkill = filteredNodes.reduce((acc, node) => {
    if (node.skill) {
      if (!acc[node.skill]) {
        acc[node.skill] = [];
      }
      acc[node.skill].push(node);
    }
    return acc;
  }, initialNodesBySkill);
  
  // Obtener habilidades relevantes para la prueba seleccionada
  const relevantSkills = selectedTest 
    ? getSkillsByPrueba()[selectedTest] 
    : Object.keys(skillLevels) as TPAESHabilidad[];
  
  return (
    <div className={`space-y-8 ${className || ''}`}>
      <h3 className="text-xl font-semibold">Mapa de Aprendizaje</h3>
      
      {relevantSkills.map(skill => (
        <Card key={skill} className="p-4">
          <div className="mb-3 flex justify-between items-center">
            <div>
              <h4 className="font-medium">{skill}</h4>
              <div className="text-sm text-muted-foreground">
                Nivel actual: {formatSkillLevel(skillLevels[skill] || 0)}
              </div>
            </div>
            
            {/* Barra de progreso para la habilidad */}
            <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary" 
                style={{ width: `${(skillLevels[skill] || 0) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Nodos de la habilidad */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {nodesBySkill[skill]?.map(node => {
              const progress = nodeProgress[node.id];
              const status = progress?.status || 'locked';
              
              return (
                <Tooltip key={node.id}>
                  <TooltipTrigger asChild>
                    <div 
                      className={`
                        p-3 rounded-md border cursor-pointer transition-all
                        ${status === 'completed' ? 'bg-green-50 border-green-200' : 
                          status === 'in_progress' ? 'bg-blue-50 border-blue-200' : 
                          'bg-gray-50 border-gray-200'}
                      `}
                      onClick={() => onNodeSelect && onNodeSelect(node.id)}
                    >
                      <div className="text-sm font-medium truncate">{node.title}</div>
                      <div className="text-xs text-muted-foreground">{node.difficulty}</div>
                      
                      {/* Indicador de progreso */}
                      {progress && (
                        <div className="mt-2 w-full h-1 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${progress.progress * 100}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{node.title}</p>
                    <p className="text-xs">{node.description}</p>
                    {progress && (
                      <p className="text-xs mt-1">
                        Progreso: {Math.round(progress.progress * 100)}%
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            
            {(!nodesBySkill[skill] || nodesBySkill[skill].length === 0) && (
              <div className="col-span-full text-center py-4 text-sm text-muted-foreground">
                No hay nodos disponibles para esta habilidad
              </div>
            )}
          </div>
        </Card>
      ))}
      
      {relevantSkills.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No hay habilidades disponibles para mostrar
        </div>
      )}
    </div>
  );
};
