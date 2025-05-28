
import React from 'react';
import { RealEvaluationSystem } from '@/components/real-evaluations/RealEvaluationSystem';
import { MobileOptimizations } from '@/components/optimization/MobileOptimizations';

const RealEvaluationsPage: React.FC = () => {
  return (
    <MobileOptimizations>
      <div className="min-h-screen overflow-y-auto">
        <RealEvaluationSystem />
      </div>
    </MobileOptimizations>
  );
};

export default RealEvaluationsPage;
