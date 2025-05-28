
import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useCriticalWebGL } from '@/core/webgl/CriticalWebGLManager';
import { motion } from 'framer-motion';

interface SafeThreeCanvasProps {
  children: React.ReactNode;
  componentId: string;
  fallback?: React.ReactNode;
  camera?: any;
  className?: string;
  onCreated?: (gl: any) => void;
}

const CriticalFallback = ({ reason }: { reason: string }) => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-white/10">
    <div className="text-center text-white/60">
      <div className="text-sm">Visualización 3D no disponible</div>
      <div className="text-xs mt-1">{reason}</div>
    </div>
  </div>
);

export const SafeThreeCanvas: React.FC<SafeThreeCanvasProps> = ({
  children,
  componentId,
  fallback,
  camera,
  className,
  onCreated
}) => {
  const { requestContext, releaseContext, canCreateContext, emergencyMode, deviceCapabilities } = useCriticalWebGL();
  const [hasContext, setHasContext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const initializeContext = async () => {
      try {
        setError(null);
        
        // Verificaciones previas críticas
        if (emergencyMode) {
          setError('Sistema en modo de emergencia');
          setIsLoading(false);
          return;
        }
        
        if (!canCreateContext) {
          setError('WebGL no disponible');
          setIsLoading(false);
          return;
        }
        
        if (deviceCapabilities.isLowEnd && deviceCapabilities.isMobile) {
          // Delay extra para dispositivos móviles de gama baja
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        const granted = await requestContext(componentId);
        
        if (mountedRef.current) {
          setHasContext(granted);
          setIsLoading(false);
          
          if (!granted) {
            setError('Límite de contextos WebGL alcanzado');
          }
        }
      } catch (error) {
        console.error('❌ Critical WebGL context error:', error);
        if (mountedRef.current) {
          setError('Error crítico de WebGL');
          setIsLoading(false);
        }
      }
    };

    // Delay escalonado para prevenir thrashing
    const delay = Math.random() * 300 + (deviceCapabilities.isLowEnd ? 500 : 100);
    const timer = setTimeout(initializeContext, delay);

    return () => {
      clearTimeout(timer);
      if (hasContext) {
        releaseContext(componentId);
      }
    };
  }, [componentId, requestContext, releaseContext, canCreateContext, emergencyMode]);

  // Marcar elemento para cleanup automático
  useEffect(() => {
    if (canvasRef.current && hasContext) {
      canvasRef.current.setAttribute('data-webgl-component', componentId);
    }
  }, [componentId, hasContext]);

  if (isLoading) {
    return (
      <div className={className || "w-full h-full"}>
        <div className="w-full h-full flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-center text-white/60">
            <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2"></div>
            <div className="text-sm">Preparando visualización 3D...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hasContext || !canCreateContext) {
    return (
      <motion.div 
        ref={canvasRef}
        className={className || "w-full h-full"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {fallback || <CriticalFallback reason={error || 'WebGL no disponible'} />}
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={canvasRef}
      className={className || "w-full h-full"}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Suspense fallback={fallback || <CriticalFallback reason="Cargando..." />}>
        <Canvas
          camera={camera || { position: [0, 5, 10], fov: 60 }}
          onCreated={(state) => {
            try {
              // Configuración conservadora para dispositivos
              const pixelRatio = deviceCapabilities.isLowEnd ? 1 : Math.min(window.devicePixelRatio, 2);
              state.gl.setPixelRatio(pixelRatio);
              
              // Configuración de performance para móviles
              if (deviceCapabilities.isMobile) {
                state.gl.antialias = false;
                state.gl.precision = 'mediump';
              }
              
              onCreated?.(state.gl);
            } catch (error) {
              console.error('❌ WebGL setup error:', error);
            }
          }}
          className="rounded-lg overflow-hidden"
        >
          {children}
        </Canvas>
      </Suspense>
    </motion.div>
  );
};
