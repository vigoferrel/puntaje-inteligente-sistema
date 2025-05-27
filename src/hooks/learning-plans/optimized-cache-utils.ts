
import { storageManager } from '@/core/storage/StorageManager';
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TypeSafeBatchItem } from '@/core/storage/types';

// Constantes optimizadas - sin 'as const' problemático
const CACHE_KEYS = {
  PLANS: 'learning_plans_v2' as const,
  CURRENT_PLAN: 'current_plan_v2' as const,
  PLAN_PROGRESS: 'plan_progress_v2' as const,
  CACHE_TIMESTAMP: 'cache_timestamp_v2' as const
};

const CACHE_EXPIRY_TIME = 1800000; // 30 minutos

/**
 * Sistema de cache optimizado que usa el StorageManager inteligente con tipos seguros
 */
export const optimizedCacheUtils = {
  loadFromCache(): {
    plans: LearningPlan[];
    currentPlan: LearningPlan | null;
    planProgress: Record<string, PlanProgress>;
  } | null {
    try {
      // Verificar timestamp
      const timestamp = storageManager.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
      if (!timestamp || Date.now() - Number(timestamp) > CACHE_EXPIRY_TIME) {
        return null;
      }
      
      // Cargar datos en batch (más eficiente)
      const cachedPlans = storageManager.getItem(CACHE_KEYS.PLANS);
      const cachedCurrentPlan = storageManager.getItem(CACHE_KEYS.CURRENT_PLAN);
      const cachedProgress = storageManager.getItem(CACHE_KEYS.PLAN_PROGRESS);
      
      if (!cachedPlans) {
        return null;
      }
      
      return {
        plans: cachedPlans,
        currentPlan: cachedCurrentPlan,
        planProgress: cachedProgress || {},
      };
    } catch (error) {
      return null;
    }
  },

  updateCache(
    plans: LearningPlan[], 
    currentPlan: LearningPlan | null, 
    planProgress: Record<string, PlanProgress>
  ): void {
    if (plans.length === 0) return;

    // Usar operación batch type-safe
    const batchItems: TypeSafeBatchItem[] = [
      { key: CACHE_KEYS.PLANS, value: plans },
      { key: CACHE_KEYS.PLAN_PROGRESS, value: planProgress },
      { key: CACHE_KEYS.CACHE_TIMESTAMP, value: Date.now() }
    ];

    if (currentPlan) {
      batchItems.push({ key: CACHE_KEYS.CURRENT_PLAN, value: currentPlan });
    }

    storageManager.batchSet(batchItems);
  },

  clearCache(): void {
    Object.values(CACHE_KEYS).forEach(key => {
      storageManager.removeItem(key);
    });
  },

  isValid(): boolean {
    const timestamp = storageManager.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
    return timestamp && (Date.now() - Number(timestamp)) < CACHE_EXPIRY_TIME;
  }
};

