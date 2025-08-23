/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Brain, Zap, Globe } from 'lucide-react';

interface NeuralHeaderProps {
  isIntersectionalReady: boolean;
}

export const NeuralHeader: FC<NeuralHeaderProps> = ({ isIntersectionalReady }) => {
  return (
    <motion.div 
      className="text-center mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 mb-6 relative"
        animate={{
          boxShadow: [
            '0 0 20px rgba(59, 130, 246, 0.5)',
            '0 0 40px rgba(59, 130, 246, 0.8)',
            '0 0 20px rgba(59, 130, 246, 0.5)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Brain className="w-12 h-12 text-white" />
        
        {/* Neural activity indicators */}
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        />
      </motion.div>

      <motion.h1 
        className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Centro de Comando Neural
      </motion.h1>

      <motion.p 
        className="text-xl text-blue-200 mb-6 max-w-3xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Ecosistema Inteligente de Aprendizaje con IA Neural y Datos Reales
      </motion.p>

      {/* Status indicators */}
      <motion.div 
        className="flex justify-center space-x-6 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center space-x-2 text-green-400">
          <Zap className="w-4 h-4" />
          <span>Sistema Neural Activo</span>
        </div>
        
        <div className="flex items-center space-x-2 text-blue-400">
          <Globe className="w-4 h-4" />
          <span>Datos Supabase Conectados</span>
        </div>
        
        {isIntersectionalReady && (
          <div className="flex items-center space-x-2 text-purple-400">
            <Brain className="w-4 h-4" />
            <span>IA Interseccional Lista</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

