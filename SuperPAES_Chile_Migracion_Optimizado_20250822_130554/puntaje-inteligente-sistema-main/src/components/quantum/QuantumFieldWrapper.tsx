/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŒŒ QuantumFieldWrapper - Campo CuÃ¡ntico de SuperposiciÃ³n
 * Leonardo da Vinci: "Menos cÃ³digo, mÃ¡s funnel"
 * 
 * Permite que ContextualWindows y UnifiedDashboard coexistan en superposiciÃ³n
 * hasta que el TercerOjo (observador cuÃ¡ntico) colapsa la funciÃ³n de onda
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumDashboard } from '../../hooks/useQuantumDashboard';
import { useQuantumFunnel } from '../../hooks/useQuantumFunnel';
import { ContextualWindows } from '../leonardo-anatomy/ContextualWindows';
import { UnifiedDashboard } from '../dashboard/UnifiedDashboard';

interface QuantumFieldWrapperProps {
  children?: React.ReactNode;
  shouldActivateAdvancedUI?: boolean; // ðŸ§¬ MecÃ¡nica Intramuscular
}

export const QuantumFieldWrapper: React.FC<QuantumFieldWrapperProps> = ({
  children,
  shouldActivateAdvancedUI
}) => {
  const { quantumState, isQuantumActive } = useQuantumDashboard();
  const { metrics } = useQuantumFunnel();
  const [quantumParticles, setQuantumParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([]);

  // Generar partÃ­culas cuÃ¡nticas para efecto visual
  useEffect(() => {
    if (isQuantumActive) {
      const particles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.6 + 0.2
      }));
      setQuantumParticles(particles);
    } else {
      setQuantumParticles([]);
    }
  }, [isQuantumActive]);

  // ðŸ§¬ MECÃNICA INTRAMUSCULAR: Determinar componente basado en ejercicios PAES
  const renderQuantumState = () => {
    // Prioridad 1: MecÃ¡nica Intramuscular (shouldActivateAdvancedUI prop)
    if (shouldActivateAdvancedUI !== undefined) {
      return shouldActivateAdvancedUI ? (
        <motion.div
          key="contextual-intramuscular"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <ContextualWindows />
        </motion.div>
      ) : (
        // Renderizar children (UI bÃ¡sica de QuantumSystemPage)
        <motion.div
          key="basic-intramuscular"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {children}
        </motion.div>
      );
    }

    // Prioridad 2: MecÃ¡nica Intramuscular AutomÃ¡tica (metrics.accuracy >= 50%)
    const autoActivateAdvanced = metrics?.accuracy && metrics.accuracy >= 50;
    if (autoActivateAdvanced) {
      return (
        <motion.div
          key="contextual-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
        >
          <ContextualWindows />
        </motion.div>
      );
    }

    // Prioridad 3: Sistema cuÃ¡ntico original (fallback)
    switch (quantumState.currentState) {
      case 'contextual':
        return (
          <motion.div
            key="contextual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <ContextualWindows />
          </motion.div>
        );
      
      case 'unified':
        return (
          <motion.div
            key="unified"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <UnifiedDashboard />
          </motion.div>
        );
      
      case 'superposition':
      default:
        // Si hay children, mostrarlos en lugar de superposiciÃ³n
        if (children) {
          return (
            <motion.div
              key="children-fallback"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full h-full"
            >
              {children}
            </motion.div>
          );
        }

        return (
          <motion.div
            key="superposition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full"
          >
            {/* Estado de superposiciÃ³n - ambos componentes superpuestos */}
            <div className="absolute inset-0 opacity-50">
              <ContextualWindows />
            </div>
            <div className="absolute inset-0 opacity-50 mix-blend-overlay">
              <UnifiedDashboard />
            </div>
            
            {/* Efecto de interferencia cuÃ¡ntica */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-cyan-500/10 animate-pulse" />
              
              {/* Ondas de interferencia */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 20%, rgba(0,255,136,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 80%, rgba(0,170,255,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 50%, rgba(255,170,0,0.1) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 20%, rgba(0,255,136,0.1) 0%, transparent 50%)'
                  ]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Campo cuÃ¡ntico de fondo */}
      <div className="absolute inset-0 pointer-events-none">
        {/* PartÃ­culas cuÃ¡nticas */}
        {quantumParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity
            }}
            animate={{
              x: [0, Math.random() * 20 - 10, 0],
              y: [0, Math.random() * 20 - 10, 0],
              opacity: [particle.opacity, particle.opacity * 0.3, particle.opacity]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* LÃ­neas de entrelazamiento cuÃ¡ntico */}
        {(quantumState?.entangledComponents?.length || 0) > 1 && (
          <motion.svg
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          >
            {(quantumState?.entangledComponents || []).map((_, index) => (
              <motion.line
                key={index}
                x1={`${20 + index * 30}%`}
                y1="20%"
                x2={`${80 - index * 30}%`}
                y2="80%"
                stroke="#00ff88"
                strokeWidth="1"
                strokeDasharray="5,5"
                animate={{
                  strokeDashoffset: [0, 10, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </motion.svg>
        )}
      </div>

      {/* Contenido principal con transiciones cuÃ¡nticas */}
      <AnimatePresence mode="wait">
        {renderQuantumState()}
      </AnimatePresence>

      {/* Indicador de coherencia cuÃ¡ntica */}
      <motion.div
        className="absolute bottom-4 left-4 px-3 py-2 bg-black/80 backdrop-blur-sm rounded-lg border border-cyan-500/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 text-xs text-cyan-400">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span>Coherencia: {Math.round(quantumState.quantumCoherence * 100)}%</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Estado: {quantumState.currentState}
        </div>
      </motion.div>

      {/* Efecto de observaciÃ³n cuÃ¡ntica */}
      {quantumState.observerActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="w-full h-full bg-gradient-radial from-transparent via-cyan-500/5 to-transparent animate-pulse" />
          
          {/* Ondas de colapso */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(0,255,136,0.2) 0%, transparent 30%)',
                'radial-gradient(circle at 50% 50%, rgba(0,255,136,0.05) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(0,255,136,0) 0%, transparent 100%)'
              ]
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut"
            }}
          />
        </motion.div>
      )}

      {/* Children adicionales */}
      {children}
    </div>
  );
};

export default QuantumFieldWrapper;

