
import React from 'react';
import { RealUnifiedDashboard } from '@/components/real-dashboard/RealUnifiedDashboard';
import { MobileOptimizations } from '@/components/optimization/MobileOptimizations';

const Index: React.FC = () => {
  return (
    <MobileOptimizations>
      <div className="min-h-screen overflow-y-auto">
        <RealUnifiedDashboard />
      </div>
    </MobileOptimizations>
  );
};

export default Index;
