
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

// Singleton para evitar múltiples inicializaciones
let isInitializing = false;
let hasInitialized = false;
let initPromise: Promise<void> | null = null;

export const useUnifiedInitialization = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  const initialize = useCallback(async () => {
    if (!profile?.id || hasInitialized || isInitializing || initRef.current) {
      return;
    }

    // Prevenir múltiples ejecuciones
    initRef.current = true;
    isInitializing = true;
    setLoading(true);
    setError(null);

    try {
      console.log('🎯 Inicialización unificada única');
      
      // Simulación simplificada de carga
      await new Promise(resolve => setTimeout(resolve, 500));
      
      hasInitialized = true;
      
      toast({
        title: "Sistema Listo",
        description: "Aplicación inicializada correctamente",
      });

    } catch (err) {
      console.error('❌ Error en inicialización:', err);
      setError('Error al inicializar el sistema');
      initRef.current = false;
    } finally {
      isInitializing = false;
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id && !hasInitialized && !isInitializing) {
      const timer = setTimeout(initialize, 100);
      return () => clearTimeout(timer);
    }
  }, [profile?.id, initialize]);

  return {
    loading,
    error,
    hasInitialized,
    retry: initialize
  };
};
