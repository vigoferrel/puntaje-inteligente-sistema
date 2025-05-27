
/**
 * Hook neurológico CARDIOVASCULAR v9.0 - MODO SILENCIOSO TOTAL
 * Sin anti-tracking agresivo, delegación completa al navegador
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { CardiovascularSystem } from '@/core/system-vitals/CardiovascularSystem';

// SINGLETON CARDIOVASCULAR SILENCIOSO GLOBAL v9.0
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
  const logThrottle = 7200000; // 2 HORAS para v9.0
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'cardiovascular_silencioso_v9',
      'browser_delegated_tracking',
      'minimal_logging',
      'emergency_response_silent'
    ]
  });

  // Inicialización del sistema cardiovascular SILENCIOSO v9.0
  useEffect(() => {
    if (!cardiovascularSystem.current && !globalCardiovascularInstance && !instanceCreationLock) {
      instanceCreationLock = true;
      
      try {
        globalCardiovascularInstance = CardiovascularSystem.getInstance({
          maxBeatsPerSecond: 2,  // MUY conservador
          restingPeriod: 8000,   // Mucho más espaciado
          recoveryTime: 15000,   // Recovery largo
          emergencyThreshold: 5, // Muy tolerante
          purificationLevel: 'minimal', // MÍNIMO
          oxygenThreshold: 60,
          silentMode: true // SILENCIOSO
        });
        cardiovascularSystem.current = globalCardiovascularInstance;
        
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 SISTEMA CARDIOVASCULAR v9.0 SILENCIOSO (Hook Neural)');
          lastLogTime.current = now;
        }
      } catch (error) {
        // Error silencioso
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

  // Broadcast cardiovascular ULTRA-ESPACIADO (menos frecuente)
  const cardiovascularBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) {
      return;
    }

    const processed = cardiovascularSystem.current.processSignal({
      type: signalType,
      payload,
      timestamp: Date.now(),
      silent_version: 'v9.0'
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
          cardiovascular_silencioso_v9: true,
          browser_delegated: true,
          vitals: cardiovascularSystem.current.getIntegratedSystemStatus()
        },
        priority: 'LOW' as any // Prioridad BAJA
      });
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast ULTRA-controlado con delay MASIVO para v9.0
  useEffect(() => {
    if (isDestroyedRef.current || !cardiovascularSystem.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    if (currentHash.length > 20) { // Umbral más alto
      const timeoutId = setTimeout(() => {
        if (!isDestroyedRef.current && 
            cardiovascularSystem.current && 
            cardiovascularSystem.current.canPump()) {
          
          cardiovascularBroadcast('DATA_MUTATION_SILENT_V9', {
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now(),
            system_health: 'silencioso_v9',
            detox_status: cardiovascularSystem.current.getIntegratedDetoxStatus()
          });
        }
      }, 300000); // AUMENTADO A 5 MINUTOS

      return () => clearTimeout(timeoutId);
    }
  }, [currentState, cardiovascularBroadcast, user?.id]);

  // Suscripción cardiovascular ULTRA-SILENCIOSA
  useEffect(() => {
    if (isDestroyedRef.current) return;
    
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (isDestroyedRef.current) return;
      
      // Solo logs CRÍTICOS
      if (signal.type === 'EMERGENCY_COORDINATION') {
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 Sistema cardiovascular v9.0 procesando emergencia (silencioso)');
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Acciones cardiovasculares con delay MASIVO para v9.0
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
        
        cardiovascularBroadcast('USER_ACTION_SILENT_V9', {
          action,
          user_id: user?.id,
          module_context: currentState,
          system_vitals: cardiovascularSystem.current.getIntegratedSystemStatus(),
          silent_info: 'v9_ultra_silencioso',
          ...payload
        });
      }
    }, 60000); // AUMENTADO A 1 MINUTO
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
      silent_status: 'v9_ultra_silencioso'
    },
    
    // AGREGADO: integrationLevel calculado dinámicamente
    integrationLevel: Math.min(100, (neural.systemHealth.neural_efficiency + neural.systemHealth.cross_pollination_rate) / 2),
    
    // Helpers cardiovasculares ULTRA-ESPACIADOS (delays MASIVOS)
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_SILENT_V9', progress), 120000); // 2 min
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('COMPLETION_SILENT_V9', completion), 180000); // 3 min
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('ENGAGEMENT_SILENT_V9', engagement), 300000); // 5 min
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('RECOMMENDATION_SILENT_V9', context), 240000); // 4 min
    }, [broadcastUserAction]),

    // Sistema de emergencia cardiovascular v9.0 SILENCIOSO
    emergencyReset: useCallback(() => {
      if (cardiovascularSystem.current) {
        cardiovascularSystem.current.emergencyReset();
      }
      lastBroadcastRef.current = '';
      isDestroyedRef.current = false;
      lastLogTime.current = 0;
      console.log('🫀 Sistema cardiovascular v9.0 reiniciado (silencioso)');
    }, []),

    // Métodos específicos del sistema SILENCIOSO v9.0
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
