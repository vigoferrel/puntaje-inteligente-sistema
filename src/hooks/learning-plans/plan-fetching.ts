import { useCallback } from "react";
import { LearningPlan } from "@/types/learning-plan";
import { fetchLearningPlans } from "./api-service";
import { toast } from "@/components/ui/use-toast";

interface PlanFetchingProps {
  plans: LearningPlan[];
  setPlans: (plans: LearningPlan[]) => void;
  setCurrentPlan: (plan: LearningPlan | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  setRetryCount: (callback: (prev: number) => number) => void;
}

export const usePlanFetching = ({
  plans,
  setPlans,
  setCurrentPlan,
  setError,
  setLoading,
  setRetryCount
}: PlanFetchingProps) => {
  /**
   * Fetches all learning plans for a user with improved error handling and retry logic
   */
  const fetchPlans = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const plansWithNodes = await fetchLearningPlans(userId);
      
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
  }, [plans, setPlans, setCurrentPlan, setError, setLoading]);

  /**
   * Retry fetching plans on error with exponential backoff
   */
  const retryFetchPlans = useCallback((userId: string) => {
    setRetryCount(prev => {
      const newCount = prev + 1;
      const delay = Math.min(2 ** newCount * 500, 5000); // Exponential backoff capped at 5 seconds
      
      console.log(`Reintentando carga de planes (intento ${newCount}) en ${delay}ms`);
      
      setTimeout(() => {
        fetchPlans(userId);
      }, delay);
      
      return newCount;
    });
  }, [fetchPlans, setRetryCount]);

  return { fetchPlans, retryFetchPlans };
};
