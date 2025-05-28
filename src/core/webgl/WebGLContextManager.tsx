
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface WebGLContextState {
  activeContexts: number;
  maxContexts: number;
  canCreateContext: boolean;
  contextQueue: string[];
}

interface WebGLContextActions {
  requestContext: (componentId: string) => Promise<boolean>;
  releaseContext: (componentId: string) => void;
  getContextStats: () => WebGLContextState;
}

const WebGLContext = createContext<WebGLContextState & WebGLContextActions>({
  activeContexts: 0,
  maxContexts: 8,
  canCreateContext: true,
  contextQueue: [],
  requestContext: async () => false,
  releaseContext: () => {},
  getContextStats: () => ({
    activeContexts: 0,
    maxContexts: 8,
    canCreateContext: true,
    contextQueue: []
  })
});

export const useWebGLContext = () => useContext(WebGLContext);

// Detectar capacidades WebGL del dispositivo
const detectWebGLCapabilities = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) return { maxContexts: 0, supportsWebGL: false };
    
    // Estimar límite basado en tipo de dispositivo
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    
    let maxContexts = 8; // Default conservador
    
    if (isMobile || isLowEnd) {
      maxContexts = 3; // Muy conservador para móviles
    } else if (navigator.hardwareConcurrency >= 8) {
      maxContexts = 6; // Más generoso para desktop potente
    }
    
    canvas.remove();
    return { maxContexts, supportsWebGL: true };
  } catch (error) {
    console.warn('WebGL detection failed:', error);
    return { maxContexts: 2, supportsWebGL: false };
  }
};

export const WebGLContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<WebGLContextState>(() => {
    const capabilities = detectWebGLCapabilities();
    return {
      activeContexts: 0,
      maxContexts: capabilities.maxContexts,
      canCreateContext: capabilities.supportsWebGL,
      contextQueue: []
    };
  });

  const requestContext = useCallback(async (componentId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState(prev => {
        // Si ya tenemos el contexto, no hacer nada
        if (prev.contextQueue.includes(componentId)) {
          resolve(true);
          return prev;
        }
        
        // Si tenemos espacio, otorgar inmediatamente
        if (prev.activeContexts < prev.maxContexts && prev.canCreateContext) {
          const newState = {
            ...prev,
            activeContexts: prev.activeContexts + 1,
            contextQueue: [...prev.contextQueue, componentId]
          };
          resolve(true);
          return newState;
        }
        
        // Si no hay espacio, rechazar
        console.warn(`WebGL context limit reached. Component ${componentId} denied.`);
        resolve(false);
        return prev;
      });
    });
  }, []);

  const releaseContext = useCallback((componentId: string) => {
    setState(prev => {
      const newQueue = prev.contextQueue.filter(id => id !== componentId);
      return {
        ...prev,
        activeContexts: Math.max(0, newQueue.length),
        contextQueue: newQueue
      };
    });
  }, []);

  const getContextStats = useCallback(() => state, [state]);

  // Limpiar contextos huérfanos cada 30 segundos
  useEffect(() => {
    const cleanup = setInterval(() => {
      setState(prev => {
        // Verificar que los componentes en la queue realmente existen
        const validComponents = prev.contextQueue.filter(id => {
          return document.querySelector(`[data-webgl-component="${id}"]`);
        });
        
        if (validComponents.length !== prev.contextQueue.length) {
          console.log('🧹 Cleaned up orphaned WebGL contexts');
          return {
            ...prev,
            activeContexts: validComponents.length,
            contextQueue: validComponents
          };
        }
        
        return prev;
      });
    }, 30000);

    return () => clearInterval(cleanup);
  }, []);

  return (
    <WebGLContext.Provider value={{
      ...state,
      requestContext,
      releaseContext,
      getContextStats
    }}>
      {children}
    </WebGLContext.Provider>
  );
};
