
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCinematic } from './CinematicTransitionSystem';

interface CinematicAudioContextType {
  playTransitionSound: (type: 'enter' | 'exit' | 'navigate') => void;
  playAmbientSound: (scene: string) => void;
  setVolume: (volume: number) => void;
  muted: boolean;
  toggleMute: () => void;
}

const CinematicAudioContext = createContext<CinematicAudioContextType | null>(null);

export const useCinematicAudio = () => {
  const context = useContext(CinematicAudioContext);
  if (!context) {
    throw new Error('useCinematicAudio must be used within CinematicAudioProvider');
  }
  return context;
};

export const CinematicAudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [volume, setVolumeState] = useState(0.3);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Crear elemento de audio para efectos de sonido
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playTransitionSound = (type: 'enter' | 'exit' | 'navigate') => {
    if (muted || !audioRef.current) return;
    
    // Sonidos sintéticos para transiciones
    const frequencies = {
      enter: [440, 880],
      exit: [880, 440],
      navigate: [523, 659, 784]
    };
    
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.setValueAtTime(frequencies[type][0], context.currentTime);
    gainNode.gain.setValueAtTime(volume * 0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.3);
  };

  const playAmbientSound = (scene: string) => {
    if (muted) return;
    console.log(`🎵 Reproduciendo ambiente: ${scene}`);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <CinematicAudioContext.Provider value={{
      playTransitionSound,
      playAmbientSound,
      setVolume,
      muted,
      toggleMute
    }}>
      {children}
    </CinematicAudioContext.Provider>
  );
};

// Componente de transición universal mejorado
export const UniversalTransition: React.FC<{
  children: React.ReactNode;
  scene: string;
  className?: string;
}> = ({ children, scene, className = "" }) => {
  const { state } = useCinematic();
  const { playTransitionSound, playAmbientSound } = useCinematicAudio();

  const getTransitionConfig = () => {
    const baseConfig = {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    };

    switch (state.immersionLevel) {
      case 'full':
        return {
          initial: { 
            opacity: 0, 
            scale: 0.9,
            rotateY: -20,
            z: -100
          },
          animate: { 
            opacity: 1, 
            scale: 1,
            rotateY: 0,
            z: 0
          },
          exit: { 
            opacity: 0, 
            scale: 1.1,
            rotateY: 20,
            z: 100
          },
          transition: { ...baseConfig, duration: 1.2 }
        };
      
      case 'standard':
        return {
          initial: { opacity: 0, y: 30, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -30, scale: 1.05 },
          transition: baseConfig
        };
      
      case 'minimal':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.4 }
        };
    }
  };

  useEffect(() => {
    playAmbientSound(scene);
  }, [scene, playAmbientSound]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => playTransitionSound('exit')}>
      <motion.div
        key={scene}
        {...getTransitionConfig()}
        className={`w-full h-full ${className}`}
        onAnimationComplete={() => playTransitionSound('enter')}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Control de efectos cinematográficos
export const CinematicControls: React.FC = () => {
  const { state, setImmersionLevel, toggleEffects } = useCinematic();
  const { muted, toggleMute, setVolume } = useCinematicAudio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
    >
      <div className="space-y-3">
        <div className="text-white text-sm font-medium">Experiencia Cinematográfica</div>
        
        <div className="flex gap-2">
          {(['minimal', 'standard', 'full'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setImmersionLevel(level)}
              className={`px-3 py-1 rounded-lg text-xs transition-all ${
                state.immersionLevel === level
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleEffects}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              state.effectsEnabled
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            Efectos: {state.effectsEnabled ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={toggleMute}
            className={`px-3 py-1 rounded-lg text-xs transition-all ${
              !muted
                ? 'bg-blue-500 text-white'
                : 'bg-gray-500 text-white'
            }`}
          >
            Audio: {!muted ? 'ON' : 'OFF'}
          </button>
        </div>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="w-full h-1 bg-white/20 rounded-lg appearance-none slider"
        />
      </div>
    </motion.div>
  );
};
