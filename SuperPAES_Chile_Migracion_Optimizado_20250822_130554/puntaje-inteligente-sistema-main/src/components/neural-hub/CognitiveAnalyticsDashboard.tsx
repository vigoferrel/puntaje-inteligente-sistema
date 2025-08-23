/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserType } from '../../types/app-types'; // Importar UserType desde el nuevo archivo

interface CognitiveAnalyticsDashboardProps {
  userType: UserType;
  [key: string]: unknown;
}

export const CognitiveAnalyticsDashboard: React.FC<CognitiveAnalyticsDashboardProps> = ({ userType, ...props }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsProcessing(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-green-500/20"
    >
      <h3 className="text-xl font-bold text-white mb-4">
        CognitiveAnalyticsDashboard
      </h3>
      
      <div className="space-y-4">
        <div className="text-green-300">
          Componente de IA CognitiveAnalyticsDashboard para usuario: {userType}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>IA procesando activamente</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CognitiveAnalyticsDashboard;

