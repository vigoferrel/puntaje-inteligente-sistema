import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TLearningNode, TLearningCyclePhase, TPAESHabilidad, TPAESPrueba } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { useCallback } from "react";

export interface NodeProgress {
  nodeId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
  timeSpentMinutes: number;
}

// Helper function to map database skill_id to TPAESHabilidad
const mapSkillIdToEnum = (skillId: number): TPAESHabilidad => {
  const skillMap: Record<number, TPAESHabilidad> = {
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
  
  return skillMap[skillId] || "SOLVE_PROBLEMS"; // Default to SOLVE_PROBLEMS if mapping not found
};

// Helper function to map database test_id to TPAESPrueba
const mapTestIdToEnum = (testId: number): TPAESPrueba => {
  const testMap: Record<number, TPAESPrueba> = {
    1: "COMPETENCIA_LECTORA",
    2: "MATEMATICA_1",
    3: "MATEMATICA_2",
    4: "CIENCIAS",
    5: "HISTORIA"
  };
  
  return testMap[testId] || "MATEMATICA_1"; // Default to MATEMATICA_1 if mapping not found
};

export const useLearningNodes = () => {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [nodeProgress, setNodeProgress] = useState<Record<string, NodeProgress>>({});
  
  const fetchLearningNodes = async (testId?: number, skillId?: number) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('learning_nodes')
        .select('*');
      
      if (testId) {
        query = query.eq('test_id', testId);
      }
      
      if (skillId) {
        query = query.eq('skill_id', skillId);
      }
      
      // Order by position for proper sequencing
      query = query.order('position', { ascending: true });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database nodes to our frontend type
      if (data) {
        const mappedNodes: TLearningNode[] = data.map(node => ({
          id: node.id,
          title: node.title,
          description: node.description || '',
          skill: mapSkillIdToEnum(node.skill_id),
          prueba: mapTestIdToEnum(node.test_id),
          difficulty: node.difficulty,
          position: node.position,
          dependsOn: node.depends_on || [],
          estimatedTimeMinutes: node.estimated_time_minutes || 30,
          content: {
            theory: '',
            examples: [],
            exerciseCount: 15
          }
        }));
        
        setNodes(mappedNodes);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching learning nodes:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los nodos de aprendizaje",
        variant: "destructive"
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchUserNodeProgress = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_node_progress')
        .select('node_id, status, progress, time_spent_minutes')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      if (data) {
        const progressMap: Record<string, NodeProgress> = {};
        
        data.forEach(item => {
          progressMap[item.node_id] = {
            nodeId: item.node_id,
            status: item.status as 'not_started' | 'in_progress' | 'completed',
            progress: item.progress || 0,
            timeSpentMinutes: item.time_spent_minutes || 0
          };
        });
        
        setNodeProgress(progressMap);
        return progressMap;
      }
      
      return {};
    } catch (error) {
      console.error('Error fetching node progress:', error);
      return {};
    }
  };

  const updateNodeProgress = async (
    userId: string, 
    nodeId: string, 
    status: 'not_started' | 'in_progress' | 'completed',
    progress: number,
    additionalTimeMinutes = 0
  ) => {
    try {
      // Get current progress to update time tracking
      const { data: currentData, error: fetchError } = await supabase
        .from('user_node_progress')
        .select('time_spent_minutes')
        .eq('user_id', userId)
        .eq('node_id', nodeId)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      
      const timeSpentMinutes = (currentData?.time_spent_minutes || 0) + additionalTimeMinutes;
      const completedAt = status === 'completed' ? new Date().toISOString() : null;
      
      const { error } = await supabase
        .from('user_node_progress')
        .upsert({
          user_id: userId,
          node_id: nodeId,
          status,
          progress,
          time_spent_minutes: timeSpentMinutes,
          completed_at: completedAt,
          last_activity_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      // Update local state
      setNodeProgress(prev => ({
        ...prev,
        [nodeId]: {
          nodeId,
          status,
          progress,
          timeSpentMinutes
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating node progress:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el progreso del nodo",
        variant: "destructive"
      });
      return false;
    }
  };

  const getLearningCyclePhase = useCallback(async (userId: string): Promise<TLearningCyclePhase> => {
    try {
      // Check if user has completed diagnostic
      const { data: diagnosticData, error: diagnosticError } = await supabase
        .from('user_diagnostic_results')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (diagnosticError) throw diagnosticError;
      
      if (!diagnosticData || diagnosticData.length === 0) {
        return 'DIAGNOSIS'; // User needs to complete diagnosis first
      }
      
      // Check if user has a learning plan
      const { data: planData, error: planError } = await supabase
        .from('learning_plans')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      
      if (planError) throw planError;
      
      if (!planData || planData.length === 0) {
        return 'PERSONALIZED_PLAN'; // User needs a learning plan
      }
      
      // Check user's progress on nodes
      const { data: nodeProgress, error: progressError } = await supabase
        .from('user_node_progress')
        .select('status')
        .eq('user_id', userId);
      
      if (progressError) throw progressError;
      
      if (!nodeProgress || nodeProgress.length === 0) {
        return 'SKILL_TRAINING'; // User needs to start training skills
      }
      
      const completedNodes = nodeProgress.filter(node => node.status === 'completed').length;
      const inProgressNodes = nodeProgress.filter(node => node.status === 'in_progress').length;
      
      // Calculate progress percentage assuming there are nodes in the plan
      const { data: planNodesCount, error: countError } = await supabase
        .from('learning_plan_nodes')
        .select('id', { count: 'exact' })
        .eq('plan_id', planData[0].id);
      
      if (countError) throw countError;
      
      const totalNodes = planNodesCount?.length || 0;
      
      if (totalNodes === 0) {
        return 'PERSONALIZED_PLAN'; // Plan exists but has no nodes
      }
      
      const progressPercentage = completedNodes / totalNodes;
      
      if (progressPercentage < 0.2) {
        return 'SKILL_TRAINING';
      } else if (progressPercentage < 0.5) {
        return 'CONTENT_STUDY';
      } else if (progressPercentage < 0.75) {
        return 'PERIODIC_TESTS';
      } else if (progressPercentage < 0.9) {
        return 'FEEDBACK_ANALYSIS';
      } else if (progressPercentage < 1.0) {
        return 'REINFORCEMENT';
      } else {
        return 'FINAL_SIMULATIONS'; // All nodes completed
      }
    } catch (error) {
      console.error('Error determining learning cycle phase:', error);
      return 'DIAGNOSIS'; // Default to diagnosis if error
    }
  }, []);

  return {
    nodes,
    loading,
    nodeProgress,
    fetchLearningNodes,
    fetchUserNodeProgress,
    updateNodeProgress,
    getLearningCyclePhase
  };
};
