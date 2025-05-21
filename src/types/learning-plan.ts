
export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetDate?: string;
  createdAt: string;
  nodes: LearningPlanNode[];
}

export interface LearningPlanNode {
  id: string;
  planId: string;
  nodeId: string;
  position: number;
  nodeName?: string; // For display purposes
  nodeSkill?: string; // For display purposes
}

export interface PlanProgress {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  overallProgress: number;
}
