
import { useState, useEffect, useCallback } from 'react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { toast } from '@/components/ui/use-toast';

interface SimpleSystemState {
  phase: 'initializing' | 'ready' | 'error';
  activeModule: string;
  loading: boolean;
}

interface SimpleValidationStatus {
  isValid: boolean;
  issuesCount: number;
}

/**
 * Hook simplificado y quirúrgico para LectoGuía
 * Arquitectura minimalista sin complejidad innecesaria
 */
export const useLectoGuiaSimplified = (userId?: string) => {
  const [systemState, setSystemState] = useState<SimpleSystemState>({
    phase: 'initializing',
    activeModule: 'chat',
    loading: false
  });

  const [validationStatus] = useState<SimpleValidationStatus>({
    isValid: true,
    issuesCount: 0
  });

  // Sistemas core
  const diagnosticSystem = useDiagnosticSystem();
  const { plans, fetchLearningPlans } = useLearningPlans();

  // Sincronización simplificada
  const syncWithBackend = useCallback(async () => {
    if (!userId) return;

    try {
      setSystemState(prev => ({ ...prev, loading: true }));
      
      await Promise.all([
        diagnosticSystem.initializeSystem(),
        fetchLearningPlans(userId)
      ]);

      setSystemState({
        phase: 'ready',
        activeModule: 'chat',
        loading: false
      });

    } catch (error) {
      console.error('❌ Error sincronizando:', error);
      setSystemState({
        phase: 'error',
        activeModule: 'chat',
        loading: false
      });
    }
  }, [userId, diagnosticSystem, fetchLearningPlans]);

  // Navegación simple
  const navigateToModule = useCallback((module: string) => {
    setSystemState(prev => ({
      ...prev,
      activeModule: module
    }));
  }, []);

  // Handler de acciones simplificado
  const handleSystemAction = useCallback(async (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case 'REVALIDATE_SYSTEM':
        console.log('🔄 Revalidando sistema...');
        break;
      case 'SYNC_WITH_BACKEND':
        await syncWithBackend();
        break;
      case 'NAVIGATE_TO_DIAGNOSTIC':
        navigateToModule('diagnostic');
        break;
      default:
        console.warn('Acción no reconocida:', action.type);
    }
  }, [syncWithBackend, navigateToModule]);

  // Inicialización automática
  useEffect(() => {
    if (userId && systemState.phase === 'initializing') {
      syncWithBackend();
    }
  }, [userId, systemState.phase, syncWithBackend]);

  // Integraciones simples
  const diagnosticIntegration = {
    isReady: diagnosticSystem.isSystemReady,
    availableTests: diagnosticSystem.diagnosticTests.length,
    systemMetrics: diagnosticSystem.systemMetrics,
    startDiagnostic: () => navigateToModule('diagnostic')
  };

  const planIntegration = {
    allPlans: plans,
    navigateToPlan: () => navigateToModule('plan')
  };

  const dashboardSync = {
    isConnected: systemState.phase === 'ready',
    nodeProgress: diagnosticSystem.learningNodes.length
  };

  const nodeValidation = {
    totalNodes: diagnosticSystem.learningNodes.length,
    isCoherent: validationStatus.isValid
  };

  return {
    // Estado simplificado
    systemState,
    currentContext: { activeModule: systemState.activeModule },
    validationStatus,

    // Integraciones minimalistas
    diagnosticIntegration,
    planIntegration,
    dashboardSync,
    nodeValidation,

    // Acciones esenciales
    handleSystemAction,
    navigateToModule,
    syncWithBackend
  };
};
