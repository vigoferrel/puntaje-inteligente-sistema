
import React from 'react';
import { useAppInitialization } from '@/hooks/use-app-initialization';
import { useUnifiedApp } from '@/contexts/UnifiedAppProvider';
import { LoadingState } from '@/components/plan/LoadingState';
import { ErrorState } from '@/components/plan/ErrorState';

interface AppInitializerProps {
  children: React.ReactNode;
}

export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const { isInitializing, hasInitialized } = useUnifiedApp();
  const { error, retry, phase, circuitBreakerState } = useAppInitialization();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ErrorState onRetry={retry} />
          {circuitBreakerState === 'open' && (
            <p className="text-yellow-500 text-sm">
              Sistema en modo protección. Reintentando automáticamente...
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isInitializing || !hasInitialized) {
    const getPhaseMessage = (currentPhase: string) => {
      switch (currentPhase) {
        case 'auth': return 'Verificando autenticación...';
        case 'nodes': return 'Cargando nodos de aprendizaje...';
        case 'plans': return 'Cargando planes de estudio...';
        case 'paes': return 'Cargando datos PAES...';
        case 'complete': return 'Finalizando inicialización...';
        default: return 'Inicializando aplicación...';
      }
    };

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingState message={getPhaseMessage(phase)} />
      </div>
    );
  }

  return <>{children}</>;
};
