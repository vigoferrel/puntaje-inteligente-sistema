
import React from "react";
import { Badge } from "@/components/ui/badge";
import { LearningPlanNode } from "@/types/learning-plan";
import { TPAESHabilidad, getHabilidadDisplayName } from "@/types/system-types";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay módulos disponibles en este plan.</p>
      </div>
    );
  }
  
  // Función para determinar el estado de un nodo
  const getNodeStatus = (nodeId: string, index: number): { 
    status: 'completed' | 'in-progress' | 'pending' | 'recommended',
    label: string,
    progress?: number
  } => {
    if (!progress) return { status: 'pending', label: 'Pendiente' };
    
    // Asumimos que los nodos se completan en orden
    if (index < progress.completedNodes) {
      return { status: 'completed', label: 'Completado', progress: 100 };
    }
    
    if (index < progress.completedNodes + progress.inProgressNodes) {
      // Para nodos en progreso, calculamos un progreso aleatorio entre 20% y 80%
      // En un caso real, este valor vendría de la base de datos
      const randomProgress = Math.floor(Math.random() * 60) + 20;
      return { status: 'in-progress', label: 'En progreso', progress: randomProgress };
    }
    
    if (nodeId === recommendedNodeId) {
      return { status: 'recommended', label: 'Recomendado' };
    }
    
    return { status: 'pending', label: 'Pendiente' };
  };
  
  // Animación para la lista
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  return (
    <div className="space-y-3">
      <h3 className="font-medium">Módulos de estudio</h3>
      
      <motion.div 
        className="space-y-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {nodes.map((node, index) => {
          const nodeStatus = getNodeStatus(node.nodeId, index);
          
          return (
            <PlanNodeItem 
              key={node.id} 
              node={node} 
              index={index}
              status={nodeStatus.status}
              statusLabel={nodeStatus.label}
              progressValue={nodeStatus.progress}
              isRecommended={node.nodeId === recommendedNodeId}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

interface PlanNodeItemProps {
  node: LearningPlanNode;
  index: number;
  status: 'completed' | 'in-progress' | 'pending' | 'recommended';
  statusLabel: string;
  progressValue?: number;
  isRecommended: boolean;
}

const PlanNodeItem = ({ node, index, status, statusLabel, progressValue, isRecommended }: PlanNodeItemProps) => {
  // Determinar estilos según el estado
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          badge: "bg-green-100 text-green-800 hover:bg-green-200",
          container: "bg-green-50 border-green-100 hover:border-green-200"
        };
      case 'in-progress':
        return {
          badge: "bg-blue-100 text-blue-800 hover:bg-blue-200",
          container: "bg-blue-50 border-blue-100 hover:border-blue-200"
        };
      case 'recommended':
        return {
          badge: "bg-primary/20 text-primary hover:bg-primary/30",
          container: "bg-primary/5 border-primary/10 ring-1 ring-primary/20 hover:ring-primary/30"
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          container: "bg-background border-gray-100 hover:border-gray-200"
        };
    }
  };
  
  const styles = getStatusStyles();
  
  // Animación individual para cada elemento
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      variants={item}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.01 }}
      className={`flex justify-between items-center p-3 rounded-lg transition-all cursor-pointer border ${styles.container}`}
    >
      <div className="flex items-center">
        <div className="bg-primary/10 text-primary font-medium rounded-full h-6 w-6 flex items-center justify-center mr-3">
          {index + 1}
        </div>
        <div>
          <p className="font-medium">{node.nodeName || `Módulo ${index + 1}`}</p>
          {node.nodeSkill && (
            <p className="text-xs text-gray-500">
              Habilidad: {getHabilidadDisplayName(node.nodeSkill as TPAESHabilidad)}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {status === 'in-progress' && progressValue !== undefined && (
          <div className="w-20">
            <Progress value={progressValue} className="h-2" />
            <p className="text-xs text-right text-muted-foreground mt-1">{progressValue}%</p>
          </div>
        )}
        <Badge variant="outline" className={styles.badge}>
          {statusLabel}
        </Badge>
      </div>
    </motion.div>
  );
};
