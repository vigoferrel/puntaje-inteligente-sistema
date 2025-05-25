
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
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

  const setInitializationFlag = useCallback((key: string, value: boolean) => {
    setInitializationFlags(prev => {
      const updated = { ...prev, [key]: value };
      
      // Condiciones más estrictas para inicialización con sistema de 277 nodos
      const hasAuth = updated['auth'] === true;
      const hasNodeValidation = updated['nodeValidation'] === true;
      const hasLearningNodes = updated['learningNodes'] === true;
      const hasEmergency = updated['emergency'] === true;
      const hasAnyData = updated['learningPlans'] || updated['paesData'];
      
      // Permitir inicialización si tenemos:
      // 1. Auth + NodeValidation + LearningNodes + AnyData (modo normal completo)
      // 2. Auth + Emergency (modo emergencia)
      if (hasAuth && hasNodeValidation && hasLearningNodes && hasAnyData) {
        setHasInitialized(true);
        setIsInitializing(false);
        console.log('✅ App inicializada (modo normal completo con 277 nodos)');
      } else if (hasAuth && hasEmergency) {
        setHasInitialized(true);
        setIsInitializing(false);
        console.log('✅ App inicializada (modo emergencia)');
      }
      
      return updated;
    });
  }, []);

  const resetInitialization = useCallback(() => {
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
