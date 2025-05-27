
import { useState, useCallback } from 'react';

interface UnifiedState {
  systemReady: boolean;
  currentModule: string;
  userProgress: Record<string, number>;
  notifications: string[];
}

export const useUnifiedState = () => {
  const [state, setState] = useState<UnifiedState>({
    systemReady: true,
    currentModule: 'dashboard',
    userProgress: {},
    notifications: []
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

  return {
    ...state,
    setCurrentModule,
    updateProgress,
    addNotification
  };
};
