
import { ReactNode } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";

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
