
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Target,
  Lightbulb
} from 'lucide-react';
import { useRealNeuralInsights } from '@/hooks/useRealNeuralInsights';
import { CinematicSkeletonOptimized } from '@/components/unified-dashboard/CinematicSkeletonOptimized';

export const NeuralInsights: React.FC = () => {
  const { insights, isLoading } = useRealNeuralInsights();

  if (isLoading) {
    return (
      <CinematicSkeletonOptimized 
        message="Generando Insights Personalizados"
        variant="card"
      />
    );
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return TrendingUp;
      case 'strength':
        return CheckCircle;
      case 'warning':
        return AlertTriangle;
      case 'achievement':
        return Target;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return 'from-blue-600 to-cyan-600';
      case 'strength':
        return 'from-green-600 to-emerald-600';
      case 'warning':
        return 'from-yellow-600 to-orange-600';
      case 'achievement':
        return 'from-purple-600 to-pink-600';
      default:
        return 'from-gray-600 to-slate-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-600/20 text-red-400 border-red-400/50">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-400/50">Media</Badge>;
      case 'low':
        return <Badge className="bg-green-600/20 text-green-400 border-green-400/50">Baja</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Card className="bg-gradient-to-r from-black/40 to-slate-900/40 backdrop-blur-xl border-white/10">
        <CardHeader>
          <CardTitle className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Insights Neurales Personalizados
          </CardTitle>
          <p className="text-sm text-white/70">
            Análisis basado en tu progreso real y patrones de estudio
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, index) => {
              const Icon = getInsightIcon(insight.type);
              const colorClasses = getInsightColor(insight.type);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 rounded-lg bg-gradient-to-br ${colorClasses} bg-opacity-20 border border-white/10`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className="w-5 h-5 text-white" />
                    {getPriorityBadge(insight.priority)}
                  </div>
                  
                  <h4 className="font-semibold text-white mb-2">
                    {insight.title}
                  </h4>
                  
                  <p className="text-sm text-white/80 mb-3">
                    {insight.description}
                  </p>

                  {insight.metric_value && (
                    <div className="text-xs text-white/60">
                      Valor: {insight.metric_value}
                    </div>
                  )}

                  {insight.actionable && (
                    <div className="mt-3">
                      <Badge className="bg-white/10 text-white border-white/20 text-xs">
                        Accionable
                      </Badge>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {insights.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg text-white mb-2">Generando Insights</h3>
              <p className="text-gray-400">
                Completa algunas actividades para recibir insights personalizados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
