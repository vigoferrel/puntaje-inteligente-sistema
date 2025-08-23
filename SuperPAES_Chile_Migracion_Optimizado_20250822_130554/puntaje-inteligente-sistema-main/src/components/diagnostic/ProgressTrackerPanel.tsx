/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TPAESPrueba, getPruebaDisplayName } from '../../types/system-types';
import { PAESTest } from '../../types/unified-diagnostic';

interface ProgressTrackerPanelProps {
  baselineScores: Record<TPAESPrueba, number> | null;
  currentScores: Record<TPAESPrueba, number> | null;
  progressTrends: Array<{
    date: string;
    scores: Record<TPAESPrueba, number>;
    improvements: Record<TPAESPrueba, number>;
  }>;
  tests: PAESTest[];
}

export const ProgressTrackerPanel: FC<ProgressTrackerPanelProps> = ({
  baselineScores,
  currentScores,
  progressTrends,
  tests
}) => {
  if (!baselineScores || !currentScores) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No hay datos de progreso disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Progreso por Prueba</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.map((test) => {
            const prueba = test.code as TPAESPrueba;
            const baseline = baselineScores[prueba] || 0;
            const current = currentScores[prueba] || 0;
            const improvement = current - baseline;
            
            return (
              <div key={test.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{getPruebaDisplayName(prueba)}</span>
                  <div className="flex items-center space-x-2">
                    {improvement > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : improvement < 0 ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-gray-400" />
                    )}
                    <Badge variant={improvement > 0 ? "default" : "secondary"}>
                      {improvement > 0 ? `+${improvement}` : improvement}
                    </Badge>
                    <span className="font-bold">{current}</span>
                  </div>
                </div>
                <Progress value={(current / 850) * 100} className="h-2" />
                <div className="text-xs text-gray-500">
                  Inicial: {baseline} | Actual: {current}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

