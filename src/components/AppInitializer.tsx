
import React from 'react';
import { useResilientInitialization } from '@/hooks/use-resilient-initialization';
import { LoadingState } from '@/components/plan/LoadingState';
import { ErrorState } from '@/components/plan/ErrorState';
import { EmergencyModeIndicator } from '@/components/EmergencyModeIndicator';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { 
    isInitializing, 
    canProceed, 
    error, 
    retry, 
    phase, 
    emergencyMode,
    progress,
    completedSteps,
    skippedSteps
  } = useResilientInitialization();

  // Mostrar error solo si no podemos proceder
  if (error && !canProceed) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <ErrorState onRetry={retry} />
          <div className="text-sm text-gray-400">
            <p>Pasos completados: {completedSteps.join(', ') || 'Ninguno'}</p>
            {skippedSteps.length > 0 && (
              <p>Pasos omitidos: {skippedSteps.join(', ')}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Mostrar loading solo si está inicializando y no puede proceder
  if (isInitializing && !canProceed) {
    const getPhaseMessage = (currentPhase: string) => {
      switch (currentPhase) {
        case 'auth': return 'Verificando autenticación...';
        case 'nodes': return 'Cargando nodos de aprendizaje...';
        case 'plans': return 'Cargando planes de estudio...';
        case 'paes': return 'Cargando datos PAES...';
        case 'emergency': return 'Activando modo de emergencia...';
        default: return 'Inicializando aplicación...';
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingState message={getPhaseMessage(phase)} />
          <div className="w-64 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-400">{progress}% completado</p>
        </div>
      </div>
    );
  }

  // Si llegamos aquí, podemos proceder (inicializado o modo emergencia)
  return (
    <>
      {emergencyMode && <EmergencyModeIndicator />}
      {children}
    </>
  );
};
