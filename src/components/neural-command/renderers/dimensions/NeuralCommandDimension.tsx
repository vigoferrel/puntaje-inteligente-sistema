
import React from 'react';
import { HolographicDashboard } from '@/components/intelligent-dashboard/HolographicDashboard';

export const NeuralCommandDimension: React.FC = () => {
  const mockMetrics = {
    totalNodes: 277,
    completedNodes: 89,
    averagePerformance: 87,
    learningVelocity: 0.85,
    predictionAccuracy: 92,
    totalStudyTime: 3240,
    nodesCompleted: 89
  };

  return (
    <HolographicDashboard 
      metrics={mockMetrics}
      patterns={{}} 
    />
  );
};
