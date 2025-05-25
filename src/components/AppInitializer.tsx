
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
  const { error, retry } = useAppInitialization();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  if (isInitializing || !hasInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingState message="Inicializando aplicación..." />
      </div>
    );
  }

  return <>{children}</>;
};
