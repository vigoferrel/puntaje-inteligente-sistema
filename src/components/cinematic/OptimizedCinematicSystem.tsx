
import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuralErrorBoundary } from '@/components/neural/NeuralErrorBoundary';

interface CinematicState {
  isTransitioning: boolean;
  currentScene: string;
  transitionType: 'fade' | 'slide' | 'universe' | 'neural';
}

interface CinematicContextType {
  state: CinematicState;
  startTransition: (scene: string, options?: { duration?: number; type?: CinematicState['transitionType'] }) => void;
  endTransition: () => void;
}

const CinematicContext = createContext<CinematicContextType | null>(null);

export const useCinematic = () => {
  const context = useContext(CinematicContext);
  if (!context) {
    // Fail silently instead of throwing error
    return {
      state: { isTransitioning: false, currentScene: 'default', transitionType: 'fade' as const },
      startTransition: () => {},
      endTransition: () => {}
    };
  }
  return context;
};

export const OptimizedCinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<CinematicState>({
    isTransitioning: false,
    currentScene: 'default',
    transitionType: 'fade'
  });

  const startTransition = useCallback((
    scene: string, 
    options?: { duration?: number; type?: CinematicState['transitionType'] }
  ) => {
    try {
      setState(prev => ({
        ...prev,
        isTransitioning: true,
        currentScene: scene,
        transitionType: options?.type || 'fade'
      }));

      // Auto-end transition to prevent stuck states
      setTimeout(() => {
        setState(prev => ({ ...prev, isTransitioning: false }));
      }, options?.duration || 600);
    } catch (error) {
      console.error('🎬 Cinematic transition error:', error);
      setState(prev => ({ ...prev, isTransitioning: false }));
    }
  }, []);

  const endTransition = useCallback(() => {
    setState(prev => ({ ...prev, isTransitioning: false }));
  }, []);

  const contextValue = useMemo(() => ({
    state,
    startTransition,
    endTransition
  }), [state, startTransition, endTransition]);

  return (
    <NeuralErrorBoundary silent>
      <CinematicContext.Provider value={contextValue}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </CinematicContext.Provider>
    </NeuralErrorBoundary>
  );
};

export const CinematicTransition: React.FC<{ 
  scene: string;
  children: React.ReactNode;
}> = ({ scene, children }) => {
  const { state } = useCinematic();

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 }
    },
    universe: {
      initial: { scale: 0.8, opacity: 0, rotateY: 10 },
      animate: { scale: 1, opacity: 1, rotateY: 0 },
      exit: { scale: 1.1, opacity: 0, rotateY: -10 }
    },
    neural: {
      initial: { y: 50, opacity: 0, filter: 'blur(10px)' },
      animate: { y: 0, opacity: 1, filter: 'blur(0px)' },
      exit: { y: -50, opacity: 0, filter: 'blur(10px)' }
    }
  };

  const currentVariant = variants[state.transitionType];

  return (
    <motion.div
      key={scene}
      initial={currentVariant.initial}
      animate={currentVariant.animate}
      exit={currentVariant.exit}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
