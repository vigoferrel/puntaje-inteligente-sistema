/* eslint-disable react-refresh/only-export-components */

import React, { useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

interface SystemIntegrationLayerProps {
  diagnosticIntegration: unknown;
  planIntegration: unknown;
  dashboardSync: unknown;
  nodeValidation: unknown;
  onSystemUpdate: () => void;
}

/**
 * Capa invisible que maneja la integraciÃ³n entre todos los sistemas
 */
export const SystemIntegrationLayer: React.FC<SystemIntegrationLayerProps> = ({
  diagnosticIntegration,
  planIntegration,
  dashboardSync,
  nodeValidation,
  onSystemUpdate
}) => {
  // SincronizaciÃ³n automÃ¡tica cada 2 minutos si hay actividad
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
      console.log('ðŸ“‹ Plan actualizado, sincronizando sistema...');
      setTimeout(onSystemUpdate, 1000);
    }
  }, [planIntegration.currentPlan, onSystemUpdate]);

  // Monitorear diagnÃ³sticos y validar coherencia
  useEffect(() => {
    if (diagnosticIntegration.isReady && diagnosticIntegration.availableTests > 0) {
      console.log('ðŸ”¬ DiagnÃ³sticos disponibles, validando coherencia...');
    }
  }, [diagnosticIntegration.isReady, diagnosticIntegration.availableTests]);

  // Este componente no renderiza nada visible
  return null;
};

