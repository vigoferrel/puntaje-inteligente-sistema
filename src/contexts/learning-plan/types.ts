
import { ReactNode } from "react";
import { TPAESHabilidad } from "@/types/system-types";

// Export LearningPlan interface
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
  nodeProgress?: Record<string, number>;
}

// Define the context state type
export interface LearningPlanContextType {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  progressData: Record<string, PlanProgress>;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  refreshPlans: (userId: string) => Promise<void>;
  selectPlan: (plan: LearningPlan) => void;
  createPlan: (userId: string, title: string, description?: string, targetDate?: string, skillPriorities?: Record<TPAESHabilidad, number>) => Promise<LearningPlan | null>;
  updatePlanProgress: (userId: string, planId: string) => Promise<void>;
  getPlanProgress: (planId: string) => PlanProgress | null;
}
