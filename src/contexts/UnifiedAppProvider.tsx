
import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { AuthProvider } from './AuthContext';
import { LearningPlanProvider } from './learning-plan';
import { PAESProvider } from './PAESContext';
import { ThemeProvider } from './ThemeContext';

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
  const [isInitializing, setIsInitializing] = useState(false); // Cambio: empezar como false
  const [hasInitialized, setHasInitialized] = useState(true); // Cambio: empezar como true
  const [initializationFlags, setInitializationFlags] = useState<Record<string, boolean>>({
    auth: true,
    nodeValidation: true,
    learningNodes: true,
    emergency: true,
    learningPlans: true,
    paesData: true
  });

  const setInitializationFlag = useCallback((key: string, value: boolean) => {
    setInitializationFlags(prev => {
      const updated = { ...prev, [key]: value };
      
      // Sistema simplificado - siempre permitir acceso completo
      if (updated['auth'] && updated['emergency']) {
        setHasInitialized(true);
        setIsInitializing(false);
        console.log('✅ App inicializada (modo completo)');
      }
      
      return updated;
    });
  }, []);

  const resetInitialization = useCallback(() => {
    setHasInitialized(true); // Mantener siempre inicializado
    setIsInitializing(false);
    setInitializationFlags({
      auth: true,
      nodeValidation: true,
      learningNodes: true,
      emergency: true,
      learningPlans: true,
      paesData: true
    });
    console.log('🔄 App reset - manteniendo acceso completo');
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
      <ThemeProvider>
        <AuthProvider>
          <LearningPlanProvider>
            <PAESProvider>
              {children}
            </PAESProvider>
          </LearningPlanProvider>
        </AuthProvider>
      </ThemeProvider>
    </UnifiedAppContext.Provider>
  );
};
