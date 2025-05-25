
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicState } from '@/types/unified-paes-types';

interface CinematicContextType {
  state: CinematicState;
  startTransition: (targetScene: CinematicState['currentScene'], options?: TransitionOptions) => Promise<void>;
  setImmersionLevel: (level: CinematicState['immersionLevel']) => void;
  toggleEffects: () => void;
}

interface TransitionOptions {
  duration?: number;
  easing?: string;
  preserveState?: boolean;
  preloadTarget?: boolean;
}

const CinematicContext = createContext<CinematicContextType | null>(null);

export const CinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CinematicState>({
    currentScene: 'dashboard',
    transitionActive: false,
    immersionLevel: 'standard',
    effectsEnabled: true
  });

  const startTransition = useCallback(async (
    targetScene: CinematicState['currentScene'],
    options: TransitionOptions = {}
  ) => {
    const { duration = 800, preloadTarget = true } = options;

    setState(prev => ({ ...prev, transitionActive: true }));

    // Preload target if needed
    if (preloadTarget) {
      console.log(`🎬 Precargando escena: ${targetScene}`);
      // Add preloading logic here
    }

    // Simulate transition duration
    await new Promise(resolve => setTimeout(resolve, duration));

    setState(prev => ({
      ...prev,
      currentScene: targetScene,
      transitionActive: false
    }));

    console.log(`✨ Transición completada a: ${targetScene}`);
  }, []);

  const setImmersionLevel = useCallback((level: CinematicState['immersionLevel']) => {
    setState(prev => ({ ...prev, immersionLevel: level }));
  }, []);

  const toggleEffects = useCallback(() => {
    setState(prev => ({ ...prev, effectsEnabled: !prev.effectsEnabled }));
  }, []);

  return (
    <CinematicContext.Provider value={{
      state,
      startTransition,
      setImmersionLevel,
      toggleEffects
    }}>
      {children}
    </CinematicContext.Provider>
  );
};

export const useCinematic = () => {
  const context = useContext(CinematicContext);
  if (!context) {
    throw new Error('useCinematic must be used within CinematicProvider');
  }
  return context;
};

// Componente de transición universal
export const CinematicTransition: React.FC<{
  children: React.ReactNode;
  scene: CinematicState['currentScene'];
}> = ({ children, scene }) => {
  const { state } = useCinematic();

  const getTransitionConfig = () => {
    switch (state.immersionLevel) {
      case 'full':
        return {
          initial: { opacity: 0, scale: 0.8, rotateY: -45 },
          animate: { opacity: 1, scale: 1, rotateY: 0 },
          exit: { opacity: 0, scale: 1.2, rotateY: 45 },
          transition: { duration: 1.2, ease: "easeInOut" }
        };
      case 'standard':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration: 0.6, ease: "easeOut" }
        };
      case 'minimal':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3 }
        };
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene}
        {...getTransitionConfig()}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
