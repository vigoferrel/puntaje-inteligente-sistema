
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const PAESSimulationDimension: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-yellow-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ 
            rotateY: [0, 360],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-4xl"
        >
          🎭
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Simulación PAES Avanzada</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Simulador con IA evaluadora y predicción de puntajes. Experimenta condiciones 
          reales de examen con retroalimentación inteligente.
        </p>
        
        <div className="bg-gradient-to-r from-red-900/60 to-orange-900/60 rounded-lg p-8 backdrop-blur-xl mt-8">
          <p className="text-white/80 mb-6 text-lg">
            Próximamente: Simulaciones reales con IA que evalúa y predice tu rendimiento PAES
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <span className="px-4 py-2 bg-white/20 rounded-lg text-white">IA Evaluadora</span>
            <span className="px-4 py-2 bg-white/20 rounded-lg text-white">Predicción de Puntajes</span>
            <span className="px-4 py-2 bg-white/20 rounded-lg text-white">Análisis de Rendimiento</span>
          </div>
          
          <Button className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 text-lg">
            Comenzar Simulación
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
