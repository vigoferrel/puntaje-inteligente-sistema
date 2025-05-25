
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Brain } from 'lucide-react';

interface CinematicSkeletonOptimizedProps {
  message?: string;
  progress?: number;
  variant?: 'full' | 'component' | 'card' | 'dashboard' | 'universe' | 'training' | 'diagnostic' | 'financial' | 'calendar';
}

export const CinematicSkeletonOptimized: React.FC<CinematicSkeletonOptimizedProps> = ({
  message = "Cargando Sistema Neural",
  progress = 0,
  variant = 'component'
}) => {
  const isFullScreen = variant === 'full';

  return (
    <div className={`${isFullScreen ? 'min-h-screen' : 'min-h-96'} flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 p-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 flex items-center justify-center"
        >
          <Brain className="w-12 h-12 text-cyan-400" />
        </motion.div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">{message}</h2>
          
          <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full"
            />
          </div>
          
          <div className="flex items-center justify-center gap-2 text-cyan-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">{progress}% completado</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
