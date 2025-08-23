/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { LearningCycleOrchestrator } from './core/LearningCycleOrchestrator';

interface LearningMaterialGeneratorProps {
  selectedSubject: string;
  subjects: unknown;
  onGenerate: (config: unknown) => void;
  isGenerating: boolean;
}

export const LearningMaterialGenerator: FC<LearningMaterialGeneratorProps> = (props) => {
  return <LearningCycleOrchestrator {...props} />;
};

