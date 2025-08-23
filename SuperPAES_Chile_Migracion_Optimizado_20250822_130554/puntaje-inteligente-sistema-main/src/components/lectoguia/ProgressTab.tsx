/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { ProgressView } from "./ProgressView";
import { useLectoGuia } from "../../contexts/LectoGuiaContext";

interface ProgressTabProps {
  onNodeSelect: (nodeId: string) => Promise<boolean>; 
}

export const ProgressTab: FC<ProgressTabProps> = ({ onNodeSelect }) => {
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

