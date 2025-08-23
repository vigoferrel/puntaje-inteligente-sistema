
import React from 'react';
import { useUnifiedState } from '@/hooks/useUnifiedState';
import { useDiagnosticController } from '@/hooks/use-diagnostic-controller';

interface DiagnosticControllerCinematicProps {
  children: (props: any) => React.ReactNode;
}

export const DiagnosticControllerCinematic: React.FC<DiagnosticControllerCinematicProps> = ({ 
  children 
}) => {
  console.log('🎬 DiagnosticControllerCinematic: Iniciando componente');
  
  const unifiedState = useUnifiedState();
  const diagnosticController = useDiagnosticController();

  console.log('🎬 DiagnosticControllerCinematic: Estados obtenidos', {
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
      console.log('📊 Actualizando progreso:', { module, progress });
      try {
        unifiedState.updateUserProgress(module, progress);
      } catch (error) {
        console.error('❌ Error actualizando progreso:', error);
      }
    },
    
    // Manejo optimizado de métricas
    onMetricsUpdate: (metrics: any) => {
      console.log('📈 Actualizando métricas:', metrics);
      try {
        const systemMetricsUpdate = {
          todayStudyTime: metrics.studyTime || unifiedState.systemMetrics.todayStudyTime,
          totalExercises: metrics.exercises || unifiedState.systemMetrics.totalExercises,
          averageScore: metrics.score || unifiedState.systemMetrics.averageScore,
          streakDays: metrics.streak || unifiedState.systemMetrics.streakDays,
          level: metrics.level || unifiedState.systemMetrics.level
        };
        
        unifiedState.updateSystemMetrics(systemMetricsUpdate);
        console.log('✅ Métricas actualizadas exitosamente');
      } catch (error) {
        console.error('❌ Error actualizando métricas:', error);
      }
    }
  };

  console.log('🎬 DiagnosticControllerCinematic: Props combinadas preparadas');

  return children(combinedProps);
};
