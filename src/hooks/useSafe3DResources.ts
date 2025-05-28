
import { useEffect, useRef, useState } from 'react';
import { useCriticalWebGL } from '@/core/webgl/CriticalWebGLManager';

interface Safe3DResourcesConfig {
  componentId: string;
  enableAutoCleanup?: boolean;
  fallbackOn3DError?: boolean;
}

export const useSafe3DResources = (config: Safe3DResourcesConfig) => {
  const { deviceCapabilities, emergencyMode } = useCriticalWebGL();
  const [is3DAvailable, setIs3DAvailable] = useState(true);
  const [shouldUseFallback, setShouldUseFallback] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Verificar si debemos usar fallback basado en capacidades del dispositivo
    const shouldFallback = 
      emergencyMode || 
      (deviceCapabilities.isLowEnd && deviceCapabilities.isMobile) ||
      !deviceCapabilities;

    setShouldUseFallback(shouldFallback);
    setIs3DAvailable(!shouldFallback);

    if (shouldFallback && config.fallbackOn3DError) {
      console.log(`📱 Using 2D fallback for ${config.componentId} due to device limitations`);
    }
  }, [emergencyMode, deviceCapabilities, config.componentId, config.fallbackOn3DError]);

  useEffect(() => {
    // Auto-cleanup en unmount
    return () => {
      if (cleanupRef.current && config.enableAutoCleanup) {
        cleanupRef.current();
      }
    };
  }, [config.enableAutoCleanup]);

  const registerCleanup = (cleanupFn: () => void) => {
    cleanupRef.current = cleanupFn;
  };

  const forceCleanup = () => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
  };

  return {
    is3DAvailable,
    shouldUseFallback,
    deviceCapabilities,
    emergencyMode,
    registerCleanup,
    forceCleanup
  };
};
