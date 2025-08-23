
import { useState, useEffect } from "react";
import { generateSimplePlan } from "@/services/learning/cached-plan-service";
import { useAuth } from "@/contexts/AuthContext";

export const useLearningPlans = () => {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlans = async () => {
      if (!profile?.id || plans.length > 0) return;
      
      setLoading(true);
      try {
        const plan = await generateSimplePlan(profile.id);
        if (plan) {
          setPlans([plan]);
          setCurrentPlan(plan);
        }
      } catch (err) {
        setError('Error al cargar planes');
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [profile?.id, plans.length]);

  return {
    plans,
    currentPlan,
    loading,
    error,
    fetchLearningPlans: () => {},
    retryFetchPlans: () => {},
    createLearningPlan: () => {},
    setCurrentPlan,
    getPlanById: () => null,
    getPlanProgress: () => null,
    updatePlanProgress: () => {},
    loadPlanProgress: () => {}
  };
};

export { type LearningPlan, type LearningPlanNode } from "@/types/learning-plan";
