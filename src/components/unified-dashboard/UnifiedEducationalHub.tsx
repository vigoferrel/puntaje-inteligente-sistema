
import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RealDataDashboard } from './RealDataDashboard';
import { NeuralSystemProvider } from '@/components/neural/NeuralSystemProvider';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';
import { OptimizedSmoothNavigator } from '@/components/navigation/OptimizedSmoothNavigator';

interface UnifiedEducationalHubProps {
  userId: string;
}

export const UnifiedEducationalHub: React.FC<UnifiedEducationalHubProps> = ({ userId }) => {
  return (
    <NeuralSystemProvider showDashboard={true} enableAutoCapture={true}>
      <OptimizedSmoothNavigator />
      <ErrorBoundary fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Error en Hub Educativo</h1>
            <p className="text-cyan-300 mb-4">Reintentando conexión con datos reales...</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
            >
              Recargar Sistema
            </button>
          </div>
        </div>
      }>
        <Suspense fallback={<SimpleLoadingScreen />}>
          <div className="section-transition">
            <RealDataDashboard userId={userId} />
          </div>
        </Suspense>
      </ErrorBoundary>
    </NeuralSystemProvider>
  );
};
