/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { 
  Crown, 
  Star, 
  Circle, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';

interface TierData {
  tier: 'tier1_critico' | 'tier2_importante' | 'tier3_complementario';
  name: string;
  total: number;
  completed: number;
  inProgress: number;
  progress: number;
  estimatedTimeRemaining: number;
}

interface TierProgressVisualizerProps {
  tierData: TierData[];
  className?: string;
}

export const TierProgressVisualizer: FC<TierProgressVisualizerProps> = ({ 
  tierData, 
  className 
}) => {
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'tier1_critico': return Crown;
      case 'tier2_importante': return Star;
      case 'tier3_complementario': return Circle;
      default: return Circle;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'tier1_critico': return {
        bg: 'from-yellow-400 to-yellow-600',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        bgLight: 'bg-yellow-50'
      };
      case 'tier2_importante': return {
        bg: 'from-gray-300 to-gray-500',
        text: 'text-gray-700',
        border: 'border-gray-200',
        bgLight: 'bg-gray-50'
      };
      case 'tier3_complementario': return {
        bg: 'from-amber-600 to-amber-800',
        text: 'text-amber-700',
        border: 'border-amber-200',
        bgLight: 'bg-amber-50'
      };
      default: return {
        bg: 'from-gray-400 to-gray-600',
        text: 'text-gray-700',
        border: 'border-gray-200',
        bgLight: 'bg-gray-50'
      };
    }
  };

  const getTierPriority = (tier: string) => {
    switch (tier) {
      case 'tier1_critico': return 'CrÃ­tico';
      case 'tier2_importante': return 'Importante';
      case 'tier3_complementario': return 'Complementario';
      default: return 'Desconocido';
    }
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Progreso por Tiers</h2>
        <Badge variant="outline">Sistema de PriorizaciÃ³n</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tierData.map((tier, index) => {
          const Icon = getTierIcon(tier.tier);
          const colors = getTierColor(tier.tier);
          const priority = getTierPriority(tier.tier);
          
          return (
            <motion.div
              key={tier.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${colors.bgLight} ${colors.border} border-2 hover:shadow-lg transition-all duration-300`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {priority}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progreso</span>
                      <span className="font-semibold">{Math.round(tier.progress)}%</span>
                    </div>
                    <Progress 
                      value={tier.progress} 
                      className="h-3"
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-xl font-bold text-green-600">
                          {tier.completed}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Completados</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-xl font-bold text-yellow-600">
                          {tier.inProgress}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">En progreso</p>
                    </div>
                  </div>

                  {/* Total and Time */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span>Total de nodos:</span>
                      <span className="font-semibold">{tier.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tiempo restante:</span>
                      <span className="font-semibold">
                        {Math.round(tier.estimatedTimeRemaining / 60)}h
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

