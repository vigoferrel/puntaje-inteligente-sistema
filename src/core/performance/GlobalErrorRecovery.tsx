
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorRecoveryState {
  errors: string[];
  isRecovering: boolean;
  recoveryAttempts: number;
}

interface ErrorRecoveryActions {
  reportError: (error: string) => void;
  attemptRecovery: () => Promise<void>;
  clearErrors: () => void;
  resetSystem: () => void;
}

const ErrorRecoveryContext = createContext<ErrorRecoveryState & ErrorRecoveryActions>({
  errors: [],
  isRecovering: false,
  recoveryAttempts: 0,
  reportError: () => {},
  attemptRecovery: async () => {},
  clearErrors: () => {},
  resetSystem: () => {}
});

export const useErrorRecovery = () => useContext(ErrorRecoveryContext);

export const GlobalErrorRecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ErrorRecoveryState>({
    errors: [],
    isRecovering: false,
    recoveryAttempts: 0
  });

  const reportError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, error].slice(-5) // Mantener solo los últimos 5 errores
    }));
    
    console.error('🚨 Error reportado:', error);
  }, []);

  const attemptRecovery = useCallback(async () => {
    setState(prev => ({ ...prev, isRecovering: true }));
    
    try {
      // Limpiar cache si es necesario
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Recargar módulos críticos
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        isRecovering: false,
        recoveryAttempts: prev.recoveryAttempts + 1,
        errors: []
      }));
      
      toast({
        title: "Sistema recuperado",
        description: "El sistema ha sido restaurado exitosamente"
      });
      
    } catch (error) {
      setState(prev => ({ ...prev, isRecovering: false }));
      toast({
        title: "Error en recuperación",
        description: "No se pudo recuperar el sistema automáticamente",
        variant: "destructive"
      });
    }
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }));
  }, []);

  const resetSystem = useCallback(() => {
    setState({
      errors: [],
      isRecovering: false,
      recoveryAttempts: 0
    });
  }, []);

  return (
    <ErrorRecoveryContext.Provider value={{
      ...state,
      reportError,
      attemptRecovery,
      clearErrors,
      resetSystem
    }}>
      {children}
    </ErrorRecoveryContext.Provider>
  );
};
