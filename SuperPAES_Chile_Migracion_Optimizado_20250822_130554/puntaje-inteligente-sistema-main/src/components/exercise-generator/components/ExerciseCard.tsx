/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader } from '../../../components/ui/card';
import { motion } from 'framer-motion';
import { ExerciseHeader } from './ExerciseHeader';
import { ExerciseContent } from './ExerciseContent';

interface Exercise {
  id: number;
  node: string;
  subject: string;
  difficulty: string;
  question: string;
  alternatives: string[];
  correctAnswer: string;
  explanation: string;
  estimatedTime: number;
}

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: FC<ExerciseCardProps> = ({ exercise, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <ExerciseHeader exercise={exercise} />
        </CardHeader>
        <CardContent>
          <ExerciseContent exercise={exercise} />
        </CardContent>
      </Card>
    </motion.div>
  );
};

