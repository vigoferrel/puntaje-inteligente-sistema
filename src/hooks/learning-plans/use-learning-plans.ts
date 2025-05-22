
import { useState, useEffect, useCallback } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { usePlanFetching } from "./plan-fetching";
import { usePlanCreation } from "./plan-creation";
import { usePlanProgress } from "./plan-progress";
import { usePlanCache } from "./plan-cache";

/**
 * Hook for managing learning plans with caching support
 */
export const useLearningPlans = () => {
  // State management
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Import sub-hooks
  const { loadFromCache, updateCache, clearCache } = usePlanCache();
  const { fetchPlans, retryFetchPlans } = usePlanFetching({
    plans,
    setPlans,
    setCurrentPlan,
    setError,
    setLoading,
    setRetryCount
  });
  
  const { createPlan } = usePlanCreation({
    setPlans,
    setCurrentPlan,
    setError,
    setLoading
  });
  
  const { 
    planProgress, 
    setPlanProgress, 
    updatePlanProgress, 
    loadPlanProgress, 
    getPlanProgress 
  } = usePlanProgress();

  // Load data from cache on initialization
  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setPlans(cachedData.plans);
      setCurrentPlan(cachedData.currentPlan);
      setPlanProgress(cachedData.planProgress);
    }
  }, [loadFromCache]);

  // Update cache when data changes
  useEffect(() => {
    if (plans.length > 0) {
      updateCache(plans, currentPlan, planProgress);
    }
  }, [plans, currentPlan, planProgress, updateCache]);

  /**
   * Gets a plan by ID
   */
  const getPlanById = useCallback((planId: string): LearningPlan | undefined => {
    return plans.find(plan => plan.id === planId);
  }, [plans]);

  return {
    plans,
    loading,
    error,
    currentPlan,
    retryCount,
    fetchLearningPlans: fetchPlans,
    retryFetchPlans,
    createLearningPlan: createPlan,
    updatePlanProgress,
    loadPlanProgress,
    setCurrentPlan,
    getPlanById,
    getPlanProgress,
    clearCache
  };
};

// Re-export types from learning-plan.ts for backward compatibility
export { type LearningPlan, type LearningPlanNode } from "@/types/learning-plan";
