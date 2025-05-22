
import { useState, useEffect, useCallback } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { 
  fetchLearningPlans as fetchPlans,
  createLearningPlan as createPlan,
  updatePlanProgress as updateProgress
} from "@/services/plan-service";
import { ensureUserHasLearningPlan } from "@/services/learning/plan-generator-service";
import { toast } from "@/components/ui/use-toast";

export { type LearningPlan, type LearningPlanNode } from "@/types/learning-plan";

export const useLearningPlans = () => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  /**
   * Fetches all learning plans for a user with improved error handling and retry logic
   */
  const fetchLearningPlans = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Asegurarse de que el usuario tenga al menos un plan
      await ensureUserHasLearningPlan(userId);
      
      // Obtener todos los planes
      const plansWithNodes = await fetchPlans(userId);
      
      if (plansWithNodes.length > 0) {
        setPlans(plansWithNodes);
        
        // Set current plan to the most recently created one
        const mostRecent = plansWithNodes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        setCurrentPlan(mostRecent);
      } else {
        // Si no hay planes después de asegurar, hay un problema
        console.warn("No se encontraron planes después de ensureUserHasLearningPlan");
      }
      
      return plansWithNodes;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      setError("No se pudieron cargar los planes de aprendizaje. Por favor, intente de nuevo.");
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de aprendizaje",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Retry fetching plans on error
   */
  const retryFetchPlans = useCallback((userId: string) => {
    setRetryCount(prev => prev + 1);
    return fetchLearningPlans(userId);
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
   * Updates progress for a learning plan with improved error handling
   */
  const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
    try {
      const progress = await updateProgress(userId, planId);
      if (!progress) {
        throw new Error("No se pudo actualizar el progreso del plan");
      }
      return progress;
    } catch (error) {
      console.error('Error updating plan progress:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del plan",
        variant: "destructive"
      });
      return false;
    }
  };

  /**
   * Gets a plan by ID
   */
  const getPlanById = (planId: string): LearningPlan | undefined => {
    return plans.find(plan => plan.id === planId);
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
    setCurrentPlan,
    getPlanById
  };
};
