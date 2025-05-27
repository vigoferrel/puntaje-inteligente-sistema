
/**
 * NEURAL DASHBOARD WIDGET v2.0
 * Widget de métricas neurales en tiempo real
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Sparkles,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useAdvancedNeuralSystem } from '@/hooks/useAdvancedNeuralSystem';

interface NeuralDashboardWidgetProps {
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  showAdvancedMetrics?: boolean;
}

export const NeuralDashboardWidget = memo<NeuralDashboardWidgetProps>(({ 
  isMinimized = false,
  onToggleMinimize,
  showAdvancedMetrics = false
}) => {
  const {
    realTimeMetrics,
    currentPrediction,
    recommendations,
    systemHealth,
    personalizedInsights,
    learningStyle,
    personalizationScore,
    neuralSystemReady,
    isSystemHealthy,
    actions
  } = useAdvancedNeuralSystem('neural-dashboard-widget');

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getHealthBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (!neuralSystemReady) {
    return (
      <Card className="w-80 bg-black/90 backdrop-blur-xl border-cyan-500/30">
        <CardContent className="p-6 text-center">
          <Brain className="w-8 h-8 mx-auto mb-4 text-cyan-400 animate-pulse" />
          <p className="text-white text-sm">Inicializando Sistema Neural...</p>
        </CardContent>
      </Card>
    );
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-4 left-4 z-50"
      >
        <Button
          onClick={onToggleMinimize}
          className="bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-400 hover:bg-black/90"
          size="sm"
        >
          <Brain className="w-4 h-4 mr-2" />
          Neural
          <div className="ml-2 flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${systemHealth.overall_score > 70 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-xs">{realTimeMetrics.real_time_engagement}%</span>
          </div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-4 left-4 z-50"
    >
      <Card className="w-96 bg-black/90 backdrop-blur-xl border-cyan-500/30 max-h-[600px] overflow-y-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Sistema Neural Avanzado
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant={getHealthBadgeVariant(systemHealth.overall_score)}
                className="text-xs"
              >
                {isSystemHealthy ? 'Saludable' : 'Requiere Atención'}
              </Badge>
              
              <Button
                onClick={actions.forceSystemCheck}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
              
              {onToggleMinimize && (
                <Button
                  onClick={onToggleMinimize}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-6 w-6 p-0"
                >
                  <Settings className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          {/* Métricas en Tiempo Real */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Métricas en Tiempo Real
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Engagement</span>
                  <Zap className="w-3 h-3 text-yellow-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {realTimeMetrics.real_time_engagement}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Aprendizaje</span>
                  <Target className="w-3 h-3 text-green-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {realTimeMetrics.learning_effectiveness}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Coherencia</span>
                  <Brain className="w-3 h-3 text-purple-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {realTimeMetrics.neural_coherence}%
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Satisfacción</span>
                  <CheckCircle className="w-3 h-3 text-blue-400" />
                </div>
                <div className="text-lg font-bold text-white">
                  {realTimeMetrics.user_satisfaction_index}%
                </div>
              </div>
            </div>
          </div>

          {/* Predicción Actual */}
          {currentPrediction && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Predicción Neural
              </h4>
              
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-300 font-medium">
                    Próxima Acción Predicha
                  </span>
                  <Badge variant="outline" className="text-purple-300 border-purple-500/30">
                    {Math.round(currentPrediction.confidence * 100)}% confianza
                  </Badge>
                </div>
                <p className="text-xs text-white">
                  {currentPrediction.next_action.replace('_', ' ')}
                </p>
                {currentPrediction.suggested_preload.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    Precargando: {currentPrediction.suggested_preload.join(', ')}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Recomendaciones Adaptativas */}
          {recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recomendaciones IA
              </h4>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {recommendations.slice(0, 3).map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-white">
                        {rec.title}
                      </span>
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">
                      {rec.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Insights Personalizados */}
          {personalizedInsights.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cyan-400 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Insights Neurales
              </h4>
              
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {personalizedInsights.slice(0, 2).map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-cyan-300">
                        {insight.title}
                      </span>
                      <span className="text-xs text-cyan-400">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-white">
                      {insight.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Estilo de Aprendizaje */}
          {learningStyle && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cyan-400">
                Estilo de Aprendizaje Detectado
              </h4>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-300 capitalize">
                    {learningStyle.pattern_type}
                  </span>
                  <Badge variant="outline" className="text-green-300 border-green-500/30">
                    {Math.round(learningStyle.confidence * 100)}%
                  </Badge>
                </div>
                <div className="text-xs text-green-200 mt-1">
                  Efectividad: {Math.round(learningStyle.effectiveness_score)}%
                </div>
              </div>
            </div>
          )}

          {/* Estado del Sistema */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSystemHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-gray-400">
                  Sistema {isSystemHealthy ? 'Óptimo' : 'Requiere Atención'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Personalización:</span>
                <span className="text-cyan-400 font-medium">
                  {personalizationScore}%
                </span>
              </div>
            </div>
            
            {systemHealth.active_issues.length > 0 && (
              <div className="mt-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-yellow-400">
                  {systemHealth.active_issues.length} problema(s) detectado(s)
                </span>
              </div>
            )}
          </div>

          {/* Acciones Rápidas */}
          <div className="flex gap-2">
            <Button
              onClick={actions.forceInsightGeneration}
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
            >
              Generar Insights
            </Button>
            
            <Button
              onClick={actions.triggerPredictionAnalysis}
              size="sm"
              variant="outline"
              className="flex-1 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              Analizar Patrones
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

NeuralDashboardWidget.displayName = 'NeuralDashboardWidget';
