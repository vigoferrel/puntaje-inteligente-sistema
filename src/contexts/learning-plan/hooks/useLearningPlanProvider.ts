
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LearningPlan {
  id: string;
  title: string;
  description: string;
  progress: number;
  createdAt: string;
}

export const useLearningPlanProvider = () => {
  const { profile } = useAuth();
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const createPlan = async (title: string, description: string) => {
    if (!profile?.id) {
      console.warn('No hay usuario autenticado para crear plan');
      return null;
    }

    setIsLoading(true);
    
    try {
      const newPlan: LearningPlan = {
        id: `plan_${Date.now()}`,
        title,
        description,
        progress: 0,
        createdAt: new Date().toISOString()
      };

      setPlans(prev => [...prev, newPlan]);
      setCurrentPlan(newPlan);
      
      console.log(`Plan creado para usuario ${profile.id}:`, newPlan);
      return newPlan;
    } catch (error) {
      console.error('Error creando plan:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePlan = async (planId: string, updates: Partial<LearningPlan>) => {
    if (!profile?.id) return false;

    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, ...updates } : plan
    ));

    if (currentPlan?.id === planId) {
      setCurrentPlan(prev => prev ? { ...prev, ...updates } : null);
    }

    return true;
  };

  const deletePlan = async (planId: string) => {
    if (!profile?.id) return false;

    setPlans(prev => prev.filter(plan => plan.id !== planId));
    
    if (currentPlan?.id === planId) {
      setCurrentPlan(null);
    }

    return true;
  };

  // Inicializar con datos demo si hay usuario
  useEffect(() => {
    if (profile?.id && plans.length === 0) {
      const demoPlan: LearningPlan = {
        id: 'demo_plan',
        title: 'Preparación PAES 2024',
        description: 'Plan integral para maximizar puntaje PAES',
        progress: 68,
        createdAt: new Date().toISOString()
      };
      
      setPlans([demoPlan]);
      setCurrentPlan(demoPlan);
    }
  }, [profile?.id, plans.length]);

  return {
    plans,
    currentPlan,
    isLoading,
    createPlan,
    updatePlan,
    deletePlan,
    setCurrentPlan
  };
};
