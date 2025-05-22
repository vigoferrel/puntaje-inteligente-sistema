
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { LearningPlanNode } from "@/types/learning-plan";
import { getSkillDisplayName } from "../skill-utils";

interface PlanNodeItemProps {
  node: LearningPlanNode;
  index: number;
  status: 'completed' | 'in-progress' | 'pending' | 'recommended';
  statusLabel: string;
  progressValue?: number;
  isRecommended: boolean;
}

export const PlanNodeItem = ({ 
  node, 
  index, 
  status, 
  statusLabel, 
  progressValue, 
  isRecommended 
}: PlanNodeItemProps) => {
  // Determine styles based on the status
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
  
  // Animation for individual item
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
              Habilidad: {getSkillDisplayName(node.nodeSkill)}
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
