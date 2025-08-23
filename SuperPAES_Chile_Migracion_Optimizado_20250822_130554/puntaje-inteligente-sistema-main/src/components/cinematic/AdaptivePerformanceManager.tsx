/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  AdaptivePerformanceContext,
  type PerformanceMetrics,
  type PerformanceSettings,
  type AdaptivePerformanceContextType
} from '../../contexts/AdaptivePerformanceContext';

interface AdaptivePerformanceProviderProps {
  children: React.ReactNode;
}

export const AdaptivePerformanceProvider: React.FC<AdaptivePerformanceProviderProps> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    deviceType: 'desktop',
    connectionSpeed: 'fast'
  });

  const [settings, setSettings] = useState<PerformanceSettings>({
    particleCount: 100,
    animationQuality: 'high',
    effectsEnabled: true,
    audioEnabled: true,
    transitionsEnabled: true
  });

  const detectDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const detectConnectionSpeed = (): 'slow' | 'medium' | 'fast' => {
    // @ts-expect-error - navigator.connection puede no estar disponible en todos los navegadores
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!connection) return 'fast';

    const effectiveType = connection.effectiveType;
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    return 'fast';
  };

  const measurePerformance = useCallback(() => {
    // Medir FPS de forma optimizada con requestIdleCallback
    let lastTime = performance.now();
    let frameCount = 0;
    let isActive = true;
    let lastUpdateTime = 0;

    const measureFrame = () => {
      if (!isActive) return;
      
      frameCount++;
      const currentTime = performance.now();
      
      // Solo actualizar cada 2 segundos para reducir re-renders
      if (currentTime - lastTime >= 2000 && currentTime - lastUpdateTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        // Throttle updates mÃ¡s agresivo
        if (Math.abs(fps - metrics.fps) > 5) {
          setMetrics(prev => ({
            ...prev,
            fps,
            memoryUsage: (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory?.usedJSHeapSize || 0,
            renderTime: currentTime - lastTime,
            deviceType: detectDeviceType(),
            connectionSpeed: detectConnectionSpeed()
          }));
          lastUpdateTime = currentTime;
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      // Usar requestIdleCallback si estÃ¡ disponible
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          if (isActive) {
            requestAnimationFrame(measureFrame);
          }
        }, { timeout: 200 });
      } else {
        setTimeout(() => {
          if (isActive) {
            requestAnimationFrame(measureFrame);
          }
        }, 200);
      }
    };

    const animationId = requestAnimationFrame(measureFrame);
    
    // Retornar funciÃ³n de limpieza
    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
    };
  }, [metrics.fps]);

  const updateSettings = useCallback((newSettings: Partial<PerformanceSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const optimizeForDevice = useCallback(() => {
    const { deviceType, connectionSpeed, fps } = metrics;
    
    let newSettings: Partial<PerformanceSettings> = {};

    // Optimizacion por tipo de dispositivo
    if (deviceType === 'mobile') {
      newSettings = {
        particleCount: 25,
        animationQuality: 'medium',
        effectsEnabled: true,
        audioEnabled: false,
        transitionsEnabled: true
      };
    } else if (deviceType === 'tablet') {
      newSettings = {
        particleCount: 50,
        animationQuality: 'medium',
        effectsEnabled: true,
        audioEnabled: true,
        transitionsEnabled: true
      };
    } else {
      newSettings = {
        particleCount: 100,
        animationQuality: 'high',
        effectsEnabled: true,
        audioEnabled: true,
        transitionsEnabled: true
      };
    }

    // Optimizacion por velocidad de conexion
    if (connectionSpeed === 'slow') {
      newSettings.particleCount = Math.min(newSettings.particleCount || 25, 25);
      newSettings.animationQuality = 'low';
      newSettings.audioEnabled = false;
    }

    // Optimizacion por FPS
    if (fps < 30) {
      newSettings.particleCount = Math.min(newSettings.particleCount || 25, 25);
      newSettings.animationQuality = 'low';
      newSettings.effectsEnabled = false;
    } else if (fps < 45) {
      newSettings.particleCount = Math.min(newSettings.particleCount || 50, 50);
      newSettings.animationQuality = 'medium';
    }

    updateSettings(newSettings);
  }, [metrics, updateSettings]);

  useEffect(() => {
    const cleanup = measurePerformance();
    
    // Optimizacion automatica cada 20 segundos (aumentado para reducir carga)
    const interval = setInterval(optimizeForDevice, 20000);
    
    // Optimizacion inicial despues de 5 segundos
    const timeout = setTimeout(optimizeForDevice, 5000);

    return () => {
      cleanup();
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [measurePerformance, optimizeForDevice]);

  const value = useMemo<AdaptivePerformanceContextType>(() => ({
    metrics,
    settings,
    updateSettings,
    optimizeForDevice
  }), [metrics, settings, updateSettings, optimizeForDevice]);

  return (
    <AdaptivePerformanceContext.Provider value={value}>
      {children}
    </AdaptivePerformanceContext.Provider>
  );
};

export default AdaptivePerformanceProvider;

