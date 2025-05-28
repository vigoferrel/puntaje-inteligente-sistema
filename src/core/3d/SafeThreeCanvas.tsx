
import React, { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useWebGLContext } from '@/core/webgl/WebGLContextManager';
import { motion } from 'framer-motion';

interface SafeThreeCanvasProps {
  children: React.ReactNode;
  componentId: string;
  fallback?: React.ReactNode;
  camera?: any;
  className?: string;
  onCreated?: (gl: any) => void;
}

const Default3DFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-white/10">
    <div className="text-center text-white/60">
      <div className="text-sm">Visualización 3D no disponible</div>
      <div className="text-xs mt-1">Límite de contextos WebGL alcanzado</div>
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
  const { requestContext, releaseContext, canCreateContext } = useWebGLContext();
  const [hasContext, setHasContext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const initializeContext = async () => {
      if (!canCreateContext) {
        setIsLoading(false);
        return;
      }

      try {
        const granted = await requestContext(componentId);
        if (mounted) {
          setHasContext(granted);
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Failed to request WebGL context:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Delay para evitar thrashing en mount simultáneo
    const timer = setTimeout(initializeContext, Math.random() * 200);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (hasContext) {
        releaseContext(componentId);
      }
    };
  }, [componentId, requestContext, releaseContext, canCreateContext]);

  // Marcar el elemento para cleanup
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

  if (!hasContext || !canCreateContext) {
    return (
      <motion.div 
        ref={canvasRef}
        className={className || "w-full h-full"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {fallback || <Default3DFallback />}
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
      <Suspense fallback={fallback || <Default3DFallback />}>
        <Canvas
          camera={camera || { position: [0, 5, 10], fov: 60 }}
          onCreated={(state) => {
            // Configurar para eficiencia (sin powerPreference)
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            onCreated?.(state.gl);
          }}
          className="rounded-lg overflow-hidden"
        >
          {children}
        </Canvas>
      </Suspense>
    </motion.div>
  );
};
