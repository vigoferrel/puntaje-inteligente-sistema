/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';

interface UserActivityHeatmapProps {
  [key: string]: unknown;
}

export const UserActivityHeatmap: React.FC<UserActivityHeatmapProps> = (props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/40 backdrop-blur-sm rounded-xl p-6 border border-white/10"
    >
      <h3 className="text-lg font-bold text-white mb-4">
        UserActivityHeatmap
      </h3>
      <div className="text-gray-300">
        Componente UserActivityHeatmap - En desarrollo
      </div>
    </motion.div>
  );
};

export default UserActivityHeatmap;


