
import { supabase } from "@/integrations/supabase/client";
import { LearningPlan } from "./types";

/**
 * Simplified learning plan services using existing tables
 */
export const createLearningPlan = async (userId: string, planData: Partial<LearningPlan>): Promise<LearningPlan | null> => {
  try {
    // Since we don't have learning_plans table, create a virtual plan using user progress
    const planId = `plan_${userId}_${Date.now()}`;
    
    // Store plan metadata in user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        target_career: planData.title,
        learning_phase: 'PLAN_ACTIVE'
      })
      .eq('id', userId);

    if (profileError) throw profileError;

    // Create virtual plan object
    const virtualPlan: LearningPlan = {
      id: planId,
      title: planData.title || 'Plan Personalizado PAES',
      description: planData.description || 'Plan generado automáticamente',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targetDate: planData.targetDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      nodes: planData.nodes || []
    };

    return virtualPlan;
  } catch (error) {
    console.error('Error creating learning plan:', error);
    return null;
  }
};

export const fetchLearningPlans = async (userId: string): Promise<LearningPlan[]> => {
  try {
    // Fetch user profile to get current plan info
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !profile) return [];

    // Create virtual plan based on user progress
    const { data: progress } = await supabase
      .from('user_node_progress')
      .select('*')
      .eq('user_id', userId);

    const virtualPlan: LearningPlan = {
      id: `plan_${userId}`,
      title: profile.target_career || 'Plan Personalizado PAES',
      description: 'Plan basado en tu progreso actual',
      userId,
      createdAt: profile.created_at,
      updatedAt: profile.updated_at,
      targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      nodes: progress?.map(p => ({
        id: p.node_id,
        nodeId: p.node_id,
        position: 0,
        nodeName: 'Nodo de aprendizaje',
        nodeDescription: 'Descripción del nodo',
        nodeDifficulty: 'INTERMEDIATE',
        nodeSkill: 'INTERPRET_RELATE',
        planId: `plan_${userId}`
      })) || []
    };

    return [virtualPlan];
  } catch (error) {
    console.error('Error fetching learning plans:', error);
    return [];
  }
};

export const updateLearningPlan = async (planId: string, updates: Partial<LearningPlan>): Promise<LearningPlan | null> => {
  try {
    // For now, just return a success response since we're using virtual plans
    console.log('Learning plan updated (virtual):', planId, updates);
    return null;
  } catch (error) {
    console.error('Error updating learning plan:', error);
    return null;
  }
};

export const deleteLearningPlan = async (planId: string): Promise<boolean> => {
  try {
    console.log('Learning plan deleted (virtual):', planId);
    return true;
  } catch (error) {
    console.error('Error deleting learning plan:', error);
    return false;
  }
};
