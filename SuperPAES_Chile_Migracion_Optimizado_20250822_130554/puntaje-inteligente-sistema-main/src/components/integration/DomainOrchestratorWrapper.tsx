import React, { useContext } from 'react';
import { DomainOrchestrator } from '../../divisions/procedure/DomainOrchestrator';
import { NeuralAnalysisService } from '../../divisions/procedure/services/NeuralAnalysisService';
import { GamificationEngineService } from '../../divisions/procedure/services/GamificationEngineService';
import { PAESExerciseService } from '../../divisions/procedure/services/PAESExerciseService';

// Crear instancia singleton del orchestrator
const neuralService = new NeuralAnalysisService();
const gamificationService = new GamificationEngineService();
const exerciseService = new PAESExerciseService();
const orchestrator = new DomainOrchestrator(neuralService, gamificationService, exerciseService);

export const OrchestratorContext = React.createContext(orchestrator);

export const useDomainOrchestrator = () => useContext(OrchestratorContext);

export const OrchestratorProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <OrchestratorContext.Provider value={orchestrator}>
      {children}
    </OrchestratorContext.Provider>
  );
};