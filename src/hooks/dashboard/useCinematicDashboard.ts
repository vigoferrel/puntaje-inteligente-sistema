
import { useMemo } from 'react';
import { useGlobalStore } from '@/store/globalStore';

export const useCinematicDashboard = () => {
  const systemState = useGlobalStore(state => state.system);
  const user = useGlobalStore(state => state.user);
  const learningNodes = useGlobalStore(state => state.learningNodes);
  const plans = useGlobalStore(state => state.plans);
  const diagnostics = useGlobalStore(state => state.diagnostics);
  const currentPlan = useGlobalStore(state => state.currentPlan);
  const cinematicMode = useGlobalStore(state => state.ui.cinematicMode);

  const dashboardData = useMemo(() => {
    // Datos simulados más realistas para el dashboard
    const mockStats = {
      nodes: learningNodes.length || 277,
      plans: plans.length || 1,
      diagnostics: diagnostics.length || 2,
      currentPlan: currentPlan ? 1 : 1, // Simular que siempre hay un plan activo
    };

    return {
      stats: mockStats,
      system: {
        isInitialized: systemState.isInitialized || true,
        isLoading: systemState.isLoading || false,
        phase: systemState.phase || 'SKILL_TRAINING',
      },
      user: {
        id: user?.id || 'user-demo',
        name: user?.name || 'Estudiante PAES',
        email: user?.email || 'estudiante@paes.cl',
      },
      ui: {
        cinematicMode: cinematicMode || false,
      },
      // Datos adicionales para el dashboard
      progress: {
        globalProgress: 65,
        weeklyGoal: 85,
        studyStreak: 7,
        totalStudyTime: 140, // horas
      },
      performance: {
        averageScore: 625,
        targetScore: 700,
        improvement: 45,
        lastTestDate: new Date().toISOString(),
      }
    };
  }, [
    learningNodes.length,
    plans.length, 
    diagnostics.length,
    currentPlan,
    systemState.isInitialized,
    systemState.isLoading,
    systemState.phase,
    user?.id,
    user?.name,
    user?.email,
    cinematicMode,
  ]);

  return dashboardData;
};
