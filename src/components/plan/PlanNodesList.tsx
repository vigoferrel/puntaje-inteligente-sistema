
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LearningPlanNode } from "@/types/learning-plan";

interface PlanNodesListProps {
  nodes: LearningPlanNode[];
}

export const PlanNodesList = ({ nodes }: PlanNodesListProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Módulos de estudio</h3>
      
      <div className="space-y-3">
        {nodes.map((node, index) => (
          <div 
            key={node.id} 
            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3">
                {index + 1}
              </div>
              <div>
                <p className="font-medium">{node.nodeName}</p>
                <p className="text-xs text-gray-500">
                  {node.nodeSkill 
                    ? `Habilidad: ${node.nodeSkill}` 
                    : "Módulo de estudio"}
                </p>
              </div>
            </div>
            
            <div>
              <Badge variant={index === 0 ? "default" : "outline"}>
                {index === 0 ? "En progreso" : "Pendiente"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
