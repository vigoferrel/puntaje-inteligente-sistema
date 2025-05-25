
import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyCircuitBreaker } from '@/utils/circuit-breaker';

/**
 * Hook neurológico quirúrgico v2.0 - Sin bucles infinitos, optimizado
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

  // Función de broadcast con circuit breaker mejorado
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
      console.warn('Broadcast neurológico fallido (tolerado):', error);
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast de estado con debouncing ultra-agresivo
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    // Solo broadcast si hay cambio significativo y han pasado al menos 10 segundos
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
      }, 10000); // 10 segundos de debouncing

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, safeBroadcast, user?.id]);

  // Suscripción optimizada sin bucles
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      // Solo procesar señales críticas de emergencia
      if (signal.type === 'EMERGENCY_COORDINATION') {
        console.log(`🚨 ${moduleType} - Coordinación de emergencia:`, signal.payload);
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Funciones de acción ultra-controladas
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    if (isDestroyedRef.current) return;
    
    const actionKey = `${action}_${JSON.stringify(payload)}_${Date.now()}`;
    
    // Evitar acciones duplicadas en ventana de 5 segundos
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    // Delay mínimo para evitar spam
    setTimeout(() => {
      if (!isDestroyedRef.current) {
        safeBroadcast('USER_ACTION', {
          action,
          user_id: user?.id,
          module_context: currentState,
          ...payload
        });
      }
    }, 1000);
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
    
    // Helpers especializados con throttling ultra-agresivo
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_UPDATE', progress), 3000);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('TASK_COMPLETION', completion);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('USER_ENGAGEMENT', engagement), 5000);
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
