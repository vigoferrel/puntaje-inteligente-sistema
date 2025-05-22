
import { useState, useEffect } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { 
  ensureUserHasLearningPlan, 
  fetchPlansWithNodes, 
  fetchPlanProgress, 
  generateNodesForPlan 
} from "../services";
import { LearningPlanContextType } from "../types";

// Import Supabase client using ES module syntax instead of require
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook that provides all the learning plan state and logic
 */
export const useLearningPlanProvider = (): LearningPlanContextType => {
  const [plans, setPlans] = useState<LearningPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressData, setProgressData] = useState<Record<string, PlanProgress>>({});
  const [progressLoading, setProgressLoading] = useState(false);
  const [recommendedNodeId, setRecommendedNodeId] = useState<string | null>(null);

  // Function to fetch all plans for a user
  const refreshPlans = async (userId: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log(`Fetching plans for user ${userId}`);
      
      // Ensure default plans exist if user has none
      await ensureUserHasLearningPlan(userId);
      
      // Fetch plans with their nodes
      const plansWithNodes = await fetchPlansWithNodes(userId);
      
      setPlans(plansWithNodes);
      
      // Set the current plan to the most recent one if not already set
      if (!currentPlan && plansWithNodes.length > 0) {
        setCurrentPlan(plansWithNodes[0]);
        // Also load progress data for this plan
        if (userId) {
          updatePlanProgress(userId, plansWithNodes[0].id);
        }
      }
      
    } catch (error) {
      console.error("Error fetching learning plans:", error);
      setError("No se pudieron cargar los planes de estudio");
      toast({
        title: "Error",
        description: "Ocurrió un problema al cargar los planes de estudio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setInitializing(false);
    }
  };
  
  // Function to create a new learning plan
  const createPlan = async (
    userId: string,
    title: string,
    description?: string,
    targetDate?: string,
    skillPriorities?: Record<TPAESHabilidad, number>
  ): Promise<LearningPlan | null> => {
    try {
      setLoading(true);
      
      // Insert the new plan using Supabase
      const { data: planData, error: planError } = await supabase
        .from('learning_plans')
        .insert({
          user_id: userId,
          title,
          description,
          target_date: targetDate
        })
        .select()
        .single();
      
      if (planError) throw planError;
      if (!planData) throw new Error("No se pudo crear el plan");
      
      // Now generate nodes for this plan based on skills
      await generateNodesForPlan(planData.id, skillPriorities);
      
      // Fetch the complete plan with nodes
      await refreshPlans(userId);
      
      // Find the newly created plan in the updated plans list
      const newPlan = plans.find(p => p.id === planData.id) || {
        id: planData.id,
        title: planData.title,
        description: planData.description || '',
        userId: planData.user_id,
        createdAt: planData.created_at,
        updatedAt: planData.updated_at,
        targetDate: planData.target_date || null,
        nodes: []
      };
      
      // Set as current plan
      setCurrentPlan(newPlan);
      
      // Show success message
      toast({
        title: "Plan creado",
        description: "Se ha creado tu nuevo plan de estudio",
      });
      
      return newPlan;
    } catch (error) {
      console.error("Error creating learning plan:", error);
      toast({
        title: "Error",
        description: "No se pudo crear el plan de estudio",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update plan progress
  const updatePlanProgress = async (userId: string, planId: string) => {
    if (!userId || !planId) return;
    
    try {
      setProgressLoading(true);
      
      const progress = await fetchPlanProgress(userId, planId);
      
      if (progress) {
        // Update state
        setProgressData(prev => ({
          ...prev,
          [planId]: progress
        }));
      }
    } catch (error) {
      console.error("Error updating plan progress:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del plan",
        variant: "destructive"
      });
    } finally {
      setProgressLoading(false);
    }
  };
  
  // Function to get plan progress
  const getPlanProgress = (planId: string): PlanProgress | null => {
    return progressData[planId] || null;
  };
  
  // Function to select a plan
  const selectPlan = (plan: LearningPlan) => {
    setCurrentPlan(plan);
  };

  // Return everything needed for the context
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
