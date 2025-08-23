/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode, useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion, AnimatePresence, Variants, Transition } from 'framer-motion';

// Configuraciones de transiciÃ³n optimizadas para 60fps
export const optimizedTransitions = {
  fast: {
    duration: 0.15,
    ease: [0.4, 0, 0.2, 1]
  },
  medium: {
    duration: 0.25,
    ease: [0.4, 0, 0.2, 1]
  },
  slow: {
    duration: 0.4,
    ease: [0.4, 0, 0.2, 1]
  }
};

// Variantes de animaciÃ³n cinematogrÃ¡fica optimizadas
export const cinematicVariants: Variants = {
  fadeInInitial: {
    opacity: 0,
    y: 10
  },
  fadeInAnimate: {
    opacity: 1,
    y: 0
  },
  fadeInExit: {
    opacity: 0,
    y: -10
  },
  
  scaleInInitial: {
    opacity: 0,
    scale: 0.95
  },
  scaleInAnimate: {
    opacity: 1,
    scale: 1
  },
  scaleInExit: {
    opacity: 0,
    scale: 1.05
  },
  
  slideUpInitial: {
    opacity: 0,
    y: 20
  },
  slideUpAnimate: {
    opacity: 1,
    y: 0
  },
  slideUpExit: {
    opacity: 0,
    y: -20
  },
  
  neuralGlowInitial: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(4px)'
  },
  neuralGlowAnimate: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)'
  },
  neuralGlowExit: {
    opacity: 0,
    scale: 1.1,
    filter: 'blur(4px)'
  }
};

// Helper para obtener las variantes de animaciÃ³n
export const getAnimationStates = (variant: string) => {
  const baseVariant = variant.replace(/Initial|Animate|Exit$/, '');
  return {
    initial: `${baseVariant}Initial`,
    animate: `${baseVariant}Animate`,
    exit: `${baseVariant}Exit`
  };
};

interface OptimizedMotionProps {
  children: ReactNode;
  variant?: 'fadeIn' | 'scaleIn' | 'slideUp' | 'neuralGlow';
  speed?: keyof typeof optimizedTransitions;
  className?: string;
  delay?: number;
}

export const OptimizedMotion: FC<OptimizedMotionProps> = ({
  children,
  variant = 'fadeIn',
  speed = 'fast',
  className = '',
  delay = 0
}) => {
  const animationStates = getAnimationStates(variant);
  const transitionConfig: Transition = {
    ...optimizedTransitions[speed],
    delay
  };

  return (
    <motion.div
      variants={cinematicVariants}
      initial={animationStates.initial}
      animate={animationStates.animate}
      exit={animationStates.exit}
      transition={transitionConfig}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface OptimizedAnimatePresenceProps {
  children: ReactNode;
  mode?: 'wait' | 'sync' | 'popLayout';
}

export const OptimizedAnimatePresence: FC<OptimizedAnimatePresenceProps> = ({
  children,
  mode = 'wait'
}) => {
  return (
    <AnimatePresence mode={mode}>
      {children}
    </AnimatePresence>
  );
};

// Hook para detectar performance y ajustar animaciones
export const useAdaptiveAnimations = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    // Detectar preferencia del usuario
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldReduceMotion(mediaQuery.matches);

    // Detectar performance del dispositivo
    const checkPerformance = () => {
      const connection = (navigator as unknown).connection;
      if (connection && connection.effectiveType === '2g') {
        setShouldReduceMotion(true);
      }
    };

    checkPerformance();
    mediaQuery.addEventListener('change', (e) => setShouldReduceMotion(e.matches));

    return () => {
      mediaQuery.removeEventListener('change', (e) => setShouldReduceMotion(e.matches));
    };
  }, []);

  const getOptimizedTransition = (speed: keyof typeof optimizedTransitions = 'fast'): Transition => {
    if (shouldReduceMotion) {
      return { duration: 0.01, ease: 'linear' };
    }
    return optimizedTransitions[speed];
  };

  return {
    shouldReduceMotion,
    getOptimizedTransition
  };
};

