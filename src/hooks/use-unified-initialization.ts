
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Sistema anti-bucles mejorado
let isInitializing = false;
let hasInitialized = false;
let initPromise: Promise<void> | null = null;
let lastInitAttempt = 0;

export const useUnifiedInitialization = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);
  const mountedRef = useRef(true);

  const initialize = useCallback(async () => {
    const now = Date.now();
    
    // Prevenir múltiples inicializaciones muy seguidas
    if (!profile?.id || hasInitialized || isInitializing || initRef.current || (now - lastInitAttempt < 5000)) {
      return;
    }

    lastInitAttempt = now;
    initRef.current = true;
    isInitializing = true;
    
    if (mountedRef.current) {
      setLoading(true);
      setError(null);
    }

    try {
      console.log('🚀 Inicialización unificada OPTIMIZADA');
      
      // Simulación de carga más rápida
      await new Promise(resolve => setTimeout(resolve, 200));
      
      hasInitialized = true;
      
      // Solo mostrar toast si el componente sigue montado
      if (mountedRef.current) {
        toast({
          title: "Sistema Neural Activo",
          description: "Centro de comando operacional",
        });
      }

    } catch (err) {
      console.error('❌ Error en inicialización:', err);
      if (mountedRef.current) {
        setError('Error al inicializar el sistema neural');
      }
      initRef.current = false;
    } finally {
      isInitializing = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [profile?.id]);

  useEffect(() => {
    mountedRef.current = true;
    
    if (profile?.id && !hasInitialized && !isInitializing) {
      const timer = setTimeout(initialize, 50); // Inicialización más rápida
      return () => clearTimeout(timer);
    }
    
    return () => {
      mountedRef.current = false;
    };
  }, [profile?.id, initialize]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    loading,
    error,
    hasInitialized,
    retry: initialize
  };
};
