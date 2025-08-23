/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Sparkles, Brain } from 'lucide-react';
import { TLearningCyclePhase, MaterialType } from '../../../types/system-types';

interface SmartRecommendationEngineProps {
  currentPhase: TLearningCyclePhase;
  selectedMaterialType: MaterialType;
  recommendations: unknown[];
  onApplyRecommendation: (config: unknown) => void;
}

export const SmartRecommendationEngine: FC<SmartRecommendationEngineProps> = ({
  currentPhase,
  selectedMaterialType,
  recommendations,
  onApplyRecommendation
}) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Recomendaciones Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Optimizado para {currentPhase} + {selectedMaterialType}
            </span>
          </div>

          {recommendations.length > 0 ? (
            recommendations.slice(0, 2).map((rec, index) => (
              <div key={rec.id} className="p-3 rounded-lg bg-background border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <Badge variant="outline">{rec.priority}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                <Button
                  onClick={() => onApplyRecommendation({
                    materialType: selectedMaterialType,
                    phase: currentPhase,
                    skillCode: rec.skillCode
                  })}
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  {rec.action}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <Brain className="h-6 w-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Analizando tu progreso...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

