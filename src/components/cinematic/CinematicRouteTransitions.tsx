
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';
import { CinematicParticleSystem } from './CinematicParticleSystem';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const CinematicRouteTransitions: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const controls = useAnimation();
  const { realTimeMetrics, actions } = useAdvancedNeuralSystem('route-transitions');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

  // Detectar dirección de navegación
  useEffect(() => {
    const routeOrder = ['/', '/auth', '/lectoguia', '/diagnostic', '/planning', '/universe', '/achievements', '/financial', '/ecosystem'];
    const currentIndex = routeOrder.indexOf(location.pathname);
    const previousIndex = routeOrder.indexOf(sessionStorage.getItem('previousRoute') || '/');
    
    setTransitionDirection(currentIndex > previousIndex ? 'forward' : 'backward');
    sessionStorage.setItem('previousRoute', location.pathname);
  }, [location.pathname]);

  // Configuración adaptativa de transiciones
  const getTransitionConfig = () => {
    const engagement = realTimeMetrics.real_time_engagement;
    const coherence = realTimeMetrics.neural_coherence;
    
    // Transición más suave si hay baja coherencia neural
    if (coherence < 40) {
      return {
        duration: 0.4,
        type: 'fade',
        intensity: 'minimal'
      };
    }
    
    // Transición dramática para alta engagement
    if (engagement > 80) {
      return {
        duration: 1.2,
        type: 'universe',
        intensity: 'dramatic'
      };
    }
    
    return {
      duration: 0.8,
      type: 'neural',
      intensity: 'moderate'
    };
  };

  const config = getTransitionConfig();

  const transitionVariants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    neural: {
      initial: {
        opacity: 0,
        scale: 0.95,
        rotateY: transitionDirection === 'forward' ? 15 : -15,
        filter: 'blur(10px) brightness(0.7)',
        z: -100
      },
      animate: {
        opacity: 1,
        scale: 1,
        rotateY: 0,
        filter: 'blur(0px) brightness(1)',
        z: 0,
        transition: {
          duration: config.duration,
          ease: [0.25, 0.46, 0.45, 0.94],
          opacity: { duration: config.duration * 0.6 },
          filter: { duration: config.duration * 0.8 }
        }
      },
      exit: {
        opacity: 0,
        scale: 1.05,
        rotateY: transitionDirection === 'forward' ? -15 : 15,
        filter: 'blur(10px) brightness(1.3)',
        z: 100,
        transition: {
          duration: config.duration * 0.7,
          ease: [0.55, 0.085, 0.68, 0.53]
        }
      }
    },
    universe: {
      initial: {
        opacity: 0,
        scale: 0.3,
        rotateX: 90,
        rotateY: transitionDirection === 'forward' ? 45 : -45,
        rotateZ: 15,
        filter: 'blur(20px) hue-rotate(180deg) saturate(2)',
        z: -1000
      },
      animate: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0,
        filter: 'blur(0px) hue-rotate(0deg) saturate(1)',
        z: 0,
        transition: {
          duration: config.duration,
          ease: [0.25, 0.46, 0.45, 0.94],
          scale: { type: 'spring', stiffness: 60, damping: 15 },
          rotateX: { duration: config.duration * 0.8 },
          rotateY: { duration: config.duration * 1.1 },
          filter: { duration: config.duration * 0.9 }
        }
      },
      exit: {
        opacity: 0,
        scale: 2,
        rotateX: -90,
        rotateY: transitionDirection === 'forward' ? -45 : 45,
        rotateZ: -15,
        filter: 'blur(20px) hue-rotate(90deg) saturate(0.5)',
        z: 1000,
        transition: {
          duration: config.duration * 0.8,
          ease: [0.55, 0.085, 0.68, 0.53]
        }
      }
    }
  };

  const currentVariants = transitionVariants[config.type as keyof typeof transitionVariants];

  // Capturar evento de transición
  useEffect(() => {
    actions.captureEvent('navigation', {
      route: location.pathname,
      transition_type: config.type,
      transition_direction: transitionDirection,
      duration: config.duration,
      performance_optimized: true
    });
  }, [location.pathname, actions, config.type, transitionDirection, config.duration]);

  // Efecto de transición con partículas
  const handleTransitionStart = () => {
    setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sistema de partículas durante transición */}
      {isTransitioning && config.intensity !== 'minimal' && (
        <CinematicParticleSystem
          intensity={80}
          isActive={true}
          variant={config.type === 'universe' ? 'cosmic' : 'neural'}
          className="opacity-60"
        />
      )}

      {/* Overlay de transición */}
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: config.duration, ease: 'easeInOut' }}
        >
          <div className={`absolute inset-0 ${
            config.type === 'universe' ? 'bg-gradient-to-br from-purple-900/30 via-blue-900/30 to-indigo-900/30' :
            config.type === 'neural' ? 'bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20' :
            'bg-black/10'
          }`} />
        </motion.div>
      )}

      {/* Contenido con transiciones */}
      <AnimatePresence 
        mode="wait" 
        onExitComplete={handleTransitionComplete}
      >
        <motion.div
          key={location.pathname}
          variants={currentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onAnimationStart={handleTransitionStart}
          className="relative z-10 min-h-screen transform-gpu will-change-transform"
          style={{ 
            perspective: '1200px',
            transformStyle: 'preserve-3d'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Efectos de luz cinematográfica */}
      {config.intensity === 'dramatic' && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 0.4 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500" />
        </motion.div>
      )}
    </div>
  );
};

// Hook para navegación cinematográfica
export const useCinematicNavigation = () => {
  const navigate = useNavigate();
  const { actions } = useAdvancedNeuralSystem();
  
  const cinematicNavigate = async (path: string, options?: { 
    preload?: boolean; 
    transitionType?: 'fade' | 'neural' | 'universe' 
  }) => {
    const { preload = true, transitionType = 'neural' } = options || {};
    
    // Capturar intención de navegación
    actions.captureEvent('navigation', {
      type: 'cinematic_navigation',
      target_path: path,
      preload_enabled: preload,
      transition_type: transitionType,
      timestamp: Date.now()
    });
    
    // Precargar destino si está habilitado
    if (preload) {
      console.log(`🎬 Precargando ruta: ${path}`);
      // Aquí se podría integrar con el bundle optimizer
    }
    
    // Ejecutar navegación
    navigate(path);
  };
  
  return { cinematicNavigate };
};
