
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Zap } from 'lucide-react';

interface CinematicSkeletonOptimizedProps {
  message?: string;
  progress?: number;
  variant?: 'full' | 'card' | 'minimal';
}

export const CinematicSkeletonOptimized: React.FC<CinematicSkeletonOptimizedProps> = ({
  message = "Cargando Sistema PAES",
  progress = 85,
  variant = 'full'
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full"
        />
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className="cinematic-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full flex items-center justify-center"
          >
            <Brain className="w-4 h-4 text-cyan-400" />
          </motion.div>
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-poppins">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 max-w-md"
      >
        {/* Icono principal con animación optimizada */}
        <div className="relative mx-auto w-24 h-24">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-24 h-24 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-10 h-10 text-cyan-400" />
          </div>
          
          {/* Partículas flotantes optimizadas */}
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
              opacity: [0.5, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-3 -right-3"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </motion.div>
          
          <motion.div
            animate={{ 
              y: [10, -10, 10],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            className="absolute -bottom-2 -left-2"
          >
            <Zap className="w-4 h-4 text-purple-400" />
          </motion.div>
        </div>

        {/* Texto principal optimizado */}
        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-white cinematic-text-glow poppins-heading"
          >
            {message}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-cyan-300 poppins-body"
          >
            Sistema cinematográfico activándose...
          </motion.p>
        </div>

        {/* Barra de progreso cinematográfica */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-white/10 rounded-full h-3 overflow-hidden relative"
        >
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full relative"
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3"
            />
          </motion.div>
        </motion.div>

        {/* Indicadores del sistema optimizados */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-3 gap-4 text-xs text-white/60 poppins-caption"
        >
          {[
            { label: 'IA Activada', color: 'bg-green-400' },
            { label: '277 Nodos', color: 'bg-blue-400' },
            { label: 'Tema Poppins', color: 'bg-purple-400' }
          ].map((indicator, index) => (
            <motion.div
              key={indicator.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                className={`w-3 h-3 ${indicator.color} rounded-full`}
              />
              <span>{indicator.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
