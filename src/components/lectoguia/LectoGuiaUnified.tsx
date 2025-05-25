
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useEducationalFlow } from '@/hooks/lectoguia/useEducationalFlow';
import { LectoGuiaEmergencyMode } from './LectoGuiaEmergencyMode';
import { CinematicHeader } from './components/CinematicHeader';
import { UnifiedContent } from './components/UnifiedContent';
import { ValidationOverlay } from './components/ValidationOverlay';
import { SystemIntegrationLayer } from './components/SystemIntegrationLayer';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

/**
 * LectoGuía Unificado Optimizado
 * Versión corregida sin bucles infinitos ni toasts en render
 */
export const LectoGuiaUnified: React.FC = () => {
  const { user } = useAuth();
  const { flowState, actions, diagnostic } = useEducationalFlow();
  const [showEmergencyMode, setShowEmergencyMode] = useState(false);
  const [initializationTimeout, setInitializationTimeout] = useState(false);

  // Timeout de inicialización más largo para evitar emergency mode prematuro
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!flowState.user.isAuthenticated) {
        setInitializationTimeout(true);
      }
    }, 15000); // Aumentado a 15 segundos

    return () => clearTimeout(timer);
  }, [flowState.user.isAuthenticated]);

  // Emergency mode solo en casos extremos
  useEffect(() => {
    if (initializationTimeout && !flowState.user.isAuthenticated) {
      const emergencyTimer = setTimeout(() => {
        setShowEmergencyMode(true);
      }, 10000); // 10 segundos adicionales

      return () => clearTimeout(emergencyTimer);
    }
  }, [initializationTimeout, flowState.user.isAuthenticated]);

  // Estado de carga inicial optimizado
  if (!flowState.user.isAuthenticated && !initializationTimeout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-semibold text-white">Iniciando LectoGuía</h2>
          <p className="text-gray-300">Optimizando sistema educativo...</p>
        </motion.div>
      </div>
    );
  }

  // Modo de emergencia solo en casos críticos
  if (showEmergencyMode) {
    return (
      <LectoGuiaEmergencyMode 
        error="No se pudo sincronizar el sistema educativo"
        onRetry={() => {
          setShowEmergencyMode(false);
          setInitializationTimeout(false);
          actions.syncSystem();
        }}
      />
    );
  }

  // Renderizado normal optimizado
  return (
    <div className="lectoguia-unified min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header optimizado */}
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

      {/* Estado del sistema simplificado */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center gap-2 text-sm">
          {flowState.isCoherent ? (
            <Badge variant="default" className="bg-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Sistema Activo
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Modo Básico
            </Badge>
          )}
          
          <Badge variant="outline" className="text-white border-white/20">
            Diagnósticos: {flowState.diagnostic.availableTests || 0}
          </Badge>
          
          <Badge variant="outline" className="text-white border-white/20">
            Planes: {flowState.learning.totalPlans || 0}
          </Badge>
        </div>
      </div>

      {/* Contenido principal optimizado */}
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
                availableTests: flowState.diagnostic.availableTests || 0,
                systemMetrics: { totalNodes: 0, isSystemReady: true },
                startDiagnostic: () => actions.navigateToContext('diagnostic')
              }}
              planIntegration={{
                allPlans: flowState.learning.totalPlans > 0 ? [flowState.learning.currentPlan].filter(Boolean) : [],
                currentPlan: flowState.learning.currentPlan,
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
                    console.log('Acción:', action.type);
                }
              }}
              onNavigate={actions.navigateToContext}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Overlay solo para errores críticos */}
      {!flowState.isCoherent && !showEmergencyMode && (
        <ValidationOverlay
          validationStatus={{ 
            isValid: false, 
            issuesCount: 1 
          }}
          onRevalidate={actions.syncSystem}
        />
      )}

      {/* Capa de integración simplificada */}
      <SystemIntegrationLayer
        diagnosticIntegration={{
          isReady: flowState.diagnostic.canStart,
          availableTests: flowState.diagnostic.availableTests || 0
        }}
        planIntegration={{
          currentPlan: flowState.learning.currentPlan,
          totalPlans: flowState.learning.totalPlans || 0
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
