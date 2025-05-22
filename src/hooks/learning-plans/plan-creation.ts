
import { useCallback } from "react";
import { LearningPlan } from "@/types/learning-plan"; 
import { TPAESHabilidad } from "@/types/system-types";
import { createLearningPlan } from "./api-service";
import { toast } from "@/components/ui/use-toast";

interface PlanCreationProps {
  setPlans: (callback: (prev: LearningPlan[]) => LearningPlan[]) => void;
  setCurrentPlan: (plan: LearningPlan | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const usePlanCreation = ({
  setPlans,
  setCurrentPlan,
  setError,
  setLoading
}: PlanCreationProps) => {
  /**
   * Creates a new learning plan for a user
   */
  const createPlan = useCallback(async (
    userId: string,
    title: string,
    description?: string,
    targetDate?: string,
    skillPriorities?: Record<TPAESHabilidad, number>
  ) => {
    try {
      setLoading(true);
      setError(null);
      const newPlan = await createLearningPlan(userId, title, description, targetDate, skillPriorities);
      
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
  }, [setPlans, setCurrentPlan, setError, setLoading]);

  return { createPlan };
};
