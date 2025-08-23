/* eslint-disable react-refresh/only-export-components */

import { LearningPlanNode, PlanProgress } from "../../../types/learning-plan";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../../types/core';

// (...args: unknown[]) => unknown to determine the status of a node
export const getNodeStatus = (
  nodeId: string, 
  index: number,
  progress: PlanProgress | null,
  recommendedNodeId: string | null
): { 
  status: 'not_started' | 'in_progress' | 'completed',
  label: string,
  progress: number
} => {
  if (!progress) return { status: 'not_started', label: 'Pendiente', progress: 0 };
  
  // Assume nodes are completed in order
  if (index < progress.completedNodes) {
    return { status: 'completed', label: 'Completado', progress: 100 };
  }
  
  if (index < progress.completedNodes + progress.inProgressNodes) {
    // Use specific node progress if available, or 50% by default
    const nodeProgressValue = progress.nodeProgress?.[nodeId] || 50;
    return { 
      status: 'in_progress', 
      label: 'En progreso', 
      progress: nodeProgressValue 
    };
  }
  
  if (nodeId === recommendedNodeId) {
    return { status: 'not_started', label: 'Recomendado', progress: 0 };
  }
  
  return { status: 'not_started', label: 'Pendiente', progress: 0 };
};



