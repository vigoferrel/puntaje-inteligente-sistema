
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook de inicialización simplificado - Sin bucles, sin conflictos
 */
export const useSimpleInitialization = () => {
  const { user, profile } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // Esperar a que el auth esté listo
        if (user && profile && mounted) {
          setIsReady(true);
          console.log('✅ Sistema inicializado correctamente');
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error de inicialización');
          console.error('❌ Error en inicialización:', err);
        }
      }
    };

    // Solo inicializar si tenemos usuario
    if (user && profile) {
      initialize();
    } else if (!user) {
      // Si no hay usuario, marcar como listo para mostrar login
      setIsReady(true);
    }

    return () => {
      mounted = false;
    };
  }, [user?.id, profile?.id]); // Dependencias específicas y estables

  return {
    isReady,
    error,
    hasUser: !!user
  };
};
