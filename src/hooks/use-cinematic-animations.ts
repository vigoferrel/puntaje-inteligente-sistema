
import { useMemo } from 'react';
import { useCinematic } from '@/components/cinematic/CinematicTransitionSystem';

export interface AnimationConfig {
  duration: number;
  easing: number[];
  delay?: number;
}

export const useCinematicAnimations = () => {
  const { state } = useCinematic();

  const animations = useMemo(() => {
    const baseEasing = [0.25, 0.46, 0.45, 0.94];
    
    switch (state.immersionLevel) {
      case 'full':
        return {
          fadeIn: {
            duration: 1.2,
            easing: baseEasing,
            initial: { opacity: 0, scale: 0.8, rotateY: -15 },
            animate: { opacity: 1, scale: 1, rotateY: 0 }
          },
          slideIn: {
            duration: 1.0,
            easing: baseEasing,
            initial: { x: 100, opacity: 0, rotateX: 10 },
            animate: { x: 0, opacity: 1, rotateX: 0 }
          },
          scaleIn: {
            duration: 0.8,
            easing: [0.34, 1.56, 0.64, 1],
            initial: { scale: 0.5, opacity: 0, rotateZ: -10 },
            animate: { scale: 1, opacity: 1, rotateZ: 0 }
          }
        };
      
      case 'standard':
        return {
          fadeIn: {
            duration: 0.6,
            easing: baseEasing,
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 }
          },
          slideIn: {
            duration: 0.5,
            easing: baseEasing,
            initial: { x: 30, opacity: 0 },
            animate: { x: 0, opacity: 1 }
          },
          scaleIn: {
            duration: 0.4,
            easing: [0.34, 1.56, 0.64, 1],
            initial: { scale: 0.9, opacity: 0 },
            animate: { scale: 1, opacity: 1 }
          }
        };
      
      case 'minimal':
        return {
          fadeIn: {
            duration: 0.3,
            easing: [0.4, 0.0, 0.2, 1],
            initial: { opacity: 0 },
            animate: { opacity: 1 }
          },
          slideIn: {
            duration: 0.2,
            easing: [0.4, 0.0, 0.2, 1],
            initial: { x: 10, opacity: 0 },
            animate: { x: 0, opacity: 1 }
          },
          scaleIn: {
            duration: 0.2,
            easing: [0.4, 0.0, 0.2, 1],
            initial: { scale: 0.98, opacity: 0 },
            animate: { scale: 1, opacity: 1 }
          }
        };
    }
  }, [state.immersionLevel]);

  const staggerChildren = useMemo(() => {
    switch (state.immersionLevel) {
      case 'full': return 0.15;
      case 'standard': return 0.1;
      case 'minimal': return 0.05;
    }
  }, [state.immersionLevel]);

  const getStaggerContainer = (children: number) => ({
    animate: {
      transition: {
        staggerChildren,
        delayChildren: 0.1
      }
    }
  });

  return {
    animations,
    staggerChildren,
    getStaggerContainer,
    isEffectsEnabled: state.effectsEnabled
  };
};
