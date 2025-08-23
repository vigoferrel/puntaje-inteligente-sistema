/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState, useCallback } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalCinematic } from '../../contexts';
import './CinematicRouteTransitions.css';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface CinematicRouteTransitionsProps {
  children: React.ReactNode;
}

export const CinematicRouteTransitions: React.FC<CinematicRouteTransitionsProps> = ({ children }) => {
  const location = useLocation();
  const { state, startTransition } = useGlobalCinematic();
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ConfiguraciÃ³n de transiciones cinematogrÃ¡ficas extremas
  const cinematicVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      rotateX: -5,
      rotateY: 2,
      filter: 'blur(10px)',
      transformOrigin: 'center center'
    },
    animate: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      filter: 'blur(0px)',
      transformOrigin: 'center center'
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      rotateX: 5,
      rotateY: -2,
      filter: 'blur(10px)',
      transformOrigin: 'center center'
    }
  };

  // ConfiguraciÃ³n de duraciÃ³n segÃºn nivel de inmersiÃ³n (memoizada)
  const getTransitionDuration = useCallback(() => {
    switch (state.preferences.immersionLevel) {
      case 'minimal':
        return 0.3;
      case 'moderate':
        return 0.6;
      case 'full':
        return 1.2;
      default:
        return 0.8;
    }
  }, [state.preferences.immersionLevel]);

  // ConfiguraciÃ³n de easing cinematogrÃ¡fico
  const cinematicEasing = [0.25, 0.46, 0.45, 0.94];

  // Efecto de transiciÃ³n al cambiar de ruta
  useEffect(() => {
    if (state.preferences.autoTransitions) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, getTransitionDuration() * 1000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, state.preferences.autoTransitions, getTransitionDuration]);

  // PartÃ­culas de transiciÃ³n
  const TransitionParticles = () => (
    <div className="transition-particles">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="transition-particle dynamic-particle"
          data-left={Math.random() * 100}
          data-top={Math.random() * 100}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.5, 0],
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200]
          }}
          transition={{
            duration: getTransitionDuration(),
            ease: cinematicEasing,
            delay: Math.random() * 0.5
          }}
        />
      ))}
    </div>
  );

  // Overlay de transiciÃ³n cinematogrÃ¡fica
  const TransitionOverlay = () => (
    <motion.div
      className="transition-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: isTransitioning ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    />
  );

  // Generar clases dinÃ¡micas basadas en el estado
  const getContentClasses = () => {
    let classes = 'cinematic-route-content';
    
    if (state.preferences.immersionLevel === 'full') {
      classes += ' cinematic-route-content--full-immersion';
    }
    
    if (state.performanceMetrics.fps < 30) {
      classes += ' cinematic-route-content--low-performance';
    }
    
    return classes;
  };

  return (
    <div className="cinematic-route-container">
      {/* Overlay de transiciÃ³n */}
      <TransitionOverlay />
      
      {/* PartÃ­culas de transiciÃ³n */}
      {isTransitioning && state.preferences.particleIntensity !== 'low' && (
        <TransitionParticles />
      )}

      {/* Contenido con transiciones cinematogrÃ¡ficas */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          variants={cinematicVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            duration: getTransitionDuration(),
            ease: cinematicEasing
          }}
          className={getContentClasses()}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};



