
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Sparkles } from 'lucide-react';

export const NeuralLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-indigo-900 flex items-center justify-center">
      <motion.div
        className="text-center text-white space-y-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Neural Loading Animation */}
        <div className="relative">
          <motion.div
            className="w-32 h-32 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Brain className="w-12 h-12 text-cyan-400" />
          </motion.div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <motion.div
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Centro de Comando Neural
          </motion.div>
          
          <div className="flex items-center justify-center space-x-2 text-cyan-300">
            <Zap className="w-5 h-5" />
            <span>Inicializando sistema interseccional...</span>
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Loading Steps */}
        <div className="space-y-2 text-sm text-cyan-200">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            ✓ Sistema anti-tracking singleton activado
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            ✓ Sistema respiratorio estabilizado
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
          >
            🔄 Preparando contexto interseccional...
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
