/* eslint-disable react-refresh/only-export-components */

import { LearningPlanNode, PlanProgress } from "../../types/learning-plan";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { PlanNodesListContainer } from "./nodes/PlanNodesListContainer";

interface PlanNodesListProps {
  nodes: LearningPlanNode[];
  recommendedNodeId: string | null;
  progress: PlanProgress | null;
}

export const PlanNodesList = ({ 
  nodes, 
  recommendedNodeId, 
  progress 
}: PlanNodesListProps) => {
  return (
    <PlanNodesListContainer 
      nodes={nodes}
      recommendedNodeId={recommendedNodeId}
      progress={progress}
    />
  );
};

