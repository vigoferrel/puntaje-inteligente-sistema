
import React, { Suspense, lazy, ComponentType } from 'react';
import { SystemErrorBoundary } from '@/core/error-handling/SystemErrorBoundary';
import { logger } from '@/core/logging/SystemLogger';

interface SafeThreeProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

// Lazy load de Three.js components con manejo de errores
const createSafeThreeComponent = (importFn: () => Promise<any>, componentName: string) => {
  return lazy(async () => {
    try {
      logger.debug('SafeThreeProvider', `Loading ${componentName}`);
      const module = await importFn();
      logger.info('SafeThreeProvider', `Successfully loaded ${componentName}`);
      return module;
    } catch (error) {
      logger.error('SafeThreeProvider', `Failed to load ${componentName}`, error);
      
      // Fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center h-64 bg-black/20 rounded-lg border border-white/10">
            <div className="text-white/60 text-center">
              <div className="text-sm">Visualización 3D no disponible</div>
              <div className="text-xs mt-1">Modo fallback activado</div>
            </div>
          </div>
        )
      };
    }
  });
};

// Verificar disponibilidad de WebGL
const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (error) {
    logger.warn('SafeThreeProvider', 'WebGL not supported', error);
    return false;
  }
};

export const SafeThreeProvider: React.FC<SafeThreeProviderProps> = ({ 
  children, 
  fallback 
}) => {
  const hasWebGL = checkWebGLSupport();

  if (!hasWebGL) {
    logger.warn('SafeThreeProvider', 'WebGL not available, using fallback');
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center h-64 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-white/10">
            <div className="text-white/60 text-center">
              <div className="text-sm">Visualizaciones 3D deshabilitadas</div>
              <div className="text-xs mt-1">WebGL no disponible en este navegador</div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <SystemErrorBoundary moduleName="Three.js Provider">
      <Suspense 
        fallback={
          fallback || (
            <div className="flex items-center justify-center h-64 bg-black/20 rounded-lg border border-white/10">
              <div className="text-white/60 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                <div className="text-sm">Cargando visualización 3D...</div>
              </div>
            </div>
          )
        }
      >
        {children}
      </Suspense>
    </SystemErrorBoundary>
  );
};

// Hook para verificar soporte de Three.js
export const useThreeSupport = () => {
  const [isSupported, setIsSupported] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkSupport = async () => {
      try {
        // Verificar WebGL
        const hasWebGL = checkWebGLSupport();
        
        // Verificar Three.js
        const hasThree = await import('@react-three/fiber').then(() => true).catch(() => false);
        
        const supported = hasWebGL && hasThree;
        setIsSupported(supported);
        
        logger.info('useThreeSupport', `Three.js support: ${supported}`, {
          webgl: hasWebGL,
          three: hasThree
        });
      } catch (error) {
        logger.error('useThreeSupport', 'Error checking Three.js support', error);
        setIsSupported(false);
      }
    };

    checkSupport();
  }, []);

  return isSupported;
};
