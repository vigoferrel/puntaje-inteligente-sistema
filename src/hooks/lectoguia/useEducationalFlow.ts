
import { useCallback, useMemo, useState, useEffect } from 'react';
import { useLearningPlans } from '@/hooks/learning-plans/use-learning-plans';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook central simplificado para el flujo educativo
 * Versión quirúrgica sin dependencias circulares
 */
export const useEducationalFlow = () => {
  const { user } = useAuth();
  const { plans, currentPlan, fetchLearningPlans } = useLearningPlans();
  
  // Estado local simplificado
  const [diagnosticState, setDiagnosticState] = useState({
    isActive: false,
    progress: 0,
    availableTests: 3, // Valor por defecto
    canStart: true,
    results: null
  });

  const [systemInitialized, setSystemInitialized] = useState(false);

  // Inicialización simplificada
  useEffect(() => {
    if (user?.id && !systemInitialized) {
      initializeSystem();
    }
  }, [user?.id, systemInitialized]);

  const initializeSystem = useCallback(async () => {
    try {
      // Solo cargar planes de aprendizaje
      if (user?.id) {
        await fetchLearningPlans(user.id);
      }
      
      // Simular disponibilidad de tests
      setDiagnosticState(prev => ({
        ...prev,
        availableTests: 5,
        canStart: true
      }));
      
      setSystemInitialized(true);
    } catch (error) {
      console.error('Error inicializando sistema:', error);
      // Continuar con valores por defecto
      setSystemInitialized(true);
    }
  }, [user?.id, fetchLearningPlans]);

  // Navegación contextual simplificada
  const navigateToContext = useCallback((context: string, data?: any) => {
    console.log(`Navegando a contexto: ${context}`, data);
    
    switch (context) {
      case 'diagnostic':
        setDiagnosticState(prev => ({ ...prev, isActive: true }));
        break;
      case 'plan':
        if (user?.id && plans.length === 0) {
          fetchLearningPlans(user.id);
        }
        break;
      default:
        console.log(`Contexto: ${context}`);
    }
  }, [user?.id, plans.length, fetchLearningPlans]);

  // Estado consolidado con lógica de coherencia más permisiva
  const flowState = useMemo(() => {
    const isCoherent = systemInitialized && !!user?.id;
    
    return {
      // Diagnósticos
      diagnostic: {
        isActive: diagnosticState.isActive,
        progress: diagnosticState.progress,
        availableTests: diagnosticState.availableTests,
        canStart: diagnosticState.canStart && isCoherent,
        results: diagnosticState.results
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
      
      // Coherencia simplificada
      isCoherent
    };
  }, [diagnosticState, currentPlan, plans.length, user, systemInitialized]);

  // Acciones simplificadas
  const actions = useMemo(() => ({
    startDiagnostic: (testId?: string) => {
      setDiagnosticState(prev => ({ 
        ...prev, 
        isActive: true, 
        progress: 0 
      }));
      console.log('Iniciando diagnóstico:', testId);
      return true;
    },
    
    completeDiagnostic: () => {
      setDiagnosticState(prev => ({ 
        ...prev, 
        isActive: false, 
        progress: 100 
      }));
      console.log('Diagnóstico completado');
      return true;
    },
    
    createLearningPlan: async (title: string, description?: string) => {
      if (!user?.id) return false;
      
      console.log('Creando plan:', { title, description, userId: user.id });
      return true;
    },
    
    navigateToContext,
    
    syncSystem: async () => {
      await initializeSystem();
    }
  }), [user?.id, navigateToContext, initializeSystem]);

  return {
    flowState,
    actions,
    
    // Acceso simplificado a subsistemas
    diagnostic: {
      availableTests: [],
      systemReady: flowState.isCoherent,
      isLoading: !systemInitialized
    },
    plans: { plans, currentPlan }
  };
};
