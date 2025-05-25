
/**
 * Hook neurológico CARDIOVASCULAR UNIFICADO v7.2 - SINGLETON ESTRICTO
 * Post-cirugía completa con singleton enforcement y logging throttled
 */

import { useEffect, useRef, useCallback } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';
import { CirculatorySystem } from '@/core/system-vitals/CirculatorySystem';

// SINGLETON GLOBAL ESTRICTO para CirculatorySystem
let globalCirculatorySystemInstance: CirculatorySystem | null = null;
let instanceCreationLock = false;

export const useNeuralIntegration = (
  moduleType: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard',
  capabilities: string[] = [],
  currentState: any = {}
) => {
  const { user } = useAuth();
  const moduleId = useRef(`${moduleType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  const circulatorySystem = useRef<CirculatorySystem | null>(null);
  const lastBroadcastRef = useRef<string>('');
  const isDestroyedRef = useRef(false);
  const lastLogTime = useRef(0);
  const logThrottle = 60000; // 1 minuto entre logs
  
  const neural = useNeuralModule({
    id: moduleId.current,
    type: moduleType,
    capabilities: [
      ...capabilities,
      'cardiovascular_integration_v7_2',
      'singleton_enforcement',
      'emergency_response'
    ]
  });

  // Inicialización singleton del sistema circulatorio
  useEffect(() => {
    if (!circulatorySystem.current && !globalCirculatorySystemInstance && !instanceCreationLock) {
      instanceCreationLock = true;
      
      try {
        globalCirculatorySystemInstance = new CirculatorySystem();
        circulatorySystem.current = globalCirculatorySystemInstance;
        
        const now = Date.now();
        if (now - lastLogTime.current > logThrottle) {
          console.log('🫀 SISTEMA CIRCULATORIO SINGLETON v7.2 INICIALIZADO');
          lastLogTime.current = now;
        }
      } catch (error) {
        console.error('Error inicializando sistema circulatorio singleton:', error);
      } finally {
        instanceCreationLock = false;
      }
    } else if (globalCirculatorySystemInstance) {
      // Reutilizar instancia singleton existente
      circulatorySystem.current = globalCirculatorySystemInstance;
    }

    return () => {
      // NO destruir el singleton, solo marcar como no utilizado
      isDestroyedRef.current = true;
    };
  }, []);

  // Broadcast cardiovascular throttled
  const cardiovascularBroadcast = useCallback((signalType: string, payload: any) => {
    if (isDestroyedRef.current || !circulatorySystem.current) {
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
          cardiovascular_processed_v7_2: true,
          singleton_enforced: true,
          vitals: circulatorySystem.current.getSystemVitals()
        },
        priority: 'MEDIUM' as any
      });
    }
  }, [neural, moduleType, capabilities, currentState]);

  // Broadcast ultra-controlado con mayor delay
  useEffect(() => {
    if (isDestroyedRef.current || !circulatorySystem.current) return;
    
    const currentHash = JSON.stringify(currentState);
    
    if (currentHash.length > 15) {
      const timeoutId = setTimeout(() => {
        if (!isDestroyedRef.current && 
            circulatorySystem.current && 
            circulatorySystem.current.canProcessSignal()) {
          
          cardiovascularBroadcast('DATA_MUTATION_CARDIOVASCULAR_V7_2', {
            new_state: currentState,
            user_id: user?.id,
            timestamp: Date.now(),
            system_health: 'singleton_optimized'
          });
        }
      }, 45000); // Aumentado a 45 segundos

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
          console.log('🫀 Sistema cardiovascular singleton procesando emergencia v7.2');
          lastLogTime.current = now;
        }
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  // Acciones cardiovasculares con delay aumentado
  const broadcastUserAction = useCallback((action: string, payload: any = {}) => {
    if (isDestroyedRef.current || !circulatorySystem.current) return;
    
    const actionKey = `${action}_${Date.now()}`;
    
    if (lastBroadcastRef.current === actionKey) {
      return;
    }
    
    lastBroadcastRef.current = actionKey;
    
    setTimeout(() => {
      if (!isDestroyedRef.current && 
          circulatorySystem.current && 
          circulatorySystem.current.canProcessSignal()) {
        
        cardiovascularBroadcast('USER_ACTION_CARDIOVASCULAR_V7_2', {
          action,
          user_id: user?.id,
          module_context: currentState,
          system_vitals: circulatorySystem.current.getSystemVitals(),
          singleton_info: 'v7_2_enforced',
          ...payload
        });
      }
    }, 5000); // Aumentado a 5 segundos
  }, [cardiovascularBroadcast, user?.id, currentState]);

  // Cleanup NO destructivo del singleton
  useEffect(() => {
    return () => {
      isDestroyedRef.current = true;
      // NO destruir el singleton global
    };
  }, []);

  return {
    moduleId: moduleId.current,
    broadcastUserAction,
    systemHealth: {
      ...neural.systemHealth,
      cardiovascular: circulatorySystem.current?.getSystemVitals() || null,
      singleton_status: 'v7_2_enforced'
    },
    
    // Helpers cardiovasculares con delays aumentados
    notifyProgress: useCallback((progress: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('PROGRESS_CARDIOVASCULAR_V7_2', progress), 15000);
    }, [broadcastUserAction]),
    
    notifyCompletion: useCallback((completion: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('COMPLETION_CARDIOVASCULAR_V7_2', completion), 8000);
    }, [broadcastUserAction]),
    
    notifyEngagement: useCallback((engagement: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('ENGAGEMENT_CARDIOVASCULAR_V7_2', engagement), 20000);
    }, [broadcastUserAction]),
    
    requestRecommendation: useCallback((context: any) => {
      if (isDestroyedRef.current) return;
      setTimeout(() => broadcastUserAction('RECOMMENDATION_CARDIOVASCULAR_V7_2', context), 3000);
    }, [broadcastUserAction]),

    // Sistema de emergencia cardiovascular singleton
    emergencyReset: useCallback(() => {
      if (circulatorySystem.current) {
        circulatorySystem.current.emergencyReset();
      }
      lastBroadcastRef.current = '';
      isDestroyedRef.current = false;
      lastLogTime.current = 0;
      console.log('🫀 Sistema cardiovascular singleton reiniciado v7.2');
    }, [])
  };
};
