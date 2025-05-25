
import { useState, useCallback } from 'react';
import { NeuralDimension } from '../config/neuralTypes';

export const useNeuralNavigation = (initialDimension: NeuralDimension = 'universe_exploration') => {
  const [activeDimension, setActiveDimension] = useState<NeuralDimension>(initialDimension);
  const [showDimensionContent, setShowDimensionContent] = useState(false);

  const handleDimensionActivation = useCallback((dimensionId: NeuralDimension) => {
    setActiveDimension(dimensionId);
    setShowDimensionContent(true);
    console.log(`🚀 Activando dimensión neural: ${dimensionId}`);
  }, []);

  const handleBackToCenter = useCallback(() => {
    setShowDimensionContent(false);
  }, []);

  return {
    activeDimension,
    showDimensionContent,
    handleDimensionActivation,
    handleBackToCenter
  };
};
