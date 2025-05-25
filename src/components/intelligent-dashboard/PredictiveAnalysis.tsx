
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, AlertTriangle, TrendingUp, Target, Clock,
  Zap, Star, Activity, BarChart3
} from 'lucide-react';
import { SkillNode } from '@/core/unified-education-system/EducationDataHub';

interface PredictiveAnalysisProps {
  skillNodes: SkillNode[];
  patterns: any;
}

export const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({
  skillNodes,
  patterns
}) => {
  // Análisis predictivo avanzado
  const predictiveInsights = React.useMemo(() => {
    const predictions = [];
    
    // Predecir áreas de riesgo
    const riskAreas = skillNodes.filter(node => {
      const riskScore = (100 - node.masteryLevel) * (node.prerequisites.length + 1);
      return riskScore > 150;
    });

    if (riskAreas.length > 0) {
      predictions.push({
        type: 'risk',
        title: 'Áreas de Riesgo Detectadas',
        description: `${riskAreas.length} habilidades requieren atención inmediata`,
        confidence: 95,
        impact: 'alta',
        timeframe: '2-3 semanas',
        recommendations: riskAreas.slice(0, 3).map(node => node.name)
      });
    }

    // Predecir oportunidades de aceleración
    const accelerationOpportunities = skillNodes.filter(node => 
      node.masteryLevel > 60 && node.masteryLevel < 85
    );

    if (accelerationOpportunities.length > 0) {
      predictions.push({
        type: 'opportunity',
        title: 'Oportunidades de Aceleración',
        description: `${accelerationOpportunities.length} habilidades listas para optimizar`,
        confidence: 88,
        impact: 'media',
        timeframe: '1-2 semanas',
        recommendations: accelerationOpportunities.slice(0, 3).map(node => node.name)
      });
    }

    // Predecir tiempo de preparación
    const avgMastery = skillNodes.reduce((sum, node) => sum + node.masteryLevel, 0) / skillNodes.length;
    const preparationTime = Math.max(1, Math.ceil((100 - avgMastery) / 10));

    predictions.push({
      type: 'timeline',
      title: 'Proyección de Preparación PAES',
      description: `Tiempo estimado para nivel óptimo: ${preparationTime} semanas`,
      confidence: 82,
      impact: 'alta',
      timeframe: `${preparationTime} semanas`,
      recommendations: ['Enfoque en habilidades críticas', 'Práctica diaria constante', 'Evaluaciones semanales']
    });

    return predictions;
  }, [skillNodes]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      case 'timeline': return Clock;
      default: return Target;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'risk': return 'from-red-600 to-orange-600';
      case 'opportunity': return 'from-green-600 to-emerald-600';
      case 'timeline': return 'from-blue-600 to-cyan-600';
      default: return 'from-purple-600 to-pink-600';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-black/40 to-slate-900/40 backdrop-blur-xl border-purple-500/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          Análisis Predictivo IA
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
            Avanzado
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Métricas Predictivas */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-600/20 rounded-lg">
            <Activity className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-xl font-bold text-blue-400">
              {Math.round(skillNodes.reduce((sum, node) => sum + node.masteryLevel, 0) / skillNodes.length)}%
            </div>
            <div className="text-xs text-gray-400">Preparación Global</div>
          </div>
          
          <div className="text-center p-3 bg-green-600/20 rounded-lg">
            <Star className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-xl font-bold text-green-400">
              {skillNodes.filter(node => node.masteryLevel > 80).length}
            </div>
            <div className="text-xs text-gray-400">Habilidades Dominadas</div>
          </div>
          
          <div className="text-center p-3 bg-orange-600/20 rounded-lg">
            <Zap className="w-6 h-6 mx-auto mb-2 text-orange-400" />
            <div className="text-xl font-bold text-orange-400">
              {skillNodes.filter(node => node.masteryLevel < 50).length}
            </div>
            <div className="text-xs text-gray-400">Requieren Refuerzo</div>
          </div>
        </div>

        {/* Predicciones IA */}
        <div className="space-y-4">
          <h4 className="text-white font-medium flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Predicciones del Sistema IA
          </h4>
          
          {predictiveInsights.map((insight, index) => {
            const Icon = getTypeIcon(insight.type);
            const colorClass = getTypeColor(insight.type);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h5 className="text-white font-medium">{insight.title}</h5>
                      <p className="text-gray-300 text-sm">{insight.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-cyan-400" />
                        <span className="text-gray-400">Confianza: {insight.confidence}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-green-400" />
                        <span className="text-gray-400">{insight.timeframe}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          insight.impact === 'alta' ? 'border-red-500/50 text-red-400' :
                          insight.impact === 'media' ? 'border-yellow-500/50 text-yellow-400' :
                          'border-blue-500/50 text-blue-400'
                        }`}
                      >
                        Impacto {insight.impact}
                      </Badge>
                    </div>

                    {/* Indicador de confianza */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Precisión del Modelo IA</span>
                        <span className="text-purple-400">{insight.confidence}%</span>
                      </div>
                      <Progress value={insight.confidence} className="h-1" />
                    </div>

                    {/* Recomendaciones específicas */}
                    {insight.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs text-gray-400">Recomendaciones IA:</p>
                        <div className="flex flex-wrap gap-1">
                          {insight.recommendations.map((rec, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {rec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tendencias de Aprendizaje */}
        <div className="p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
          <h5 className="text-white font-medium mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Tendencia de Aprendizaje
          </h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Velocidad de Progreso:</span>
              <span className="text-purple-400 ml-2 font-medium">
                {patterns.learningTrends === 'improving' ? '⬆️ Mejorando' : 
                 patterns.learningTrends === 'stable' ? '➡️ Estable' : 
                 '⬇️ Necesita Atención'}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Predicción 30 días:</span>
              <span className="text-green-400 ml-2 font-medium">+15% dominio</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
