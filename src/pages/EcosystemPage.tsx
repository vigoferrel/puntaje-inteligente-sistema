
import React from 'react';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { EcosystemIntegrationEngine } from '@/components/educational-ecosystem/EcosystemIntegrationEngine';
import { AppLayout } from '@/components/app-layout';
import { useAuth } from '@/contexts/AuthContext';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';
import { motion } from 'framer-motion';

const EcosystemPage: React.FC = () => {
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
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto p-6"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Ecosistema Educativo</h1>
            <p className="text-white/70 text-lg">Centro de control e integración de todos los módulos educativos</p>
          </div>
          
          <ErrorBoundary fallback={
            <div className="text-center text-white">
              <h2 className="text-xl font-bold mb-4">Error en Ecosistema</h2>
              <p className="text-red-300 mb-4">No se pudo cargar el ecosistema educativo.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Recargar
              </button>
            </div>
          }>
            <EcosystemIntegrationEngine />
          </ErrorBoundary>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default EcosystemPage;
