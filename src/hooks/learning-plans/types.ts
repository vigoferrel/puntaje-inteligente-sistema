
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";

export interface LearningPlansState {
  plans: LearningPlan[];
  loading: boolean;
  error: string | null;
  currentPlan: LearningPlan | null;
  retryCount: number;
  planProgress: Record<string, PlanProgress>;
}

export interface LearningPlansActions {
  fetchLearningPlans: (userId: string) => Promise<LearningPlan[]>;
  retryFetchPlans: (userId: string) => void;
  createLearningPlan: (
    userId: string,
    title: string,
    description?: string,
    targetDate?: string,
    skillPriorities?: Record<TPAESHabilidad, number>
  ) => Promise<LearningPlan | null>;
  updatePlanProgress: (userId: string, planId: string) => Promise<PlanProgress | false>;
  loadPlanProgress: (userId: string, planId: string) => Promise<PlanProgress | false>;
  setCurrentPlan: (plan: LearningPlan) => void;
  getPlanById: (planId: string) => LearningPlan | undefined;
  getPlanProgress: (planId: string) => PlanProgress | null;
  clearCache: () => void;
}

// Cache keys for sessionStorage
export const CACHE_KEYS = {
  PLANS: 'cached_learning_plans',
  CURRENT_PLAN: 'cached_current_plan',
  PLAN_PROGRESS: 'cached_plan_progress',
  CACHE_TIMESTAMP: 'cached_plans_timestamp',
};

// Time in milliseconds for cache expiry (5 minutes)
export const CACHE_EXPIRY_TIME = 5 * 60 * 1000;
