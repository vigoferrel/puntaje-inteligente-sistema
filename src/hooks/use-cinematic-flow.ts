
import { useState, useCallback, useRef } from 'react';
import { universalHub } from '@/core/universal-hub/UniversalDataHub';
import { orchestrator } from '@/core/orchestrators/CentralizedStateManager';

/**
 * Hook para flujo cinematográfico unificado
 * Maneja transiciones suaves entre módulos sin duplicaciones
 */
export const useCinematicFlow = (userId?: string) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<string>('dashboard');
  const [flowHistory, setFlowHistory] = useState<string[]>(['dashboard']);
  const transitionRef = useRef<number | null>(null);

  /**
   * TRANSICIÓN CINEMATOGRÁFICA PRINCIPAL
   */
  const executeFlow = useCallback(async (
    targetFlow: string, 
    payload?: any,
    options?: { 
      duration?: number; 
      easing?: string; 
      preload?: boolean;
      context?: string;
    }
  ) => {
    if (!userId) return false;

    const { duration = 600, easing = 'easeInOut', preload = true, context } = options || {};

    console.log(`🎬 Iniciando flujo cinematográfico: ${currentFlow} → ${targetFlow}`);

    setIsTransitioning(true);

    try {
      // Precargar datos del destino si es necesario
      if (preload) {
        await preloadFlowData(targetFlow, userId, payload);
      }

      // Ejecutar transición con el orquestador central
      const result = await orchestrator.orchestrateEducationalFlow(userId, {
        type: `NAVIGATE_TO_${targetFlow.toUpperCase()}`,
        payload: { ...payload, context, previousFlow: currentFlow }
      });

      if (result.success) {
        // Actualizar estado del flujo
        setCurrentFlow(targetFlow);
        setFlowHistory(prev => [...prev.slice(-9), targetFlow]); // Mantener últimos 10

        // Simular duración de transición cinematográfica
        transitionRef.current = window.setTimeout(() => {
          setIsTransitioning(false);
          console.log(`✨ Transición completada: ${targetFlow}`);
        }, duration);

        return true;
      } else {
        throw new Error(result.error || 'Flow transition failed');
      }

    } catch (error) {
      console.error(`❌ Error en transición cinematográfica:`, error);
      setIsTransitioning(false);
      return false;
    }
  }, [userId, currentFlow]);

  /**
   * PRECARGA DE DATOS PARA FLUJO
   */
  const preloadFlowData = async (flow: string, userId: string, payload?: any) => {
    const preloadMap = {
      'evaluation': () => universalHub.getEvaluationData(userId, payload?.prueba || 'COMPETENCIA_LECTORA'),
      'lectoguia': () => universalHub.getLectoGuiaData(userId, payload?.subject || 'general'),
      'dashboard': () => universalHub.getDashboardData(userId),
      'plan': () => universalHub.getCentralizedData(`plans_${userId}`, async () => ({})),
      'diagnostic': () => universalHub.getCentralizedData(`diagnostic_${userId}`, async () => ({}))
    };

    const preloader = preloadMap[flow as keyof typeof preloadMap];
    if (preloader) {
      await preloader();
      console.log(`🚀 Datos precargados para flujo: ${flow}`);
    }
  };

  /**
   * FLUJOS ESPECÍFICOS OPTIMIZADOS
   */
  const startEvaluation = useCallback((prueba: string, config?: any) => {
    return executeFlow('evaluation', { prueba, config }, {
      duration: 800,
      easing: 'easeOut',
      preload: true,
      context: `evaluation:${prueba}`
    });
  }, [executeFlow]);

  const navigateToLectoGuia = useCallback((subject?: string, nodeId?: string) => {
    return executeFlow('lectoguia', { subject, nodeId }, {
      duration: 600,
      easing: 'easeInOut',
      preload: true,
      context: `lectoguia:${subject || 'general'}`
    });
  }, [executeFlow]);

  const showDashboard = useCallback((section?: string) => {
    return executeFlow('dashboard', { section }, {
      duration: 500,
      easing: 'easeInOut',
      preload: true,
      context: `dashboard:${section || 'overview'}`
    });
  }, [executeFlow]);

  const openStudyPlan = useCallback((planId?: string) => {
    return executeFlow('plan', { planId }, {
      duration: 700,
      easing: 'easeOut',
      preload: true,
      context: `plan:${planId || 'current'}`
    });
  }, [executeFlow]);

  const startDiagnostic = useCallback((testId?: string) => {
    return executeFlow('diagnostic', { testId }, {
      duration: 800,
      easing: 'easeOut',
      preload: true,
      context: `diagnostic:${testId || 'adaptive'}`
    });
  }, [executeFlow]);

  /**
   * NAVEGACIÓN CON HISTORIAL
   */
  const goBack = useCallback(() => {
    if (flowHistory.length > 1) {
      const previousFlow = flowHistory[flowHistory.length - 2];
      return executeFlow(previousFlow, {}, {
        duration: 400,
        easing: 'easeIn',
        preload: false,
        context: 'navigation:back'
      });
    }
    return false;
  }, [flowHistory, executeFlow]);

  const canGoBack = flowHistory.length > 1;

  /**
   * CONTEXTO CINEMATOGRÁFICO
   */
  const getCinematicContext = () => ({
    currentFlow,
    flowHistory,
    isTransitioning,
    canGoBack,
    progressPercentage: isTransitioning ? Math.random() * 100 : 100
  });

  /**
   * MÉTRICAS DEL FLUJO
   */
  const getFlowMetrics = () => ({
    totalFlows: flowHistory.length,
    currentSession: flowHistory,
    isActive: isTransitioning,
    hubMetrics: universalHub.getHubMetrics(),
    orchestrationMetrics: orchestrator.getOrchestrationMetrics()
  });

  /**
   * LIMPIEZA
   */
  const cleanup = useCallback(() => {
    if (transitionRef.current) {
      clearTimeout(transitionRef.current);
      transitionRef.current = null;
    }
    setIsTransitioning(false);
  }, []);

  return {
    // Estado del flujo
    currentFlow,
    isTransitioning,
    flowHistory,
    canGoBack,

    // Acciones cinematográficas
    executeFlow,
    startEvaluation,
    navigateToLectoGuia,
    showDashboard,
    openStudyPlan,
    startDiagnostic,
    goBack,

    // Contexto y métricas
    getCinematicContext,
    getFlowMetrics,
    cleanup
  };
};
