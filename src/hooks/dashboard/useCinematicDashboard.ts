
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

  const dashboardData = useMemo(() => ({
    stats: {
      nodes: learningNodes.length,
      plans: plans.length,
      diagnostics: diagnostics.length,
      currentPlan: currentPlan ? 1 : 0,
    },
    system: {
      isInitialized: systemState.isInitialized,
      isLoading: systemState.isLoading,
      phase: systemState.phase,
    },
    user: {
      id: user?.id,
      name: user?.name,
      email: user?.email,
    },
    ui: {
      cinematicMode,
    },
  }), [
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
