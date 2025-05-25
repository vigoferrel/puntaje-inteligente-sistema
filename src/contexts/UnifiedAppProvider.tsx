
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

interface UnifiedAppContextType {
  isInitializing: boolean;
  hasInitialized: boolean;
  setInitializationFlag: (flag: string, value: boolean) => void;
}

const UnifiedAppContext = createContext<UnifiedAppContextType>({
  isInitializing: false,
  hasInitialized: true,
  setInitializationFlag: () => {}
});

export const useUnifiedApp = () => {
  const context = useContext(UnifiedAppContext);
  return context;
};

export const UnifiedAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  const setInitializationFlag = (flag: string, value: boolean) => {
    setFlags(prev => ({ ...prev, [flag]: value }));
  };

  // Contexto que incluye las funciones necesarias
  const contextValue = {
    isInitializing: false,
    hasInitialized: true,
    setInitializationFlag
  };

  return (
    <UnifiedAppContext.Provider value={contextValue}>
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </UnifiedAppContext.Provider>
  );
};
