
import { useState, useCallback } from "react";
import { PlanProgress } from "@/types/learning-plan";
import { updatePlanProgress as updatePlan } from "./api-service";

export const usePlanProgress = () => {
  const [planProgress, setPlanProgress] = useState<Record<string, PlanProgress>>({});
  const [progressLoading, setProgressLoading] = useState(false);

  /**
   * Updates progress for a learning plan with improved caching
   */
  const updatePlanProgress = useCallback(async (userId: string, planId: string): Promise<PlanProgress | false> => {
    try {
      setProgressLoading(true);
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
    } finally {
      setProgressLoading(false);
    }
  }, [planProgress]);

  /**
   * Loads progress for a specific plan
   */
  const loadPlanProgress = useCallback(async (userId: string, planId: string): Promise<PlanProgress | false> => {
    if (!userId || !planId) return false;
    
    try {
      setProgressLoading(true);
      // Check if we already have progress in cache
      const cachedProgress = getPlanProgress(planId);
      if (cachedProgress) {
        console.log('Usando progreso en caché mientras se actualiza');
      }
      
      return await updatePlanProgress(userId, planId);
    } catch (error) {
      console.error("Error loading plan progress:", error);
      return false;
    } finally {
      setProgressLoading(false);
    }
  }, [updatePlanProgress]);

  /**
   * Gets progress for a plan
   */
  const getPlanProgress = useCallback((planId: string): PlanProgress | null => {
    return planProgress[planId] || null;
  }, [planProgress]);

  return { 
    planProgress, 
    setPlanProgress, 
    progressLoading, 
    updatePlanProgress, 
    loadPlanProgress, 
    getPlanProgress 
  };
};
