
import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyCircuitBreaker } from '@/utils/circuit-breaker';

/**
 * Hook neurológico quirúrgico - Sin bucles infinitos
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

  // Función de broadcast con circuit breaker
  const safeBroadcast = useCallback((signalType: string, payload: any) => {
    if (!circuitBreaker.current.canProcess()) {
      console.warn(`🚫 Signal blocked by circuit breaker: ${signalType}`);
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
      console.error('❌ Error en broadcast neurológico:', error);
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast de estado con debouncing agresivo (solo cambios significativos)
  useEffect(() => {
    const currentHash = JSON.stringify(currentState);
    
    // Solo broadcast si hay cambio real y han pasado al menos 5 segundos
    if (currentHash !== stateHashRef.current) {
      const timeoutId = setTimeout(() => {
        if (circuitBreaker.current.canProcess()) {
          safeBroadcast('DATA_MUTATION', {
            previous_state: stateHashRef.current,
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now()
          });
          
          stateHashRef.current = currentHash;
        }
      }, 5000); // 5 segundos de debouncing

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, safeBroadcast, user?.id]);

  // Suscripción sin bucles
  useEffect(() => {
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      // Solo procesar señales críticas
      if (signal.type === 'EMERGENCY_COORDINATION') {
        console.log(`🚨 ${moduleType} - Coordinación de emergencia:`, signal.payload);
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Funciones de acción controladas
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    const actionKey = `${action}_${JSON.stringify(payload)}`;
    
    // Evitar acciones duplicadas
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    safeBroadcast('USER_ACTION', {
      action,
      user_id: user?.id,
      module_context: currentState,
      ...payload
    });
  }, [safeBroadcast, user?.id, currentState]);

  return {
    moduleId: moduleId.current,
    broadcastUserAction,
    systemHealth: neural.systemHealth,
    circuitBreakerState: circuitBreaker.current.getState(),
    
    // Helpers especializados con throttling
    notifyProgress: useCallback((progress: any) => {
      setTimeout(() => broadcastUserAction('PROGRESS_UPDATE', progress), 1000);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      broadcastUserAction('TASK_COMPLETION', completion);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      setTimeout(() => broadcastUserAction('USER_ENGAGEMENT', engagement), 2000);
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      broadcastUserAction('REQUEST_RECOMMENDATION', context);
    }, [broadcastUserAction]),

    // Función de emergencia
    emergencyReset: useCallback(() => {
      circuitBreaker.current.forceRecovery();
      lastBroadcastRef.current = '';
      stateHashRef.current = '';
    }, [])
  };
};
