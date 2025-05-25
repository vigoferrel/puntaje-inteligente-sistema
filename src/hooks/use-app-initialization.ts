
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { usePAESData } from '@/hooks/use-paes-data';
import { useLearningPlans } from '@/hooks/learning-plans';
import { ensureLearningNodesExist } from '@/services/learning/initialize-learning-service';

export const useAppInitialization = () => {
  const { profile } = useAuth();
  const { setInitializationFlag, hasInitialized, isInitializing } = useUnifiedApp();
  const [error, setError] = useState<string | null>(null);
  const initializationInProgress = useRef(false);
  const lastUserId = useRef<string | null>(null);

  // Guard: Solo inicializar una vez por usuario
  const shouldInitialize = useCallback(() => {
    if (!profile?.id) return false;
    if (initializationInProgress.current) return false;
    if (hasInitialized && lastUserId.current === profile.id) return false;
    return true;
  }, [profile?.id, hasInitialized]);

  const initializeApp = useCallback(async () => {
    if (!shouldInitialize()) {
      console.log('🛑 Initialization blocked by guard');
      return;
    }

    console.log('🚀 Starting app initialization...');
    initializationInProgress.current = true;
    lastUserId.current = profile!.id;
    setError(null);

    try {
      // Asegurar que los nodos de aprendizaje existen
      await ensureLearningNodesExist();
      setInitializationFlag('learningNodes', true);

      // Marcar autenticación como lista
      setInitializationFlag('auth', true);

      console.log('✅ App initialization completed');
    } catch (err) {
      console.error('❌ App initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Error de inicialización');
    } finally {
      initializationInProgress.current = false;
    }
  }, [shouldInitialize, profile, setInitializationFlag]);

  // Effect con debounce para evitar múltiples ejecuciones
  useEffect(() => {
    if (!profile?.id) return;

    const timeoutId = setTimeout(() => {
      initializeApp();
    }, 100); // Debounce de 100ms

    return () => clearTimeout(timeoutId);
  }, [profile?.id, initializeApp]);

  // Cleanup cuando el usuario cambia
  useEffect(() => {
    if (lastUserId.current && lastUserId.current !== profile?.id) {
      initializationInProgress.current = false;
      lastUserId.current = null;
    }
  }, [profile?.id]);

  return {
    isInitializing,
    hasInitialized,
    error,
    retry: initializeApp
  };
};
