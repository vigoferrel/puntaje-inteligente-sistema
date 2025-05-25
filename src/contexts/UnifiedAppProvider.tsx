
import React, { createContext, useContext, ReactNode, useState, useCallback, useRef } from 'react';
import { AuthProvider } from './AuthContext';
import { LearningPlanProvider } from './learning-plan';
import { PAESProvider } from './PAESContext';

interface UnifiedAppContextType {
  isInitializing: boolean;
  hasInitialized: boolean;
  initializationFlags: Record<string, boolean>;
  setInitializationFlag: (key: string, value: boolean) => void;
  resetInitialization: () => void;
}

const UnifiedAppContext = createContext<UnifiedAppContextType | undefined>(undefined);

export const useUnifiedApp = () => {
  const context = useContext(UnifiedAppContext);
  if (!context) {
    throw new Error('useUnifiedApp must be used within UnifiedAppProvider');
  }
  return context;
};

export const UnifiedAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [initializationFlags, setInitializationFlags] = useState<Record<string, boolean>>({});
  const initRef = useRef(false);

  const setInitializationFlag = useCallback((key: string, value: boolean) => {
    setInitializationFlags(prev => {
      const updated = { ...prev, [key]: value };
      
      // Check if all critical flags are true
      const criticalFlags = ['auth', 'learningPlans', 'paesData'];
      const allCriticalReady = criticalFlags.every(flag => updated[flag] === true);
      
      if (allCriticalReady && !initRef.current) {
        initRef.current = true;
        setHasInitialized(true);
        setIsInitializing(false);
        console.log('✅ App fully initialized');
      }
      
      return updated;
    });
  }, []);

  const resetInitialization = useCallback(() => {
    initRef.current = false;
    setHasInitialized(false);
    setIsInitializing(true);
    setInitializationFlags({});
    console.log('🔄 App initialization reset');
  }, []);

  const contextValue = {
    isInitializing,
    hasInitialized,
    initializationFlags,
    setInitializationFlag,
    resetInitialization
  };

  return (
    <UnifiedAppContext.Provider value={contextValue}>
      <AuthProvider>
        <LearningPlanProvider>
          <PAESProvider>
            {children}
          </PAESProvider>
        </LearningPlanProvider>
      </AuthProvider>
    </UnifiedAppContext.Provider>
  );
};
