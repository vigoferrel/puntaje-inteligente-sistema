
import React, { createContext, useContext, ReactNode } from 'react';
import { usePAESUnifiedDashboardOptimized } from '@/hooks/use-paes-unified-dashboard-optimized';

interface PAESContextType {
  loading: boolean;
  testPerformances: any[];
  unifiedMetrics: any;
  comparativeAnalysis: any;
  availableTests: any[];
  refreshData: () => void;
  simulateScenario: (improvements: Record<string, number>) => number;
}

const PAESContext = createContext<PAESContextType | undefined>(undefined);

export const PAESProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const paesData = usePAESUnifiedDashboardOptimized();

  return (
    <PAESContext.Provider value={paesData}>
      {children}
    </PAESContext.Provider>
  );
};

export const usePAESContext = () => {
  const context = useContext(PAESContext);
  if (context === undefined) {
    throw new Error('usePAESContext must be used within a PAESProvider');
  }
  return context;
};
