
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLearningPlanContext } from '@/contexts/learning-plan';

export const useLearningPlan = () => {
  const { profile } = useAuth();
  const planContext = useLearningPlanContext();
  
  // Auto-load plans when user is available and context is initializing
  useEffect(() => {
    if (profile?.id && planContext.initializing) {
      console.log('Auto-loading plans for user:', profile.id);
      planContext.refreshPlans(profile.id);
    }
  }, [profile?.id, planContext.initializing, planContext.refreshPlans]);
  
  // Function to create a new plan
  const createNewPlan = async (title: string, description?: string) => {
    if (!profile?.id) {
      console.warn('Cannot create plan: no user profile available');
      return null;
    }
    
    const targetDate = new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString();
    return await planContext.createPlan(profile.id, title, description, targetDate);
  };
  
  // Function to update progress for the current plan
  const updateCurrentPlanProgress = async () => {
    if (!profile?.id || !planContext.currentPlan) {
      console.warn('Cannot update progress: missing user or plan');
      return;
    }
    await planContext.updatePlanProgress(profile.id, planContext.currentPlan.id);
  };
  
  // Manual refresh function
  const refreshPlans = () => {
    if (profile?.id) {
      console.log('Manual refresh of plans for user:', profile.id);
      planContext.refreshPlans(profile.id);
    } else {
      console.warn('Cannot refresh plans: no user profile available');
    }
  };
  
  return {
    plans: planContext.plans,
    currentPlan: planContext.currentPlan,
    loading: planContext.loading,
    error: planContext.error,
    initializing: planContext.initializing,
    progressLoading: planContext.progressLoading,
    getPlanProgress: planContext.getPlanProgress,
    refreshPlans,
    selectPlan: planContext.selectPlan,
    createPlan: createNewPlan,
    updateCurrentPlanProgress
  };
};
