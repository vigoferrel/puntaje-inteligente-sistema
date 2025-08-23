/* eslint-disable react-refresh/only-export-components */
import React from 'react';

interface CinematicInterfaceMasterProps {
  children: React.ReactNode;
  currentModule: string;
  userProgress: {
    totalNodes: number;
    completedNodes: number;
    neuralCoherence: number;
    learningVelocity: number;
    engagementScore: number;
  };
  onModuleChange: (module: string) => void;
}

export const CinematicInterfaceMaster: React.FC<CinematicInterfaceMasterProps> = ({
  children
}) => {
  // Componente simplificado - sin animaciones problemáticas
  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};

