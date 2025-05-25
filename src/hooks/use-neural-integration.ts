
import { useEffect, useRef } from 'react';
import { useNeuralModule } from '@/core/intersectional-nexus/IntersectionalNexus';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook quirúrgico para integración neurológica de cualquier módulo
 */
export const useNeuralIntegration = (
  moduleType: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard',
  capabilities: string[] = [],
  currentState: any = {}
) => {
  const { user } = useAuth();
  const moduleId = useRef(`${moduleType}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`);
  
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

  // Auto-broadcast de cambios de estado
  const lastStateRef = useRef(currentState);
  useEffect(() => {
    if (JSON.stringify(currentState) !== JSON.stringify(lastStateRef.current)) {
      neural.broadcastSignal({
        origin: {
          id: moduleId.current,
          type: moduleType,
          capabilities: capabilities,
          current_state: currentState
        },
        type: 'DATA_MUTATION',
        payload: {
          previous_state: lastStateRef.current,
          new_state: currentState,
          user_id: user?.id,
          timestamp: Date.now()
        },
        priority: 'MEDIUM'
      });
      
      lastStateRef.current = currentState;
    }
  }, [currentState, neural, moduleType, capabilities, user?.id]);

  // Broadcast de acciones del usuario
  const broadcastUserAction = (action: string, payload: any = {}) => {
    neural.broadcastSignal({
      origin: {
        id: moduleId.current,
        type: moduleType,
        capabilities: capabilities,
        current_state: currentState
      },
      type: 'USER_ACTION',
      payload: {
        action,
        user_id: user?.id,
        module_context: currentState,
        ...payload
      },
      priority: 'HIGH'
    });
  };

  // Suscribirse a recomendaciones interseccionales
  useEffect(() => {
    const unsubscribe = neural.subscribeToSignals(moduleId.current, (signal) => {
      if (signal.type === 'RECOMMENDATION_SYNTHESIS') {
        console.log(`🎯 ${moduleType} recibió recomendación:`, signal.payload);
        // Aquí cada módulo puede decidir cómo usar la recomendación
      }
      
      if (signal.type === 'ADAPTIVE_ADJUSTMENT') {
        console.log(`⚡ ${moduleType} adaptándose:`, signal.payload);
        // Aquí cada módulo puede ajustar su comportamiento
      }
    });

    return unsubscribe;
  }, [neural, moduleType]);

  return {
    moduleId: moduleId.current,
    broadcastUserAction,
    systemHealth: neural.systemHealth,
    
    // Helpers especializados
    notifyProgress: (progress: any) => broadcastUserAction('PROGRESS_UPDATE', progress),
    notifyCompletion: (completion: any) => broadcastUserAction('TASK_COMPLETION', completion),
    notifyEngagement: (engagement: any) => broadcastUserAction('USER_ENGAGEMENT', engagement),
    requestRecommendation: (context: any) => broadcastUserAction('REQUEST_RECOMMENDATION', context)
  };
};

/**
 * Hook para módulos que generan insights interseccionales
 */
export const useInsightGenerator = (moduleType: string) => {
  const neural = useNeuralIntegration(moduleType as any, ['insight_generation', 'pattern_recognition']);

  const generateInsight = (type: string, data: any, confidence: number = 0.8) => {
    neural.broadcastUserAction('GENERATE_INSIGHT', {
      insight_type: type,
      data,
      confidence,
      source_module: moduleType,
      timestamp: Date.now()
    });
  };

  const sharePattern = (pattern: any, relevance: string[] = []) => {
    neural.broadcastUserAction('SHARE_PATTERN', {
      pattern,
      relevant_to_modules: relevance,
      source_module: moduleType,
      timestamp: Date.now()
    });
  };

  return {
    generateInsight,
    sharePattern,
    systemHealth: neural.systemHealth
  };
};
