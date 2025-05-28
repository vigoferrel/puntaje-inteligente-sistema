
import React from 'react';
import { CleanPAESHub } from '@/components/paes-hub/CleanPAESHub';
import { SystemHealthMonitor } from '@/components/system-health/SystemHealthMonitor';

export const SuperPAESUnifiedHub: React.FC = () => {
  return (
    <div className="relative">
      <CleanPAESHub />
      <SystemHealthMonitor />
    </div>
  );
};
