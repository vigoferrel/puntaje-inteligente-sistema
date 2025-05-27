
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicState {
  isTransitioning: boolean;
  currentScene: string;
  transitionType: 'fade' | 'slide' | 'scale' | 'blur';
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
}

interface CinematicContextType {
  state: CinematicState;
  startTransition: (scene: string, type?: CinematicState['transitionType']) => Promise<void>;
  setImmersionLevel: (level: CinematicState['immersionLevel']) => void;
  toggleEffects: () => void;
}

const CinematicContext = createContext<CinematicContextType | null>(null);

const defaultState: CinematicState = {
  isTransitioning: false,
  currentScene: 'hub',
  transitionType: 'fade',
  immersionLevel: 'standard',
  effectsEnabled: true
};

export const SimplifiedCinematicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<CinematicState>(defaultState);

  const startTransition = useCallback(async (
    scene: string, 
    type: CinematicState['transitionType'] = 'fade'
  ) => {
    setState(prev => ({ 
      ...prev, 
      isTransitioning: true, 
      transitionType: type 
    }));

    // Duración de transición basada en nivel de inmersión
    const duration = state.immersionLevel === 'full' ? 800 : 
                    state.immersionLevel === 'standard' ? 600 : 300;

    await new Promise(resolve => setTimeout(resolve, duration));

    setState(prev => ({
      ...prev,
      currentScene: scene,
      isTransitioning: false
    }));
  }, [state.immersionLevel]);

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

export const useSimplifiedCinematic = () => {
  const context = useContext(CinematicContext);
  if (!context) {
    // Fallback seguro
    return {
      state: defaultState,
      startTransition: async () => {},
      setImmersionLevel: () => {},
      toggleEffects: () => {}
    };
  }
  return context;
};

// Componente de transición unificado
export const CinematicTransition: React.FC<{
  children: ReactNode;
  scene: string;
}> = ({ children, scene }) => {
  const { state } = useSimplifiedCinematic();

  const getTransitionConfig = () => {
    const baseConfig = {
      duration: state.immersionLevel === 'full' ? 0.8 : 
                state.immersionLevel === 'standard' ? 0.6 : 0.3,
      ease: "easeInOut"
    };

    switch (state.transitionType) {
      case 'slide':
        return {
          initial: { x: 300, opacity: 0 },
          animate: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 },
          transition: baseConfig
        };
      case 'scale':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 },
          transition: baseConfig
        };
      case 'blur':
        return {
          initial: { filter: 'blur(10px)', opacity: 0 },
          animate: { filter: 'blur(0px)', opacity: 1 },
          exit: { filter: 'blur(10px)', opacity: 0 },
          transition: baseConfig
        };
      default: // fade
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: baseConfig
        };
    }
  };

  if (!state.effectsEnabled) {
    return <>{children}</>;
  }

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
