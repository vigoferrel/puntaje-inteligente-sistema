import { useState, useEffect, useCallback, useRef } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { usePlanFetching } from "./plan-fetching";
import { usePlanCreation } from "./plan-creation";
import { usePlanProgress } from "./plan-progress";
import { usePlanCache } from "./plan-cache";

export const useLearningPlans = () => {
  const { setInitializationFlag, hasInitialized } = useUnifiedApp();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const { loadFromCache, updateCache, clearCache } = usePlanCache();
  const { fetchPlans: originalFetchPlans, retryFetchPlans } = usePlanFetching({
    plans,
    setPlans,
    setCurrentPlan,
    setError,
    setLoading,
    setRetryCount
  });
  
  const { createPlan: originalCreatePlan } = usePlanCreation({
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

  const shouldFetchPlans = useCallback((userId: string) => {
    if (!userId) return false;
    if (isLoadingRef.current) return false;
    if (hasLoadedRef.current && lastUserIdRef.current === userId) return false;
    if (!hasInitialized) return false;
    return true;
  }, [hasInitialized]);

  const fetchPlans = useCallback(async (userId: string) => {
    if (!shouldFetchPlans(userId)) {
      console.log('🛑 Learning plans fetch blocked by guard');
      return;
    }

    console.log('🔄 Fetching learning plans...');
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const cachedData = loadFromCache();
      if (cachedData && lastUserIdRef.current === userId) {
        console.log('📦 Using cached learning plans');
        setPlans(cachedData.plans);
        setCurrentPlan(cachedData.currentPlan);
        setPlanProgress(cachedData.planProgress);
        setInitializationFlag('learningPlans', true);
        hasLoadedRef.current = true;
        return;
      }

      const fetchedPlans = await originalFetchPlans(userId);
      
      hasLoadedRef.current = true;
      lastUserIdRef.current = userId;
      setInitializationFlag('learningPlans', true);
      
      console.log('✅ Learning plans loaded successfully');
    } catch (err) {
      console.error('❌ Error fetching learning plans:', err);
      setError('Error al cargar los planes de estudio');
      hasLoadedRef.current = false;
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [shouldFetchPlans, setInitializationFlag, loadFromCache, originalFetchPlans]);

  const createPlan = useCallback(async (
    userId: string, 
    title: string, 
    description?: string, 
    targetDate?: string,
    skillPriorities?: Record<any, number>
  ): Promise<LearningPlan | null> => {
    isLoadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const newPlan = await originalCreatePlan(userId, title, description, targetDate, skillPriorities);
      return newPlan;
    } catch (err) {
      console.error('❌ Error creating learning plan:', err);
      setError('Error al crear el plan de estudio');
      return null;
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [originalCreatePlan]);

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

export { type LearningPlan, type LearningPlanNode } from "@/types/learning-plan";
