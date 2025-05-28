
import React from 'react';
import { BalancedPAESHub } from './BalancedPAESHub';
import { SystemHealthMonitor } from '@/components/system-health/SystemHealthMonitor';

export const SuperPAESUnifiedHub: React.FC = () => {
  return (
    <div className="relative">
      <BalancedPAESHub />
      <SystemHealthMonitor />
    </div>
  );
};
