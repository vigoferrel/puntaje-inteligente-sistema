/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Brain, 
  Zap, 
  Target, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SmartRecommendation {
  id: string;
  type: 'critical' | 'opportunity' | 'strength' | 'next_step';
  title: string;
  description: string;
  subject: string;
  estimatedTime: number;
  impact: 'high' | 'medium' | 'low';
  action: {
    label: string;
    route: string;
  };
  aiReason: string;
}

interface SmartRecommendationsProps {
  recommendations: SmartRecommendation[];
}

export const SmartRecommendations: FC<SmartRecommendationsProps> = ({ 
  recommendations 
}) => {
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertCircle;
      case 'opportunity': return TrendingUp;
      case 'strength': return Target;
      case 'next_step': return Zap;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'opportunity': return 'border-yellow-200 bg-yellow-50';
      case 'strength': return 'border-green-200 bg-green-50';
      case 'next_step': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-7 w-7 text-primary" />
        <h2 className="text-2xl font-bold">Recomendaciones IA</h2>
        <Badge variant="outline" className="ml-auto">
          Personalizada para ti
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => {
          const Icon = getRecommendationIcon(rec.type);
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`${getRecommendationColor(rec.type)} border-2 hover:shadow-md transition-all duration-300`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white shadow-sm">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{rec.subject}</p>
                      </div>
                    </div>
                    <Badge className={getImpactColor(rec.impact)}>
                      {rec.impact === 'high' ? 'Alto' : 
                       rec.impact === 'medium' ? 'Medio' : 'Bajo'} impacto
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm">{rec.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{rec.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Brain className="h-3 w-3" />
                      <span>IA sugiere</span>
                    </div>
                  </div>

                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      <strong>RazÃ³n IA:</strong> {rec.aiReason}
                    </p>
                  </div>

                  <Button 
                    asChild 
                    className="w-full" 
                    variant={rec.type === 'critical' ? 'default' : 'outline'}
                  >
                    <Link to={rec.action.route} className="flex items-center gap-2">
                      {rec.action.label}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

