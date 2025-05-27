
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicParticleSystem } from './CinematicParticleSystem';
import { NeuroActivityMonitor } from './NeuroActivityMonitor';
import { AdvancedFloatingNavigation } from './AdvancedFloatingNavigation';
import { EnhancedCinematicTransitions } from './EnhancedCinematicTransitions';

interface CinematicSystemWrapperProps {
  children: React.ReactNode;
  cinematicMode?: boolean;
  variant?: 'neural' | 'cosmic' | 'energy' | 'universe';
}

export const CinematicSystemWrapper: React.FC<CinematicSystemWrapperProps> = ({ 
  children, 
  cinematicMode = true,
  variant = 'neural'
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(0);
  const [ambientMode, setAmbientMode] = useState<'neural' | 'cosmic' | 'energy'>('neural');

  useEffect(() => {
    // Inicialización cinematográfica mejorada
    const timer = setTimeout(() => setIsInitialized(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cinematicMode) return;

    // Sistema de actividad neuronal mejorado
    const interval = setInterval(() => {
      setNeuralActivity(prev => {
        const baseActivity = Math.sin(Date.now() / 1000) * 30 + 70;
        const variance = Math.random() * 20 - 10;
        const newActivity = Math.max(20, Math.min(100, baseActivity + variance));
        return Math.round(newActivity);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [cinematicMode]);

  // Cambio automático de modo ambiente
  useEffect(() => {
    const modeTimer = setInterval(() => {
      const modes: Array<'neural' | 'cosmic' | 'energy'> = ['neural', 'cosmic', 'energy'];
      const currentIndex = modes.indexOf(ambientMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      setAmbientMode(modes[nextIndex]);
    }, 30000); // Cambiar cada 30 segundos

    return () => clearInterval(modeTimer);
  }, [ambientMode]);

  if (!cinematicMode) {
    return <>{children}</>;
  }

  const getBackgroundGradient = () => {
    switch (ambientMode) {
      case 'cosmic':
        return [
          'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f172a 70%, #7c2d12 100%)',
          'linear-gradient(135deg, #16213e 0%, #0f172a 30%, #7c2d12 70%, #1a0b2e 100%)',
          'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f172a 70%, #7c2d12 100%)'
        ];
      case 'energy':
        return [
          'linear-gradient(135deg, #1a2e05 0%, #16213e 30%, #0f172a 70%, #365314 100%)',
          'linear-gradient(135deg, #16213e 0%, #0f172a 30%, #365314 70%, #1a2e05 100%)',
          'linear-gradient(135deg, #1a2e05 0%, #16213e 30%, #0f172a 70%, #365314 100%)'
        ];
      default: // neural
        return [
          'linear-gradient(135deg, #0f0f23 0%, #1a0b2e 30%, #16213e 70%, #0f172a 100%)',
          'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f172a 70%, #0f0f23 100%)',
          'linear-gradient(135deg, #0f0f23 0%, #1a0b2e 30%, #16213e 70%, #0f172a 100%)'
        ];
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background cinematográfico dinámico */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          background: getBackgroundGradient()
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sistema de partículas cinematográficas mejorado */}
      <CinematicParticleSystem 
        intensity={neuralActivity}
        isActive={isInitialized}
        variant={ambientMode}
      />

      {/* Monitor de actividad neuronal mejorado */}
      <NeuroActivityMonitor 
        activity={neuralActivity}
        position="top-right"
      />

      {/* Sistema de navegación flotante avanzado */}
      <AdvancedFloatingNavigation />

      {/* Efectos de luz ambiental mejorados */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Luces primarias */}
        <motion.div
          className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl ${
            ambientMode === 'cosmic' ? 'bg-red-500/20' :
            ambientMode === 'energy' ? 'bg-yellow-500/20' :
            'bg-purple-500/20'
          }`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, 80, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className={`absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full blur-3xl ${
            ambientMode === 'cosmic' ? 'bg-pink-500/20' :
            ambientMode === 'energy' ? 'bg-green-500/20' :
            'bg-cyan-500/20'
          }`}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.1, 0.3],
            x: [0, -60, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Luces secundarias */}
        <motion.div
          className={`absolute top-3/4 left-1/2 w-48 h-48 rounded-full blur-2xl ${
            ambientMode === 'cosmic' ? 'bg-purple-500/15' :
            ambientMode === 'energy' ? 'bg-blue-500/15' :
            'bg-indigo-500/15'
          }`}
          animate={{
            scale: [0.8, 1.1, 0.8],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Contenido principal con transiciones mejoradas */}
      <AnimatePresence mode="wait">
        <EnhancedCinematicTransitions
          variant={variant}
          className="relative z-20"
        >
          {children}
        </EnhancedCinematicTransitions>
      </AnimatePresence>

      {/* Overlay cinematográfico avanzado */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <motion.div
          className={`absolute inset-0 ${
            ambientMode === 'cosmic' ? 'bg-gradient-to-t from-transparent via-transparent to-red-900/10' :
            ambientMode === 'energy' ? 'bg-gradient-to-t from-transparent via-transparent to-green-900/10' :
            'bg-gradient-to-t from-transparent via-transparent to-purple-900/10'
          }`}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        
        {/* Scan lines cinematográficas */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.03) 2px,
              rgba(255,255,255,0.03) 4px
            )`
          }}
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      {/* Indicador de modo cinematográfico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-4 left-4 z-40"
      >
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          ambientMode === 'cosmic' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
          ambientMode === 'energy' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
          'bg-purple-500/20 text-purple-300 border border-purple-500/30'
        } backdrop-blur-xl`}>
          {ambientMode.toUpperCase()} MODE
        </div>
      </motion.div>
    </div>
  );
};
