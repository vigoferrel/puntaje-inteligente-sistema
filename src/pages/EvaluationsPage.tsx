
import React from 'react';
import { RealEvaluationSystem } from '@/components/real-evaluations/RealEvaluationSystem';
import { motion } from 'framer-motion';
import { MobileOptimizations } from '@/components/optimization/MobileOptimizations';

const EvaluationsPage: React.FC = () => {
  return (
    <MobileOptimizations>
      <div className="min-h-screen overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full pb-32"
        >
          <RealEvaluationSystem />
        </motion.div>
      </div>
    </MobileOptimizations>
  );
};

export default EvaluationsPage;
