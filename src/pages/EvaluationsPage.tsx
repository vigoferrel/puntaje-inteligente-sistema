
import React from 'react';
import { EvaluationBank } from '@/components/evaluations/EvaluationBank';
import { motion } from 'framer-motion';

const EvaluationsPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <EvaluationBank />
      </motion.div>
    </div>
  );
};

export default EvaluationsPage;
