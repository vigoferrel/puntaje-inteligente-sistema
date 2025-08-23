/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Badge } from '../../../components/ui/badge';
import { PAESStatsCard } from './PAESStatsCard';
import { TestSpecificStats } from '../test-stats';
import { TPAESPrueba, getPruebaDisplayName } from '../../../types/system-types';

interface ExerciseTabHeaderProps {
  activeSubject: string;
  selectedPrueba: TPAESPrueba | null;
  hasExercise: boolean;
  isLoading: boolean;
  nodes?: unknown[];
  nodeProgress?: Record<string, unknown>;
  skillLevels?: Record<string, unknown>;
}

export const ExerciseTabHeader: FC<ExerciseTabHeaderProps> = ({
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
      {/* EstadÃ­sticas PAES */}
      {activeSubject && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <PAESStatsCard activeSubject={activeSubject} />
        </motion.div>
      )}
      
      {/* EstadÃ­sticas especÃ­ficas del tipo de prueba */}
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

