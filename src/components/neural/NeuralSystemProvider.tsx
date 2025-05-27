
/**
 * NEURAL SYSTEM PROVIDER v2.0
 * Proveedor global del sistema neural avanzado
 */

import React, { createContext, useContext, useEffect } from 'react';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';
import { NeuralDashboardWidget } from './NeuralDashboardWidget';

const NeuralSystemContext = createContext<ReturnType<typeof useAdvancedNeuralSystem> | null>(null);

export const useNeuralSystem = () => {
  const context = useContext(NeuralSystemContext);
  if (!context) {
    throw new Error('useNeuralSystem must be used within NeuralSystemProvider');
  }
  return context;
};

interface NeuralSystemProviderProps {
  children: React.ReactNode;
  showDashboard?: boolean;
  enableAutoCapture?: boolean;
}

export const NeuralSystemProvider: React.FC<NeuralSystemProviderProps> = ({
  children,
  showDashboard = true,
  enableAutoCapture = true
}) => {
  const neuralSystem = useAdvancedNeuralSystem('neural-system-provider');
  const [showWidget, setShowWidget] = React.useState(false);
  const [widgetMinimized, setWidgetMinimized] = React.useState(true);

  // Auto-mostrar widget después de que el sistema esté listo
  useEffect(() => {
    if (neuralSystem.neuralSystemReady && showDashboard) {
      setTimeout(() => setShowWidget(true), 2000);
    }
  }, [neuralSystem.neuralSystemReady, showDashboard]);

  // Auto-captura de errores no manejados
  useEffect(() => {
    if (!enableAutoCapture || !neuralSystem.neuralSystemReady) return;

    const handleError = (event: ErrorEvent) => {
      neuralSystem.actions.captureEvent('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error_type: 'javascript'
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      neuralSystem.actions.captureEvent('error', {
        reason: event.reason?.toString() || 'Unknown promise rejection',
        error_type: 'promise_rejection'
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [neuralSystem.neuralSystemReady, enableAutoCapture, neuralSystem.actions]);

  // Log de inicialización exitosa
  useEffect(() => {
    if (neuralSystem.neuralSystemReady) {
      console.log('🚀 Neural System Provider initialized successfully');
      console.log('📊 System Status:', neuralSystem.neuralSystemStatus);
    }
  }, [neuralSystem.neuralSystemReady, neuralSystem.neuralSystemStatus]);

  return (
    <NeuralSystemContext.Provider value={neuralSystem}>
      {children}
      
      {/* Widget de Dashboard Neural */}
      {showWidget && showDashboard && (
        <NeuralDashboardWidget
          isMinimized={widgetMinimized}
          onToggleMinimize={() => setWidgetMinimized(!widgetMinimized)}
          showAdvancedMetrics={true}
        />
      )}
    </NeuralSystemContext.Provider>
  );
};
