
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { PAESStatsCard } from './PAESStatsCard';
import { TestSpecificStats } from '../test-stats';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';

interface ExerciseTabHeaderProps {
  activeSubject: string;
  selectedPrueba: TPAESPrueba | null;
  hasExercise: boolean;
  isLoading: boolean;
  nodes?: any[];
  nodeProgress?: Record<string, any>;
  skillLevels?: Record<string, any>;
}

export const ExerciseTabHeader: React.FC<ExerciseTabHeaderProps> = ({
  activeSubject,
  selectedPrueba,
  hasExercise,
  isLoading,
  nodes = [],
  nodeProgress = {},
  skillLevels = {}
}) => {
  if (hasExercise || isLoading) return null;

  return (
    <div className="space-y-4">
      {/* Estadísticas PAES */}
      {activeSubject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PAESStatsCard activeSubject={activeSubject} />
        </motion.div>
      )}
      
      {/* Estadísticas específicas del tipo de prueba */}
      {selectedPrueba && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TestSpecificStats
            selectedPrueba={selectedPrueba}
            nodes={nodes}
            nodeProgress={nodeProgress}
            skillLevels={skillLevels}
          />
        </motion.div>
      )}
    </div>
  );
};
