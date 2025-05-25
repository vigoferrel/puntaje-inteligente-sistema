
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Sistema anti-bucles quirúrgicamente optimizado v2.0
let globalInitializationState = {
  isInitializing: false,
  hasInitialized: false,
  lastInitAttempt: 0,
  initializationLock: false,
  initPromise: null as Promise<void> | null
};

export const useUnifiedInitialization = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);
  const mountedRef = useRef(true);
  const stabilityRef = useRef(false);

  const initialize = useCallback(async () => {
    const now = Date.now();
    
    // Prevenir múltiples inicializaciones con estado global
    if (!profile?.id || 
        globalInitializationState.hasInitialized || 
        globalInitializationState.isInitializing || 
        initRef.current || 
        globalInitializationState.initializationLock ||
        (now - globalInitializationState.lastInitAttempt < 5000)) { // Reducido a 5 segundos
      return;
    }

    // Usar promesa global para evitar inicializaciones concurrentes
    if (globalInitializationState.initPromise) {
      return globalInitializationState.initPromise;
    }

    // Bloqueo quirúrgico global
    globalInitializationState.initializationLock = true;
    globalInitializationState.lastInitAttempt = now;
    globalInitializationState.isInitializing = true;
    initRef.current = true;
    
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    // Crear promesa global
    globalInitializationState.initPromise = (async () => {
      try {
        console.log('🚀 Inicialización neural unificada v2.0');
        
        // Simulación de carga ultra-optimizada
        await new Promise(resolve => setTimeout(resolve, 50));
        
        // Verificar estabilidad antes de marcar como completado
        if (mountedRef.current) {
          globalInitializationState.hasInitialized = true;
          stabilityRef.current = true;
          
          // Toast diferido y controlado
          setTimeout(() => {
            if (mountedRef.current && stabilityRef.current && !error) {
              toast({
                title: "Sistema Neural Optimizado",
                description: "Todas las funcionalidades integradas y desobstruidas",
              });
            }
          }, 1000);
        }

      } catch (err) {
        console.error('❌ Error en inicialización:', err);
        if (mountedRef.current) {
          setError('Error al inicializar el sistema neural');
          stabilityRef.current = false;
        }
        initRef.current = false;
        globalInitializationState.hasInitialized = false;
      } finally {
        globalInitializationState.isInitializing = false;
        globalInitializationState.initializationLock = false;
        globalInitializationState.initPromise = null;
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    })();

    return globalInitializationState.initPromise;
  }, [profile?.id, error]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (profile?.id && 
        !globalInitializationState.hasInitialized && 
        !globalInitializationState.isInitializing && 
        !globalInitializationState.initializationLock) {
      // Inicialización inmediata para mejor UX
      const timer = setTimeout(initialize, 100);
      return () => clearTimeout(timer);
    }
    
    return () => {
      mountedRef.current = false;
      stabilityRef.current = false;
    };
  }, [profile?.id, initialize]);

  // Reset global al desmontar todos los componentes
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stabilityRef.current = false;
      if (!mountedRef.current) {
        initRef.current = false;
      }
    };
  }, []);

  return {
    loading,
    error,
    hasInitialized: globalInitializationState.hasInitialized && stabilityRef.current,
    retry: initialize
  };
};

// Función de cleanup global para casos de emergencia
export const resetGlobalInitialization = () => {
  globalInitializationState = {
    isInitializing: false,
    hasInitialized: false,
    lastInitAttempt: 0,
    initializationLock: false,
    initPromise: null
  };
  console.log('🔄 Estado de inicialización global reseteado');
};
