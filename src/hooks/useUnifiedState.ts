
import { useState, useCallback } from 'react';

interface UserProgress {
  streakDays: number;
  totalExercises: number;
  averageScore: number;
  lastActivity: Date;
  completedExercises: number;
  overallScore: number;
  streak: number;
  level: number;
}

interface SystemMetrics {
  todayStudyTime: number;
  completedNodes: number;
  totalNodes: number;
  systemHealth: number;
  streakDays: number;
  totalProgress: number;
}

export const useUnifiedState = () => {
  const [currentTool, setCurrentTool] = useState('dashboard');
  
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    todayStudyTime: 45,
    completedNodes: 8,
    totalNodes: 25,
    systemHealth: 95,
    streakDays: 5,
    totalProgress: 67
  });

  const [userProgress, setUserProgress] = useState<UserProgress>({
    streakDays: 5,
    totalExercises: 47,
    averageScore: 87,
    lastActivity: new Date(),
    completedExercises: 47,
    overallScore: 87,
    streak: 5,
    level: 4
  });

  const updateCurrentTool = useCallback((tool: string) => {
    setCurrentTool(tool);
  }, []);

  const updateUserProgress = useCallback((updates: Partial<UserProgress>) => {
    setUserProgress(prev => ({ ...prev, ...updates }));
  }, []);

  const updateSystemMetrics = useCallback((updates: Partial<SystemMetrics>) => {
    setSystemMetrics(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    currentTool,
    systemMetrics,
    userProgress,
    setCurrentTool: updateCurrentTool,
    updateUserProgress,
    updateSystemMetrics
  };
};
