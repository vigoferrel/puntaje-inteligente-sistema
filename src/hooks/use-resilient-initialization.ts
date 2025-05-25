
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { useLearningPlans } from '@/hooks/learning-plans';
import { usePAESData } from '@/hooks/use-paes-data';
import { ensureLearningNodesExist } from '@/services/learning/initialize-learning-service';

// Timeouts más agresivos para evitar bloqueos
const TIMEOUTS = {
  AUTH_TIMEOUT: 3000,        // 3 segundos
  NODES_TIMEOUT: 5000,       // 5 segundos  
  PLANS_TIMEOUT: 4000,       // 4 segundos
  PAES_TIMEOUT: 4000,        // 4 segundos
  TOTAL_TIMEOUT: 15000       // 15 segundos máximo total
};

interface InitializationState {
  phase: 'idle' | 'auth' | 'nodes' | 'plans' | 'paes' | 'complete' | 'emergency';
  error: string | null;
  emergencyMode: boolean;
  progress: number;
  completedSteps: string[];
  skippedSteps: string[];
}

export const useResilientInitialization = () => {
  const { profile } = useAuth();
  const { setInitializationFlag, hasInitialized } = useUnifiedApp();
  
  const [state, setState] = useState<InitializationState>({
    phase: 'idle',
    error: null,
    emergencyMode: false,
    progress: 0,
    completedSteps: [],
    skippedSteps: []
  });

  const initializationRef = useRef(false);
  const totalTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { fetchLearningPlans } = useLearningPlans();
  const { refreshData: refreshPAESData } = usePAESData();

  // Wrapper para ejecutar operaciones con timeout
  const withTimeout = useCallback(<T>(
    promise: Promise<T>, 
    timeoutMs: number, 
    operation: string
  ): Promise<T> => {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => 
        setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
      )
    ]);
  }, []);

  // Activar modo de emergencia
  const activateEmergencyMode = useCallback(() => {
    console.warn('🚨 Activando modo de emergencia');
    
    setState(prev => ({ 
      ...prev, 
      emergencyMode: true, 
      phase: 'emergency',
      progress: 100 
    }));

    // Marcar flags básicos para permitir uso mínimo
    setInitializationFlag('auth', true);
    setInitializationFlag('emergency', true);
    
    return true;
  }, [setInitializationFlag]);

  // Ejecutar paso de inicialización con manejo de errores
  const executeStep = useCallback(async (
    stepName: string,
    operation: () => Promise<void>,
    timeout: number,
    required: boolean = false
  ): Promise<boolean> => {
    try {
      console.log(`🔄 Ejecutando paso: ${stepName}`);
      
      await withTimeout(operation(), timeout, stepName);
      
      setState(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, stepName]
      }));
      
      console.log(`✅ Paso completado: ${stepName}`);
      return true;
      
    } catch (error) {
      console.warn(`⚠️ Paso falló: ${stepName}`, error);
      
      setState(prev => ({
        ...prev,
        skippedSteps: [...prev.skippedSteps, stepName]
      }));

      if (required) {
        throw error;
      }
      
      return false;
    }
  }, [withTimeout]);

  // Inicialización principal
  const initialize = useCallback(async () => {
    if (!profile?.id || initializationRef.current || hasInitialized) {
      return;
    }

    console.log('🚀 Iniciando inicialización resiliente');
    initializationRef.current = true;

    // Timeout total para prevenir bloqueos indefinidos
    totalTimeoutRef.current = setTimeout(() => {
      console.warn('⏰ Timeout total alcanzado, activando modo de emergencia');
      activateEmergencyMode();
    }, TIMEOUTS.TOTAL_TIMEOUT);

    try {
      // Paso 1: Auth (requerido)
      setState(prev => ({ ...prev, phase: 'auth', progress: 20 }));
      await executeStep(
        'auth',
        async () => {
          setInitializationFlag('auth', true);
        },
        TIMEOUTS.AUTH_TIMEOUT,
        true
      );

      // Paso 2: Nodos (opcional)
      setState(prev => ({ ...prev, phase: 'nodes', progress: 40 }));
      await executeStep(
        'nodes',
        async () => {
          await ensureLearningNodesExist();
          setInitializationFlag('learningNodes', true);
        },
        TIMEOUTS.NODES_TIMEOUT
      );

      // Paso 3: Planes (opcional)
      setState(prev => ({ ...prev, phase: 'plans', progress: 70 }));
      await executeStep(
        'plans',
        async () => {
          await fetchLearningPlans(profile.id);
          setInitializationFlag('learningPlans', true);
        },
        TIMEOUTS.PLANS_TIMEOUT
      );

      // Paso 4: PAES (opcional)
      setState(prev => ({ ...prev, phase: 'paes', progress: 90 }));
      await executeStep(
        'paes',
        async () => {
          await refreshPAESData();
          setInitializationFlag('paesData', true);
        },
        TIMEOUTS.PAES_TIMEOUT
      );

      // Completado
      setState(prev => ({ ...prev, phase: 'complete', progress: 100 }));
      console.log('✅ Inicialización completada exitosamente');

    } catch (error) {
      console.error('❌ Error en inicialización, activando modo de emergencia:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      }));
      activateEmergencyMode();
    } finally {
      if (totalTimeoutRef.current) {
        clearTimeout(totalTimeoutRef.current);
      }
      initializationRef.current = false;
    }
  }, [profile?.id, hasInitialized, executeStep, setInitializationFlag, fetchLearningPlans, refreshPAESData, activateEmergencyMode]);

  // Reintentar inicialización
  const retry = useCallback(() => {
    initializationRef.current = false;
    setState({
      phase: 'idle',
      error: null,
      emergencyMode: false,
      progress: 0,
      completedSteps: [],
      skippedSteps: []
    });
    initialize();
  }, [initialize]);

  // Ejecutar inicialización cuando haya usuario
  useEffect(() => {
    if (profile?.id && !hasInitialized) {
      const timeoutId = setTimeout(initialize, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [profile?.id, hasInitialized, initialize]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (totalTimeoutRef.current) {
        clearTimeout(totalTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...state,
    isInitializing: state.phase !== 'idle' && state.phase !== 'complete' && state.phase !== 'emergency',
    hasInitialized: hasInitialized || state.emergencyMode,
    retry,
    canProceed: hasInitialized || state.emergencyMode
  };
};
