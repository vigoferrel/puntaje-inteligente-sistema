
import React from 'react';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { SafeDimensionRenderer } from './SafeDimensionRenderer';

interface DimensionContentRendererProps {
  activeDimension: NeuralDimension;
  activeDimensionData?: NeuralDimensionConfig;
}

export const DimensionContentRenderer: React.FC<DimensionContentRendererProps> = (props) => {
  return <SafeDimensionRenderer {...props} />;
};
