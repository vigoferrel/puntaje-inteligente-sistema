
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPlan } from '../types';
import { createLearningPlan, fetchLearningPlans, updateLearningPlan, deleteLearningPlan } from '../services';

export const useLearningPlanProvider = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch plans for current user
  const fetchPlans = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      
      const fetchedPlans = await fetchLearningPlans(user.id);
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
    }
  }, [user?.id, currentPlan]);

  // Create new plan
  const createPlan = useCallback(async (planData: Partial<LearningPlan>) => {
    if (!user?.id) return null;

    try {
      setLoading(true);
      setError(null);

      const newPlan = await createLearningPlan(user.id, planData);
      
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
  }, [user?.id]);

  // Update existing plan
  const updatePlan = useCallback(async (planId: string, updates: Partial<LearningPlan>) => {
    try {
      setLoading(true);
      setError(null);

      const updatedPlan = await updateLearningPlan(planId, updates);
      
      if (updatedPlan) {
        setPlans(prev => prev.map(plan => 
          plan.id === planId ? { ...plan, ...updates } : plan
        ));
        
        if (currentPlan?.id === planId) {
          setCurrentPlan(prev => prev ? { ...prev, ...updates } : null);
        }
      }
      
      return updatedPlan;
    } catch (err) {
      console.error('Error updating plan:', err);
      setError('Error al actualizar el plan de estudio');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentPlan]);

  // Delete plan
  const deletePlan = useCallback(async (planId: string) => {
    try {
      setLoading(true);
      setError(null);

      const success = await deleteLearningPlan(planId);
      
      if (success) {
        setPlans(prev => prev.filter(plan => plan.id !== planId));
        
        if (currentPlan?.id === planId) {
          setCurrentPlan(null);
        }
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting plan:', err);
      setError('Error al eliminar el plan de estudio');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentPlan]);

  // Set current plan
  const setActivePlan = useCallback((plan: LearningPlan | null) => {
    setCurrentPlan(plan);
  }, []);

  return {
    // State
    currentPlan,
    plans,
    loading,
    error,
    
    // Actions
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
    setActivePlan,
    
    // Computed
    hasPlans: plans.length > 0,
    isReady: !loading && error === null
  };
};
