
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Sistema anti-bucles simplificado y optimizado v3.0
let globalInitializationState = {
  isInitializing: false,
  hasInitialized: false,
  lastInitAttempt: 0,
  initializationLock: false
};

export const useUnifiedInitialization = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);
  const mountedRef = useRef(true);

  const initialize = useCallback(async () => {
    const now = Date.now();
    
    // Validaciones críticas simplificadas
    if (!profile?.id || 
        globalInitializationState.hasInitialized || 
        globalInitializationState.isInitializing || 
        initRef.current ||
        (now - globalInitializationState.lastInitAttempt < 10000)) { // 10 segundos mínimo
      return;
    }

    // Bloqueo simple
    globalInitializationState.isInitializing = true;
    globalInitializationState.lastInitAttempt = now;
    initRef.current = true;
    
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      console.log('🚀 Inicialización neural simplificada v3.0');
      
      // Inicialización ultrarrápida
      await new Promise(resolve => setTimeout(resolve, 200));
      
      if (mountedRef.current) {
        globalInitializationState.hasInitialized = true;
        
        // Toast único y controlado
        setTimeout(() => {
          if (mountedRef.current && !error) {
            toast({
              title: "Sistema Neural Activado",
              description: "Plataforma PAES lista para usar",
            });
          }
        }, 500);
      }

    } catch (err) {
      console.error('❌ Error en inicialización:', err);
      if (mountedRef.current) {
        setError('Error al inicializar el sistema');
      }
      initRef.current = false;
      globalInitializationState.hasInitialized = false;
    } finally {
      globalInitializationState.isInitializing = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [profile?.id, error]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (profile?.id && 
        !globalInitializationState.hasInitialized && 
        !globalInitializationState.isInitializing) {
      // Inicialización inmediata
      const timer = setTimeout(initialize, 100);
      return () => clearTimeout(timer);
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [profile?.id, initialize]);

  // Reset al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (!mountedRef.current) {
        initRef.current = false;
      }
    };
  }, []);

  return {
    loading,
    error,
    hasInitialized: globalInitializationState.hasInitialized,
    retry: initialize
  };
};

// Función de cleanup simplificada
export const resetGlobalInitialization = () => {
  globalInitializationState = {
    isInitializing: false,
    hasInitialized: false,
    lastInitAttempt: 0,
    initializationLock: false
  };
  console.log('🔄 Estado de inicialización global reseteado');
};
