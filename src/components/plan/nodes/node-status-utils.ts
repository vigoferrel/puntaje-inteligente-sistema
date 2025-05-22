
import { LearningPlanNode, PlanProgress } from "@/types/learning-plan";

// Function to determine the status of a node
export const getNodeStatus = (
  nodeId: string, 
  index: number,
  progress: PlanProgress | null,
  recommendedNodeId: string | null
): { 
  status: 'completed' | 'in-progress' | 'pending' | 'recommended',
  label: string,
  progress?: number
} => {
  if (!progress) return { status: 'pending', label: 'Pendiente' };
  
  // Assume nodes are completed in order
  if (index < progress.completedNodes) {
    return { status: 'completed', label: 'Completado', progress: 100 };
  }
  
  if (index < progress.completedNodes + progress.inProgressNodes) {
    // Use specific node progress if available, or 50% by default
    const nodeProgressValue = progress.nodeProgress?.[nodeId] || 50;
    return { 
      status: 'in-progress', 
      label: 'En progreso', 
      progress: nodeProgressValue 
    };
  }
  
  if (nodeId === recommendedNodeId) {
    return { status: 'recommended', label: 'Recomendado' };
  }
  
  return { status: 'pending', label: 'Pendiente' };
};
