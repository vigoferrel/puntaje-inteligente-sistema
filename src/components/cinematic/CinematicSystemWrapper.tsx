
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CinematicParticleSystem } from './CinematicParticleSystem';
import { NeuroActivityMonitor } from './NeuroActivityMonitor';
import { CinematicNavigationHub } from './CinematicNavigationHub';

interface CinematicSystemWrapperProps {
  children: React.ReactNode;
  cinematicMode?: boolean;
}

export const CinematicSystemWrapper: React.FC<CinematicSystemWrapperProps> = ({ 
  children, 
  cinematicMode = true 
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [neuralActivity, setNeuralActivity] = useState(0);

  useEffect(() => {
    // Inicialización cinematográfica
    const timer = setTimeout(() => setIsInitialized(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!cinematicMode) return;

    // Monitoreo de actividad neuronal simulada
    const interval = setInterval(() => {
      setNeuralActivity(prev => {
        const newActivity = Math.sin(Date.now() / 1000) * 50 + 50;
        return Math.round(newActivity);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [cinematicMode]);

  if (!cinematicMode) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background cinematográfico con gradientes dinámicos */}
      <motion.div
        className="fixed inset-0 z-0"
        animate={{
          background: [
            'linear-gradient(135deg, #0f0f23 0%, #1a0b2e 30%, #16213e 70%, #0f172a 100%)',
            'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f172a 70%, #0f0f23 100%)',
            'linear-gradient(135deg, #0f0f23 0%, #1a0b2e 30%, #16213e 70%, #0f172a 100%)'
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Sistema de partículas cinematográficas */}
      <CinematicParticleSystem 
        intensity={neuralActivity}
        isActive={isInitialized}
      />

      {/* Monitor de actividad neuronal */}
      <NeuroActivityMonitor 
        activity={neuralActivity}
        position="top-right"
      />

      {/* Hub de navegación cinematográfica */}
      <CinematicNavigationHub />

      {/* Efectos de luz ambiental */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.1, 0.3],
            x: [0, -40, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Contenido principal */}
      <AnimatePresence mode="wait">
        <motion.div
          key="main-content"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-20"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Overlay de efectos cinematográficos */}
      <div className="fixed inset-0 pointer-events-none z-30">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-purple-900/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
    </div>
  );
};
