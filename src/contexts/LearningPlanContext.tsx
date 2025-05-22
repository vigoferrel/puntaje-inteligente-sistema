import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LearningPlan, PlanProgress } from "@/types/learning-plan";
import { supabase } from "@/integrations/supabase/client";
import { TPAESHabilidad } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";

// Define the context state type
interface LearningPlanContextType {
  plans: LearningPlan[];
  currentPlan: LearningPlan | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  progressData: Record<string, PlanProgress>;
  progressLoading: boolean;
  recommendedNodeId: string | null;
  refreshPlans: (userId: string) => Promise<void>;
  selectPlan: (plan: LearningPlan) => void;
  createPlan: (userId: string, title: string, description?: string, targetDate?: string, skillPriorities?: Record<TPAESHabilidad, number>) => Promise<LearningPlan | null>;
  updatePlanProgress: (userId: string, planId: string) => Promise<void>;
  getPlanProgress: (planId: string) => PlanProgress | null;
}

// Create context with default values
const LearningPlanContext = createContext<LearningPlanContextType>({
  plans: [],
  currentPlan: null,
  loading: false,
  initializing: true,
  error: null,
  progressData: {},
  progressLoading: false,
  recommendedNodeId: null,
  refreshPlans: async () => {},
  selectPlan: () => {},
  createPlan: async () => null,
  updatePlanProgress: async () => {},
  getPlanProgress: () => null
});

// Provider component
export const LearningPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      const { data: plansData, error: plansError } = await supabase
        .from('learning_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (plansError) throw plansError;
      
      if (!plansData || plansData.length === 0) {
        setPlans([]);
        setCurrentPlan(null);
        return;
      }
      
      // For each plan, fetch its nodes with proper error handling
      const plansWithNodes = await Promise.all(
        plansData.map(async (plan) => {
          try {
            const { data: nodesData, error: nodesError } = await supabase
              .from('learning_plan_nodes')
              .select(`
                id, position,
                node:node_id (
                  id, title, description, difficulty, skill_id
                )
              `)
              .eq('plan_id', plan.id)
              .order('position', { ascending: true });
            
            if (nodesError) throw nodesError;
            
            // Transform nodes to the expected format with safe type handling
            const nodes = (nodesData || []).map(item => {
              const nodeSkill = mapNodeSkillSafely(item.node?.skill_id);
              
              return {
                id: item.id,
                nodeId: item.node?.id || '',
                nodeName: item.node?.title || `Node ${item.position}`,
                nodeDescription: item.node?.description || '',
                nodeDifficulty: item.node?.difficulty || 'basic',
                nodeSkill,
                position: item.position,
                planId: plan.id
              };
            });
            
            // Return complete plan object
            return {
              id: plan.id,
              title: plan.title,
              description: plan.description || '',
              userId: plan.user_id,
              createdAt: plan.created_at,
              updatedAt: plan.updated_at,
              targetDate: plan.target_date || null,
              nodes
            };
          } catch (nodeError) {
            console.error(`Error fetching nodes for plan ${plan.id}:`, nodeError);
            // Return plan with empty nodes array on error
            return {
              id: plan.id,
              title: plan.title,
              description: plan.description || '',
              userId: plan.user_id,
              createdAt: plan.created_at,
              updatedAt: plan.updated_at,
              targetDate: plan.target_date || null,
              nodes: []
            };
          }
        })
      );
      
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
      
      // Insert the new plan
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
      
      // Fetch the nodes in this plan
      const { data: planNodes, error: nodesError } = await supabase
        .from('learning_plan_nodes')
        .select('id, node_id')
        .eq('plan_id', planId);
      
      if (nodesError) throw nodesError;
      
      if (!planNodes || planNodes.length === 0) {
        setProgressData(prev => ({
          ...prev,
          [planId]: {
            totalNodes: 0,
            completedNodes: 0,
            inProgressNodes: 0,
            overallProgress: 0,
            nodeProgress: {}
          }
        }));
        return;
      }
      
      const nodeIds = planNodes.map(n => n.node_id);
      
      // Fetch progress for all nodes
      const { data: progress, error: progressError } = await supabase
        .from('user_node_progress')
        .select('*')
        .eq('user_id', userId)
        .in('node_id', nodeIds);
      
      if (progressError) throw progressError;
      
      // Calculate metrics
      const totalNodes = planNodes.length;
      const completedNodes = (progress || []).filter(p => p.status === 'completed').length;
      const inProgressNodes = (progress || []).filter(p => p.status === 'in_progress').length;
      const overallProgress = totalNodes > 0 ? (completedNodes / totalNodes) * 100 : 0;
      
      // Create nodeProgress map
      const nodeProgressMap: Record<string, number> = {};
      (progress || []).forEach(p => {
        nodeProgressMap[p.node_id] = p.progress || 0;
      });
      
      // Update state
      setProgressData(prev => ({
        ...prev,
        [planId]: {
          totalNodes,
          completedNodes,
          inProgressNodes,
          overallProgress,
          nodeProgress: nodeProgressMap
        }
      }));
      
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

  // Return the provider
  return (
    <LearningPlanContext.Provider
      value={{
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
      }}
    >
      {children}
    </LearningPlanContext.Provider>
  );
};

// Helper function to map node skill safely
function mapNodeSkillSafely(skillId: number | undefined | null): TPAESHabilidad {
  if (skillId === undefined || skillId === null) return 'MODEL';
  
  try {
    // Use a hardcoded mapping to avoid import issues
    const skillMapping: Record<number, TPAESHabilidad> = {
      1: "TRACK_LOCATE",
      2: "INTERPRET_RELATE",
      3: "EVALUATE_REFLECT",
      4: "SOLVE_PROBLEMS",
      5: "REPRESENT",
      6: "MODEL",
      7: "ARGUE_COMMUNICATE",
      8: "IDENTIFY_THEORIES",
      9: "PROCESS_ANALYZE",
      10: "APPLY_PRINCIPLES",
      11: "SCIENTIFIC_ARGUMENT",
      12: "TEMPORAL_THINKING",
      13: "SOURCE_ANALYSIS",
      14: "MULTICAUSAL_ANALYSIS",
      15: "CRITICAL_THINKING",
      16: "REFLECTION"
    };
    
    return skillMapping[skillId] || 'MODEL';
  } catch (e) {
    console.error(`Error mapping skill ID ${skillId}:`, e);
    return 'MODEL';
  }
}

// Helper function to ensure user has a learning plan
async function ensureUserHasLearningPlan(userId: string): Promise<boolean> {
  try {
    // First check if the user already has plans
    const { count, error } = await supabase
      .from('learning_plans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (error) throw error;
    
    // If user has plans, we're done
    if (count && count > 0) return true;
    
    // Otherwise, generate a default plan
    const { data: planData, error: planError } = await supabase
      .from('learning_plans')
      .insert({
        user_id: userId,
        title: 'Plan de Estudio PAES',
        description: 'Plan de estudio personalizado para la PAES',
        target_date: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString()
      })
      .select()
      .single();
    
    if (planError) throw planError;
    if (!planData) throw new Error('No se pudo crear el plan por defecto');
    
    // Generate nodes for the new plan
    await generateNodesForPlan(planData.id);
    
    return true;
  } catch (error) {
    console.error('Error ensuring user has learning plan:', error);
    return false;
  }
}

// Helper function to generate nodes for a plan
async function generateNodesForPlan(
  planId: string, 
  skillPriorities?: Record<TPAESHabilidad, number>
): Promise<boolean> {
  try {
    // Fetch some basic nodes to include
    const { data: nodes, error: nodesError } = await supabase
      .from('learning_nodes')
      .select('id, position, skill_id, difficulty')
      .order('difficulty', { ascending: true })
      .order('position', { ascending: true })
      .limit(10);
    
    if (nodesError) throw nodesError;
    
    if (!nodes || nodes.length === 0) {
      console.warn('No learning nodes available to add to the plan');
      return false;
    }
    
    // Prepare nodes for insertion
    let position = 1;
    const planNodes = nodes.map(node => ({
      plan_id: planId,
      node_id: node.id,
      position: position++
    }));
    
    // Insert the nodes into the plan
    const { error: insertError } = await supabase
      .from('learning_plan_nodes')
      .insert(planNodes);
    
    if (insertError) throw insertError;
    
    return true;
  } catch (error) {
    console.error('Error generating nodes for plan:', error);
    return false;
  }
}

// Custom hook to use the learning plan context
export const useLearningPlanContext = () => useContext(LearningPlanContext);
