
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { TLearningCyclePhase, LEARNING_CYCLE_PHASES_ORDER } from "@/types/system-types";
import { toast } from "@/components/ui/use-toast";
import { generatePerformanceInsights } from "@/services/openrouter-service";

export const useLearningWorkflow = () => {
  const { user } = useAuth();
  const { getLearningCyclePhase, nodeProgress, loading } = useLearningNodes();
  const [currentPhase, setCurrentPhase] = useState<TLearningCyclePhase>("DIAGNOSIS");
  const [timeInPhase, setTimeInPhase] = useState<number | null>(null);

  useEffect(() => {
    const loadUserPhase = async () => {
      if (user?.id) {
        try {
          const phase = await getLearningCyclePhase(user.id);
          setCurrentPhase(phase);
          
          // Fetch time spent in current phase if available
          if (nodeProgress) {
            const phaseNodes = Object.values(nodeProgress).filter(
              node => node.learningPhase === phase
            );
            
            const timeSpent = phaseNodes.reduce(
              (total, node) => total + (node.timeSpentMinutes || 0), 
              0
            );
            
            setTimeInPhase(timeSpent);
          }
          
          // Generate insights if in analysis phase
          if (phase === 'FEEDBACK_ANALYSIS' && user.id) {
            generatePerformanceInsights(user.id, nodeProgress);
          }
        } catch (error) {
          console.error("Error cargando fase de aprendizaje:", error);
        }
      }
    };
    
    loadUserPhase();
  }, [user?.id, getLearningCyclePhase, nodeProgress]);

  // Calculate completed nodes percentage
  const calculateProgress = () => {
    if (!nodeProgress) return 0;
    
    const nodes = Object.values(nodeProgress);
    if (nodes.length === 0) return 0;
    
    const completedNodes = nodes.filter(node => node.status === 'completed').length;
    return Math.round((completedNodes / nodes.length) * 100);
  };

  // Calculate phase progress
  const calculatePhaseProgress = (phase: TLearningCyclePhase) => {
    if (!nodeProgress) return 0;
    
    const phaseNodes = Object.values(nodeProgress).filter(
      node => node.learningPhase === phase
    );
    
    if (phaseNodes.length === 0) return 0;
    
    const completedNodes = phaseNodes.filter(node => node.status === 'completed').length;
    return Math.round((completedNodes / phaseNodes.length) * 100);
  };

  // Handle click on LectoGuía
  const handleLectoGuiaClick = () => {
    toast({
      title: "¡Consultando a LectoGuía!",
      description: "Te ayudará con tu comprensión lectora mediante ejercicios personalizados."
    });
  };

  const currentPhaseIndex = LEARNING_CYCLE_PHASES_ORDER.indexOf(currentPhase);
  const completionPercentage = calculateProgress();

  return {
    loading,
    currentPhase,
    timeInPhase,
    calculateProgress,
    calculatePhaseProgress,
    handleLectoGuiaClick,
    currentPhaseIndex,
    completionPercentage
  };
};
