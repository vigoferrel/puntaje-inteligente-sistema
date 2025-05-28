
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface CriticalWebGLState {
  activeContexts: number;
  maxContexts: number;
  canCreateContext: boolean;
  deviceCapabilities: {
    isMobile: boolean;
    isLowEnd: boolean;
    maxMemory: number;
  };
  emergencyMode: boolean;
}

interface CriticalWebGLActions {
  requestContext: (componentId: string) => Promise<boolean>;
  releaseContext: (componentId: string) => void;
  forceCleanup: () => void;
  enterEmergencyMode: () => void;
}

const CriticalWebGLContext = createContext<CriticalWebGLState & CriticalWebGLActions>({
  activeContexts: 0,
  maxContexts: 2,
  canCreateContext: false,
  deviceCapabilities: { isMobile: false, isLowEnd: false, maxMemory: 1000 },
  emergencyMode: false,
  requestContext: async () => false,
  releaseContext: () => {},
  forceCleanup: () => {},
  enterEmergencyMode: () => {}
});

export const useCriticalWebGL = () => useContext(CriticalWebGLContext);

// Detección avanzada de capacidades del dispositivo
const detectDeviceCapabilities = () => {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4;
  
  const isLowEnd = isMobile || hardwareConcurrency <= 2 || memory <= 2;
  
  // Límites conservadores basados en dispositivo
  const maxContexts = isLowEnd ? 1 : (isMobile ? 2 : 3);
  
  return {
    isMobile,
    isLowEnd,
    maxMemory: memory * 1000,
    maxContexts
  };
};

export const CriticalWebGLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [capabilities] = useState(detectDeviceCapabilities);
  const [state, setState] = useState<CriticalWebGLState>({
    activeContexts: 0,
    maxContexts: capabilities.maxContexts,
    canCreateContext: true,
    deviceCapabilities: capabilities,
    emergencyMode: false
  });
  
  const [contextRegistry, setContextRegistry] = useState<Map<string, number>>(new Map());

  // Monitoreo automático de memoria y performance
  useEffect(() => {
    const monitorInterval = setInterval(() => {
      // Verificar si hay memoria disponible
      const performanceMemory = (performance as any).memory;
      if (performanceMemory) {
        const memoryUsage = performanceMemory.usedJSHeapSize / performanceMemory.totalJSHeapSize;
        
        // Si el uso de memoria supera el 85%, activar modo de emergencia
        if (memoryUsage > 0.85 && !state.emergencyMode) {
          enterEmergencyMode();
        }
      }
      
      // Limpiar contextos huérfanos
      forceCleanup();
    }, 10000); // Cada 10 segundos

    return () => clearInterval(monitorInterval);
  }, [state.emergencyMode]);

  const requestContext = useCallback(async (componentId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState(prev => {
        // Si ya existe el contexto, permitir
        if (prev.activeContexts < prev.maxContexts && !prev.emergencyMode) {
          setContextRegistry(registry => new Map(registry.set(componentId, Date.now())));
          resolve(true);
          return {
            ...prev,
            activeContexts: prev.activeContexts + 1
          };
        }
        
        console.warn(`🚨 WebGL context denied for ${componentId} - Limit: ${prev.maxContexts}, Active: ${prev.activeContexts}`);
        resolve(false);
        return prev;
      });
    });
  }, []);

  const releaseContext = useCallback((componentId: string) => {
    setState(prev => {
      setContextRegistry(registry => {
        const newRegistry = new Map(registry);
        newRegistry.delete(componentId);
        return newRegistry;
      });
      
      return {
        ...prev,
        activeContexts: Math.max(0, prev.activeContexts - 1)
      };
    });
  }, []);

  const forceCleanup = useCallback(() => {
    const now = Date.now();
    const staleThreshold = 30000; // 30 segundos
    
    setContextRegistry(registry => {
      const newRegistry = new Map();
      let cleanedCount = 0;
      
      registry.forEach((timestamp, componentId) => {
        const element = document.querySelector(`[data-webgl-component="${componentId}"]`);
        if (element && (now - timestamp) < staleThreshold) {
          newRegistry.set(componentId, timestamp);
        } else {
          cleanedCount++;
        }
      });
      
      if (cleanedCount > 0) {
        setState(prev => ({
          ...prev,
          activeContexts: Math.max(0, prev.activeContexts - cleanedCount)
        }));
        console.log(`🧹 Cleaned ${cleanedCount} stale WebGL contexts`);
      }
      
      return newRegistry;
    });
  }, []);

  const enterEmergencyMode = useCallback(() => {
    setState(prev => ({
      ...prev,
      emergencyMode: true,
      maxContexts: 1 // Solo permitir 1 contexto en emergencia
    }));
    
    // Forzar limpieza inmediata
    forceCleanup();
    console.log('🚨 EMERGENCY MODE: WebGL contexts limited to 1');
  }, [forceCleanup]);

  return (
    <CriticalWebGLContext.Provider value={{
      ...state,
      requestContext,
      releaseContext,
      forceCleanup,
      enterEmergencyMode
    }}>
      {children}
    </CriticalWebGLContext.Provider>
  );
};
