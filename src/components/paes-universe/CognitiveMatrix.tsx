
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { TLearningNode, TPAESHabilidad } from '@/types/system-types';

interface CognitiveMatrixProps {
  skills: TPAESHabilidad[];
  nodes: TLearningNode[];
  cognitiveLevel: number;
  onMatrixSelect: (skill: string) => void;
}

export const CognitiveMatrix: React.FC<CognitiveMatrixProps> = ({
  skills,
  nodes,
  cognitiveLevel,
  onMatrixSelect
}) => {
  return (
    <div className="h-full p-8 bg-gradient-to-br from-purple-900 via-pink-900 to-black">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
          COGNITIVE MATRIX
        </h1>
        <p className="text-white/80 text-xl">Mapa neuronal de habilidades PAES</p>
      </motion.div>

      <div className="flex items-center justify-center h-96">
        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-xl p-8">
          <CardContent>
            <div className="text-white text-center">
              <div className="text-2xl font-bold mb-4">Matrix Cognitiva</div>
              <div className="text-gray-400">
                Nivel cognitivo actual: {cognitiveLevel}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
