
import React, { useEffect, useRef } from 'react';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Optimizaciones para scroll suave en móviles
    const container = containerRef.current;
    if (!container) return;

    // Configurar scroll suave y evitar bouncing
    container.style.overflowY = 'auto';
    container.style.scrollBehavior = 'smooth';
    
    // Evitar problemas de scroll en iOS usando tipos seguros
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      container.style.position = 'relative';
      container.style.height = '100vh';
      // Usar setProperty para propiedades vendor-specific
      container.style.setProperty('-webkit-overflow-scrolling', 'touch');
    }

    // Optimizar rendering para Canvas y 3D
    const canvasElements = container.querySelectorAll('canvas');
    canvasElements.forEach(canvas => {
      canvas.style.transform = 'translateZ(0)'; // Hardware acceleration
      canvas.style.willChange = 'transform';
    });

    // Cleanup
    return () => {
      canvasElements.forEach(canvas => {
        canvas.style.willChange = 'auto';
      });
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen"
      style={{
        // Prevenir scroll horizontal
        overflowX: 'hidden',
        // Asegurar que el contenido se renderice correctamente
        contain: 'layout style paint',
        // Optimizar compositing
        isolation: 'isolate'
      }}
    >
      {children}
    </div>
  );
};
