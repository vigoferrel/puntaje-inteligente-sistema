/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { CinematicIntelligenceCenter } from './CinematicIntelligenceCenter';

interface DiagnosticIntelligenceCenterProps {
  onStartAssessment?: () => void;
}

export const DiagnosticIntelligenceCenter: FC<DiagnosticIntelligenceCenterProps> = ({ 
  onStartAssessment 
}) => {
  return <CinematicIntelligenceCenter onStartAssessment={onStartAssessment} />;
};

