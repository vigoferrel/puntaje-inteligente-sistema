
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ModernDashboardHub } from '@/components/dashboard/modern/ModernDashboardHub';
import { GlobalEducationProvider } from '@/contexts/GlobalEducationProvider';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';
import { AppSidebar } from '@/components/app-sidebar';

const Dashboard: React.FC = () => {
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
          <h1 className="text-2xl font-bold mb-4">Error en Dashboard</h1>
          <p className="text-cyan-300 mb-4">No se pudo cargar el dashboard. Reintentando...</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded text-white"
          >
            Recargar
          </button>
        </div>
      </div>
    }>
      <GlobalEducationProvider>
        <div className="flex">
          <AppSidebar />
          <div className="flex-1">
            <ModernDashboardHub />
          </div>
        </div>
      </GlobalEducationProvider>
    </ErrorBoundary>
  );
};

export default Dashboard;
