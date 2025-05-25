
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEducationalFlow } from '@/hooks/lectoguia/useEducationalFlow';
import { CinematicHeader } from './components/CinematicHeader';
import { UnifiedContent } from './components/UnifiedContent';
import { ValidationOverlay } from './components/ValidationOverlay';
import { SystemIntegrationLayer } from './components/SystemIntegrationLayer';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * LectoGuía Unificado Refactorizado Quirúrgicamente
 * Arquitectura simplificada con flujo educativo optimizado
 */
export const LectoGuiaUnified: React.FC = () => {
  const { user } = useAuth();
  const { flowState, actions, diagnostic } = useEducationalFlow();

  // Inicialización automática del sistema educativo
  useEffect(() => {
    if (user?.id && !flowState.isCoherent) {
      console.log('🚀 Inicializando flujo educativo...');
      actions.syncSystem();
    }
  }, [user?.id, flowState.isCoherent, actions]);

  // Estado de carga
  if (!flowState.user.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-white">Iniciando LectoGuía</h2>
          <p className="text-gray-300">Cargando sistema educativo...</p>
        </motion.div>
      </div>
    );
  }

  // Estado de error del sistema
  if (!flowState.isCoherent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Sistema Incoherente</h2>
          <p className="text-gray-300">No se pudo sincronizar el flujo educativo</p>
          <button 
            onClick={actions.syncSystem}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Reintentar Sincronización
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
        systemState={{ 
          phase: 'ready', 
          activeModule: 'chat', 
          loading: diagnostic.isLoading 
        }}
        validationStatus={{ 
          isValid: flowState.isCoherent, 
          issuesCount: flowState.isCoherent ? 0 : 1 
        }}
        onNavigateToModule={actions.navigateToContext}
      />

      {/* Estado del sistema educativo */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          {flowState.isCoherent ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Sistema Coherente
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Sincronización Pendiente
            </Badge>
          )}
          
          <Badge variant="outline" className="text-white border-white/20">
            Tests: {flowState.diagnostic.availableTests}
          </Badge>
          
          <Badge variant="outline" className="text-white border-white/20">
            Planes: {flowState.learning.totalPlans}
          </Badge>
          
          {flowState.diagnostic.isActive && (
            <Badge variant="outline" className="text-white border-white/20 bg-blue-600/20">
              Diagnóstico Activo: {Math.round(flowState.diagnostic.progress)}%
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key="unified-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <UnifiedContent
              context={{ activeModule: 'chat' }}
              systemState={{ 
                phase: 'ready', 
                activeModule: 'chat', 
                loading: diagnostic.isLoading 
              }}
              diagnosticIntegration={{
                isReady: flowState.diagnostic.canStart,
                availableTests: flowState.diagnostic.availableTests,
                systemMetrics: { totalNodes: 0, isSystemReady: true },
                startDiagnostic: () => actions.navigateToContext('diagnostic')
              }}
              planIntegration={{
                allPlans: [],
                navigateToPlan: () => actions.navigateToContext('plan')
              }}
              onAction={(action) => {
                switch (action.type) {
                  case 'START_DIAGNOSTIC':
                    actions.startDiagnostic(action.payload?.testId);
                    break;
                  case 'CREATE_PLAN':
                    actions.createLearningPlan(action.payload?.title, action.payload?.description);
                    break;
                  default:
                    console.warn('Acción no reconocida:', action.type);
                }
              }}
              onNavigate={actions.navigateToContext}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlay solo para errores críticos */}
      {!flowState.isCoherent && (
        <ValidationOverlay
          validationStatus={{ 
            isValid: false, 
            issuesCount: 1 
          }}
          onRevalidate={actions.syncSystem}
        />
      )}

      {/* Capa de integración optimizada */}
      <SystemIntegrationLayer
        diagnosticIntegration={{
          isReady: flowState.diagnostic.canStart,
          availableTests: flowState.diagnostic.availableTests
        }}
        planIntegration={{
          currentPlan: flowState.learning.currentPlan,
          totalPlans: flowState.learning.totalPlans
        }}
        dashboardSync={{
          isConnected: flowState.isCoherent,
          nodeProgress: 0
        }}
        nodeValidation={{
          totalNodes: 0,
          isCoherent: flowState.isCoherent
        }}
        onSystemUpdate={actions.syncSystem}
      />
    </div>
  );
};
