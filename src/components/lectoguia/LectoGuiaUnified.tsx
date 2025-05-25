
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';
import { CinematicHeader } from './components/CinematicHeader';
import { UnifiedContent } from './components/UnifiedContent';
import { ValidationOverlay } from './components/ValidationOverlay';
import { SystemIntegrationLayer } from './components/SystemIntegrationLayer';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * LectoGuía Unificado Quirúrgicamente Simplificado
 * Arquitectura minimalista para máximo rendimiento
 */
export const LectoGuiaUnified: React.FC = () => {
  const { user } = useAuth();
  
  const {
    // Estado simplificado del sistema
    systemState,
    currentContext,
    
    // Validaciones básicas
    validationStatus,
    
    // Integraciones minimalistas
    diagnosticIntegration,
    planIntegration,
    dashboardSync,
    nodeValidation,
    
    // Acciones esenciales
    handleSystemAction,
    navigateToModule,
    syncWithBackend
  } = useLectoGuiaSimplified(user?.id);

  // Inicialización única
  useEffect(() => {
    if (user?.id && systemState.phase === 'initializing') {
      console.log('🚀 Inicializando LectoGuía simplificado...');
      syncWithBackend();
    }
  }, [user?.id, systemState.phase, syncWithBackend]);

  // Estado de carga
  if (systemState.phase === 'initializing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-white">Inicializando LectoGuía</h2>
          <p className="text-gray-300">Sistema simplificado cargando...</p>
        </motion.div>
      </div>
    );
  }

  // Estado de error
  if (systemState.phase === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Error del Sistema</h2>
          <p className="text-gray-300">No se pudo inicializar LectoGuía</p>
          <button 
            onClick={syncWithBackend}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Reintentar
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="lectoguia-unified min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header simplificado */}
      <CinematicHeader
        user={user}
        systemState={systemState}
        validationStatus={validationStatus}
        onNavigateToModule={navigateToModule}
      />

      {/* Estado del sistema */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          {validationStatus.isValid ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Sistema Operativo
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Problemas Detectados
            </Badge>
          )}
          
          <Badge variant="outline" className="text-white border-white/20">
            Tests: {diagnosticIntegration.availableTests}
          </Badge>
          
          <Badge variant="outline" className="text-white border-white/20">
            Nodos: {nodeValidation.totalNodes}
          </Badge>
          
          {dashboardSync.isConnected && (
            <Badge variant="outline" className="text-white border-white/20 bg-green-600/20">
              Conectado
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentContext.activeModule}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UnifiedContent
              context={currentContext}
              systemState={systemState}
              diagnosticIntegration={diagnosticIntegration}
              planIntegration={planIntegration}
              onAction={handleSystemAction}
              onNavigate={navigateToModule}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlay solo para errores críticos */}
      {!validationStatus.isValid && validationStatus.issuesCount > 5 && (
        <ValidationOverlay
          validationStatus={validationStatus}
          onRevalidate={() => handleSystemAction({ type: 'REVALIDATE_SYSTEM' })}
        />
      )}

      {/* Capa de integración minimalista */}
      <SystemIntegrationLayer
        diagnosticIntegration={diagnosticIntegration}
        planIntegration={planIntegration}
        dashboardSync={dashboardSync}
        nodeValidation={nodeValidation}
        onSystemUpdate={syncWithBackend}
      />
    </div>
  );
};
