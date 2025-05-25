
import React from 'react';
import { LearningCycleOrchestrator } from './core/LearningCycleOrchestrator';

interface LearningMaterialGeneratorProps {
  selectedSubject: string;
  subjects: any;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const LearningMaterialGenerator: React.FC<LearningMaterialGeneratorProps> = (props) => {
  return <LearningCycleOrchestrator {...props} />;
};
