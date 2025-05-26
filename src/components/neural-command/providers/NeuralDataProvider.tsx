
import React, { createContext, useContext, ReactNode } from 'react';
import { useOptimizedRealNeuralMetrics } from '@/hooks/useOptimizedRealNeuralMetrics';
import { useAuth } from '@/contexts/AuthContext';

interface NeuralDataContextType {
  metrics: any;
  isLoading: boolean;
  error: string | null;
  user: any;
  getMetricForDimension: (dimensionId: string) => number;
}

const NeuralDataContext = createContext<NeuralDataContextType | undefined>(undefined);

interface NeuralDataProviderProps {
  children: ReactNode;
}

export const NeuralDataProvider: React.FC<NeuralDataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { metrics, isLoading, error, getMetricForDimension } = useOptimizedRealNeuralMetrics();

  const value = {
    metrics,
    isLoading,
    error,
    user,
    getMetricForDimension
  };

  return (
    <NeuralDataContext.Provider value={value}>
      {children}
    </NeuralDataContext.Provider>
  );
};

export const useNeuralData = () => {
  const context = useContext(NeuralDataContext);
  if (context === undefined) {
    throw new Error('useNeuralData must be used within a NeuralDataProvider');
  }
  return context;
};
