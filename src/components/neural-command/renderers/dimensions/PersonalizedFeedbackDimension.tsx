
import React from 'react';
import { motion } from 'framer-motion';

interface PersonalizedFeedbackDimensionProps {
  userProgress?: {
    currentLevel: number;
    streak: number;
    performance: number;
  };
  recentActivities?: any[];
}

export const PersonalizedFeedbackDimension: React.FC<PersonalizedFeedbackDimensionProps> = ({
  userProgress = {
    currentLevel: 23,
    streak: 12,
    performance: 87
  },
  recentActivities = []
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-4xl"
        >
          🤖
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Coach IA Personal</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Tu entrenador personal de IA que analiza tu progreso y te brinda retroalimentación 
          personalizada para maximizar tu rendimiento académico.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-cyan-400 font-bold text-xl mb-3">🎯 Nivel Actual</h3>
            <div className="text-3xl font-bold text-white mb-2">{userProgress.currentLevel}</div>
            <p className="text-white/70">Progreso académico</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-blue-400 font-bold text-xl mb-3">🔥 Racha</h3>
            <div className="text-3xl font-bold text-white mb-2">{userProgress.streak}</div>
            <p className="text-white/70">días consecutivos</p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-indigo-400 font-bold text-xl mb-3">📈 Rendimiento</h3>
            <div className="text-3xl font-bold text-white mb-2">{userProgress.performance}%</div>
            <p className="text-white/70">promedio semanal</p>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm mt-8">
          <h3 className="text-white font-bold text-xl mb-4">💬 Mensaje del Coach IA</h3>
          <p className="text-white/80 text-lg">
            "¡Excelente progreso! Tu racha de {userProgress.streak} días demuestra consistencia. 
            Te recomiendo enfocarte en matemáticas esta semana para equilibrar tu rendimiento."
          </p>
        </div>
      </div>
    </motion.div>
  );
};
