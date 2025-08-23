
/**
 * Hook neurológico CARDIOVASCULAR v10.0 - NAVEGACIÓN OPTIMIZADA
 * Versión optimizada para navegación inmediata sin delays
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { CardiovascularSystem } from '@/core/system-vitals/CardiovascularSystem';

// SINGLETON CARDIOVASCULAR OPTIMIZADO GLOBAL v10.0
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
  const logThrottle = 300000; // 5 MINUTOS para v10.0
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'cardiovascular_optimizado_v10',
      'navegacion_inmediata',
      'minimal_logging',
      'emergency_response_fast'
    ]
  });

  // Inicialización del sistema cardiovascular OPTIMIZADO v10.0
  useEffect(() => {
    if (!cardiovascularSystem.current && !globalCardiovascularInstance && !instanceCreationLock) {
      instanceCreationLock = true;
      
      try {
        globalCardiovascularInstance = CardiovascularSystem.getInstance({
          maxBeatsPerSecond: 10,  // Aumentado para navegación rápida
          restingPeriod: 1000,   // Muy reducido
          recoveryTime: 2000,    // Recovery rápido
          emergencyThreshold: 20, // Muy tolerante
          purificationLevel: 'minimal',
          oxygenThreshold: 40,
          silentMode: false // NO silencioso para navegación
        });
        cardiovascularSystem.current = globalCardiovascularInstance;
        
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 SISTEMA CARDIOVASCULAR v10.0 NAVEGACIÓN OPTIMIZADA');
          lastLogTime.current = now;
        }
      } catch (error) {
        console.warn('❤️ Error cardiovascular manejado silenciosamente');
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

  // Broadcast cardiovascular INMEDIATO para navegación
  const cardiovascularBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) {
      return;
    }

    const processed = cardiovascularSystem.current.processSignal({
      type: signalType,
      payload,
      timestamp: Date.now(),
      optimized_version: 'v10.0'
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
          cardiovascular_optimizado_v10: true,
          navegacion_inmediata: true,
          vitals: cardiovascularSystem.current.getIntegratedSystemStatus()
        },
        priority: 'HIGH' as any // Prioridad ALTA para navegación
      });
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast INMEDIATO sin delays para navegación v10.0
  useEffect(() => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    if (currentHash.length > 10) { // Umbral bajo para respuesta rápida
      // SIN TIMEOUT - ejecución inmediata
      if (!isDestroyedRef.current && 
          cardiovascularSystem.current && 
          cardiovascularSystem.current.canPump()) {
        
        cardiovascularBroadcast('DATA_MUTATION_FAST_V10', {
          new_state: currentState,
          user_id: user?.id,
          timestamp: Date.now(),
          system_health: 'optimizado_v10',
          detox_status: cardiovascularSystem.current.getIntegratedDetoxStatus()
        });
      }
    }
  }, [currentState, cardiovascularBroadcast, user?.id]);

  // Suscripción cardiovascular OPTIMIZADA
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      // Logs para navegación crítica
      if (signal.type === 'NAVIGATE_TO_TOOL' || signal.type === 'USER_ACTION_FAST_V10') {
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 Sistema cardiovascular v10.0 procesando navegación');
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Acciones cardiovasculares INMEDIATAS para navegación v10.0
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) return;
    
    const actionKey = `${action}_${Date.now()}`;
    
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    // EJECUCIÓN INMEDIATA sin setTimeout
    if (!isDestroyedRef.current && 
        cardiovascularSystem.current && 
        cardiovascularSystem.current.canPump()) {
      
      cardiovascularBroadcast('USER_ACTION_FAST_V10', {
        action,
        user_id: user?.id,
        module_context: currentState,
        system_vitals: cardiovascularSystem.current.getIntegratedSystemStatus(),
        fast_info: 'v10_navegacion_optimizada',
        ...payload
      });
    }
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
      fast_status: 'v10_navegacion_optimizada'
    },
    
    // AGREGADO: integrationLevel calculado dinámicamente
    integrationLevel: Math.min(100, (neural.systemHealth.neural_efficiency + neural.systemHealth.cross_pollination_rate) / 2),
    
    // Helpers cardiovasculares INMEDIATOS (sin delays)
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('PROGRESS_FAST_V10', progress);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('COMPLETION_FAST_V10', completion);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('ENGAGEMENT_FAST_V10', engagement);
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      broadcastUserAction('RECOMMENDATION_FAST_V10', context);
    }, [broadcastUserAction]),

    // Sistema de emergencia cardiovascular v10.0 OPTIMIZADO
    emergencyReset: useCallback(() => {
      if (cardiovascularSystem.current) {
        cardiovascularSystem.current.emergencyReset();
      }
      lastBroadcastRef.current = '';
      isDestroyedRef.current = false;
      lastLogTime.current = 0;
      console.log('🫀 Sistema cardiovascular v10.0 reiniciado (optimizado)');
    }, []),

    // Métodos específicos del sistema OPTIMIZADO v10.0
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
