
import React from 'react';
import { CinematicIntelligenceCenter } from './CinematicIntelligenceCenter';

interface DiagnosticIntelligenceCenterProps {
  onStartAssessment?: () => void;
}

export const DiagnosticIntelligenceCenter: React.FC<DiagnosticIntelligenceCenterProps> = ({ 
  onStartAssessment 
}) => {
  return <CinematicIntelligenceCenter onStartAssessment={onStartAssessment} />;
};
