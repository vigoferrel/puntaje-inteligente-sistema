
import React from 'react';
import { OptimizedEducationalUniverse } from './OptimizedEducationalUniverse';
import { OptimizedNeuralProvider } from '@/components/neural/OptimizedNeuralProvider';
import { SystemHealthMonitor } from '@/components/system-health/SystemHealthMonitor';
import { AutoRecoverySystem } from '@/components/recovery/AutoRecoverySystem';

export const EducationalUniverse: React.FC = () => {
  return (
    <AutoRecoverySystem>
      <OptimizedNeuralProvider>
        <OptimizedEducationalUniverse />
        <SystemHealthMonitor />
      </OptimizedNeuralProvider>
    </AutoRecoverySystem>
  );
};
