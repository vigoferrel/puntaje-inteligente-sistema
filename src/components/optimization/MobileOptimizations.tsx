
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => {
      // Pequeño delay para orientationchange
      setTimeout(checkMobile, 100);
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Optimizaciones específicas para móvil que mejoran el scroll
  const mobileStyles = isMobile ? {
    touchAction: 'pan-y pinch-zoom',
    WebkitTapHighlightColor: 'transparent',
    overscrollBehavior: 'contain' as const
  } : {};

  return (
    <motion.div
      style={mobileStyles}
      className={`scroll-optimized ${isMobile ? 'mobile-optimized' : ''} ${isLandscape ? 'landscape-mode' : ''}`}
      initial={false}
      animate={{
        transition: { duration: 0.2 }
      }}
    >
      {children}
      
      <style>{`
        .scroll-optimized {
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: contain;
        }
        
        .mobile-optimized {
          /* Scroll optimizado para móviles */
          -webkit-overflow-scrolling: touch;
          overflow-y: auto;
          overscroll-behavior-y: contain;
          scroll-behavior: smooth;
        }
        
        .landscape-mode {
          /* Optimizaciones específicas para landscape */
          -webkit-overflow-scrolling: touch;
          overflow-y: auto;
          overscroll-behavior: contain;
        }
        
        @media (max-width: 768px) {
          .cinematic-text-glow {
            text-shadow: 0 0 10px currentColor;
            font-size: 1.5rem !important;
          }
          
          .backdrop-blur-xl {
            backdrop-filter: blur(8px);
          }
          
          /* Contenedores principales optimizados para scroll móvil */
          .min-h-screen {
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch;
            overscroll-behavior: contain;
          }
          
          /* Navegación flotante - compensar altura */
          body {
            padding-bottom: 120px !important;
          }
        }
        
        @media (max-height: 600px) and (orientation: landscape) {
          /* Optimizaciones para landscape en móviles pequeños */
          body {
            padding-bottom: 80px !important;
          }
        }
      `}</style>
    </motion.div>
  );
};
