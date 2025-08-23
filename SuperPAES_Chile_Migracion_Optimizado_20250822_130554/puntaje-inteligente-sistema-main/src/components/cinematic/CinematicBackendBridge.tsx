/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { scoringSystemFacade } from '../../core/scoring/facade/ScoringSystemFacade';
import { useCinematicUniverse } from '../../contexts/cinematic-universe/CinematicUniverseContext';

interface CinematicBackendBridgeContextType {
  isConnected: boolean;
  systemHealth: unknown;
  userMetrics: unknown;
  refreshMetrics: () => Promise<void>;
  executeScoring: (data: unknown) => Promise<unknown>;
}

const CinematicBackendBridgeContext = createContext<CinematicBackendBridgeContextType | null>(null);

export const useCinematicBackendBridge = () => {
  const context = useContext(CinematicBackendBridgeContext);
  if (!context) {
    throw new Error('useCinematicBackendBridge debe usarse dentro de CinematicBackendBridgeProvider');
  }
  return context;
};

interface CinematicBackendBridgeProviderProps {
  children: React.ReactNode;
}

export const CinematicBackendBridgeProvider: React.FC<CinematicBackendBridgeProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [systemHealth, setSystemHealth] = useState(null);
  const [userMetrics, setUserMetrics] = useState(null);
  const { state } = useCinematicUniverse();

  const refreshMetrics = async () => {
    try {
      const healthResult = await scoringSystemFacade.getSystemHealth();
      if (healthResult.success) {
        setSystemHealth(healthResult.data);
        setIsConnected(true);
      }

      // Obtener metricas del usuario actual si esta disponible
      if (state.userType) {
        const analyticsResult = await scoringSystemFacade.getAnalytics('current_user');
        if (analyticsResult.success) {
          setUserMetrics(analyticsResult.data);
        }
      }
    } catch (error) {
      console.error('Error refreshing metrics:', error);
      setIsConnected(false);
    }
  };

  const executeScoring = async (data: unknown) => {
    try {
      const result = await scoringSystemFacade.calculateScore(
        data.userId || 'anonymous',
        data.responses || [],
        data.metadata || {}
      );
      return result;
    } catch (error) {
      console.error('Error executing scoring:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    // Inicializar conexion
    refreshMetrics();

    // Actualizar metricas cada 30 segundos
    const interval = setInterval(refreshMetrics, 30000);

    return () => clearInterval(interval);
  }, [state.userType]);

  const value: CinematicBackendBridgeContextType = {
    isConnected,
    systemHealth,
    userMetrics,
    refreshMetrics,
    executeScoring
  };

  return (
    <CinematicBackendBridgeContext.Provider value={value}>
      {children}
    </CinematicBackendBridgeContext.Provider>
  );
};

export default CinematicBackendBridgeProvider;


