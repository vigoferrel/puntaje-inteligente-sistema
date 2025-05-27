
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';

interface CinematicRouterProps {
  children: React.ReactNode;
}

export const CinematicRouter: React.FC<CinematicRouterProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, setScene, startTransition } = useGlobalCinematic();

  // Mapeo de rutas a escenas cinematográficas
  const routeSceneMap: Record<string, string> = {
    '/': 'dashboard',
    '/superpaes': 'superpaes',
    '/lectoguia': 'lectoguia',
    '/diagnostic': 'diagnostic',
    '/financial': 'financial',
    '/planning': 'planning',
    '/universe': 'universe',
    '/achievements': 'achievements'
  };

  // Sincronizar ruta actual con escena cinematográfica
  useEffect(() => {
    const currentScene = routeSceneMap[location.pathname] || 'unknown';
    if (currentScene !== state.currentScene && currentScene !== 'unknown') {
      setScene(currentScene);
    }
  }, [location.pathname, state.currentScene, setScene]);

  // Navegación cinematográfica inteligente
  const cinematicNavigate = async (path: string) => {
    const targetScene = routeSceneMap[path];
    if (targetScene && state.preferences.autoTransitions) {
      await startTransition(targetScene);
    }
    navigate(path);
  };

  // Obtener configuración de transición basada en preferencias
  const getTransitionConfig = () => {
    const baseConfig = {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.3 }
    };

    switch (state.preferences.immersionLevel) {
      case 'full':
        return {
          initial: { 
            opacity: 0, 
            scale: 0.95,
            rotateY: -10,
            filter: 'blur(10px)'
          },
          animate: { 
            opacity: 1, 
            scale: 1,
            rotateY: 0,
            filter: 'blur(0px)'
          },
          exit: { 
            opacity: 0, 
            scale: 1.05,
            rotateY: 10,
            filter: 'blur(10px)'
          },
          transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
        };
      
      case 'standard':
        return {
          initial: { opacity: 0, y: 20, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: -20, scale: 1.02 },
          transition: { duration: 0.6, ease: "easeInOut" }
        };
      
      default:
        return baseConfig;
    }
  };

  // Efectos de partículas de transición
  const renderTransitionEffects = () => {
    if (state.isTransitioning && state.preferences.particleIntensity !== 'low') {
      return (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: state.preferences.particleIntensity === 'high' ? 20 : 10 }).map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                state.preferences.visualMode === 'cosmic' ? 'bg-pink-400' :
                state.preferences.visualMode === 'energy' ? 'bg-yellow-400' :
                state.preferences.visualMode === 'universe' ? 'bg-purple-400' :
                'bg-cyan-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 1, 0],
                y: [0, -100]
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: 'easeOut'
              }}
            />
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {renderTransitionEffects()}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          {...getTransitionConfig()}
          className="w-full h-full"
        >
          {React.cloneElement(children as React.ReactElement, { cinematicNavigate })}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
