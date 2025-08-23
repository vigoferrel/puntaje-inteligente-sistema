/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { NeuralPAESHub } from '../../components/neural-paes/NeuralPAESHub';
import { SystemHealthMonitor } from '../../components/system-health/SystemHealthMonitor';
import { NeuralSystemProvider } from '../../components/neural/NeuralSystemProvider';

export const SuperPAESUnifiedHub: FC = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <NeuralSystemProvider showDashboard={false} enableAutoCapture={true}>
        <NeuralPAESHub />
        <SystemHealthMonitor />
      </NeuralSystemProvider>
    </div>
  );
};

