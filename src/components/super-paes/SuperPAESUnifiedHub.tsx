
import React from 'react';
import { NeuralPAESHub } from '@/components/neural-paes/NeuralPAESHub';
import { SystemHealthMonitor } from '@/components/system-health/SystemHealthMonitor';
import { NeuralSystemProvider } from '@/components/neural/NeuralSystemProvider';

export const SuperPAESUnifiedHub: React.FC = () => {
  return (
    <div className="relative">
      <NeuralSystemProvider showDashboard={false} enableAutoCapture={true}>
        <NeuralPAESHub />
        <SystemHealthMonitor />
      </NeuralSystemProvider>
    </div>
  );
};
