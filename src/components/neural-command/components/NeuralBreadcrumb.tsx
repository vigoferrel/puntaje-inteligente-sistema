
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Brain } from 'lucide-react';

interface NeuralBreadcrumbProps {
  activeDimension: string;
  activeDimensionData?: any;
  onBackToCenter: () => void;
  showDimensionContent: boolean;
}

export const NeuralBreadcrumb: React.FC<NeuralBreadcrumbProps> = ({
  activeDimension,
  activeDimensionData,
  onBackToCenter,
  showDimensionContent
}) => {
  if (!showDimensionContent) {
    return (
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-2 text-cyan-300">
          <Brain className="w-5 h-5" />
          <span className="font-semibold">Centro de Comando Neural</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.nav 
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <button
            onClick={onBackToCenter}
            className="flex items-center text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <Brain className="w-4 h-4 mr-1" />
            Centro Neural
          </button>
        </li>
        
        <ChevronRight className="w-4 h-4 text-gray-500" />
        
        <li className="flex items-center">
          <span className="text-white font-medium">
            {activeDimensionData?.icon} {activeDimensionData?.title || activeDimension}
          </span>
        </li>
      </ol>
      
      {activeDimensionData?.description && (
        <motion.p 
          className="text-gray-300 text-sm mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {activeDimensionData.description}
        </motion.p>
      )}
    </motion.nav>
  );
};
