import React from "react";
import { ProgressView } from "./ProgressView";
import { TLearningNode } from "@/types/system-types";

interface ProgressTabProps {
  onNodeSelect: (nodeId: string) => Promise<boolean>; 
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ onNodeSelect }) => {
  const handleNodeClick = async (nodeId: string) => {
    return await onNodeSelect(nodeId);
  };
  
  const handleStartSimulation = () => {
    // Redireccionar a la página de simulaciones
    window.location.href = "/simulaciones";
  };

  return (
    <div className="h-full">
      <ProgressView 
        onNodeSelect={handleNodeClick} 
        onStartSimulation={handleStartSimulation}
      />
    </div>
  );
};
