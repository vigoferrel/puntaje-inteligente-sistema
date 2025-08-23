
import React from 'react';
import { motion } from 'framer-motion';

interface ContextualBackgroundProps {
  prueba?: string;
}

export const ContextualBackground: React.FC<ContextualBackgroundProps> = ({ prueba }) => {
  const getBackgroundGradient = () => {
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        return 'from-blue-900/20 via-indigo-800/10 to-purple-900/20';
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        return 'from-green-900/20 via-emerald-800/10 to-teal-900/20';
      case 'CIENCIAS':
        return 'from-orange-900/20 via-red-800/10 to-pink-900/20';
      case 'HISTORIA':
        return 'from-amber-900/20 via-orange-800/10 to-red-900/20';
      default:
        return 'from-slate-900/20 via-gray-800/10 to-slate-900/20';
    }
  };

  const getPatternColor = () => {
    switch (prueba) {
      case 'COMPETENCIA_LECTORA':
        return 'text-blue-500/10';
      case 'MATEMATICA_1':
      case 'MATEMATICA_2':
        return 'text-green-500/10';
      case 'CIENCIAS':
        return 'text-orange-500/10';
      case 'HISTORIA':
        return 'text-amber-500/10';
      default:
        return 'text-primary/10';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradiente de fondo principal */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()}`} />
      
      {/* Patrón geométrico sutil */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path 
                d="M 10 0 L 0 0 0 10" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className={getPatternColor()}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Ondas flotantes */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${getPatternColor().replace('/10', '/5')} blur-3xl`}
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`,
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
          />
        ))}
      </div>

      {/* Efecto de vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/20" />
    </div>
  );
};
