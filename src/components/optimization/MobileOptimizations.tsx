
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
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  // Optimizaciones específicas para móvil
  const mobileStyles = isMobile ? {
    touchAction: 'manipulation',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none' as const
  } : {};

  return (
    <motion.div
      style={mobileStyles}
      className={`${isMobile ? 'mobile-optimized' : ''} ${isLandscape ? 'landscape-mode' : ''}`}
      initial={false}
      animate={{
        scale: isMobile ? 1 : 1,
        transition: { duration: 0.2 }
      }}
    >
      {children}
      
      {/* Styles específicos para móvil */}
      <style>{`
        .mobile-optimized {
          -webkit-overflow-scrolling: touch;
        }
        
        .landscape-mode {
          height: 100vh;
          overflow: hidden;
        }
        
        @media (max-width: 768px) {
          .cinematic-text-glow {
            text-shadow: 0 0 10px currentColor;
            font-size: 1.5rem !important;
          }
          
          .backdrop-blur-xl {
            backdrop-filter: blur(8px);
          }
        }
      `}</style>
    </motion.div>
  );
};
