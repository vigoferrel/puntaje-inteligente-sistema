
export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string | null;
  createdAt: string;
  updatedAt?: string;
  nodes: LearningPlanNode[];
}

export interface LearningPlanNode {
  id: string;
  nodeId: string;
  position: number;
  nodeName?: string;
  nodeDescription?: string;
  nodeDifficulty?: string;
  nodeSkill?: string;
  planId?: string;
}

export interface PlanProgress {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  overallProgress: number;
  nodeProgress: Record<string, number>; // Map of nodeId -> progress value (0-100)
}
