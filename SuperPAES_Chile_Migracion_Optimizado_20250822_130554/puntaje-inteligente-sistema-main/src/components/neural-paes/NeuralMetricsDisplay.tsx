/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

interface NeuralDimension {
  id: string;
  name: string;
  value: number;
  status: 'optimal' | 'warning' | 'critical';
  description: string;
}

interface NeuralMetricsDisplayProps {
  dimensions: NeuralDimension[];
  overallScore: number;
}

export const NeuralMetricsDisplay: FC<NeuralMetricsDisplayProps> = ({
  dimensions,
  overallScore
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Neural Score */}
      <Card className="bg-gradient-to-r from-black/60 to-slate-900/60 backdrop-blur-xl border-cyan-500/30">
        <CardContent className="p-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2"
          >
            {overallScore}%
          </motion.div>
          <div className="text-white/80 text-lg">PuntuaciÃ³n Neural Global</div>
          <div className="text-white/60 text-sm">Sistema Neural v3.0 Activo</div>
        </CardContent>
      </Card>

      {/* Neural Dimensions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dimensions.map((dimension, index) => (
          <motion.div
            key={dimension.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-white/90 font-medium text-sm">{dimension.name}</div>
                  <Badge className={getStatusColor(dimension.status)}>
                    {dimension.status}
                  </Badge>
                </div>
                
                <div className="text-2xl font-bold text-cyan-400 mb-2">
                  {dimension.value}%
                </div>
                
                <Progress 
                  value={dimension.value} 
                  className="h-2 mb-2"
                />
                
                <div className="text-white/60 text-xs">
                  {dimension.description}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

