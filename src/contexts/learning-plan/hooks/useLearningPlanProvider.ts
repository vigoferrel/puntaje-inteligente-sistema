
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LearningPlan, PlanProgress } from '../types';

export const useLearningPlanProvider = () => {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<Record<string, any>>({});
  const [progressLoading, setProgressLoading] = useState(false);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);

  const refreshPlans = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Refreshing plans for user: ${userId}`);
      setInitializing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading plans');
    } finally {
      setLoading(false);
    }
  };

  const selectPlan = (plan: LearningPlan) => {
    setCurrentPlan(plan);
  };

  const createPlan = async (userId: string, title: string, description?: string, targetDate?: string, skillPriorities?: Record<string, number>) => {
    if (!profile?.id) {
      console.warn('No hay usuario autenticado para crear plan');
      return null;
    }

    setLoading(true);
    
    try {
      const newPlan: LearningPlan = {
        id: `plan_${Date.now()}`,
        title,
        description: description || '',
        progress: 0,
        createdAt: new Date().toISOString(),
        userId: profile.id,
        nodes: []
      };

      setPlans(prev => [...prev, newPlan]);
      setCurrentPlan(newPlan);
      
      console.log(`Plan creado para usuario ${profile.id}:`, newPlan);
      return newPlan;
    } catch (error) {
      console.error('Error creando plan:', error);
      setError('Error creating plan');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePlanProgress = async (userId: string, planId: string) => {
    if (!profile?.id) return;
    
    setProgressLoading(true);
    try {
      // Simulate progress update
      console.log(`Updating progress for plan ${planId} and user ${userId}`);
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error updating progress:', error);
    } finally {
      setProgressLoading(false);
    }
  };

  const getPlanProgress = (planId: string): PlanProgress => {
    return progressData[planId] || {
      totalNodes: 0,
      completedNodes: 0,
      inProgressNodes: 0,
      overallProgress: 0,
      nodeProgress: {}
    };
  };

  // Inicializar con datos demo si hay usuario
  useEffect(() => {
    if (profile?.id && plans.length === 0 && initializing) {
      const demoPlan: LearningPlan = {
        id: 'demo_plan',
        title: 'Preparación PAES 2024',
        description: 'Plan integral para maximizar puntaje PAES',
        progress: 68,
        createdAt: new Date().toISOString(),
        userId: profile.id,
        nodes: []
      };
      
      setPlans([demoPlan]);
      setCurrentPlan(demoPlan);
      setInitializing(false);
    }
  }, [profile?.id, plans.length, initializing]);

  return {
    plans,
    currentPlan,
    loading,
    initializing,
    error,
    progressData,
    progressLoading,
    recommendedNodeId,
    refreshPlans,
    selectPlan,
    createPlan,
    updatePlanProgress,
    getPlanProgress
  };
};
