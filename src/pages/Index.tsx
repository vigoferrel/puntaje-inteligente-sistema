
import React from 'react';
import { AppLayout } from '@/components/app-layout';
import { SimplifiedDashboard } from '@/components/dashboard/SimplifiedDashboard';
import { useUnifiedInitialization } from '@/hooks/use-unified-initialization';
import { LoadingState } from '@/components/plan/LoadingState';
import { ErrorState } from '@/components/plan/ErrorState';

const Index: React.FC = () => {
  const { loading, error, hasInitialized, retry } = useUnifiedInitialization();

  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingState message="Cargando dashboard..." />
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

  return (
    <AppLayout>
      <SimplifiedDashboard />
    </AppLayout>
  );
};

export default Index;
