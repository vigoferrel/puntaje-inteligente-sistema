/* eslint-disable react-refresh/only-export-components */
/**
 * NEURAL SYSTEM PROVIDER v4.0 - ARQUITECTURA CONSOLIDADA
 * Proveedor base del sistema neural con tipos completos y Fast Refresh optimizado
 */

import { useReducer, useEffect, ReactNode, FC, useState, useMemo } from 'react';
import { 
  NeuralSystemContext, 
  BasicNeuralContext, 
  initialState, 
  neuralReducer 
} from './NeuralSystemContext';
import { useNeuralActions } from './useNeuralActions';
import { NeuralDashboardWidget } from './NeuralDashboardWidget';

interface NeuralSystemProviderProps {
  children: ReactNode;
  showDashboard?: boolean;
  enableAutoCapture?: boolean;
}

export const NeuralSystemProvider: FC<NeuralSystemProviderProps> = ({
  children,
  showDashboard = true,
  enableAutoCapture = true
}) => {
  const [state, dispatch] = useReducer(neuralReducer, initialState);
  const [showWidget, setShowWidget] = useState(false);
  const [widgetMinimized, setWidgetMinimized] = useState(true);

  // Usar el hook optimizado para las acciones
  const actions = useNeuralActions(dispatch);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo<BasicNeuralContext>(() => ({
    state,
    actions
  }), [state, actions]);

  // Efecto para inicializaciÃ³n
  useEffect(() => {
    if (!state.isInitialized) {
      actions.initialize();
    }
  }, [state.isInitialized, actions]);

  // Efecto para mostrar el dashboard
  useEffect(() => {
    if (state.isInitialized && showDashboard) {
      const timer = setTimeout(() => setShowWidget(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.isInitialized, showDashboard]);

  // Efecto para captura automÃ¡tica de errores
  useEffect(() => {
    if (!enableAutoCapture || !state.isInitialized) return;

    const handleError = (event: ErrorEvent) => {
      actions.captureEvent({
        type: 'error',
        message: event.message,
        filename: event.filename,
        timestamp: Date.now()
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      actions.captureEvent({
        type: 'promise_rejection',
        reason: event.reason?.toString() || 'Unknown promise rejection',
        timestamp: Date.now()
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [state.isInitialized, enableAutoCapture, actions]);

  return (
    <NeuralSystemContext.Provider value={contextValue}>
      {children}
      
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

