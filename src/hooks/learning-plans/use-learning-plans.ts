
import { useState, useEffect, useCallback, useRef } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { usePlanFetching } from "./plan-fetching";
import { usePlanCreation } from "./plan-creation";
import { usePlanProgress } from "./plan-progress";
import { usePlanCache } from "./plan-cache";

export const useLearningPlans = () => {
  const { hasInitialized } = useUnifiedApp();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const hasLoadedRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  const { loadFromCache, updateCache } = usePlanCache();
  const { fetchPlans: originalFetchPlans, retryFetchPlans: originalRetryFetchPlans } = usePlanFetching({
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

  // Guard más eficiente
  const shouldFetchPlans = useCallback((userId: string) => {
    if (!userId || !hasInitialized) return false;
    if (hasLoadedRef.current && lastUserIdRef.current === userId) return false;
    return true;
  }, [hasInitialized]);

  const fetchPlans = useCallback(async (userId: string) => {
    if (!shouldFetchPlans(userId)) {
      console.log('🛑 Learning plans fetch blocked by guard');
      return;
    }

    console.log('🔄 Fetching learning plans...');
    setLoading(true);
    setError(null);

    try {
      // Intentar cache primero
      const cachedData = loadFromCache();
      if (cachedData && lastUserIdRef.current === userId) {
        console.log('📦 Using cached learning plans');
        setPlans(cachedData.plans);
        setCurrentPlan(cachedData.currentPlan);
        setPlanProgress(cachedData.planProgress);
        hasLoadedRef.current = true;
        return cachedData.plans;
      }

      // Fetch fresco
      const fetchedPlans = await originalFetchPlans(userId);
      
      hasLoadedRef.current = true;
      lastUserIdRef.current = userId;
      
      console.log('✅ Learning plans loaded successfully');
      return fetchedPlans;
      
    } catch (err) {
      console.error('❌ Error fetching learning plans:', err);
      setError('Error al cargar los planes de estudio');
      hasLoadedRef.current = false;
      return [];
    } finally {
      setLoading(false);
    }
  }, [shouldFetchPlans, loadFromCache, originalFetchPlans, setPlanProgress]);

  // Función de retry que acepta userId - CORREGIDO: llamar con los 3 argumentos requeridos
  const retryFetchPlans = useCallback((userId: string) => {
    if (!userId) {
      console.warn('Cannot retry fetch: no userId provided');
      return;
    }
    
    console.log('🔄 Retrying fetch plans for user:', userId);
    hasLoadedRef.current = false;
    // Llamar con todos los argumentos requeridos: userId, setError, setLoading
    originalRetryFetchPlans(userId, setError, setLoading);
  }, [originalRetryFetchPlans]);

  const createPlan = useCallback(async (
    userId: string, 
    title: string, 
    description?: string, 
    targetDate?: string,
    skillPriorities?: Record<string, number>
  ): Promise<LearningPlan | null> => {
    setLoading(true);
    setError(null);

    try {
      // Pasar todos los argumentos requeridos a originalCreatePlan
      const newPlan = await originalCreatePlan(
        userId, 
        title, 
        description || '', 
        targetDate, 
        skillPriorities
      );
      
      // Actualizar cache
      if (newPlan) {
        const updatedPlans = [...plans, newPlan];
        updateCache({
          plans: updatedPlans,
          currentPlan: newPlan,
          planProgress
        });
      }
      
      return newPlan;
    } catch (err) {
      console.error('❌ Error creating learning plan:', err);
      setError('Error al crear el plan de estudio');
      return null;
    } finally {
      setLoading(false);
    }
  }, [originalCreatePlan, plans, planProgress, updateCache]);

  const getPlanById = useCallback((planId: string): LearningPlan | undefined => {
    return plans.find(plan => plan.id === planId);
  }, [plans]);

  // Reset cuando cambia el usuario
  useEffect(() => {
    return () => {
      if (lastUserIdRef.current !== null) {
        hasLoadedRef.current = false;
      }
    };
  }, []);

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
    getPlanProgress
  };
};

export { type LearningPlan, type LearningPlanNode } from "@/types/learning-plan";
