
import React from 'react';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { useUnifiedInitialization } from '@/hooks/use-unified-initialization';
import { LoadingState } from '@/components/plan/LoadingState';
import { ErrorState } from '@/components/plan/ErrorState';

const Index: React.FC = () => {
  const { loading, error, hasInitialized, retry } = useUnifiedInitialization();

  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <LoadingState message="Activando universo neurológico..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  return <EducationalUniverse />;
};

export default Index;
