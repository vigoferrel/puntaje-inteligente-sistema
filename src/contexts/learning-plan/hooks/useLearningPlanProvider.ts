
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPlan, PlanProgress, LearningPlanContextType } from '../types';
import { createLearningPlan, fetchLearningPlans, updateLearningPlan, deleteLearningPlan } from '../services';

export const useLearningPlanProvider = (): LearningPlanContextType => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<Record<string, PlanProgress>>({});
  const [progressLoading, setProgressLoading] = useState(false);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);

  // Fetch plans for current user
  const refreshPlans = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedPlans = await fetchLearningPlans(userId);
      setPlans(fetchedPlans);
      
      // Set current plan to the first one if available
      if (fetchedPlans.length > 0 && !currentPlan) {
        setCurrentPlan(fetchedPlans[0]);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Error al cargar los planes de estudio');
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  }, [currentPlan]);

  // Select a plan
  const selectPlan = useCallback((plan: LearningPlan) => {
    setCurrentPlan(plan);
  }, []);

  // Create new plan
  const createPlan = useCallback(async (
    userId: string, 
    title: string, 
    description?: string, 
    targetDate?: string,
    skillPriorities?: Record<any, number>
  ): Promise<LearningPlan | null> => {
    try {
      setLoading(true);
      setError(null);

      const planData = {
        title,
        description,
        targetDate,
        nodes: []
      };

      const newPlan = await createLearningPlan(userId, planData);
      
      if (newPlan) {
        setPlans(prev => [...prev, newPlan]);
        setCurrentPlan(newPlan);
        return newPlan;
      }
      
      return null;
    } catch (err) {
      console.error('Error creating plan:', err);
      setError('Error al crear el plan de estudio');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update plan progress
  const updatePlanProgress = useCallback(async (userId: string, planId: string) => {
    try {
      setProgressLoading(true);
      // For now, create mock progress data
      const mockProgress: PlanProgress = {
        totalNodes: currentPlan?.nodes.length || 0,
        completedNodes: 0,
        inProgressNodes: 0,
        overallProgress: 0,
        nodeProgress: {}
      };
      
      setProgressData(prev => ({
        ...prev,
        [planId]: mockProgress
      }));
    } catch (err) {
      console.error('Error updating plan progress:', err);
    } finally {
      setProgressLoading(false);
    }
  }, [currentPlan]);

  // Get plan progress
  const getPlanProgress = useCallback((planId: string): PlanProgress | null => {
    return progressData[planId] || null;
  }, [progressData]);

  return {
    // State
    currentPlan,
    plans,
    loading,
    initializing,
    error,
    progressData,
    progressLoading,
    recommendedNodeId,
    
    // Actions
    refreshPlans,
    selectPlan,
    createPlan,
    updatePlanProgress,
    getPlanProgress
  };
};
