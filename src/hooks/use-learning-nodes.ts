
import { useState, useCallback } from "react";
import { TLearningNode, TLearningCyclePhase } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { NodeProgress } from "@/types/node-progress";
import { 
  fetchLearningNodes as fetchNodes, 
  fetchUserNodeProgress as fetchProgress,
  updateNodeProgress as updateProgress,
  getLearningCyclePhase as getCyclePhase
} from "@/services/node";

export { type NodeProgress } from "@/types/node-progress";

export const useLearningNodes = () => {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [nodeProgress, setNodeProgress] = useState<Record<string, NodeProgress>>({});
  
  const fetchLearningNodes = async (testId?: number, skillId?: number) => {
    try {
      setLoading(true);
      const data = await fetchNodes(testId, skillId);
      setNodes(data);
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
      const progressMap = await fetchProgress(userId);
      setNodeProgress(progressMap);
      return progressMap;
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
      const success = await updateProgress(
        userId, 
        nodeId, 
        status, 
        progress, 
        additionalTimeMinutes
      );
      
      if (success) {
        // Update local state
        setNodeProgress(prev => ({
          ...prev,
          [nodeId]: {
            nodeId,
            status,
            progress,
            timeSpentMinutes: (prev[nodeId]?.timeSpentMinutes || 0) + additionalTimeMinutes
          }
        }));
      }
      
      return success;
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
    return await getCyclePhase(userId);
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
