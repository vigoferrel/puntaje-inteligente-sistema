
import { useState, useCallback } from "react";
import { TLearningNode, TLearningCyclePhase, LEARNING_CYCLE_PHASES_ORDER } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { NodeProgress } from "@/types/node-progress";
import { 
  fetchLearningNodes as fetchNodes, 
  fetchUserNodeProgress as fetchProgress,
  updateNodeProgress as updateProgress,
  getLearningCyclePhase as getCyclePhase,
  fetchNodeContent as getNodeContent
} from "@/services/node";

export { type NodeProgress } from "@/types/node-progress";

export const useLearningNodes = () => {
  const [nodes, setNodes] = useState<TLearningNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [nodeProgress, setNodeProgress] = useState<Record<string, NodeProgress>>({});
  const [currentPhase, setCurrentPhase] = useState<TLearningCyclePhase>("DIAGNOSIS");
  
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
    const phase = await getCyclePhase(userId);
    setCurrentPhase(phase);
    return phase;
  }, []);

  const fetchNodeContent = async (nodeId: string) => {
    try {
      return await getNodeContent(nodeId);
    } catch (error) {
      console.error('Error fetching node content:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el contenido del nodo",
        variant: "destructive"
      });
      return null;
    }
  };

  // Workflow functionality consolidada
  const calculateProgress = () => {
    if (!nodeProgress) return 0;
    
    const nodes = Object.values(nodeProgress);
    if (nodes.length === 0) return 0;
    
    const completedNodes = nodes.filter(node => node.status === 'completed').length;
    return Math.round((completedNodes / nodes.length) * 100);
  };

  const calculatePhaseProgress = (phase: TLearningCyclePhase) => {
    if (!nodeProgress) return 0;
    
    // Simplificado: calculamos progreso basado en nodos completados
    const allNodes = Object.values(nodeProgress);
    if (allNodes.length === 0) return 0;
    
    const completedNodes = allNodes.filter(node => node.status === 'completed').length;
    return Math.round((completedNodes / allNodes.length) * 100);
  };

  const handleLectoGuiaClick = () => {
    toast({
      title: "¡Consultando a LectoGuía!",
      description: "Te ayudará con tu comprensión lectora mediante ejercicios personalizados."
    });
  };

  const getCurrentPhaseIndex = () => LEARNING_CYCLE_PHASES_ORDER.indexOf(currentPhase);
  const getCompletionPercentage = () => calculateProgress();

  return {
    nodes,
    loading,
    nodeProgress,
    currentPhase,
    fetchLearningNodes,
    fetchUserNodeProgress,
    updateNodeProgress,
    getLearningCyclePhase,
    fetchNodeContent,
    // Workflow functions
    calculateProgress,
    calculatePhaseProgress,
    handleLectoGuiaClick,
    currentPhaseIndex: getCurrentPhaseIndex(),
    completionPercentage: getCompletionPercentage()
  };
};
