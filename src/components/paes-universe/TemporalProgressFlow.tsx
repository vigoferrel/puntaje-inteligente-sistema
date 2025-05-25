
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TLearningNode } from '@/types/system-types';
import { NodeProgress } from '@/types/node-progress';

interface TemporalProgressFlowProps {
  nodeProgress: Record<string, NodeProgress>;
  nodes: TLearningNode[];
  onTimelineSelect: (period: string) => void;
}

export const TemporalProgressFlow: React.FC<TemporalProgressFlowProps> = ({
  nodeProgress,
  nodes,
  onTimelineSelect
}) => {
  return (
    <div className="h-full p-8 bg-gradient-to-br from-green-900 via-teal-900 to-black">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-4">
          TEMPORAL FLOW
        </h1>
        <p className="text-white/80 text-xl">Tu línea temporal de aprendizaje</p>
      </motion.div>

      <div className="flex items-center justify-center h-96">
        <Card className="bg-black/40 border-green-500/30 backdrop-blur-xl p-8">
          <CardContent>
            <div className="text-white text-center">
              <div className="text-2xl font-bold mb-4">Timeline en desarrollo</div>
              <div className="text-gray-400">
                Visualización temporal de tu progreso académico
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
