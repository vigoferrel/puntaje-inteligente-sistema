
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDiagnosticSystem } from '@/hooks/diagnostic/useDiagnosticSystem';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useValidationSystem } from './useValidationSystem';
import { toast } from '@/components/ui/use-toast';

interface SystemState {
  phase: 'initializing' | 'ready' | 'error';
  activeModule: 'chat' | 'exercise' | 'plan' | 'diagnostic' | 'dashboard';
  loading: boolean;
  lastSync: Date | null;
}

interface CurrentContext {
  activeModule: string;
  activeSubject: string;
  selectedPrueba: string;
  nodeId?: string;
  exerciseId?: string;
  coherenceLevel: number;
}

/**
 * Hook unificado simplificado para LectoGuía
 * Usa el nuevo sistema diagnóstico consolidado
 */
export const useLectoGuiaUnified = (userId?: string) => {
  const [systemState, setSystemState] = useState<SystemState>({
    phase: 'initializing',
    activeModule: 'chat',
    loading: false,
    lastSync: null
  });

  const [currentContext, setCurrentContext] = useState<CurrentContext>({
    activeModule: 'chat',
    activeSubject: 'general',
    selectedPrueba: 'COMPETENCIA_LECTORA',
    coherenceLevel: 100
  });

  // Hook diagnóstico simplificado
  const diagnosticSystem = useDiagnosticSystem();
  
  // Hook de planes de aprendizaje
  const { 
    plans, 
    currentPlan, 
    fetchLearningPlans, 
    createLearningPlan 
  } = useLearningPlans();

  // Sistema de validación
  const {
    validationStatus,
    validateSystemCoherence
  } = useValidationSystem();

  // Referencias para evitar re-renders innecesarios
  const lastValidationRef = useRef<Date | null>(null);

  // Sincronización simplificada con backend
  const syncWithBackend = useCallback(async () => {
    if (!userId) return;

    try {
      setSystemState(prev => ({ ...prev, loading: true }));

      // Sincronizar solo lo esencial
      await Promise.all([
        diagnosticSystem.initializeSystem(),
        fetchLearningPlans(userId)
      ]);

      // Validar coherencia básica
      await validateSystemCoherence();

      setSystemState(prev => ({
        ...prev,
        phase: 'ready',
        loading: false,
        lastSync: new Date()
      }));

      console.log('✅ LectoGuía sincronizado exitosamente');

    } catch (error) {
      console.error('❌ Error sincronizando LectoGuía:', error);
      setSystemState(prev => ({
        ...prev,
        phase: 'error',
        loading: false
      }));

      toast({
        title: "Error de sincronización",
        description: "No se pudo conectar con el sistema educativo",
        variant: "destructive"
      });
    }
  }, [userId, diagnosticSystem, fetchLearningPlans, validateSystemCoherence]);

  // Navegación entre módulos
  const navigateToModule = useCallback((module: string, context?: Partial<CurrentContext>) => {
    setCurrentContext(prev => ({
      ...prev,
      activeModule: module,
      ...context
    }));

    setSystemState(prev => ({
      ...prev,
      activeModule: module as any
    }));
  }, []);

  // Manejo simplificado de acciones del sistema
  const handleSystemAction = useCallback(async (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case 'REVALIDATE_SYSTEM':
        await validateSystemCoherence();
        break;

      case 'SYNC_WITH_BACKEND':
        await syncWithBackend();
        break;

      case 'CREATE_PLAN':
        if (userId && action.payload?.title) {
          await createLearningPlan(
            userId,
            action.payload.title,
            action.payload.description
          );
        }
        break;

      case 'NAVIGATE_TO_PLAN':
        navigateToModule('plan');
        break;

      case 'NAVIGATE_TO_DIAGNOSTIC':
        navigateToModule('diagnostic');
        break;

      case 'START_EXERCISE':
        navigateToModule('exercise', {
          nodeId: action.payload?.nodeId
        });
        break;

      default:
        console.warn('Acción no reconocida:', action.type);
    }
  }, [userId, validateSystemCoherence, syncWithBackend, createLearningPlan, navigateToModule]);

  // Inicialización del sistema
  useEffect(() => {
    if (userId && systemState.phase === 'initializing') {
      syncWithBackend();
    }
  }, [userId, systemState.phase, syncWithBackend]);

  // Validación periódica simplificada
  useEffect(() => {
    if (systemState.phase === 'ready') {
      const interval = setInterval(() => {
        const now = new Date();
        if (!lastValidationRef.current || 
            (now.getTime() - lastValidationRef.current.getTime()) > 300000) {
          validateSystemCoherence();
          lastValidationRef.current = now;
        }
      }, 300000); // 5 minutos

      return () => clearInterval(interval);
    }
  }, [systemState.phase, validateSystemCoherence]);

  // Integraciones simplificadas
  const diagnosticIntegration = {
    isReady: diagnosticSystem.isSystemReady,
    availableTests: diagnosticSystem.diagnosticTests.length,
    systemMetrics: diagnosticSystem.systemMetrics,
    officialExercises: diagnosticSystem.learningNodes.length,
    startDiagnostic: () => navigateToModule('diagnostic'),
    generateExercise: (nodeId?: string) => handleSystemAction({
      type: 'START_EXERCISE',
      payload: { nodeId }
    })
  };

  const planIntegration = {
    currentPlan,
    allPlans: plans,
    navigateToPlan: () => navigateToModule('plan'),
    createPlan: (title: string, description?: string) => handleSystemAction({
      type: 'CREATE_PLAN',
      payload: { title, description }
    })
  };

  const dashboardSync = {
    lastSync: systemState.lastSync,
    isConnected: systemState.phase === 'ready',
    nodeProgress: diagnosticSystem.learningNodes.length,
    recommendedPath: diagnosticSystem.tier1Nodes.slice(0, 5)
  };

  const nodeValidation = {
    totalNodes: diagnosticSystem.learningNodes.length,
    tier1Nodes: diagnosticSystem.tier1Nodes.length,
    isCoherent: validationStatus.isValid,
    lastValidation: lastValidationRef.current
  };

  return {
    // Estado del sistema
    systemState,
    currentContext,

    // Validaciones
    validationStatus,

    // Integraciones simplificadas
    diagnosticIntegration,
    planIntegration,
    dashboardSync,
    nodeValidation,

    // Acciones
    handleSystemAction,
    navigateToModule,
    syncWithBackend
  };
};
