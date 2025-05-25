/**
 * NEXUS INTERSECCIONAL DESINFECTADO - Sistema Nervioso Digital v3.0
 * Arquitectura quirúrgica sin bucles infinitos y con batching optimizado
 */

import React from 'react';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { universalHub } from '@/core/universal-hub/UniversalDataHub';
import { EmergencyCircuitBreaker } from '@/utils/circuit-breaker';

// Circuit Breaker Global Desinfectado
const globalCircuitBreaker = new EmergencyCircuitBreaker({
  maxSignalsPerSecond: 5,  // Más permisivo
  cooldownPeriod: 1500,    // Más rápido
  emergencyThreshold: 8,   // Más tolerante
  autoRecoveryTime: 5000   // Recovery más rápido
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

// Queue de señales con batching optimizado y menos verboso
let signalQueue: NeuralSignal[] = [];
let batchTimeout: NodeJS.Timeout | null = null;
let lastBatchLog = 0;

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
      
      // Limitar historial aún más agresivamente
      if (pathway.length > 1) {
        pathway.splice(0, pathway.length - 1);
      }
    });
    
    return { neural_pathways: newPathways };
  });
  
  // Log solo cada 5 minutos para reducir spam
  const now = Date.now();
  if (now - lastBatchLog > 300000) {
    console.log(`🧠 Sistema neural procesando ${signalsToProcess.length} señales`);
    lastBatchLog = now;
  }
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
    // Estado inicial optimizado
    active_modules: new Map(),
    neural_pathways: new Map(),
    global_coherence: 100,
    collective_insights: [],
    cross_module_patterns: [],
    unified_user_journey: null,
    system_health: {
      neural_efficiency: 98,
      cross_pollination_rate: 92,
      adaptive_learning_score: 95,
      user_experience_harmony: 94
    },

    // Registro neurológico ultra-controlado y silencioso
    registerModule: (module: ModuleIdentity) => {
      if (!globalCircuitBreaker.canProcess()) {
        return;
      }

      set(state => {
        const newModules = new Map(state.active_modules);
        newModules.set(module.id, module);
        
        globalCircuitBreaker.recordSignal();
        
        return {
          active_modules: newModules,
          global_coherence: Math.min(100, state.global_coherence + 1)
        };
      });
    },

    // Broadcasting con control de emergencia y batching optimizado
    broadcastSignal: (signal) => {
      if (!globalCircuitBreaker.canProcess()) {
        return;
      }

      const fullSignal: NeuralSignal = {
        ...signal,
        timestamp: Date.now(),
        correlation_id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      // Agregar a queue para batching con delay más largo
      signalQueue.push(fullSignal);
      globalCircuitBreaker.recordSignal();

      // Procesar batch después de un delay más largo para reducir frecuencia
      if (batchTimeout) {
        clearTimeout(batchTimeout);
      }
      
      batchTimeout = setTimeout(() => {
        processBatchedSignals(set);
        batchTimeout = null;
      }, 3000); // Aumentado a 3 segundos

      // Propagar solo señales críticas inmediatamente
      if (signal.priority === 'CRITICAL' || signal.type === 'EMERGENCY_COORDINATION') {
        universalHub.notifySubscribers(`neural_signal_${signal.type}`, fullSignal);
      }
    },

    // Suscripción neurológica
    subscribeToSignals: (moduleId: string, callback: (signal: NeuralSignal) => void) => {
      return universalHub.subscribe(`neural_signal_MODULE_${moduleId}`, callback);
    },

    // Síntesis con control de frecuencia ultra-agresivo
    synthesizeInsights: async () => {
      if (!globalCircuitBreaker.canProcess()) {
        return;
      }

      const state = get();
      const modules = Array.from(state.active_modules.values()).slice(0, 2); // Limitar a 2 módulos
      
      // Síntesis ultra-mínima para evitar sobrecarga
      const insights = modules.map(module => ({
        module_id: module.id,
        module_type: module.type,
        capabilities_utilization: Math.min(module.capabilities.length / 3, 1),
        state_complexity: Math.min(Object.keys(module.current_state || {}).length, 3),
        neural_connections: Math.min(state.neural_pathways.size, 5)
      }));

      // Cross patterns ultra-limitados
      const crossPatterns = [];
      if (modules.length >= 2) {
        const moduleA = modules[0];
        const moduleB = modules[1];
        
        const sharedCapabilities = moduleA.capabilities.filter(cap => 
          moduleB.capabilities.includes(cap)
        ).slice(0, 1); // Solo 1 capacidad compartida
        
        if (sharedCapabilities.length > 0) {
          crossPatterns.push({
            modules: [moduleA.id, moduleB.id],
            shared_capabilities: sharedCapabilities,
            synergy_potential: Math.min(sharedCapabilities.length * 50, 100),
            recommended_integration: `${moduleA.type} ↔ ${moduleB.type}`
          });
        }
      }

      set({
        collective_insights: insights,
        cross_module_patterns: crossPatterns,
        system_health: {
          ...state.system_health,
          cross_pollination_rate: Math.min(100, crossPatterns.length * 50),
          adaptive_learning_score: Math.min(100, insights.length * 40)
        }
      });

      globalCircuitBreaker.recordSignal();
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

    // Sistema inmunológico ultra-simplificado
    detectAnomalies: () => {
      const state = get();
      const anomalies: string[] = [];

      if (state.global_coherence < 50) { // Umbral más permisivo
        anomalies.push(`Coherencia global: ${state.global_coherence}%`);
      }

      if (state.system_health.neural_efficiency < 60) { // Umbral más permisivo
        anomalies.push(`Eficiencia neural: ${state.system_health.neural_efficiency}%`);
      }

      return anomalies;
    },

    // Auto-sanación ultra-silenciosa
    healSystem: async () => {
      const anomalies = get().detectAnomalies();
      
      if (anomalies.length === 0) {
        return;
      }

      set(state => ({
        global_coherence: Math.min(100, state.global_coherence + 15),
        system_health: {
          neural_efficiency: Math.min(100, state.system_health.neural_efficiency + 15),
          cross_pollination_rate: Math.min(100, state.system_health.cross_pollination_rate + 10),
          adaptive_learning_score: Math.min(100, state.system_health.adaptive_learning_score + 10),
          user_experience_harmony: Math.min(100, state.system_health.user_experience_harmony + 10)
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
