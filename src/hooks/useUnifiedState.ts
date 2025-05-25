
import { useState, useCallback } from 'react';

interface UserProgress {
  streakDays: number;
  totalExercises: number;
  averageScore: number;
  lastActivity: Date;
}

interface SystemMetrics {
  todayStudyTime: number;
  completedNodes: number;
  totalNodes: number;
  systemHealth: number;
}

export const useUnifiedState = () => {
  const [currentTool, setCurrentTool] = useState('dashboard');
  
  const systemMetrics: SystemMetrics = {
    todayStudyTime: 45,
    completedNodes: 8,
    totalNodes: 25,
    systemHealth: 95
  };

  const userProgress: UserProgress = {
    streakDays: 5,
    totalExercises: 47,
    averageScore: 87,
    lastActivity: new Date()
  };

  const updateCurrentTool = useCallback((tool: string) => {
    setCurrentTool(tool);
  }, []);

  return {
    currentTool,
    systemMetrics,
    userProgress,
    setCurrentTool: updateCurrentTool
  };
};
