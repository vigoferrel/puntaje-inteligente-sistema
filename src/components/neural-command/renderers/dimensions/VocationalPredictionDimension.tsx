
import React from 'react';
import { motion } from 'framer-motion';

interface VocationalPredictionDimensionProps {
  userMetrics?: {
    performance: number;
    strengths: string[];
    interests: string[];
  };
}

export const VocationalPredictionDimension: React.FC<VocationalPredictionDimensionProps> = ({
  userMetrics = {
    performance: 87,
    strengths: ['mathematics', 'logic', 'analysis'],
    interests: ['technology', 'science', 'innovation']
  }
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            rotateY: [0, 180, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-4xl"
        >
          🧬
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Predictor Vocacional IA</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Descubre tu camino profesional ideal basado en tu rendimiento, fortalezas e intereses. 
          Nuestra IA analiza patrones para sugerir carreras perfectas para ti.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-indigo-400 font-bold text-xl mb-3">📊 Rendimiento</h3>
            <div className="text-3xl font-bold text-white mb-2">{userMetrics.performance}%</div>
            <p className="text-white/70">Promedio general</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-purple-400 font-bold text-xl mb-3">💪 Fortalezas</h3>
            <div className="space-y-1">
              {userMetrics.strengths.map((strength, index) => (
                <div key={index} className="text-white text-sm bg-white/10 rounded px-2 py-1">
                  {strength}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-pink-400 font-bold text-xl mb-3">❤️ Intereses</h3>
            <div className="space-y-1">
              {userMetrics.interests.map((interest, index) => (
                <div key={index} className="text-white text-sm bg-white/10 rounded px-2 py-1">
                  {interest}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
