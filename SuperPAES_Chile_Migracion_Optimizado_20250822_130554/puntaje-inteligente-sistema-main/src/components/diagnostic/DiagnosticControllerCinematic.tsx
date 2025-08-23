/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { useUnifiedState } from '../../hooks/useUnifiedState';
import { useDiagnosticController } from '../../hooks/use-diagnostic-controller';

interface DiagnosticControllerCinematicProps {
  children: (props: unknown) => ReactNode;
}

export const DiagnosticControllerCinematic: FC<DiagnosticControllerCinematicProps> = ({ 
  children 
}) => {
  console.log('ðŸŽ¬ DiagnosticControllerCinematic: Iniciando componente');
  
  const unifiedState = useUnifiedState();
  const diagnosticController = useDiagnosticController();

  console.log('ðŸŽ¬ DiagnosticControllerCinematic: Estados obtenidos', {
    hasUnifiedState: !!unifiedState,
    hasDiagnosticController: !!diagnosticController,
    testsAvailable: diagnosticController.testsAvailable
  });

  // Combinar estados de forma simplificada
  const combinedProps = {
    ...unifiedState,
    ...diagnosticController,
    
    // Manejo optimizado de actualizaciones de progreso
    onProgressUpdate: (module: string, progress: number) => {
      console.log('ðŸ“Š Actualizando progreso:', { module, progress });
      try {
        unifiedState.updateUserProgress(module, progress);
      } catch (error) {
        console.error('âŒ Error actualizando progreso:', error);
      }
    },
    
    // Manejo optimizado de mÃ©tricas
    onMetricsUpdate: (metrics: unknown) => {
      console.log('ðŸ“ˆ Actualizando mÃ©tricas:', metrics);
      try {
        const systemMetricsUpdate = {
          todayStudyTime: metrics.studyTime || unifiedState.systemMetrics.todayStudyTime,
          totalExercises: metrics.exercises || unifiedState.systemMetrics.totalExercises,
          averageScore: metrics.score || unifiedState.systemMetrics.averageScore,
          streakDays: metrics.streak || unifiedState.systemMetrics.streakDays,
          level: metrics.level || unifiedState.systemMetrics.level
        };
        
        unifiedState.updateSystemMetrics(systemMetricsUpdate);
        console.log('âœ… MÃ©tricas actualizadas exitosamente');
      } catch (error) {
        console.error('âŒ Error actualizando mÃ©tricas:', error);
      }
    }
  };

  console.log('ðŸŽ¬ DiagnosticControllerCinematic: Props combinadas preparadas');

  return children(combinedProps);
};

