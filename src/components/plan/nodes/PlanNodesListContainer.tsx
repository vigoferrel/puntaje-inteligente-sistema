
import React from "react";
import { motion } from "framer-motion";
import { LearningPlanNode, PlanProgress } from "@/types/learning-plan";
import { PlanNodeItem } from "./PlanNodeItem";
import { getNodeStatus } from "./node-status-utils";

interface PlanNodesListContainerProps {
  nodes: LearningPlanNode[];
  recommendedNodeId: string | null;
  progress: PlanProgress | null;
}

export const PlanNodesListContainer = ({ 
  nodes, 
  recommendedNodeId, 
  progress 
}: PlanNodesListContainerProps) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No hay módulos disponibles en este plan.</p>
      </div>
    );
  }
  
  // Animation for the list
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
          const nodeStatus = getNodeStatus(node.nodeId, index, progress, recommendedNodeId);
          
          return (
            <PlanNodeItem 
              key={node.id || index} 
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
