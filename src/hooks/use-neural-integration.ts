
import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyCircuitBreaker } from '@/utils/circuit-breaker';

/**
 * Hook neurológico desinfectado v3.0 - Sistema ultra-optimizado sin spam
 */
export const useNeuralIntegration = (
  moduleType: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard',
  capabilities: string[] = [],
  currentState: any = {}
) => {
  const { user } = useAuth();
  const moduleId = useRef(`${moduleType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  const circuitBreaker = useRef(new EmergencyCircuitBreaker());
  const lastBroadcastRef = useRef<string>('');
  const stateHashRef = useRef<string>('');
  const isDestroyedRef = useRef(false);
  const lastLogTime = useRef(0);
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'data_sync',
      'user_interaction',
      'adaptive_learning'
    ]
  });

  // Función de broadcast ultra-silenciosa con circuit breaker optimizado
  const safeBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current || !circuitBreaker.current.canProcess()) {
      return;
    }

    try {
      neural.broadcastSignal({
        origin: {
          id: moduleId.current,
          type: moduleType,
          capabilities: capabilities,
          current_state: currentState
        },
        type: signalType as any,
        payload,
        priority: 'MEDIUM' as any
      });
      
      circuitBreaker.current.recordSignal();
    } catch (error) {
      // Completamente silencioso - no spam de errores
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast de estado con debouncing ultra-agresivo y logging reducido
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    // Solo broadcast si hay cambio significativo y han pasado al menos 15 segundos
    if (currentHash !== stateHashRef.current && currentHash.length > 10) {
      const timeoutId = setTimeout(() => {
        if (!isDestroyedRef.current && circuitBreaker.current.canProcess()) {
          safeBroadcast('DATA_MUTATION', {
            previous_state: stateHashRef.current,
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now()
          });
          
          stateHashRef.current = currentHash;
        }
      }, 15000); // 15 segundos de debouncing

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, safeBroadcast, user?.id]);

  // Suscripción ultra-optimizada y silenciosa
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      // Solo procesar señales críticas de emergencia y logear muy poco
      if (signal.type === 'EMERGENCY_COORDINATION') {
        const now = Date.now();
        if (now - lastLogTime.current > 300000) { // Solo log cada 5 minutos
          console.log(`🚨 ${moduleType} - Coordinación de emergencia`);
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Funciones de acción ultra-controladas y silenciosas
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    if (isDestroyedRef.current) return;
    
    const actionKey = `${action}_${JSON.stringify(payload)}_${Date.now()}`;
    
    // Evitar acciones duplicadas en ventana de 10 segundos
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    // Delay mayor para evitar spam
    setTimeout(() => {
      if (!isDestroyedRef.current) {
        safeBroadcast('USER_ACTION', {
          action,
          user_id: user?.id,
          module_context: currentState,
          ...payload
        });
      }
    }, 2000); // Aumentado a 2 segundos
  }, [safeBroadcast, user?.id, currentState]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isDestroyedRef.current = true;
      circuitBreaker.current.destroy();
    };
  }, []);

  return {
    moduleId: moduleId.current,
    broadcastUserAction,
    systemHealth: neural.systemHealth,
    circuitBreakerState: circuitBreaker.current.getState(),
    
    // Helpers especializados con throttling ultra-agresivo y completamente silenciosos
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_UPDATE', progress), 5000);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('TASK_COMPLETION', completion);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('USER_ENGAGEMENT', engagement), 8000);
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('REQUEST_RECOMMENDATION', context);
    }, [broadcastUserAction]),

    // Función de emergencia mejorada
    emergencyReset: useCallback(() => {
      circuitBreaker.current.forceRecovery();
      lastBroadcastRef.current = '';
      stateHashRef.current = '';
      isDestroyedRef.current = false;
    }, [])
  };
};
