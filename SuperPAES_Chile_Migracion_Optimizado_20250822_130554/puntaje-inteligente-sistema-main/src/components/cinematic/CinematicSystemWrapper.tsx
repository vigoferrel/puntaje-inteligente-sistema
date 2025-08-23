/* eslint-disable react-refresh/only-export-components */

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
  // ðŸ”¬ CONTEXT7: Desactivar animaciones cinematogrÃ¡ficas que causan problemas de renderizado
  console.log('ðŸŽ¬ CinematicSystemWrapper: Modo simplificado para evitar problemas de renderizado');
  
  // Retornar solo los children sin animaciones complejas
  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
};


