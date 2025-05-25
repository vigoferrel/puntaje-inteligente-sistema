
import { useState, useCallback, useRef, useEffect } from 'react';
import { IntersectionalState, IntersectionalContext, CrossModuleAction } from '@/types/intersectional-types';
import { useUnifiedState } from '@/hooks/useUnifiedState';

/**
 * Hook central para el estado interseccional de LectoGuía
 * Coordina el estado entre todos los módulos y el ecosistema
 */
export const useIntersectionalState = (userId?: string) => {
  const { userProgress, systemMetrics } = useUnifiedState();
  const actionQueueRef = useRef<CrossModuleAction[]>([]);
  
  const [intersectionalState, setIntersectionalState] = useState<IntersectionalState>({
    context: {
      userId: userId || '',
      currentSubject: 'COMPETENCIA_LECTORA',
      activeModule: 'chat',
      crossModuleMetrics: {
        totalStudyTime: systemMetrics.todayStudyTime,
        exercisesCompleted: userProgress.completedExercises,
        averagePerformance: userProgress.overallScore,
        streakDays: userProgress.streak
      }
    },
    modules: {
      chat: {
        isActive: true,
        lastUpdated: new Date(),
        performance: 85,
        needsAttention: false,
        activeConversation: null,
        messageCount: 0
      },
      exercise: {
        isActive: false,
        lastUpdated: new Date(),
        performance: 75,
        needsAttention: false,
        currentExercise: null,
        completionRate: 0
      },
      progress: {
        isActive: false,
        lastUpdated: new Date(),
        performance: 80,
        needsAttention: false,
        currentLevel: userProgress.level,
        progressToday: 0
      },
      subject: {
        isActive: false,
        lastUpdated: new Date(),
        performance: 70,
        needsAttention: true,
        focusAreas: ['comprensión', 'análisis'],
        masteryLevels: {}
      }
    },
    ecosystem: {
      financial: {
        connected: false,
        lastSync: null,
        recommendations: []
      },
      diagnostic: {
        connected: false,
        lastAssessment: null,
        nextRecommended: null
      },
      planning: {
        connected: false,
        activePlan: null,
        alignment: 0
      }
    }
  });

  // Actualizar contexto interseccional
  const updateContext = useCallback((updates: Partial<IntersectionalContext>) => {
    setIntersectionalState(prev => ({
      ...prev,
      context: { ...prev.context, ...updates }
    }));
  }, []);

  // Cambiar módulo activo con sincronización
  const activateModule = useCallback((module: 'chat' | 'exercise' | 'progress' | 'subject') => {
    setIntersectionalState(prev => ({
      ...prev,
      context: { ...prev.context, activeModule: module },
      modules: {
        ...prev.modules,
        [module]: {
          ...prev.modules[module],
          isActive: true,
          lastUpdated: new Date()
        },
        // Desactivar otros módulos
        ...Object.keys(prev.modules).reduce((acc, key) => {
          if (key !== module) {
            acc[key as keyof typeof prev.modules] = {
              ...prev.modules[key as keyof typeof prev.modules],
              isActive: false
            };
          }
          return acc;
        }, {} as any)
      }
    }));
  }, []);

  // Sistema de acciones entre módulos
  const dispatchCrossModuleAction = useCallback((action: CrossModuleAction) => {
    actionQueueRef.current.push(action);
    
    // Procesar acción inmediatamente si es de alta prioridad
    if (action.priority === 'high') {
      processCrossModuleAction(action);
    }
  }, []);

  const processCrossModuleAction = useCallback((action: CrossModuleAction) => {
    console.log(`🔄 Procesando acción interseccional: ${action.type} de ${action.source} a ${action.target}`);
    
    switch (action.type) {
      case 'UPDATE_CONTEXT':
        updateContext(action.payload);
        break;
        
      case 'SYNC_METRICS':
        setIntersectionalState(prev => ({
          ...prev,
          context: {
            ...prev.context,
            crossModuleMetrics: { ...prev.context.crossModuleMetrics, ...action.payload }
          }
        }));
        break;
        
      case 'REQUEST_RECOMMENDATION':
        // Generar recomendación basada en estado interseccional
        generateIntersectionalRecommendation(action.payload);
        break;
        
      case 'TRIGGER_INTEGRATION':
        // Activar integración con otro módulo del ecosistema
        triggerEcosystemIntegration(action.payload.module, action.payload.data);
        break;
    }
  }, [updateContext]);

  // Generar recomendaciones interseccionales
  const generateIntersectionalRecommendation = useCallback((context: any) => {
    // Lógica para generar recomendaciones basadas en el estado completo
    console.log('🎯 Generando recomendación interseccional:', context);
  }, []);

  // Integración con ecosistema
  const triggerEcosystemIntegration = useCallback((module: string, data: any) => {
    setIntersectionalState(prev => ({
      ...prev,
      ecosystem: {
        ...prev.ecosystem,
        [module]: {
          ...prev.ecosystem[module as keyof typeof prev.ecosystem],
          connected: true,
          lastSync: new Date()
        }
      }
    }));
  }, []);

  // Sincronización periódica con ecosistema
  useEffect(() => {
    const interval = setInterval(() => {
      // Sincronizar métricas con estado unificado
      updateContext({
        crossModuleMetrics: {
          totalStudyTime: systemMetrics.todayStudyTime,
          exercisesCompleted: userProgress.completedExercises,
          averagePerformance: userProgress.overallScore,
          streakDays: userProgress.streak
        }
      });
      
      // Procesar cola de acciones pendientes
      while (actionQueueRef.current.length > 0) {
        const action = actionQueueRef.current.shift();
        if (action) {
          processCrossModuleAction(action);
        }
      }
    }, 5000); // Cada 5 segundos

    return () => clearInterval(interval);
  }, [updateContext, processCrossModuleAction, systemMetrics, userProgress]);

  return {
    intersectionalState,
    updateContext,
    activateModule,
    dispatchCrossModuleAction,
    
    // Helpers para módulos específicos
    getChatContext: () => ({
      ...intersectionalState.context,
      moduleState: intersectionalState.modules.chat
    }),
    
    getExerciseContext: () => ({
      ...intersectionalState.context,
      moduleState: intersectionalState.modules.exercise,
      diagnosticLevel: intersectionalState.ecosystem.diagnostic.lastAssessment ? 'assessed' : 'pending'
    }),
    
    getProgressContext: () => ({
      ...intersectionalState.context,
      moduleState: intersectionalState.modules.progress,
      ecosystemAlignment: intersectionalState.ecosystem.planning.alignment
    }),
    
    getSubjectContext: () => ({
      ...intersectionalState.context,
      moduleState: intersectionalState.modules.subject,
      financialAlignment: intersectionalState.context.financialGoals
    })
  };
};
