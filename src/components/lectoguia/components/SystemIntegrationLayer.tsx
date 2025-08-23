
import React, { useEffect } from 'react';

interface SystemIntegrationLayerProps {
  diagnosticIntegration: any;
  planIntegration: any;
  dashboardSync: any;
  nodeValidation: any;
  onSystemUpdate: () => void;
}

/**
 * Capa invisible que maneja la integración entre todos los sistemas
 */
export const SystemIntegrationLayer: React.FC<SystemIntegrationLayerProps> = ({
  diagnosticIntegration,
  planIntegration,
  dashboardSync,
  nodeValidation,
  onSystemUpdate
}) => {
  // Sincronización automática cada 2 minutos si hay actividad
  useEffect(() => {
    const interval = setInterval(() => {
      if (dashboardSync.isConnected) {
        onSystemUpdate();
      }
    }, 120000); // 2 minutos

    return () => clearInterval(interval);
  }, [dashboardSync.isConnected, onSystemUpdate]);

  // Monitorear cambios en el plan y sincronizar
  useEffect(() => {
    if (planIntegration.currentPlan) {
      console.log('📋 Plan actualizado, sincronizando sistema...');
      setTimeout(onSystemUpdate, 1000);
    }
  }, [planIntegration.currentPlan, onSystemUpdate]);

  // Monitorear diagnósticos y validar coherencia
  useEffect(() => {
    if (diagnosticIntegration.isReady && diagnosticIntegration.availableTests > 0) {
      console.log('🔬 Diagnósticos disponibles, validando coherencia...');
    }
  }, [diagnosticIntegration.isReady, diagnosticIntegration.availableTests]);

  // Este componente no renderiza nada visible
  return null;
};
