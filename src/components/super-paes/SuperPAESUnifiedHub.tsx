
import React from 'react';
import { NeuralPAESHub } from '@/components/neural-paes/NeuralPAESHub';
import { SystemHealthMonitor } from '@/components/system-health/SystemHealthMonitor';

export const SuperPAESUnifiedHub: React.FC = () => {
  return (
    <div className="relative">
      <NeuralPAESHub />
      <SystemHealthMonitor />
    </div>
  );
};
