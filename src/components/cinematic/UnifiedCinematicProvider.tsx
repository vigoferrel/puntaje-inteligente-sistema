
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedCinematicState {
  currentScene: string;
  isTransitioning: boolean;
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
  particleIntensity: 'low' | 'medium' | 'high';
  visualMode: 'neural' | 'cosmic' | 'energy' | 'universe';
  audioEnabled: boolean;
  volume: number;
}

interface UnifiedCinematicContextType {
  state: UnifiedCinematicState;
  startTransition: (scene: string, options?: { duration?: number; type?: string }) => Promise<void>;
  setImmersionLevel: (level: UnifiedCinematicState['immersionLevel']) => void;
  toggleEffects: () => void;
  updatePreferences: (prefs: Partial<UnifiedCinematicState>) => void;
  playTransitionSound: (type: 'enter' | 'exit' | 'navigate') => void;
}

const UnifiedCinematicContext = createContext<UnifiedCinematicContextType | null>(null);

const defaultState: UnifiedCinematicState = {
  currentScene: 'dashboard',
  isTransitioning: false,
  immersionLevel: 'standard',
  effectsEnabled: true,
  particleIntensity: 'medium',
  visualMode: 'neural',
  audioEnabled: true,
  volume: 0.3
};

export const UnifiedCinematicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<UnifiedCinematicState>(defaultState);

  const startTransition = useCallback(async (
    scene: string, 
    options?: { duration?: number; type?: string }
  ) => {
    const { duration = 600 } = options || {};

    setState(prev => ({ ...prev, isTransitioning: true }));

    await new Promise(resolve => setTimeout(resolve, duration));

    setState(prev => ({
      ...prev,
      currentScene: scene,
      isTransitioning: false
    }));
  }, []);

  const setImmersionLevel = useCallback((level: UnifiedCinematicState['immersionLevel']) => {
    setState(prev => ({ ...prev, immersionLevel: level }));
  }, []);

  const toggleEffects = useCallback(() => {
    setState(prev => ({ ...prev, effectsEnabled: !prev.effectsEnabled }));
  }, []);

  const updatePreferences = useCallback((prefs: Partial<UnifiedCinematicState>) => {
    setState(prev => ({ ...prev, ...prefs }));
  }, []);

  const playTransitionSound = useCallback((type: 'enter' | 'exit' | 'navigate') => {
    if (state.audioEnabled) {
      console.log(`🎵 Playing ${type} sound`);
    }
  }, [state.audioEnabled]);

  const contextValue: UnifiedCinematicContextType = {
    state,
    startTransition,
    setImmersionLevel,
    toggleEffects,
    updatePreferences,
    playTransitionSound
  };

  return (
    <UnifiedCinematicContext.Provider value={contextValue}>
      {children}
    </UnifiedCinematicContext.Provider>
  );
};

export const useUnifiedCinematic = () => {
  const context = useContext(UnifiedCinematicContext);
  if (!context) {
    // Fallback seguro en lugar de throw error
    console.warn('useUnifiedCinematic: No provider found, using fallback');
    return {
      state: defaultState,
      startTransition: async () => {},
      setImmersionLevel: () => {},
      toggleEffects: () => {},
      updatePreferences: () => {},
      playTransitionSound: () => {}
    };
  }
  return context;
};

// Componente de transición unificado
export const UnifiedTransition: React.FC<{
  children: React.ReactNode;
  scene: string;
}> = ({ children, scene }) => {
  const { state } = useUnifiedCinematic();

  const getTransitionConfig = () => {
    switch (state.immersionLevel) {
      case 'full':
        return {
          initial: { opacity: 0, scale: 0.9, rotateY: -15 },
          animate: { opacity: 1, scale: 1, rotateY: 0 },
          exit: { opacity: 0, scale: 1.1, rotateY: 15 },
          transition: { duration: 0.8, ease: "easeInOut" }
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
