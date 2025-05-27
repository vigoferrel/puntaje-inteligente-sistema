
import React from 'react';
import { useUnifiedState } from '@/hooks/useUnifiedState';
import { useDiagnosticController } from '@/hooks/use-diagnostic-controller';

interface DiagnosticControllerCinematicProps {
  children: (props: any) => React.ReactNode;
}

export const DiagnosticControllerCinematic: React.FC<DiagnosticControllerCinematicProps> = ({ 
  children 
}) => {
  const unifiedState = useUnifiedState();
  const diagnosticController = useDiagnosticController();

  // Combine both states for the children
  const combinedProps = {
    ...unifiedState,
    ...diagnosticController,
    
    // Handle progress updates
    onProgressUpdate: (module: string, progress: number) => {
      unifiedState.updateUserProgress(module, progress);
    },
    
    // Handle metrics updates
    onMetricsUpdate: (metrics: any) => {
      // Map metrics to the correct SystemMetrics properties
      const systemMetricsUpdate = {
        todayStudyTime: metrics.studyTime || unifiedState.systemMetrics.todayStudyTime,
        totalExercises: metrics.exercises || unifiedState.systemMetrics.totalExercises,
        averageScore: metrics.score || unifiedState.systemMetrics.averageScore,
        streakDays: metrics.streak || unifiedState.systemMetrics.streakDays,
        level: metrics.level || unifiedState.systemMetrics.level
      };
      
      unifiedState.updateSystemMetrics(systemMetricsUpdate);
    }
  };

  return children(combinedProps);
};
