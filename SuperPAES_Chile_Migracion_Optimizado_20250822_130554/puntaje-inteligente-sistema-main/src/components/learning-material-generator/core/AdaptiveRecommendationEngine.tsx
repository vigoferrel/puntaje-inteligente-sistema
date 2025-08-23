﻿/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { AdaptiveRecommendation } from '../../../types/material-generation';
import { Sparkles, Play, Clock, TrendingUp } from 'lucide-react';

interface AdaptiveRecommendationEngineProps {
  recommendations: AdaptiveRecommendation[];
  onRecommendationSelect: (config: unknown) => void;
  isGenerating: boolean;
}

export const AdaptiveRecommendationEngine: FC<AdaptiveRecommendationEngineProps> = ({
  recommendations,
  onRecommendationSelect,
  isGenerating
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercises': return 'ðŸ“';
      case 'study_content': return 'ðŸ“–';
      case 'assessment': return 'ðŸ”¬';
      case 'practice_test': return 'ðŸ“‹';
      default: return 'ðŸ“š';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Recomendaciones Adaptativas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((recommendation) => (
            <div key={recommendation.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(recommendation.type)}</span>
                  <h4 className="font-medium">{recommendation.title}</h4>
                </div>
                <Badge className={getPriorityColor(recommendation.priority)}>
                  {recommendation.priority}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {recommendation.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {recommendation.estimatedTime} min
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {recommendation.reasoning}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => onRecommendationSelect(recommendation.config)}
                  disabled={isGenerating}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Aplicar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

