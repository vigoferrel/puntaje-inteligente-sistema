
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { UniverseVisualizationHub } from '@/components/universe/UniverseVisualizationHub';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';

const UniverseVisualizationPage: React.FC = () => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <SimpleLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error de Autenticación</h1>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Error en Universo 3D</h1>
          <p className="text-cyan-300 mb-4">No se pudo cargar la visualización. Reintentando...</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
          >
            Recargar
          </button>
        </div>
      </div>
    }>
      <UniverseVisualizationHub />
    </ErrorBoundary>
  );
};

export default UniverseVisualizationPage;
