/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';

export const UniverseDimension: FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
    >
      <div className="text-center space-y-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl"
        >
          ðŸŒŒ
        </motion.div>
        
        <h2 className="text-4xl font-bold text-white">Universe 3D</h2>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Explora el universo educativo en tres dimensiones. Navega por galaxias de conocimiento 
          y descubre conexiones entre diferentes Ã¡reas de aprendizaje.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-2">ðŸª Galaxias de Materias</h3>
            <p className="text-white/70 text-sm">MatemÃ¡ticas, Ciencias, Lenguaje y mÃ¡s</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-2">â­ Constelaciones de Habilidades</h3>
            <p className="text-white/70 text-sm">Conexiones inteligentes entre conceptos</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <h3 className="text-white font-bold mb-2">ðŸš€ NavegaciÃ³n Intuitiva</h3>
            <p className="text-white/70 text-sm">Controles naturales y fluidos</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

