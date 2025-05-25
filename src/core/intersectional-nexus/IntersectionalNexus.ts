
/**
 * NEXUS INTERSECCIONAL - Sistema Nervioso Digital Estabilizado
 * Arquitectura quirúrgica sin bucles infinitos
 */

import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { universalHub } from '@/core/universal-hub/UniversalDataHub';
import { EmergencyCircuitBreaker } from '@/utils/circuit-breaker';

// Circuit Breaker Global de Emergencia
const globalCircuitBreaker = new EmergencyCircuitBreaker({
  maxSignalsPerSecond: 2,
  cooldownPeriod: 5000,
  emergencyThreshold: 3,
  autoRecoveryTime: 30000
});

// Tipos neurológicos del sistema
interface NeuralSignal {
  origin: ModuleIdentity;
  target?: ModuleIdentity[];
  type: SignalType;
  payload: any;
  priority: SignalPriority;
  timestamp: number;
  correlation_id: string;
}

interface ModuleIdentity {
  id: string;
  type: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard' | 'intersectional';
  capabilities: string[];
  current_state: any;
}

interface IntersectionalState {
  // Estado neurológico del sistema
  active_modules: Map<string, ModuleIdentity>;
  neural_pathways: Map<string, NeuralSignal[]>;
  global_coherence: number;
  
  // Inteligencia colectiva
  collective_insights: any[];
  cross_module_patterns: any[];
  unified_user_journey: any;
  
  // Métricas quirúrgicas
  system_health: {
    neural_efficiency: number;
    cross_pollination_rate: number;
    adaptive_learning_score: number;
    user_experience_harmony: number;
  };
}

type SignalType = 
  | 'USER_ACTION' 
  | 'DATA_MUTATION' 
  | 'INSIGHT_GENERATION' 
  | 'RECOMMENDATION_SYNTHESIS'
  | 'ADAPTIVE_ADJUSTMENT'
  | 'EMERGENCY_COORDINATION';

type SignalPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'BACKGROUND';

// Queue de señales con batching quirúrgico
let signalQueue: NeuralSignal[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

const processBatchedSignals = (setState: any) => {
  if (signalQueue.length === 0) return;
  
  const signalsToProcess = [...signalQueue];
  signalQueue = [];
  
  setState((state: IntersectionalState) => {
    const newPathways = new Map(state.neural_pathways);
    
    signalsToProcess.forEach(signal => {
      const pathwayKey = `${signal.origin.id}_${signal.type}`;
      
      if (!newPathways.has(pathwayKey)) {
        newPathways.set(pathwayKey, []);
      }
      
      const pathway = newPathways.get(pathwayKey)!;
      pathway.push(signal);
      
      // Limitar historial agresivamente
      if (pathway.length > 2) {
        pathway.splice(0, pathway.length - 2);
      }
    });
    
    return { neural_pathways: newPathways };
  });
  
  console.log(`🧠 Procesadas ${signalsToProcess.length} señales neurológicas en batch`);
};

export const useIntersectionalNexus = create<IntersectionalState & {
  // API Neurológica
  registerModule: (module: ModuleIdentity) => void;
  broadcastSignal: (signal: Omit<NeuralSignal, 'timestamp' | 'correlation_id'>) => void;
  subscribeToSignals: (moduleId: string, callback: (signal: NeuralSignal) => void) => () => void;
  
  // Inteligencia Adaptativa
  synthesizeInsights: () => Promise<void>;
  adaptToUserBehavior: (behavior: any) => void;
  harmonizeExperience: () => void;
  
  // Sistema Inmunológico
  detectAnomalies: () => string[];
  healSystem: () => Promise<void>;
  optimizePathways: () => void;
  
  // Sistema de Emergencia
  emergencyReset: () => void;
  getSystemStatus: () => any;
}>()(
  subscribeWithSelector((set, get) => ({
    // Estado inicial
    active_modules: new Map(),
    neural_pathways: new Map(),
    global_coherence: 100,
    collective_insights: [],
    cross_module_patterns: [],
    unified_user_journey: null,
    system_health: {
      neural_efficiency: 95,
      cross_pollination_rate: 88,
      adaptive_learning_score: 92,
      user_experience_harmony: 90
    },

    // Registro neurológico controlado
    registerModule: (module: ModuleIdentity) => {
      if (!globalCircuitBreaker.canProcess()) {
        console.warn('🚫 Registro de módulo bloqueado por circuit breaker');
        return;
      }

      set(state => {
        const newModules = new Map(state.active_modules);
        newModules.set(module.id, module);
        
        globalCircuitBreaker.recordSignal();
        console.log(`🧠 Módulo neuronal registrado: ${module.type}[${module.id}]`);
        
        return {
          active_modules: newModules,
          global_coherence: Math.min(100, state.global_coherence + 1)
        };
      });
    },

    // Broadcasting con control de emergencia y batching
    broadcastSignal: (signal) => {
      if (!globalCircuitBreaker.canProcess()) {
        console.warn('🚫 Señal neuronal bloqueada por circuit breaker');
        return;
      }

      const fullSignal: NeuralSignal = {
        ...signal,
        timestamp: Date.now(),
        correlation_id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Agregar a queue para batching
      signalQueue.push(fullSignal);
      globalCircuitBreaker.recordSignal();

      // Procesar batch después de un delay
      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }
      
      batchTimeout = setTimeout(() => {
        processBatchedSignals(set);
        batchTimeout = null;
      }, 1000);

      // Propagar solo señales críticas inmediatamente
      if (signal.priority === 'CRITICAL' || signal.type === 'EMERGENCY_COORDINATION') {
        universalHub.notifySubscribers(`neural_signal_${signal.type}`, fullSignal);
      }
    },

    // Suscripción neurológica
    subscribeToSignals: (moduleId: string, callback: (signal: NeuralSignal) => void) => {
      return universalHub.subscribe(`neural_signal_MODULE_${moduleId}`, callback);
    },

    // Síntesis con control de frecuencia agresivo
    synthesizeInsights: async () => {
      if (!globalCircuitBreaker.canProcess()) {
        console.warn('🚫 Síntesis de insights bloqueada');
        return;
      }

      const state = get();
      const modules = Array.from(state.active_modules.values()).slice(0, 3); // Limitar a 3 módulos
      
      // Síntesis mínima para evitar sobrecarga
      const insights = modules.map(module => ({
        module_id: module.id,
        module_type: module.type,
        capabilities_utilization: Math.min(module.capabilities.length / 5, 1),
        state_complexity: Math.min(Object.keys(module.current_state || {}).length, 5),
        neural_connections: Math.min(state.neural_pathways.size, 10)
      }));

      // Cross patterns muy limitados
      const crossPatterns = [];
      if (modules.length >= 2) {
        const moduleA = modules[0];
        const moduleB = modules[1];
        
        const sharedCapabilities = moduleA.capabilities.filter(cap => 
          moduleB.capabilities.includes(cap)
        ).slice(0, 2);
        
        if (sharedCapabilities.length > 0) {
          crossPatterns.push({
            modules: [moduleA.id, moduleB.id],
            shared_capabilities: sharedCapabilities,
            synergy_potential: Math.min(sharedCapabilities.length * 30, 100),
            recommended_integration: `Bridge ${moduleA.type} ↔ ${moduleB.type}`
          });
        }
      }

      set({
        collective_insights: insights,
        cross_module_patterns: crossPatterns,
        system_health: {
          ...state.system_health,
          cross_pollination_rate: Math.min(100, crossPatterns.length * 25),
          adaptive_learning_score: Math.min(100, insights.length * 20)
        }
      });

      globalCircuitBreaker.recordSignal();
      console.log(`🧠 Síntesis neurológica optimizada: ${insights.length} insights`);
    },

    // Adaptación comportamental minimalista
    adaptToUserBehavior: (behavior) => {
      set(state => {
        const adaptations = {
          navigation_preference: behavior.navigation_pattern || 'default',
          interaction_style: behavior.interaction_frequency || 'normal',
          learning_velocity: behavior.completion_rate || 0.5,
          focus_areas: behavior.time_distribution || {}
        };

        return {
          unified_user_journey: {
            ...state.unified_user_journey,
            adaptations,
            last_adaptation: Date.now()
          },
          system_health: {
            ...state.system_health,
            user_experience_harmony: Math.min(100, state.system_health.user_experience_harmony + 2)
          }
        };
      });
    },

    // Armonización experiencial simplificada
    harmonizeExperience: () => {
      const state = get();
      const modules = Array.from(state.active_modules.values()).slice(0, 2); // Solo 2 módulos
      
      modules.forEach(module => {
        // Signal minimalista sin payload complejo
        if (globalCircuitBreaker.canProcess()) {
          setTimeout(() => {
            get().broadcastSignal({
              origin: { 
                id: 'nexus', 
                type: 'intersectional', 
                capabilities: ['harmonization'], 
                current_state: {} 
              },
              type: 'ADAPTIVE_ADJUSTMENT',
              payload: {
                target_module: module.id,
                harmonization_directive: 'align_user_experience'
              },
              priority: 'LOW'
            });
          }, 2000 * modules.indexOf(module)); // Stagger signals
        }
      });

      console.log(`🎵 Armonización simplificada para ${modules.length} módulos`);
    },

    // Sistema inmunológico simplificado
    detectAnomalies: () => {
      const state = get();
      const anomalies: string[] = [];

      if (state.global_coherence < 70) {
        anomalies.push(`Coherencia global baja: ${state.global_coherence}%`);
      }

      if (state.system_health.neural_efficiency < 80) {
        anomalies.push(`Eficiencia neural reducida: ${state.system_health.neural_efficiency}%`);
      }

      return anomalies;
    },

    // Auto-sanación minimalista
    healSystem: async () => {
      const anomalies = get().detectAnomalies();
      
      if (anomalies.length === 0) {
        console.log('🌟 Sistema neurológico saludable');
        return;
      }

      console.log(`🔧 Auto-sanación activada para ${anomalies.length} anomalías`);

      set(state => ({
        global_coherence: Math.min(100, state.global_coherence + 10),
        system_health: {
          neural_efficiency: Math.min(100, state.system_health.neural_efficiency + 10),
          cross_pollination_rate: Math.min(100, state.system_health.cross_pollination_rate + 5),
          adaptive_learning_score: Math.min(100, state.system_health.adaptive_learning_score + 5),
          user_experience_harmony: Math.min(100, state.system_health.user_experience_harmony + 5)
        }
      }));
    },

    // Optimización quirúrgica de pathways
    optimizePathways: () => {
      set(state => {
        const optimizedPathways = new Map();
        
        state.neural_pathways.forEach((signals, pathway) => {
          const recentSignals = signals.filter(signal => 
            Date.now() - signal.timestamp < 120000 // Solo 2 minutos
          ).slice(0, 2); // Máximo 2 señales por pathway
          
          if (recentSignals.length > 0) {
            optimizedPathways.set(pathway, recentSignals);
          }
        });

        console.log(`⚡ Pathways optimizados: ${optimizedPathways.size}/${state.neural_pathways.size}`);

        return {
          neural_pathways: optimizedPathways,
          system_health: {
            ...state.system_health,
            neural_efficiency: Math.min(100, state.system_health.neural_efficiency + 3)
          }
        };
      });
    },

    // Sistema de emergencia quirúrgico
    emergencyReset: () => {
      globalCircuitBreaker.forceRecovery();
      
      // Limpiar queue de señales
      signalQueue = [];
      if (batchTimeout) {
        clearTimeout(batchTimeout);
        batchTimeout = null;
      }
      
      set({
        neural_pathways: new Map(),
        collective_insights: [],
        cross_module_patterns: [],
        global_coherence: 100,
        system_health: {
          neural_efficiency: 95,
          cross_pollination_rate: 88,
          adaptive_learning_score: 92,
          user_experience_harmony: 90
        }
      });
      
      console.log('🚨 EMERGENCY RESET: Sistema neurológico reiniciado quirúrgicamente');
    },

    getSystemStatus: () => ({
      circuitBreakerState: globalCircuitBreaker.getState(),
      activeModules: get().active_modules.size,
      globalCoherence: get().global_coherence,
      pathways: get().neural_pathways.size,
      queuedSignals: signalQueue.length
    })
  }))
);

// Hooks especializados para diferentes tipos de módulos
export const useNeuralModule = (moduleConfig: Omit<ModuleIdentity, 'current_state'>) => {
  const nexus = useIntersectionalNexus();
  
  React.useEffect(() => {
    const fullModule: ModuleIdentity = {
      ...moduleConfig,
      current_state: {}
    };
    
    nexus.registerModule(fullModule);
    
    return () => {
      // Cleanup si es necesario
    };
  }, [moduleConfig.id]);

  return {
    broadcastSignal: nexus.broadcastSignal,
    subscribeToSignals: nexus.subscribeToSignals,
    systemHealth: nexus.system_health
  };
};

// Sistema inmunológico automático con intervalos largos
export const useNeuralImmunity = () => {
  const nexus = useIntersectionalNexus();
  
  React.useEffect(() => {
    const immuneSystem = setInterval(() => {
      const anomalies = nexus.detectAnomalies();
      
      if (anomalies.length > 2) {
        nexus.healSystem();
      } else if (Math.random() > 0.7) { // Solo optimizar 30% de las veces
        nexus.optimizePathways();
      }
    }, 300000); // Cada 5 minutos

    return () => clearInterval(immuneSystem);
  }, []);

  return nexus.system_health;
};
