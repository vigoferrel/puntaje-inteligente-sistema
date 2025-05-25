
import React, { createContext, useContext, useMemo } from 'react';
import { useNodesEnhanced } from '@/contexts/lectoguia/useNodesEnhanced';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedLectoGuiaContextType {
  nodes: any[];
  nodeProgress: any;
  loading: boolean;
  error: string | null;
  validationStatus: any;
  selectedTestId: number | null;
  selectedPrueba: any;
  handlePruebaChange: (prueba: any) => void;
  updateNodeProgress: (nodeId: string, status: any, progress: number) => void;
  refreshNodes: () => void;
  getFilteredNodes: () => any[];
}

const OptimizedLectoGuiaContext = createContext<OptimizedLectoGuiaContextType | undefined>(undefined);

export const OptimizedLectoGuiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const nodeData = useNodesEnhanced(user?.id);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => nodeData, [
    nodeData.nodes.length,
    nodeData.loading,
    nodeData.error,
    nodeData.selectedTestId,
    nodeData.selectedPrueba,
    nodeData.validationStatus.issuesCount
  ]);
  
  return (
    <OptimizedLectoGuiaContext.Provider value={contextValue}>
      {children}
    </OptimizedLectoGuiaContext.Provider>
  );
};

export const useOptimizedLectoGuia = () => {
  const context = useContext(OptimizedLectoGuiaContext);
  if (context === undefined) {
    throw new Error('useOptimizedLectoGuia must be used within an OptimizedLectoGuiaProvider');
  }
  return context;
};
