
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface StableInitializationState {
  isReady: boolean;
  error: string | null;
  hasUser: boolean;
}

/**
 * Hook de inicialización estable - Sin bucles, dependencias fijas
 */
export const useStableInitialization = (): StableInitializationState => {
  const { user, profile, isLoading } = useAuth();
  const [state, setState] = useState<StableInitializationState>({
    isReady: false,
    error: null,
    hasUser: false
  });
  
  const timeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  useEffect(() => {
    // Limpiar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Si aún está cargando, esperar
    if (isLoading) {
      return;
    }

    // Timeout de seguridad para evitar bucles infinitos
    timeoutRef.current = setTimeout(() => {
      if (!mountedRef.current) return;

      try {
        const hasValidUser = !!user?.id;
        const hasValidProfile = !!profile?.id;
        
        setState({
          isReady: true,
          error: null,
          hasUser: hasValidUser && hasValidProfile
        });

        console.log('✅ Inicialización estable completada:', {
          hasUser: hasValidUser,
          hasProfile: hasValidProfile
        });
        
      } catch (err) {
        console.error('❌ Error en inicialización estable:', err);
        setState({
          isReady: true,
          error: err instanceof Error ? err.message : 'Error desconocido',
          hasUser: false
        });
      }
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isLoading, user?.id, profile?.id]); // Dependencias fijas y estables

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return state;
};
