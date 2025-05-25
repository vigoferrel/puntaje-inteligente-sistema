
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

interface UnifiedAppContextType {
  isInitializing: boolean;
  hasInitialized: boolean;
}

const UnifiedAppContext = createContext<UnifiedAppContextType>({
  isInitializing: false,
  hasInitialized: true
});

export const useUnifiedApp = () => {
  const context = useContext(UnifiedAppContext);
  return context;
};

export const UnifiedAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Contexto simplificado que siempre está "inicializado"
  const contextValue = {
    isInitializing: false,
    hasInitialized: true
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
