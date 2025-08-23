
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { unifiedStorageSystem } from "@/core/storage/UnifiedStorageSystem";

const CACHE_KEYS = {
  PLANS: 'learning_plans_unified',
  CURRENT_PLAN: 'current_plan_unified',
  PLAN_PROGRESS: 'plan_progress_unified',
  CACHE_TIMESTAMP: 'cache_timestamp_unified'
};

const CACHE_EXPIRY_TIME = 1800000; // 30 minutos

/**
 * Loads learning plans data from UnifiedStorageSystem cache
 */
export const loadFromCache = (): {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  planProgress: Record<string, PlanProgress>;
} | null => {
  try {
    // Check if the cache is still valid
    const timestamp = unifiedStorageSystem.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
    if (!timestamp || Date.now() - Number(timestamp) > CACHE_EXPIRY_TIME) {
      return null;
    }
    
    // Load plans
    const cachedPlans = unifiedStorageSystem.getItem(CACHE_KEYS.PLANS);
    const cachedCurrentPlan = unifiedStorageSystem.getItem(CACHE_KEYS.CURRENT_PLAN);
    const cachedProgress = unifiedStorageSystem.getItem(CACHE_KEYS.PLAN_PROGRESS);
    
    if (!cachedPlans) {
      return null;
    }
    
    return {
      plans: cachedPlans,
      currentPlan: cachedCurrentPlan,
      planProgress: cachedProgress || {},
    };
  } catch (error) {
    console.warn('Error loading data from unified cache:', error);
    return null;
  }
};

/**
 * Updates the cache using UnifiedStorageSystem
 */
export const updateCache = (
  plans: LearningPlan[], 
  currentPlan: LearningPlan | null, 
  planProgress: Record<string, PlanProgress>
): void => {
  if (plans.length === 0) return;

  try {
    unifiedStorageSystem.setItem(CACHE_KEYS.PLANS, plans, { silentErrors: true });
    unifiedStorageSystem.setItem(CACHE_KEYS.PLAN_PROGRESS, planProgress, { silentErrors: true });
    unifiedStorageSystem.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now(), { silentErrors: true });
    
    if (currentPlan) {
      unifiedStorageSystem.setItem(CACHE_KEYS.CURRENT_PLAN, currentPlan, { silentErrors: true });
    }
  } catch (error) {
    console.warn('Error updating unified cache:', error);
  }
};

/**
 * Clears all cache data using UnifiedStorageSystem
 */
export const clearCache = (): void => {
  Object.values(CACHE_KEYS).forEach(key => {
    unifiedStorageSystem.removeItem(key);
  });
};
