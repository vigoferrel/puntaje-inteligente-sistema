/* eslint-disable react-refresh/only-export-components */
import React, { ReactNode, Suspense, useRef, useEffect } from 'react';
import { ContextWindowProvider } from '../../core/context-windows/ContextWindowManager';
import { ViewportVirtualizer } from '../../core/context-windows/ViewportVirtualizer';
import { usePerformanceMonitor } from '../../core/performance/PerformanceMonitor';
import { motion, AnimatePresence } from 'framer-motion';
import type { SafeString, SafeNumber, SafeBoolean } from '../../types/core';
import './OptimizedCinematicWrapper.css';
import '@/styles/CinematicAnimations.css';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface OptimizedCinematicWrapperProps {
  children: ReactNode;
  enableParticles?: SafeBoolean;
  enableHolographics?: SafeBoolean;
  enableTransitions?: SafeBoolean;
  maxActiveWindows?: SafeNumber;
  memoryBudget?: SafeNumber;
}

const SimpleParticleSystem: React.FC<{ intensity: number }> = React.memo(({ intensity }) => {
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Configurar partÃ­culas dinÃ¡micamente usando CSS custom properties
  useEffect(() => {
    const particles = particleRefs.current.filter(Boolean);
    
    particles.forEach((particle, index) => {
      if (particle) {
        // Generar valores aleatorios para cada partÃ­cula
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 2 + Math.random() * 3;
        const scale = 0.5 + Math.random() * 0.5;
        const opacity = 0.3 + Math.random() * 0.4;
        
        // Establecer CSS custom properties
        particle.style.setProperty('--particle-left', `${left}%`);
        particle.style.setProperty('--particle-top', `${top}%`);
        particle.style.setProperty('--particle-delay', `${delay}s`);
        particle.style.setProperty('--particle-duration', `${duration}s`);
        particle.style.setProperty('--particle-scale', scale.toString());
        particle.style.setProperty('--particle-opacity', opacity.toString());
      }
    });
  }, [intensity]);
  
  // Cleanup en desmontaje
  useEffect(() => {
    return () => {
      particleRefs.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="particle-system-optimized particle-container"
    >
      {Array.from({ length: Math.min(intensity, 50) }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (particleRefs.current[i] = el)}
          className="particle cinematic-particle cinematic-float"
        />
      ))}
    </div>
  );
});

SimpleParticleSystem.displayName = 'SimpleParticleSystem';

const SimpleHolographicSystem: React.FC = React.memo(() => {
  return (
    <div className="holographic-system-optimized">
      <div className="holographic-grid" />
    </div>
  );
});

SimpleHolographicSystem.displayName = 'SimpleHolographicSystem';

export const OptimizedCinematicWrapper: React.FC<OptimizedCinematicWrapperProps> = ({
  children,
  enableParticles = true,
  enableHolographics = true,
  enableTransitions = true,
  maxActiveWindows = 5,
  memoryBudget = 512
}) => {
  const { metrics, getPerformanceLevel } = usePerformanceMonitor();
  const performanceLevel = getPerformanceLevel();

  const adaptiveSettings = React.useMemo(() => {
    switch (performanceLevel) {
      case 'low':
        return { particleCount: 10, enableEffects: false, transitionDuration: 0.2 };
      case 'medium':
        return { particleCount: 25, enableEffects: true, transitionDuration: 0.4 };
      case 'high':
      default:
        return { particleCount: 50, enableEffects: true, transitionDuration: 0.6 };
    }
  }, [performanceLevel]);

  const cinematicVariants = React.useMemo(() => ({
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: adaptiveSettings.transitionDuration,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      y: -20,
      transition: {
        duration: adaptiveSettings.transitionDuration * 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }), [adaptiveSettings.transitionDuration]);

  return (
    <ContextWindowProvider maxWindows={maxActiveWindows} memoryBudget={memoryBudget}>
      <div className="optimized-cinematic-wrapper relative min-h-screen overflow-hidden">
        {process.env.NODE_ENV === 'development' && metrics && (
          <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-2 rounded text-xs font-mono">
            <div>FPS: {Math.round(metrics.fps)}</div>
            <div>Memory: {Math.round(metrics.memoryUsage)}MB</div>
            <div>Mode: {performanceLevel}</div>
          </div>
        )}

        {enableParticles && adaptiveSettings.enableEffects && (
          <ViewportVirtualizer id="particle-system" priority={4}>
            <Suspense fallback={null}>
              <SimpleParticleSystem intensity={adaptiveSettings.particleCount} />
            </Suspense>
          </ViewportVirtualizer>
        )}

        {enableHolographics && adaptiveSettings.enableEffects && performanceLevel !== 'low' && (
          <ViewportVirtualizer id="holographic-system" priority={3}>
            <Suspense fallback={null}>
              <SimpleHolographicSystem />
            </Suspense>
          </ViewportVirtualizer>
        )}

        <div className="relative z-10">
          {enableTransitions ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="cinematic-content"
                variants={cinematicVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="cinematic-content-container"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="cinematic-content-container">
              {children}
            </div>
          )}
        </div>
      </div>
    </ContextWindowProvider>
  );
};

export default OptimizedCinematicWrapper;


