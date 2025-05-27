
import React from 'react';
import { motion } from 'framer-motion';
import { NeuralDimension, NeuralDimensionConfig } from '../../config/neuralTypes';

interface DefaultDimensionProps {
  activeDimension: NeuralDimension;
  activeDimensionData?: NeuralDimensionConfig;
}

export const DefaultDimension: React.FC<DefaultDimensionProps> = ({
  activeDimension,
  activeDimensionData
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center text-4xl"
        >
          🧠
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">
          Dimensión Neural: {activeDimensionData?.title || activeDimension}
        </h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          {activeDimensionData?.description || 'Configurando módulo avanzado...'}
        </p>
        
        <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm">
          <p className="text-white/60 text-lg">
            Este módulo está siendo optimizado para la experiencia neural unificada.
            <br />
            🚀 Funcionalidades avanzadas en desarrollo activo.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
