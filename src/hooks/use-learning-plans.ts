
import { useState, useEffect } from "react";
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
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  
  /**
   * Fetches all learning plans for a user
   */
  const fetchLearningPlans = async (userId: string) => {
    try {
      setLoading(true);
      
      // Asegurarse de que el usuario tenga al menos un plan
      await ensureUserHasLearningPlan(userId);
      
      // Obtener todos los planes
      const plansWithNodes = await fetchPlans(userId);
      
      setPlans(plansWithNodes);
      
      // Set current plan to the most recently created one
      if (plansWithNodes.length > 0) {
        const mostRecent = plansWithNodes.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        setCurrentPlan(mostRecent);
      }
      
      return plansWithNodes;
    } catch (error) {
      console.error('Error fetching learning plans:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los planes de aprendizaje",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

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
      const newPlan = await createPlan(userId, title, description, targetDate, skillPriorities);
      
      if (newPlan) {
        // Update state
        setPlans(prev => [...prev, newPlan]);
        setCurrentPlan(newPlan);
      }
      
      return newPlan;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates progress for a learning plan
   */
  const updatePlanProgress = async (userId: string, planId: string): Promise<PlanProgress | false> => {
    return await updateProgress(userId, planId);
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
    currentPlan,
    fetchLearningPlans,
    createLearningPlan,
    updatePlanProgress,
    setCurrentPlan,
    getPlanById
  };
};
