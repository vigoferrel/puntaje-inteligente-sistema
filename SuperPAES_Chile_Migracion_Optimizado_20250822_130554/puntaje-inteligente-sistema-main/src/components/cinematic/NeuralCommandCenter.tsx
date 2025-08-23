/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { motion } from 'framer-motion';
import { Brain, Activity, Zap } from 'lucide-react';

interface NeuralCommandCenterProps {
  neuralActivity: number;
  emotionalState: string;
  currentModule: string;
  onModuleChange: (module: string) => void;
}

export const NeuralCommandCenter: FC<NeuralCommandCenterProps> = ({
  neuralActivity,
  emotionalState,
  currentModule,
  onModuleChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-4 left-4 z-50 bg-black/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-4"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Brain className="w-8 h-8 text-cyan-400" />
          <motion.div
            className="absolute inset-0 w-8 h-8 bg-cyan-400 rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
        
        <div>
          <div className="text-white font-bold text-sm">Neural Command</div>
          <div className="text-cyan-300 text-xs">
            {neuralActivity.toFixed(1)}% â€¢ {emotionalState}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-400" />
          <Zap className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
      
      <motion.div
        className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
          animate={{ width: `${neuralActivity}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};
