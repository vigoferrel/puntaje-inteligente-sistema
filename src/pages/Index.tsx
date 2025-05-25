
import React from 'react';
import { SimplifiedDashboard } from '@/components/dashboard/SimplifiedDashboard';
import { useUnifiedInitialization } from '@/hooks/use-unified-initialization';
import { LoadingState } from '@/components/plan/LoadingState';
import { ErrorState } from '@/components/plan/ErrorState';

const Index: React.FC = () => {
  const { loading, error, hasInitialized, retry } = useUnifiedInitialization();

  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingState message="Activando sistema neurológico..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  // IMPORTANTE: Sin wrapper adicional - SimplifiedDashboard maneja su propio layout
  return <SimplifiedDashboard />;
};

export default Index;
