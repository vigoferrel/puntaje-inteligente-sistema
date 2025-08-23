/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Play, RefreshCw, Sparkles, Target, Clock } from 'lucide-react';
import { TLearningCyclePhase } from '../../../types/system-types';
import { motion } from 'framer-motion';

interface ActionCenterProps {
  recommendations: unknown[];
  currentPhase: TLearningCyclePhase;
  onQuickAction: (config: unknown) => void;
  isGenerating: boolean;
}

export const ActionCenter: FC<ActionCenterProps> = ({
  recommendations,
  currentPhase,
  onQuickAction,
  isGenerating
}) => {
  const quickActions = [
    {
      id: 'daily-practice',
      title: 'PrÃ¡ctica Diaria',
      description: 'Ejercicios recomendados para hoy',
      icon: Target,
      color: 'bg-blue-500',
      config: {
        materialType: 'exercises',
        phase: currentPhase,
        count: 5,
        difficulty: 'intermedio'
      }
    },
    {
      id: 'weakness-focus',
      title: 'Reforzar Debilidades',
      description: 'Material dirigido a tus Ã¡reas de mejora',
      icon: Sparkles,
      color: 'bg-orange-500',
      config: {
        materialType: 'practice_guides',
        phase: 'REINFORCEMENT',
        count: 3,
        difficulty: 'basico'
      }
    },
    {
      id: 'quick-assessment',
      title: 'EvaluaciÃ³n RÃ¡pida',
      description: 'Test corto para medir progreso',
      icon: Clock,
      color: 'bg-green-500',
      config: {
        materialType: 'diagnostic_tests',
        phase: 'PERIODIC_TESTS',
        count: 8,
        difficulty: 'intermedio'
      }
    }
  ];

  const handleQuickAction = (action: unknown) => {
    onQuickAction({
      ...action.config,
      nodes: ['recommended'], // Se determinarÃ¡n automÃ¡ticamente
      subject: 'current'
    });
  };

  return (
    <div className="space-y-6">
      {/* Acciones RÃ¡pidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Acciones RÃ¡pidas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleQuickAction(action)}
                  disabled={isGenerating}
                  variant="outline"
                  className="w-full h-auto p-4 flex items-start gap-3 hover:bg-muted/50"
                >
                  <div className={`p-2 rounded-lg ${action.color} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                  {isGenerating && (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  )}
                </Button>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Recomendaciones Inteligentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recomendaciones IA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.length > 0 ? (
            recommendations.slice(0, 3).map((rec, index) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-sm">{rec.title}</div>
                  <Badge variant="outline" className="text-xs">
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {rec.description}
                </p>
                <Button
                  onClick={() => handleQuickAction({
                    config: {
                      materialType: rec.type || 'exercises',
                      phase: currentPhase,
                      count: 3,
                      skillCode: rec.skillCode
                    }
                  })}
                  disabled={isGenerating}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {rec.action}
                </Button>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Generando recomendaciones...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

