
/**
 * Hook neurológico CARDIOVASCULAR INTEGRISTA v8.0 - SISTEMA UNIFICADO
 * Post-cirugía completa con arquitectura monolítica cardiovascular
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { CardiovascularSystem } from '@/core/system-vitals/CardiovascularSystem';

// SINGLETON CARDIOVASCULAR INTEGRISTA GLOBAL
let globalCardiovascularInstance: CardiovascularSystem | null = null;
let instanceCreationLock = false;

export const useNeuralIntegration = (
  moduleType: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard',
  capabilities: string[] = [],
  currentState: any = {}
) => {
  const { user } = useAuth();
  const moduleId = useRef(`${moduleType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  const cardiovascularSystem = useRef<CardiovascularSystem | null>(null);
  const lastBroadcastRef = useRef<string>('');
  const isDestroyedRef = useRef(false);
  const lastLogTime = useRef(0);
  const logThrottle = 120000; // 2 minutos entre logs
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'cardiovascular_integrista_v8_0',
      'detox_integration',
      'anti_tracking_unified',
      'emergency_response_integrated'
    ]
  });

  // Inicialización del sistema cardiovascular integrista
  useEffect(() => {
    if (!cardiovascularSystem.current && !globalCardiovascularInstance && !instanceCreationLock) {
      instanceCreationLock = true;
      
      try {
        globalCardiovascularInstance = CardiovascularSystem.getInstance({
          maxBeatsPerSecond: 5,  // Más conservador para v8.0
          restingPeriod: 3000,   // Más espaciado
          recoveryTime: 8000,    // Recovery más largo
          emergencyThreshold: 8, // Más tolerante
          purificationLevel: 'maximum',
          oxygenThreshold: 80
        });
        cardiovascularSystem.current = globalCardiovascularInstance;
        
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 SISTEMA CARDIOVASCULAR INTEGRISTA v8.0 INICIALIZADO (Detox incluido)');
          lastLogTime.current = now;
        }
      } catch (error) {
        console.error('Error inicializando sistema cardiovascular integrista:', error);
      } finally {
        instanceCreationLock = false;
      }
    } else if (globalCardiovascularInstance) {
      cardiovascularSystem.current = globalCardiovascularInstance;
    }

    return () => {
      isDestroyedRef.current = true;
    };
  }, []);

  // Broadcast cardiovascular integrista throttled
  const cardiovascularBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) {
      return;
    }

    const processed = cardiovascularSystem.current.processSignal({
      type: signalType,
      payload,
      timestamp: Date.now(),
      integrista_version: 'v8.0'
    });

    if (processed) {
      const oxygenatedModule = cardiovascularSystem.current.oxygenate({
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
          cardiovascular_integrista_v8_0: true,
          detox_integrated: true,
          vitals: cardiovascularSystem.current.getIntegratedSystemStatus()
        },
        priority: 'MEDIUM' as any
      });
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast ultra-controlado con mayor delay para v8.0
  useEffect(() => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    if (currentHash.length > 15) {
      const timeoutId = setTimeout(() => {
        if (!isDestroyedRef.current && 
            cardiovascularSystem.current && 
            cardiovascularSystem.current.canPump()) {
          
          cardiovascularBroadcast('DATA_MUTATION_INTEGRISTA_V8_0', {
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now(),
            system_health: 'integrista_optimized',
            detox_status: cardiovascularSystem.current.getIntegratedDetoxStatus()
          });
        }
      }, 60000); // Aumentado a 60 segundos para v8.0

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, cardiovascularBroadcast, user?.id]);

  // Suscripción cardiovascular throttled
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      if (signal.type === 'EMERGENCY_COORDINATION') {
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 Sistema cardiovascular integrista procesando emergencia v8.0');
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Acciones cardiovasculares integradas con delay aumentado
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) return;
    
    const actionKey = `${action}_${Date.now()}`;
    
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    setTimeout(() => {
      if (!isDestroyedRef.current && 
          cardiovascularSystem.current && 
          cardiovascularSystem.current.canPump()) {
        
        cardiovascularBroadcast('USER_ACTION_INTEGRISTA_V8_0', {
          action,
          user_id: user?.id,
          module_context: currentState,
          system_vitals: cardiovascularSystem.current.getIntegratedSystemStatus(),
          integrista_info: 'v8_0_unified',
          ...payload
        });
      }
    }, 8000); // Aumentado a 8 segundos para v8.0
  }, [cardiovascularBroadcast, user?.id, currentState]);

  // Cleanup NO destructivo del singleton
  useEffect(() => {
    return () => {
      isDestroyedRef.current = true;
    };
  }, []);

  return {
    moduleId: moduleId.current,
    broadcastUserAction,
    systemHealth: {
      ...neural.systemHealth,
      cardiovascular: cardiovascularSystem.current?.getIntegratedSystemStatus() || null,
      integrista_status: 'v8_0_unified'
    },
    
    // Helpers cardiovasculares integrados con delays aumentados
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_INTEGRISTA_V8_0', progress), 20000);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('COMPLETION_INTEGRISTA_V8_0', completion), 12000);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('ENGAGEMENT_INTEGRISTA_V8_0', engagement), 25000);
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('RECOMMENDATION_INTEGRISTA_V8_0', context), 5000);
    }, [broadcastUserAction]),

    // Sistema de emergencia cardiovascular integrista
    emergencyReset: useCallback(() => {
      if (cardiovascularSystem.current) {
        cardiovascularSystem.current.emergencyReset();
      }
      lastBroadcastRef.current = '';
      isDestroyedRef.current = false;
      lastLogTime.current = 0;
      console.log('🫀 Sistema cardiovascular integrista reiniciado v8.0');
    }, []),

    // Nuevos métodos específicos del sistema integrista
    activateEmergencyDetox: useCallback(() => {
      if (cardiovascularSystem.current) {
        cardiovascularSystem.current.activateIntegratedEmergencyMode();
      }
    }, []),

    getDetoxStatus: useCallback(() => {
      return cardiovascularSystem.current?.getIntegratedDetoxStatus() || null;
    }, []),

    isSafeMode: useCallback(() => {
      return cardiovascularSystem.current?.isSafeMode() || false;
    }, [])
  };
};
