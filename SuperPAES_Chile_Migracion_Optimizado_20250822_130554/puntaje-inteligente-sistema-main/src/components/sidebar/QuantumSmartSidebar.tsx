/* eslint-disable react-refresh/only-export-components */
/**
 * ðŸŽ›ï¸ QuantumSmartSidebar - Pensamiento CuÃ¡ntico Secuencial
 * Leonardo da Vinci: "Menos es MÃ¡s" - ReutilizaciÃ³n mÃ¡xima
 * 
 * Solo 35 lÃ­neas - Reutiliza QuantumReconnectionHub completamente
 * Efecto multiplicador: organizaciÃ³n inteligente sin duplicar cÃ³digo
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import QuantumReconnectionHub from '../quantum/QuantumReconnectionHub';
import { useQuantumContext7 } from '../../hooks/useQuantumContext7';

interface QuantumSmartSidebarProps {
  className?: string;
}

export const QuantumSmartSidebar: React.FC<QuantumSmartSidebarProps> = ({ className = '' }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { state } = useQuantumContext7();

  // Context7 - Filtro inteligente basado en componentes activos
  const getActiveFilter = () => {
    const activeCount = [
      state.bloom.active,
      state.spotify.active,
      state.enhanced3D.active,
      state.smartExercise.active,
      state.openRouter.active,
      state.gamification.active
    ].filter(Boolean).length;

    return activeCount > 3 ? 'dashboard' : 'all'; // Auto-organizaciÃ³n
  };

  return (
    <motion.div
      className={`fixed left-0 top-0 h-full bg-black/80 backdrop-blur-sm border-r border-cyan-500/30 z-40 ${className}`}
      animate={{ width: isCollapsed ? '60px' : '400px' }}
      transition={{ duration: 0.3 }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-cyan-500 text-white rounded-full p-1 z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Contenido - Reutiliza QuantumReconnectionHub completamente */}
      {!isCollapsed && (
        <div className="p-4 h-full overflow-hidden">
          <QuantumReconnectionHub className="h-full" />
        </div>
      )}

      {/* Vista colapsada - Solo iconos */}
      {isCollapsed && (
        <div className="p-2 flex flex-col items-center space-y-4 mt-16">
          <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
            <span className="text-cyan-400 text-xs">ðŸŒŒ</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuantumSmartSidebar;
