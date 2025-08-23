/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useRealNeuralData } from '../../hooks/useRealNeuralData';
import { Database, Brain, Zap, Target } from 'lucide-react';

export const ProductionSystemStats: FC = () => {
  const { realNodes, neuralMetrics, isLoading } = useRealNeuralData();

  if (isLoading) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardContent className="p-4">
          <div className="animate-pulse">Cargando estadÃ­sticas del sistema...</div>
        </CardContent>
      </Card>
    );
  }

  const systemStats = {
    totalNodes: realNodes.length,
    activeNodes: realNodes.filter(n => n.isActive).length,
    testsAvailable: new Set(realNodes.map(n => n.testId)).size,
    tierDistribution: realNodes.reduce((acc, node) => {
      acc[node.tierPriority] = (acc[node.tierPriority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-green-500/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Sistema de ProducciÃ³n
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{systemStats.totalNodes}</div>
            <div className="text-sm text-green-400">Nodos Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{systemStats.activeNodes}</div>
            <div className="text-sm text-green-400">Nodos Activos</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Tests PAES:</span>
            <Badge variant="outline">{systemStats.testsAvailable}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/80">CrÃ­ticos:</span>
            <Badge className="bg-red-600">{systemStats.tierDistribution['tier1_critico'] || 0}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Importantes:</span>
            <Badge className="bg-yellow-600">{systemStats.tierDistribution['tier2_importante'] || 0}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Complementarios:</span>
            <Badge className="bg-blue-600">{systemStats.tierDistribution['tier3_complementario'] || 0}</Badge>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <Brain className="w-4 h-4 mx-auto text-cyan-400" />
              <div className="text-white">{neuralMetrics.neuralCoherence}%</div>
            </div>
            <div className="text-center">
              <Zap className="w-4 h-4 mx-auto text-purple-400" />
              <div className="text-white">{neuralMetrics.learningVelocity}%</div>
            </div>
            <div className="text-center">
              <Target className="w-4 h-4 mx-auto text-orange-400" />
              <div className="text-white">{neuralMetrics.engagementScore}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

