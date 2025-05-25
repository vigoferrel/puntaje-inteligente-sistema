
import React from 'react';
import { NeuralCommandCenter } from '@/components/neural-command/NeuralCommandCenter';
import { useUnifiedInitialization } from '@/hooks/use-unified-initialization';
import { LoadingState } from '@/components/plan/LoadingState';
import { ErrorState } from '@/components/plan/ErrorState';

const NeuralIndex: React.FC = () => {
  const { loading, error, hasInitialized, retry } = useUnifiedInitialization();

  if (loading && !hasInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 flex items-center justify-center">
        <LoadingState message="Activando centro de comando neural..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 flex items-center justify-center">
        <ErrorState onRetry={retry} />
      </div>
    );
  }

  return <NeuralCommandCenter />;
};

export default NeuralIndex;
