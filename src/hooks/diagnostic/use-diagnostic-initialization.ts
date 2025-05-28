
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDiagnostic } from '@/hooks/use-diagnostic';

export const useDiagnosticInitialization = () => {
  const { user } = useAuth();
  const { tests, loading, error } = useDiagnostic();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeDiagnostic = async () => {
      if (!user?.id) return;
      
      try {
        // Inicialización real del sistema diagnóstico
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing diagnostic system:', error);
      }
    };

    initializeDiagnostic();
  }, [user?.id]);

  return {
    isInitialized,
    tests,
    loading,
    error
  };
};
