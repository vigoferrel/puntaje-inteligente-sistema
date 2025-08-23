/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';

interface PerformanceMonitorDashboardProps {
  [key: string]: unknown;
}

export const PerformanceMonitorDashboard: React.FC<PerformanceMonitorDashboardProps> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-lg font-bold text-white mb-4">
        PerformanceMonitorDashboard
      </h3>
      <div className="text-gray-300">
        Componente PerformanceMonitorDashboard - En desarrollo
      </div>
    </motion.div>
  );
};

export default PerformanceMonitorDashboard;


