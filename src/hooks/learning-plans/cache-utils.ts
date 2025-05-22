
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { CACHE_KEYS, CACHE_EXPIRY_TIME } from "./types";

/**
 * Loads learning plans data from cache if available and not expired
 */
export const loadFromCache = (): {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  planProgress: Record<string, PlanProgress>;
} | null => {
  try {
    // Check if the cache is still valid
    const timestamp = sessionStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
    if (!timestamp || Date.now() - Number(timestamp) > CACHE_EXPIRY_TIME) {
      return null;
    }
    
    // Load plans
    const cachedPlans = sessionStorage.getItem(CACHE_KEYS.PLANS);
    const cachedCurrentPlan = sessionStorage.getItem(CACHE_KEYS.CURRENT_PLAN);
    const cachedProgress = sessionStorage.getItem(CACHE_KEYS.PLAN_PROGRESS);
    
    if (!cachedPlans) {
      return null;
    }
    
    return {
      plans: JSON.parse(cachedPlans) as LearningPlan[],
      currentPlan: cachedCurrentPlan ? JSON.parse(cachedCurrentPlan) : null,
      planProgress: cachedProgress ? JSON.parse(cachedProgress) : {},
    };
  } catch (error) {
    console.error('Error loading data from cache:', error);
    return null;
  }
};

/**
 * Updates the cache with current plans data
 */
export const updateCache = (
  plans: LearningPlan[], 
  currentPlan: LearningPlan | null, 
  planProgress: Record<string, PlanProgress>
): void => {
  try {
    if (plans.length > 0) {
      sessionStorage.setItem(CACHE_KEYS.PLANS, JSON.stringify(plans));
      
      if (currentPlan) {
        sessionStorage.setItem(CACHE_KEYS.CURRENT_PLAN, JSON.stringify(currentPlan));
      }
      
      sessionStorage.setItem(CACHE_KEYS.PLAN_PROGRESS, JSON.stringify(planProgress));
      sessionStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
    }
  } catch (error) {
    console.error('Error updating cache:', error);
  }
};

/**
 * Clears all cache data
 */
export const clearCache = (): void => {
  Object.values(CACHE_KEYS).forEach(key => sessionStorage.removeItem(key));
};
