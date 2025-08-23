
import React from "react";
import { ProgressView } from "./ProgressView";
import { useLectoGuia } from "@/contexts/LectoGuiaContext";

interface ProgressTabProps {
  onNodeSelect: (nodeId: string) => Promise<boolean>; 
}

export const ProgressTab: React.FC<ProgressTabProps> = ({ onNodeSelect }) => {
  const { skillLevels, handleStartSimulation } = useLectoGuia();
  
  const handleNodeClick = async (nodeId: string) => {
    return await onNodeSelect(nodeId);
  };

  return (
    <div className="h-full">
      <ProgressView 
        skillLevels={skillLevels}
        onStartSimulation={handleStartSimulation}
      />
    </div>
  );
};
