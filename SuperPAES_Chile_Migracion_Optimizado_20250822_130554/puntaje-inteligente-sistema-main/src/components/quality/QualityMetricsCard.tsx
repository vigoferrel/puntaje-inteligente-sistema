/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Shield, CheckCircle, AlertTriangle, Target,
  TrendingUp, Award, Star, Zap
} from 'lucide-react';

interface QualityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  category: 'content' | 'user_experience' | 'ai_precision' | 'reliability';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  description: string;
}

interface QualityMetricsCardProps {
  metrics: QualityMetric[];
  overallScore: number;
}

const getMetricIcon = (category: string) => {
  switch (category) {
    case 'content': return Target;
    case 'user_experience': return Star;
    case 'ai_precision': return Zap;
    case 'reliability': return Shield;
    default: return CheckCircle;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-400';
    case 'good': return 'text-blue-400';
    case 'warning': return 'text-yellow-400';
    case 'critical': return 'text-red-400';
    default: return 'text-gray-400';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-green-600';
    case 'good': return 'bg-blue-600';
    case 'warning': return 'bg-yellow-600';
    case 'critical': return 'bg-red-600';
    default: return 'bg-gray-600';
  }
};

export const QualityMetricsCard: FC<QualityMetricsCardProps> = ({
  metrics,
  overallScore
}) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'ðŸ“ˆ';
      case 'down': return 'ðŸ“‰';
      default: return 'âž¡ï¸';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            MÃ©tricas de Calidad
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusBadge(overallScore >= 90 ? 'excellent' : overallScore >= 80 ? 'good' : overallScore >= 70 ? 'warning' : 'critical')} text-white`}>
              <Award className="w-3 h-3 mr-1" />
              {overallScore}% General
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.category);
            
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-purple-400" />
                    <span className="text-white font-medium text-sm">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                      {metric.value}%
                    </span>
                    <span className="text-xs">{getTrendIcon(metric.trend)}</span>
                  </div>
                </div>
                
                <Progress 
                  value={metric.value} 
                  className="h-2 mb-2"
                />
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{metric.description}</span>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(metric.status)} border-current text-xs`}
                  >
                    Meta: {metric.target}%
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Resumen de Estado */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <h4 className="text-white font-medium">Estado del Sistema</h4>
              <p className="text-green-300 text-sm">
                {overallScore >= 90 
                  ? 'Sistema funcionando con excelencia. Todos los estÃ¡ndares superados.'
                  : overallScore >= 80
                  ? 'Sistema en buen estado. Algunas mÃ©tricas pueden mejorarse.'
                  : overallScore >= 70
                  ? 'Sistema funcional con advertencias. Revisar mÃ©tricas crÃ­ticas.'
                  : 'Sistema requiere atenciÃ³n inmediata. MÃºltiples mÃ©tricas por debajo del umbral.'
                }
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

