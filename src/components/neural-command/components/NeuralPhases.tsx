
import React from 'react';
import { motion } from 'framer-motion';
import { DimensionCard } from './DimensionCard';
import { NeuralDimensionConfig, NeuralDimension } from '../config/neuralTypes';

interface NeuralPhasesProps {
  dimensionsByPhase: Record<string, NeuralDimensionConfig[]>;
  activeDimension: NeuralDimension;
  onDimensionActivation: (dimensionId: NeuralDimension) => void;
  getMetricForDimension: (dimensionId: string) => number;
}

export const NeuralPhases: React.FC<NeuralPhasesProps> = ({
  dimensionsByPhase,
  activeDimension,
  onDimensionActivation,
  getMetricForDimension
}) => {
  return (
    <div className="space-y-8">
      {Object.entries(dimensionsByPhase).map(([phase, dimensions], phaseIndex) => (
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: phaseIndex * 0.1 }}
        >
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins">
              {phase} Neural
            </h3>
            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-full opacity-30" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {dimensions.map((dimension, index) => (
              <DimensionCard
                key={dimension.id}
                dimension={dimension}
                isActive={activeDimension === dimension.id}
                metrics={getMetricForDimension(dimension.id)}
                onActivate={onDimensionActivation}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
