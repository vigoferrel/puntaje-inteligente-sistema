
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface GlobalEducationState {
  activeModule: 'lectoguia' | 'superpaes' | null;
  sharedData: Record<string, any>;
  isSystemHealthy: boolean;
}

interface GlobalEducationContextType {
  state: GlobalEducationState;
  setActiveModule: (module: 'lectoguia' | 'superpaes' | null) => void;
  updateSharedData: (key: string, value: any) => void;
  getSharedData: (key: string) => any;
}

const GlobalEducationContext = createContext<GlobalEducationContextType | undefined>(undefined);

export const useGlobalEducation = () => {
  const context = useContext(GlobalEducationContext);
  if (!context) {
    throw new Error('useGlobalEducation must be used within a GlobalEducationProvider');
  }
  return context;
};

export const GlobalEducationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<GlobalEducationState>({
    activeModule: null,
    sharedData: {},
    isSystemHealthy: true
  });

  const setActiveModule = (module: 'lectoguia' | 'superpaes' | null) => {
    setState(prev => ({ ...prev, activeModule: module }));
  };

  const updateSharedData = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      sharedData: { ...prev.sharedData, [key]: value }
    }));
  };

  const getSharedData = (key: string) => {
    return state.sharedData[key];
  };

  // Monitor system health
  useEffect(() => {
    const interval = setInterval(() => {
      // Basic health check
      const isHealthy = user !== null && typeof window !== 'undefined';
      setState(prev => ({ ...prev, isSystemHealthy: isHealthy }));
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  return (
    <GlobalEducationContext.Provider value={{
      state,
      setActiveModule,
      updateSharedData,
      getSharedData
    }}>
      {children}
    </GlobalEducationContext.Provider>
  );
};
