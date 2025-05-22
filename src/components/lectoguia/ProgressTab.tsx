
import React, { useEffect } from "react";
import { ProgressView } from "./ProgressView";
import { SkillNodeConnection } from "./skill-visualization/SkillNodeConnection";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { useAuth } from "@/contexts/AuthContext";

interface ProgressTabProps {
  skillLevels: Record<string, number>;
  onStartSimulation: () => void;
}

export function ProgressTab({ skillLevels, onStartSimulation }: ProgressTabProps) {
  const { user } = useAuth();
  const { 
    nodes, 
    fetchLearningNodes,
    nodeProgress,
    fetchUserNodeProgress
  } = useLearningNodes();
  
  // Cargar datos de nodos y progreso al iniciar
  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await fetchLearningNodes(1); // Competencia lectora por defecto
        await fetchUserNodeProgress(user.id);
      }
    };
    
    loadData();
  }, [user?.id, fetchLearningNodes, fetchUserNodeProgress]);

  return (
    <div className="space-y-6">
      <ProgressView skillLevels={skillLevels} onStartSimulation={onStartSimulation} />
      
      {/* Nuevo componente de visualización de habilidades y nodos */}
      <SkillNodeConnection 
        skillLevels={skillLevels as any} 
        nodes={nodes}
        nodeProgress={nodeProgress}
        className="mt-8"
      />
    </div>
  );
}
