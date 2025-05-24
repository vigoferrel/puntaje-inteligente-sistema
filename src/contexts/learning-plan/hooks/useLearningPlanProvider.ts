
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPlan, PlanProgress, LearningPlanContextType } from '../types';
import { createLearningPlan, fetchLearningPlans, updateLearningPlan, deleteLearningPlan } from '../services';

export const useLearningPlanProvider = (): LearningPlanContextType => {
  const { user, profile } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<Record<string, PlanProgress>>({});
  const [progressLoading, setProgressLoading] = useState(false);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);

  // Auto-initialize when user becomes available
  useEffect(() => {
    if (profile?.id && initializing) {
      console.log('Auto-initializing plans for user:', profile.id);
      refreshPlans(profile.id);
    }
  }, [profile?.id, initializing]);

  // Fetch plans for current user
  const refreshPlans = useCallback(async (userId: string) => {
    if (!userId) {
      console.warn('Cannot refresh plans: no userId provided');
      return;
    }

    try {
      console.log('Fetching plans for user:', userId);
      setLoading(true);
      setError(null);
      
      const fetchedPlans = await fetchLearningPlans(userId);
      console.log('Fetched plans:', fetchedPlans);
      
      setPlans(fetchedPlans);
      
      // Set current plan to the first one if available and none is set
      if (fetchedPlans.length > 0 && !currentPlan) {
        console.log('Setting current plan to:', fetchedPlans[0].title);
        setCurrentPlan(fetchedPlans[0]);
      } else if (fetchedPlans.length === 0) {
        console.log('No plans found, user needs to create one');
        setCurrentPlan(null);
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
    console.log('Selecting plan:', plan.title);
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
    if (!userId) {
      console.warn('Cannot create plan: no userId provided');
      return null;
    }

    try {
      console.log('Creating new plan:', title);
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
        console.log('Plan created successfully:', newPlan.title);
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
    if (!userId || !planId) {
      console.warn('Cannot update progress: missing userId or planId');
      return;
    }

    try {
      console.log('Updating progress for plan:', planId);
      setProgressLoading(true);
      
      // Create mock progress data with required nodeProgress
      const mockProgress: PlanProgress = {
        totalNodes: currentPlan?.nodes.length || 0,
        completedNodes: Math.floor(Math.random() * (currentPlan?.nodes.length || 0)),
        inProgressNodes: Math.floor(Math.random() * 3),
        overallProgress: Math.floor(Math.random() * 100),
        nodeProgress: {}
      };
      
      // Add node progress for each node
      currentPlan?.nodes.forEach(node => {
        mockProgress.nodeProgress[node.nodeId] = Math.floor(Math.random() * 100);
      });
      
      setProgressData(prev => ({
        ...prev,
        [planId]: mockProgress
      }));
      
      console.log('Progress updated successfully');
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
