
import React from 'react';
import { motion } from 'framer-motion';

export const TrainingDimension: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotateY: [0, 180, 360]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-4xl"
        >
          🧠
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Entrenamiento Neural</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Entrena tu mente con ejercicios adaptativos. El sistema ajusta la dificultad 
          según tu progreso para maximizar el aprendizaje.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold text-xl mb-3">🎯 Entrenamiento Adaptativo</h3>
            <p className="text-white/70">
              Ejercicios que se ajustan automáticamente a tu nivel y ritmo de aprendizaje.
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-white font-bold text-xl mb-3">📊 Métricas en Tiempo Real</h3>
            <p className="text-white/70">
              Monitoreo continuo de tu rendimiento y progreso con insights inteligentes.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
