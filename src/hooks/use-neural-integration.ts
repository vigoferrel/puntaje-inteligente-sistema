
import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { CirculatorySystem } from '@/core/system-vitals/CirculatorySystem';

/**
 * Hook neurológico CARDIOVASCULAR UNIFICADO v7.1 - Post-cirugía completa
 */
export const useNeuralIntegration = (
  moduleType: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard',
  capabilities: string[] = [],
  currentState: any = {}
) => {
  const { user } = useAuth();
  const moduleId = useRef(`${moduleType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  const circulatorySystem = useRef(new CirculatorySystem());
  const lastBroadcastRef = useRef<string>('');
  const isDestroyedRef = useRef(false);
  const lastLogTime = useRef(0);
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'cardiovascular_integration',
      'unified_circulation',
      'emergency_response'
    ]
  });

  // Broadcast cardiovascular unificado
  const cardiovascularBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current) {
      return;
    }

    const processed = circulatorySystem.current.processSignal({
      type: signalType,
      payload,
      timestamp: Date.now()
    });

    if (processed) {
      const oxygenatedModule = circulatorySystem.current.oxygenateModule({
        id: moduleId.current,
        type: moduleType,
        capabilities: capabilities,
        current_state: currentState
      });

      neural.broadcastSignal({
        origin: oxygenatedModule,
        type: signalType as any,
        payload: {
          ...payload,
          cardiovascular_processed: true,
          vitals: circulatorySystem.current.getSystemVitals()
        },
        priority: 'MEDIUM' as any
      });
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast controlado
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    if (currentHash.length > 15) {
      const timeoutId = setTimeout(() => {
        if (!isDestroyedRef.current && circulatorySystem.current.canProcessSignal()) {
          cardiovascularBroadcast('DATA_MUTATION_CARDIOVASCULAR', {
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now(),
            system_health: 'optimized'
          });
        }
      }, 20000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, cardiovascularBroadcast, user?.id]);

  // Suscripción cardiovascular
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      if (signal.type === 'EMERGENCY_COORDINATION') {
        const now = Date.now();
        if (now - lastLogTime.current > 600000) {
          console.log('🫀 Sistema cardiovascular procesando emergencia v7.1');
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Acciones cardiovasculares
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    if (isDestroyedRef.current) return;
    
    const actionKey = `${action}_${Date.now()}`;
    
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    setTimeout(() => {
      if (!isDestroyedRef.current) {
        cardiovascularBroadcast('USER_ACTION_CARDIOVASCULAR', {
          action,
          user_id: user?.id,
          module_context: currentState,
          system_vitals: circulatorySystem.current.getSystemVitals(),
          ...payload
        });
      }
    }, 2000);
  }, [cardiovascularBroadcast, user?.id, currentState]);

  // Cleanup cardiovascular
  useEffect(() => {
    return () => {
      isDestroyedRef.current = true;
      circulatorySystem.current.destroy();
    };
  }, []);

  return {
    moduleId: moduleId.current,
    broadcastUserAction,
    systemHealth: {
      ...neural.systemHealth,
      cardiovascular: circulatorySystem.current.getSystemVitals()
    },
    
    // Helpers cardiovasculares optimizados
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_CARDIOVASCULAR', progress), 6000);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('COMPLETION_CARDIOVASCULAR', completion), 1500);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('ENGAGEMENT_CARDIOVASCULAR', engagement), 8000);
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('RECOMMENDATION_CARDIOVASCULAR', context), 1000);
    }, [broadcastUserAction]),

    // Sistema de emergencia cardiovascular
    emergencyReset: useCallback(() => {
      circulatorySystem.current.emergencyReset();
      lastBroadcastRef.current = '';
      isDestroyedRef.current = false;
      console.log('🫀 Sistema cardiovascular unificado reiniciado v7.1');
    }, [])
  };
};
