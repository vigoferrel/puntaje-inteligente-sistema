/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';
import { SafeDimensionRenderer } from './SafeDimensionRenderer';

interface DimensionContentRendererProps {
  activeDimension: NeuralDimension;
  activeDimensionData?: NeuralDimensionConfig;
}

export const DimensionContentRenderer: FC<DimensionContentRendererProps> = (props) => {
  return <SafeDimensionRenderer {...props} />;
};

