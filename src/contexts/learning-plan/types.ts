
import { ReactNode } from "react";
import { TPAESHabilidad } from "@/types/system-types";

// Interfaz principal que debe coincidir con la del sistema
export interface LearningPlan {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
  // Propiedades opcionales para flexibilidad
  userId?: string;
  updatedAt?: string;
  targetDate?: string | null;
  nodes?: LearningPlanNode[];
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
  isCompleted?: boolean;
  progress?: number;
}

export interface PlanProgress {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  overallProgress: number;
  nodeProgress: Record<string, number>;
}

// Define the context state type
export interface LearningPlanContextType {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  progressData: Record<string, any>;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  refreshPlans: (userId: string) => Promise<void>;
  selectPlan: (plan: LearningPlan) => void;
  createPlan: (userId: string, title: string, description?: string, targetDate?: string, skillPriorities?: Record<TPAESHabilidad, number>) => Promise<LearningPlan | null>;
  updatePlanProgress: (userId: string, planId: string) => Promise<void>;
  getPlanProgress: (planId: string) => PlanProgress;
}
