
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface ErrorRecoveryState {
  errors: string[];
  isRecovering: boolean;
  recoveryAttempts: number;
  emergencyMode: boolean;
  systemStability: 'stable' | 'degraded' | 'critical';
}

interface ErrorRecoveryActions {
  reportError: (error: string) => void;
  attemptRecovery: () => Promise<void>;
  clearErrors: () => void;
  resetSystem: () => void;
  enterEmergencyMode: () => void;
  exitEmergencyMode: () => void;
}

const ErrorRecoveryContext = createContext<ErrorRecoveryState & ErrorRecoveryActions>({
  errors: [],
  isRecovering: false,
  recoveryAttempts: 0,
  emergencyMode: false,
  systemStability: 'stable',
  reportError: () => {},
  attemptRecovery: async () => {},
  clearErrors: () => {},
  resetSystem: () => {},
  enterEmergencyMode: () => {},
  exitEmergencyMode: () => {}
});

export const useErrorRecovery = () => useContext(ErrorRecoveryContext);

export const GlobalErrorRecoveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ErrorRecoveryState>({
    errors: [],
    isRecovering: false,
    recoveryAttempts: 0,
    emergencyMode: false,
    systemStability: 'stable'
  });

  // Monitoreo automático de estabilidad
  useEffect(() => {
    const stabilityInterval = setInterval(() => {
      setState(prev => {
        let newStability: ErrorRecoveryState['systemStability'] = 'stable';
        
        if (prev.errors.length > 5) {
          newStability = 'critical';
        } else if (prev.errors.length > 2) {
          newStability = 'degraded';
        }

        // Auto-activar modo de emergencia si es crítico
        if (newStability === 'critical' && !prev.emergencyMode) {
          setTimeout(() => enterEmergencyMode(), 1000);
        }

        return { ...prev, systemStability: newStability };
      });
    }, 10000); // Cada 10 segundos

    return () => clearInterval(stabilityInterval);
  }, []);

  const reportError = useCallback((error: string) => {
    setState(prev => {
      const newErrors = [...prev.errors, error].slice(-10); // Mantener solo los últimos 10
      
      // Auto-recovery si hay demasiados errores
      if (newErrors.length >= 8 && !prev.isRecovering) {
        setTimeout(() => attemptRecovery(), 2000);
      }
      
      return { ...prev, errors: newErrors };
    });
    
    console.error('🚨 Error reportado al sistema de recuperación:', error);
  }, []);

  const attemptRecovery = useCallback(async () => {
    setState(prev => ({ ...prev, isRecovering: true }));
    
    try {
      // Limpiar cache del navegador
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Resetear estado local
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('neural-') || key.startsWith('intersectional-')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // Esperar estabilización
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setState(prev => ({
        ...prev,
        isRecovering: false,
        recoveryAttempts: prev.recoveryAttempts + 1,
        errors: [],
        systemStability: 'stable'
      }));
      
      toast({
        title: "Sistema neurológico recuperado",
        description: "El sistema ha sido restaurado y estabilizado"
      });
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isRecovering: false,
        emergencyMode: true
      }));
      
      toast({
        title: "Modo de emergencia activado",
        description: "Sistema funcionando con capacidades limitadas",
        variant: "destructive"
      });
    }
  }, []);

  const clearErrors = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      errors: [],
      systemStability: 'stable'
    }));
  }, []);

  const resetSystem = useCallback(() => {
    setState({
      errors: [],
      isRecovering: false,
      recoveryAttempts: 0,
      emergencyMode: false,
      systemStability: 'stable'
    });
    
    console.log('🔄 Sistema de recuperación reiniciado completamente');
  }, []);

  const enterEmergencyMode = useCallback(() => {
    setState(prev => ({ ...prev, emergencyMode: true }));
    
    toast({
      title: "Modo de emergencia",
      description: "Sistema neurológico funcionando en modo seguro",
      variant: "destructive"
    });
    
    console.log('🚨 MODO DE EMERGENCIA ACTIVADO');
  }, []);

  const exitEmergencyMode = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      emergencyMode: false,
      errors: [],
      systemStability: 'stable'
    }));
    
    toast({
      title: "Sistema restaurado",
      description: "Modo de emergencia desactivado"
    });
    
    console.log('✅ MODO DE EMERGENCIA DESACTIVADO');
  }, []);

  return (
    <ErrorRecoveryContext.Provider value={{
      ...state,
      reportError,
      attemptRecovery,
      clearErrors,
      resetSystem,
      enterEmergencyMode,
      exitEmergencyMode
    }}>
      {children}
    </ErrorRecoveryContext.Provider>
  );
};
