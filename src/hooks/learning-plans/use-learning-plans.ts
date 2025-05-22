import { useState, useEffect, useCallback } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import {
  fetchLearningPlans as fetchPlans,
  createLearningPlan as createPlan,
  updatePlanProgress as updatePlan
} from "./api-service";
import { loadFromCache, updateCache, clearCache as clearCacheUtil } from "./cache-utils";

/**
 * Hook for managing learning plans with caching support
 */
export const useLearningPlans = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [planProgress, setPlanProgress] = useState<Record<string, PlanProgress>>({});
  
  // Load data from cache on initialization
  useEffect(() => {
    const cachedData = loadFromCache();
    if (cachedData) {
      setPlans(cachedData.plans);
      setCurrentPlan(cachedData.currentPlan);
      setPlanProgress(cachedData.planProgress);
    }
  }, []);
  
  // Update cache when data changes
  useEffect(() => {
    if (plans.length > 0) {
      updateCache(plans, currentPlan, planProgress);
    }
  }, [plans, currentPlan, planProgress]);
  
  // Clear cache
  const clearCache = useCallback(() => {
    clearCacheUtil();
  }, []);

  /**
   * Fetches all learning plans for a user with improved error handling and retry logic
   */
  const fetchLearningPlans = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const plansWithNodes = await fetchPlans(userId);
      
      if (plansWithNodes.length > 0) {
        setPlans(plansWithNodes);
        
        // Set current plan to the most recently created one
        const mostRecent = plansWithNodes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        setCurrentPlan(mostRecent);
      } else {
        // If no plans after ensuring, there's a problem
        console.warn("No se encontraron planes después de ensureUserHasLearningPlan");
        
        // If we have cached data, keep it to show something to the user
        if (plans.length === 0) {
          clearCacheUtil(); // Only clear cache if there are really no plans
        }
      }
      
      return plansWithNodes;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      setError("No se pudieron cargar los planes de aprendizaje. Por favor, intente de nuevo.");
      
      // Don't show toast if we already have data in cache
      if (plans.length === 0) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los planes de aprendizaje",
          variant: "destructive"
        });
      }
      
      // If there's an error but we have cached data, keep it
      return plans;
    } finally {
      setLoading(false);
    }
  }, [plans]);

  /**
   * Retry fetching plans on error with exponential backoff
   */
  const retryFetchPlans = useCallback((userId: string) => {
    setRetryCount(prev => {
      const newCount = prev + 1;
      const delay = Math.min(2 ** newCount * 500, 5000); // Exponential backoff capped at 5 seconds
      
      console.log(`Reintentando carga de planes (intento ${newCount}) en ${delay}ms`);
      
      setTimeout(() => {
        fetchLearningPlans(userId);
      }, delay);
      
      return newCount;
    });
  }, [fetchLearningPlans]);

  /**
   * Creates a new learning plan for a user
   */
  const createLearningPlan = async (
    userId: string,
    title: string,
    description?: string,
    targetDate?: string,
    skillPriorities?: Record<TPAESHabilidad, number>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newPlan = await createPlan(userId, title, description, targetDate, skillPriorities);
      
      if (newPlan) {
        // Update state
        setPlans(prev => [...prev, newPlan]);
        setCurrentPlan(newPlan);
        // Clear progress for this plan
        setPlanProgress(prev => ({
          ...prev,
          [newPlan.id]: {
            totalNodes: newPlan.nodes.length,
            completedNodes: 0,
            inProgressNodes: 0,
            overallProgress: 0,
            nodeProgress: {}
          }
        }));
        return newPlan;
      } else {
        throw new Error("No se pudo crear el plan de aprendizaje");
      }
    } catch (error) {
      console.error('Error creating learning plan:', error);
      setError("No se pudo crear el plan de aprendizaje. Por favor, intente de nuevo.");
      toast({
        title: "Error",
        description: "No se pudo crear el plan de aprendizaje",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates progress for a learning plan with improved caching
   */
  const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
    try {
      const progress = await updatePlan(userId, planId, planProgress);
      if (progress) {
        // Update state with new progress
        setPlanProgress(prev => ({
          ...prev,
          [planId]: progress
        }));
      }
      return progress;
    } catch (error) {
      console.error('Error in updatePlanProgress:', error);
      return false;
    }
  };

  /**
   * Loads progress for a specific plan
   */
  const loadPlanProgress = useCallback(async (userId: string, planId: string): Promise<PlanProgress | false> => {
    if (!userId || !planId) return false;
    
    try {
      // Check if we already have progress in cache
      const cachedProgress = getPlanProgress(planId);
      if (cachedProgress) {
        console.log('Usando progreso en caché mientras se actualiza');
      }
      
      return await updatePlanProgress(userId, planId);
    } catch (error) {
      console.error("Error loading plan progress:", error);
      return false;
    }
  }, []);

  /**
   * Gets a plan by ID
   */
  const getPlanById = (planId: string): LearningPlan | undefined => {
    return plans.find(plan => plan.id === planId);
  };
  
  /**
   * Gets progress for a plan
   */
  const getPlanProgress = (planId: string): PlanProgress | null => {
    return planProgress[planId] || null;
  };

  return {
    plans,
    loading,
    error,
    currentPlan,
    retryCount,
    fetchLearningPlans,
    retryFetchPlans,
    createLearningPlan,
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
