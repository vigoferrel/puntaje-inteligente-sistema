
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Activity, Zap } from 'lucide-react';

interface NeuroActivityMonitorProps {
  activity: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const NeuroActivityMonitor: React.FC<NeuroActivityMonitorProps> = ({
  activity,
  position = 'top-right'
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left': return 'top-4 left-4';
      case 'top-right': return 'top-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      default: return 'top-4 right-4';
    }
  };

  const getActivityColor = () => {
    if (activity > 75) return 'text-red-400';
    if (activity > 50) return 'text-yellow-400';
    if (activity > 25) return 'text-green-400';
    return 'text-blue-400';
  };

  const getActivityLevel = () => {
    if (activity > 75) return 'ALTA';
    if (activity > 50) return 'MEDIA';
    if (activity > 25) return 'BAJA';
    return 'MÍNIMA';
  };

  return (
    <motion.div
      className={`fixed ${getPositionClasses()} z-50`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-black/60 backdrop-blur-md rounded-xl p-4 border border-white/20 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold text-sm">Monitor Neural</span>
        </div>

        {/* Actividad principal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Actividad:</span>
            <span className={`font-bold text-sm ${getActivityColor()}`}>
              {activity}%
            </span>
          </div>

          {/* Barra de progreso */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                activity > 75 ? 'bg-red-400' :
                activity > 50 ? 'bg-yellow-400' :
                activity > 25 ? 'bg-green-400' : 'bg-blue-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${activity}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Estado */}
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-xs">Estado:</span>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-cyan-400" />
              <span className={`text-xs font-medium ${getActivityColor()}`}>
                {getActivityLevel()}
              </span>
            </div>
          </div>

          {/* Métricas adicionales */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Eficiencia:</span>
              <span className="text-purple-400">{Math.round(activity * 0.85)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Conexiones:</span>
              <span className="text-cyan-400">{Math.round(activity * 12.5)}K</span>
            </div>
          </div>

          {/* Indicador de pulso */}
          <div className="flex items-center justify-center pt-2">
            <motion.div
              className="flex items-center gap-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-xs text-white/60">Neural Activo</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
