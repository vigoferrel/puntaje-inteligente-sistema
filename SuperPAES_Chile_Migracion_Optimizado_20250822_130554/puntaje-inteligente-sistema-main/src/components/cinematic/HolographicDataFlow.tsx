/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { motion } from 'framer-motion';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';

interface HolographicDataFlowProps {
  currentModule: string;
  userProgress: {
    totalNodes: number;
    completedNodes: number;
    neuralCoherence: number;
    learningVelocity: number;
    engagementScore: number;
  };
  neuralActivity: number;
}

export const HolographicDataFlow: FC<HolographicDataFlowProps> = ({
  currentModule,
  userProgress,
  neuralActivity
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 pointer-events-none z-10"
    >
      {/* Flujo de datos hologrÃ¡fico */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full dynamic-particle"
            data-left={Math.random() * 100}
            data-top={Math.random() * 100}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.5, 0.5],
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* LÃ­neas de conexiÃ³n de datos */}
      <svg className="absolute inset-0 w-full h-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.line
            key={i}
            x1={`${Math.random() * 100}%`}
            y1={`${Math.random() * 100}%`}
            x2={`${Math.random() * 100}%`}
            y2={`${Math.random() * 100}%`}
            stroke="rgba(6, 182, 212, 0.3)"
            strokeWidth="1"
            animate={{
              opacity: [0.1, 0.5, 0.1],
              strokeDasharray: ["0,10", "5,5", "0,10"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </svg>

      {/* MÃ©tricas flotantes */}
      <motion.div
        className="absolute top-1/4 right-1/4 text-cyan-400 text-xs font-mono"
        animate={{
          opacity: [0.5, 1, 0.5],
          y: [0, -10, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Neural: {neuralActivity.toFixed(1)}%
      </motion.div>

      <motion.div
        className="absolute bottom-1/3 left-1/3 text-purple-400 text-xs font-mono"
        animate={{
          opacity: [0.5, 1, 0.5],
          y: [0, 10, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        Coherence: {userProgress.neuralCoherence}%
      </motion.div>
    </motion.div>
  );
};


