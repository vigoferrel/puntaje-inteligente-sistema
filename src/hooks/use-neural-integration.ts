
/**
 * Hook neurológico CARDIOVASCULAR v8.2 - CALIBRACIÓN SILENCIOSA
 * Post-cirugía completa con arquitectura monolítica cardiovascular optimizada
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { CardiovascularSystem } from '@/core/system-vitals/CardiovascularSystem';

// SINGLETON CARDIOVASCULAR CALIBRADO GLOBAL v8.2
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
  const logThrottle = 300000; // 5 minutos para v8.2
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'cardiovascular_integrista_v8_2',
      'detox_integration_calibrated',
      'anti_tracking_silent',
      'emergency_response_optimized'
    ]
  });

  // Inicialización del sistema cardiovascular calibrado v8.2
  useEffect(() => {
    if (!cardiovascularSystem.current && !globalCardiovascularInstance && !instanceCreationLock) {
      instanceCreationLock = true;
      
      try {
        globalCardiovascularInstance = CardiovascularSystem.getInstance({
          maxBeatsPerSecond: 4,  // Más conservador para v8.2
          restingPeriod: 4000,   // Más espaciado
          recoveryTime: 10000,   // Recovery más largo
          emergencyThreshold: 8, // Más tolerante
          purificationLevel: 'safe_mode',
          oxygenThreshold: 70
        });
        cardiovascularSystem.current = globalCardiovascularInstance;
        
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 SISTEMA CARDIOVASCULAR v8.2 CALIBRADO (Hook Neural)');
          lastLogTime.current = now;
        }
      } catch (error) {
        console.error('Error inicializando sistema cardiovascular v8.2:', error);
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

  // Broadcast cardiovascular calibrado (menos frecuente)
  const cardiovascularBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) {
      return;
    }

    const processed = cardiovascularSystem.current.processSignal({
      type: signalType,
      payload,
      timestamp: Date.now(),
      integrista_version: 'v8.2'
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
          cardiovascular_integrista_v8_2: true,
          detox_calibrated: true,
          vitals: cardiovascularSystem.current.getIntegratedSystemStatus()
        },
        priority: 'LOW' as any // Prioridad baja para v8.2
      });
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast ultra-controlado con mayor delay para v8.2
  useEffect(() => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    if (currentHash.length > 15) {
      const timeoutId = setTimeout(() => {
        if (!isDestroyedRef.current && 
            cardiovascularSystem.current && 
            cardiovascularSystem.current.canPump()) {
          
          cardiovascularBroadcast('DATA_MUTATION_CALIBRATED_V8_2', {
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now(),
            system_health: 'integrista_calibrated',
            detox_status: cardiovascularSystem.current.getIntegratedDetoxStatus()
          });
        }
      }, 120000); // Aumentado a 2 minutos para v8.2

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, cardiovascularBroadcast, user?.id]);

  // Suscripción cardiovascular silenciosa
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      // Solo logs críticos
      if (signal.type === 'EMERGENCY_COORDINATION') {
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 Sistema cardiovascular v8.2 procesando emergencia');
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Acciones cardiovasculares con delay aumentado para v8.2
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
        
        cardiovascularBroadcast('USER_ACTION_CALIBRATED_V8_2', {
          action,
          user_id: user?.id,
          module_context: currentState,
          system_vitals: cardiovascularSystem.current.getIntegratedSystemStatus(),
          integrista_info: 'v8_2_calibrated',
          ...payload
        });
      }
    }, 15000); // Aumentado a 15 segundos para v8.2
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
      integrista_status: 'v8_2_calibrated'
    },
    
    // Helpers cardiovasculares calibrados (delays aumentados)
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_CALIBRATED_V8_2', progress), 30000); // 30 seg
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('COMPLETION_CALIBRATED_V8_2', completion), 20000); // 20 seg
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('ENGAGEMENT_CALIBRATED_V8_2', engagement), 45000); // 45 seg
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('RECOMMENDATION_CALIBRATED_V8_2', context), 10000); // 10 seg
    }, [broadcastUserAction]),

    // Sistema de emergencia cardiovascular v8.2
    emergencyReset: useCallback(() => {
      if (cardiovascularSystem.current) {
        cardiovascularSystem.current.emergencyReset();
      }
      lastBroadcastRef.current = '';
      isDestroyedRef.current = false;
      lastLogTime.current = 0;
      console.log('🫀 Sistema cardiovascular v8.2 reiniciado');
    }, []),

    // Métodos específicos del sistema calibrado v8.2
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
