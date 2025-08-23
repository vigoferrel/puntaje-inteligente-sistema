/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserType } from '../../types/cinematic-universe';

interface RealTimeMetricsWidgetProps {
  userType: UserType;
  refreshInterval?: number;
}

export const RealTimeMetricsWidget: React.FC<RealTimeMetricsWidgetProps> = ({
  userType,
  refreshInterval = 30000
}) => {
  const [metrics, setMetrics] = useState({
    activeUsers: 1247,
    totalSessions: 3456,
    avgSessionTime: 25.4,
    completionRate: 78.5
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20"
      >
        <h3 className="text-lg font-bold text-white mb-4">Metricas en Tiempo Real</h3>
        <div className="text-3xl font-bold text-cyan-400">{metrics.activeUsers}</div>
        <div className="text-sm text-gray-300">Usuarios Activos</div>
      </motion.div>
    </div>
  );
};

export default RealTimeMetricsWidget;

