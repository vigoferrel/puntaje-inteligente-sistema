
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

interface CinematicSkeletonProps {
  message?: string;
  progress?: number;
}

export const CinematicSkeleton: React.FC<CinematicSkeletonProps> = ({
  message = "Cargando Sistema PAES",
  progress = 0
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md"
      >
        {/* Icono principal con animación */}
        <div className="relative mx-auto w-20 h-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-20 h-20 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          
          {/* Partículas flotantes */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-3 -right-3"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </motion.div>
        </div>

        {/* Texto principal */}
        <div className="space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-white cinematic-text-glow poppins-title"
          >
            {message}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-cyan-300 poppins-body"
          >
            Preparando experiencia cinematográfica...
          </motion.p>
        </div>

        {/* Barra de progreso */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-white/10 rounded-full h-2 overflow-hidden"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress || 85}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
          />
        </motion.div>

        {/* Indicadores del sistema */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-4 text-xs text-white/60 poppins-caption"
        >
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            IA Activada
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            277 Nodos
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            Tema Poppins
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Skeleton para cards específicos
export const CardSkeleton: React.FC = () => (
  <div className="cinematic-card p-6 space-y-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full animate-pulse" />
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-white/10 rounded animate-pulse w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-white/10 rounded animate-pulse" />
      <div className="h-3 bg-white/10 rounded animate-pulse w-4/5" />
    </div>
  </div>
);
