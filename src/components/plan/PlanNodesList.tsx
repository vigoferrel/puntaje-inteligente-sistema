
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LearningPlanNode } from "@/types/learning-plan";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { Progress } from "@/components/ui/progress";

interface PlanNodesListProps {
  nodes: LearningPlanNode[];
  recommendedNodeId: string | null;
  progress: {
    totalNodes: number;
    completedNodes: number;
    inProgressNodes: number;
    overallProgress: number;
  } | null;
}

export const PlanNodesList = ({ nodes, recommendedNodeId, progress }: PlanNodesListProps) => {
  // Función para determinar el estado de un nodo
  const getNodeStatus = (nodeId: string, index: number): { 
    status: 'completed' | 'in-progress' | 'pending' | 'recommended',
    label: string 
  } => {
    if (!progress) return { status: 'pending', label: 'Pendiente' };
    
    // Asumimos que los nodos se completan en orden
    if (index < progress.completedNodes) {
      return { status: 'completed', label: 'Completado' };
    }
    
    if (index < progress.completedNodes + progress.inProgressNodes) {
      return { status: 'in-progress', label: 'En progreso' };
    }
    
    if (nodeId === recommendedNodeId) {
      return { status: 'recommended', label: 'Recomendado' };
    }
    
    return { status: 'pending', label: 'Pendiente' };
  };
  
  return (
    <div className="space-y-2">
      <h3 className="font-medium">Módulos de estudio</h3>
      
      <div className="space-y-3">
        {nodes.map((node, index) => {
          const nodeStatus = getNodeStatus(node.nodeId, index);
          
          return (
            <PlanNodeItem 
              key={node.id} 
              node={node} 
              index={index}
              status={nodeStatus.status}
              statusLabel={nodeStatus.label}
              isRecommended={node.nodeId === recommendedNodeId}
            />
          );
        })}
      </div>
    </div>
  );
};

interface PlanNodeItemProps {
  node: LearningPlanNode;
  index: number;
  status: 'completed' | 'in-progress' | 'pending' | 'recommended';
  statusLabel: string;
  isRecommended: boolean;
}

const PlanNodeItem = ({ node, index, status, statusLabel, isRecommended }: PlanNodeItemProps) => {
  // Determinar estilos según el estado
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          badge: "bg-green-100 text-green-800 hover:bg-green-200",
          container: "bg-green-50 border-green-100"
        };
      case 'in-progress':
        return {
          badge: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          container: "bg-blue-50 border-blue-100"
        };
      case 'recommended':
        return {
          badge: "bg-primary/20 text-primary hover:bg-primary/30",
          container: "bg-primary/5 border-primary/10 ring-1 ring-primary/20"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          container: "bg-gray-50 border-gray-100"
        };
    }
  };
  
  const styles = getStatusStyles();
  
  return (
    <div 
      className={`flex justify-between items-center p-3 rounded-lg hover:bg-opacity-90 transition-colors ${styles.container}`}
    >
      <div className="flex items-center">
        <div className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3">
          {index + 1}
        </div>
        <div>
          <p className="font-medium">{node.nodeName}</p>
          {node.nodeSkill && (
            <p className="text-xs text-gray-500">
              Habilidad: {getHabilidadDisplayName(node.nodeSkill as TPAESHabilidad)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {status === 'in-progress' && (
          <Progress value={50} className="w-16 h-2" />
        )}
        <Badge variant="outline" className={styles.badge}>
          {statusLabel}
        </Badge>
      </div>
    </div>
  );
};
