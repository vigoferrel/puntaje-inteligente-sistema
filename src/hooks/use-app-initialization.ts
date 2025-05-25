
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { useLearningPlans } from '@/hooks/learning-plans';
import { usePAESData } from '@/hooks/use-paes-data';
import { ensureLearningNodesExist } from '@/services/learning/initialize-learning-service';
import { CircuitBreaker } from '@/utils/circuit-breaker';

// Circuit breaker para prevenir múltiples inicializaciones
const initCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 60000, // 1 minuto
  onOpen: () => console.log('🚫 Circuit breaker opened - preventing initialization'),
  onClose: () => console.log('✅ Circuit breaker closed - allowing initialization')
});

export const useAppInitialization = () => {
  const { profile } = useAuth();
  const { setInitializationFlag, hasInitialized, isInitializing } = useUnifiedApp();
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'auth' | 'nodes' | 'plans' | 'paes' | 'complete'>('idle');
  
  const initializationInProgress = useRef(false);
  const lastUserId = useRef<string | null>(null);
  const initStartTime = useRef<number | null>(null);

  // Hooks que necesitamos para la inicialización
  const { fetchLearningPlans } = useLearningPlans();
  const { refreshData: refreshPAESData } = usePAESData();

  // Guard: Solo inicializar una vez por usuario
  const shouldInitialize = useCallback(() => {
    if (!profile?.id) return false;
    if (initCircuitBreaker.isOpen()) return false;
    if (initializationInProgress.current) return false;
    if (hasInitialized && lastUserId.current === profile.id) return false;
    return true;
  }, [profile?.id, hasInitialized]);

  const initializeApp = useCallback(async () => {
    if (!shouldInitialize()) {
      console.log('🛑 Initialization blocked by guard');
      return;
    }

    console.log('🚀 Starting unified app initialization...');
    initializationInProgress.current = true;
    lastUserId.current = profile!.id;
    initStartTime.current = Date.now();
    setError(null);

    try {
      // Fase 1: Autenticación
      setPhase('auth');
      setInitializationFlag('auth', true);
      console.log('✅ Phase 1: Auth completed');

      // Fase 2: Nodos de aprendizaje
      setPhase('nodes');
      await ensureLearningNodesExist();
      setInitializationFlag('learningNodes', true);
      console.log('✅ Phase 2: Learning nodes completed');

      // Fase 3: Planes de aprendizaje (en paralelo con PAES)
      setPhase('plans');
      const plansPromise = fetchLearningPlans(profile!.id);
      
      // Fase 4: Datos PAES (en paralelo con planes)
      setPhase('paes');
      const paesPromise = refreshPAESData();

      // Esperar a que ambos terminen
      await Promise.all([plansPromise, paesPromise]);
      
      setInitializationFlag('learningPlans', true);
      setInitializationFlag('paesData', true);
      
      setPhase('complete');
      
      const totalTime = Date.now() - initStartTime.current!;
      console.log(`✅ App initialization completed in ${totalTime}ms`);
      
      // Registro de éxito en circuit breaker
      initCircuitBreaker.success();

    } catch (err) {
      console.error('❌ App initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Error de inicialización');
      
      // Registro de fallo en circuit breaker
      initCircuitBreaker.failure();
      
      // Reset de flags en caso de error
      setInitializationFlag('auth', false);
      setInitializationFlag('learningNodes', false);
      setInitializationFlag('learningPlans', false);
      setInitializationFlag('paesData', false);
      
    } finally {
      initializationInProgress.current = false;
      initStartTime.current = null;
    }
  }, [shouldInitialize, profile, setInitializationFlag, fetchLearningPlans, refreshPAESData]);

  // Effect con debounce mejorado
  useEffect(() => {
    if (!profile?.id) return;

    // Reset cuando el usuario cambia
    if (lastUserId.current && lastUserId.current !== profile.id) {
      initializationInProgress.current = false;
      lastUserId.current = null;
      setPhase('idle');
    }

    const timeoutId = setTimeout(() => {
      initializeApp();
    }, 150); // Debounce más conservador

    return () => clearTimeout(timeoutId);
  }, [profile?.id, initializeApp]);

  // Cleanup cuando el usuario cambia
  useEffect(() => {
    if (lastUserId.current && lastUserId.current !== profile?.id) {
      initializationInProgress.current = false;
      lastUserId.current = null;
      setError(null);
      setPhase('idle');
    }
  }, [profile?.id]);

  return {
    isInitializing,
    hasInitialized,
    error,
    phase,
    retry: initializeApp,
    circuitBreakerState: initCircuitBreaker.getState()
  };
};
