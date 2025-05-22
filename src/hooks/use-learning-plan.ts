
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningPlanContext } from '@/contexts/LearningPlanContext';

export const useLearningPlan = () => {
  const { profile } = useAuth();
  const planContext = useLearningPlanContext();
  
  // Load plans when the user profile is available
  useEffect(() => {
    if (profile?.id && planContext.initializing) {
      planContext.refreshPlans(profile.id);
    }
  }, [profile?.id, planContext.initializing]);
  
  // Function to create a new plan
  const createNewPlan = async (title: string, description?: string) => {
    if (!profile?.id) return null;
    
    const targetDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString();
    return await planContext.createPlan(profile.id, title, description, targetDate);
  };
  
  // Function to update progress for the current plan
  const updateCurrentPlanProgress = async () => {
    if (!profile?.id || !planContext.currentPlan) return;
    await planContext.updatePlanProgress(profile.id, planContext.currentPlan.id);
  };
  
  return {
    plans: planContext.plans,
    currentPlan: planContext.currentPlan,
    loading: planContext.loading,
    error: planContext.error,
    initializing: planContext.initializing,
    progressLoading: planContext.progressLoading,
    getPlanProgress: planContext.getPlanProgress,
    refreshPlans: () => profile?.id && planContext.refreshPlans(profile.id),
    selectPlan: planContext.selectPlan,
    createPlan: createNewPlan,
    updateCurrentPlanProgress
  };
};
