
import React, { useEffect, useRef, useState } from 'react';

interface Enhanced3DMobileOptimizationsProps {
  children: React.ReactNode;
}

export const Enhanced3DMobileOptimizations: React.FC<Enhanced3DMobileOptimizationsProps> = ({ 
  children 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    isLowEnd: false,
    supportsWebGL2: true,
    memoryLimit: 1000
  });

  useEffect(() => {
    // Detectar capacidades del dispositivo
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    // Verificar soporte WebGL
    const supportsWebGL2 = !!canvas.getContext('webgl2');
    
    // Estimar si es dispositivo de gama baja
    const isLowEnd = (
      navigator.hardwareConcurrency <= 4 ||
      (navigator as any).deviceMemory <= 4 ||
      /Android.*Chrome.*Mobile/.test(navigator.userAgent)
    );

    // Estimar límite de memoria para texturas
    const memoryLimit = isLowEnd ? 512 : 1024;

    setDeviceCapabilities({
      isLowEnd,
      supportsWebGL2,
      memoryLimit
    });

    // Configurar container para 3D
    const container = containerRef.current;
    if (!container) return;

    // Optimizaciones específicas para 3D
    container.style.transform = 'translate3d(0,0,0)';
    container.style.willChange = 'transform';
    
    // Configuraciones iOS específicas
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      container.style.position = 'relative';
      container.style.height = '100vh';
      container.style.setProperty('-webkit-overflow-scrolling', 'touch');
      container.style.setProperty('-webkit-transform', 'translate3d(0,0,0)');
    }

    // Optimizar Canvas elements
    const optimizeCanvas = () => {
      const canvasElements = container.querySelectorAll('canvas');
      canvasElements.forEach(canvas => {
        // Hardware acceleration
        canvas.style.transform = 'translateZ(0)';
        canvas.style.willChange = 'transform';
        
        // Configurar para dispositivos de gama baja
        if (deviceCapabilities.isLowEnd) {
          canvas.style.imageRendering = 'pixelated';
          // Reducir DPR para dispositivos lentos
          const context = canvas.getContext('webgl') || canvas.getContext('webgl2');
          if (context) {
            // Configurar precision para ahorro de recursos
          }
        }
        
        // Lazy loading para canvas fuera de vista
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              canvas.style.willChange = 'transform';
            } else {
              canvas.style.willChange = 'auto';
            }
          });
        });
        
        observer.observe(canvas);
      });
    };

    // Observar cambios en el DOM para nuevos canvas
    const canvasObserver = new MutationObserver(() => {
      optimizeCanvas();
    });

    canvasObserver.observe(container, {
      childList: true,
      subtree: true
    });

    // Optimización inicial
    setTimeout(optimizeCanvas, 100);

    // Manejar cambios de orientación
    const handleOrientationChange = () => {
      setTimeout(() => {
        optimizeCanvas();
        // Forzar reflow para evitar problemas de viewport
        container.style.height = window.innerHeight + 'px';
      }, 300);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Cleanup
    return () => {
      canvasObserver.disconnect();
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
      
      const canvasElements = container.querySelectorAll('canvas');
      canvasElements.forEach(canvas => {
        canvas.style.willChange = 'auto';
      });
    };
  }, [deviceCapabilities]);

  // Configurar context provider para capacidades del dispositivo
  useEffect(() => {
    // Establecer variables CSS para optimizaciones
    document.documentElement.style.setProperty(
      '--device-performance-level', 
      deviceCapabilities.isLowEnd ? 'low' : 'high'
    );
    
    document.documentElement.style.setProperty(
      '--webgl-support-level',
      deviceCapabilities.supportsWebGL2 ? '2' : '1'
    );
  }, [deviceCapabilities]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full min-h-screen"
      style={{
        overflowX: 'hidden',
        contain: 'layout style paint',
        isolation: 'isolate',
        // Optimización para 3D
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
      data-device-capabilities={JSON.stringify(deviceCapabilities)}
    >
      {children}
    </div>
  );
};

// Hook para acceder a las capacidades del dispositivo
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    supportsWebGL2: true,
    memoryLimit: 1000,
    recommendedParticleCount: 1000,
    recommendedQuality: 'high' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    const isLowEnd = (
      navigator.hardwareConcurrency <= 4 ||
      (navigator as any).deviceMemory <= 4 ||
      /Android.*Chrome.*Mobile/.test(navigator.userAgent)
    );

    const canvas = document.createElement('canvas');
    const supportsWebGL2 = !!canvas.getContext('webgl2');
    
    setCapabilities({
      isLowEnd,
      supportsWebGL2,
      memoryLimit: isLowEnd ? 512 : 1024,
      recommendedParticleCount: isLowEnd ? 300 : 1000,
      recommendedQuality: isLowEnd ? 'low' : supportsWebGL2 ? 'high' : 'medium'
    });
  }, []);

  return capabilities;
};
