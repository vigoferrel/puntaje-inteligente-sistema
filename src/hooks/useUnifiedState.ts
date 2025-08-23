
import { useState, useCallback } from 'react';

interface UnifiedState {
  systemReady: boolean;
  currentModule: string;
  userProgress: Record<string, number>;
  notifications: string[];
}

interface SystemMetrics {
  todayStudyTime: number;
  totalExercises: number;
  averageScore: number;
  streakDays: number;
  level: number;
}

export const useUnifiedState = () => {
  const [state, setState] = useState<UnifiedState>({
    systemReady: true,
    currentModule: 'dashboard',
    userProgress: {},
    notifications: []
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    todayStudyTime: 45,
    totalExercises: 127,
    averageScore: 78,
    streakDays: 5,
    level: 3
  });

  const setCurrentModule = useCallback((module: string) => {
    setState(prev => ({ ...prev, currentModule: module }));
  }, []);

  const updateProgress = useCallback((module: string, progress: number) => {
    setState(prev => ({
      ...prev,
      userProgress: { ...prev.userProgress, [module]: progress }
    }));
  }, []);

  const addNotification = useCallback((message: string) => {
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, message]
    }));
  }, []);

  const updateUserProgress = useCallback((module: string, progress: number) => {
    updateProgress(module, progress);
  }, [updateProgress]);

  const updateSystemMetrics = useCallback((metrics: Partial<SystemMetrics>) => {
    setSystemMetrics(prev => ({ ...prev, ...metrics }));
  }, []);

  return {
    ...state,
    systemMetrics,
    setCurrentModule,
    updateProgress,
    addNotification,
    updateUserProgress,
    updateSystemMetrics
  };
};
