
import { useCallback, useMemo } from 'react';
import { useDiagnosticFlow } from '@/hooks/diagnostic/useDiagnosticFlow';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook central para el flujo educativo
 * Coordina diagnósticos, planes y navegación
 */
export const useEducationalFlow = () => {
  const { user } = useAuth();
  const diagnosticFlow = useDiagnosticFlow();
  const { plans, currentPlan, fetchLearningPlans } = useLearningPlans();

  // Navegación contextual
  const navigateToContext = useCallback((context: string, data?: any) => {
    switch (context) {
      case 'diagnostic':
        if (data?.testId) {
          diagnosticFlow.selectTest(data.testId);
        }
        break;
      case 'plan':
        if (user?.id && plans.length === 0) {
          fetchLearningPlans(user.id);
        }
        break;
      default:
        console.log(`Navegando a contexto: ${context}`, data);
    }
  }, [diagnosticFlow, user?.id, plans.length, fetchLearningPlans]);

  // Estado consolidado del flujo educativo
  const flowState = useMemo(() => ({
    // Diagnósticos
    diagnostic: {
      isActive: diagnosticFlow.isActive,
      progress: diagnosticFlow.progress,
      availableTests: diagnosticFlow.availableTests.length,
      canStart: diagnosticFlow.systemReady && !diagnosticFlow.isActive,
      results: diagnosticFlow.results
    },
    
    // Planes de aprendizaje
    learning: {
      currentPlan,
      totalPlans: plans.length,
      hasActivePlan: !!currentPlan,
      canCreatePlan: !!user?.id
    },
    
    // Estado general
    user: {
      isAuthenticated: !!user,
      id: user?.id,
      name: user?.email
    },
    
    // Coherencia del sistema
    isCoherent: diagnosticFlow.systemReady && !!user?.id
  }), [diagnosticFlow, currentPlan, plans.length, user]);

  // Acciones educativas
  const actions = useMemo(() => ({
    startDiagnostic: (testId?: string) => {
      if (testId) {
        diagnosticFlow.selectTest(testId);
      }
      return diagnosticFlow.startDiagnostic();
    },
    
    completeDiagnostic: diagnosticFlow.finishDiagnostic,
    
    createLearningPlan: async (title: string, description?: string) => {
      if (!user?.id) return false;
      
      // Aquí se integraría con el servicio de planes
      console.log('Creando plan:', { title, description, userId: user.id });
      return true;
    },
    
    navigateToContext,
    
    syncSystem: async () => {
      if (user?.id) {
        await fetchLearningPlans(user.id);
      }
    }
  }), [diagnosticFlow, user?.id, navigateToContext, fetchLearningPlans]);

  return {
    flowState,
    actions,
    
    // Acceso directo a subsistemas para casos específicos
    diagnostic: diagnosticFlow,
    plans: { plans, currentPlan }
  };
};
