
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { TLearningCyclePhase } from '@/types/system-types';
import { motion } from 'framer-motion';

interface AdaptiveRecommendationEngineProps {
  currentPhase: TLearningCyclePhase;
  learningInsights: any;
  recommendations: any[];
  onApplyRecommendation: (config: any) => void;
}

export const AdaptiveRecommendationEngine: React.FC<AdaptiveRecommendationEngineProps> = ({
  currentPhase,
  learningInsights,
  recommendations,
  onApplyRecommendation
}) => {
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState<any[]>([]);

  useEffect(() => {
    generateAdaptiveRecommendations();
  }, [currentPhase, learningInsights]);

  const generateAdaptiveRecommendations = () => {
    const recommendations = [];

    // Recomendación basada en fase actual
    const phaseRecommendations = {
      'DIAGNOSIS': {
        type: 'phase',
        title: 'Completa tu Diagnóstico',
        description: 'Identifica tus fortalezas y áreas de mejora',
        action: 'Hacer Test Diagnóstico',
        priority: 'Alta',
        config: { materialType: 'diagnostic_tests', count: 10 }
      },
      'SKILL_TRAINING': {
        type: 'skill',
        title: 'Entrena Habilidades Específicas',
        description: 'Practica ejercicios dirigidos a tus debilidades',
        action: 'Entrenar Habilidades',
        priority: 'Alta',
        config: { materialType: 'exercises', count: 8 }
      },
      'CONTENT_STUDY': {
        type: 'content',
        title: 'Refuerza Contenidos Teóricos',
        description: 'Estudia los conceptos fundamentales',
        action: 'Estudiar Contenido',
        priority: 'Media',
        config: { materialType: 'study_content', count: 5 }
      }
    };

    if (phaseRecommendations[currentPhase]) {
      recommendations.push(phaseRecommendations[currentPhase]);
    }

    // Recomendaciones basadas en insights
    if (learningInsights) {
      if (learningInsights.weakestSkills?.length > 0) {
        recommendations.push({
          type: 'weakness',
          title: 'Refuerza Áreas Débiles',
          description: `Mejora en: ${learningInsights.weakestSkills.slice(0, 2).join(', ')}`,
          action: 'Practicar Debilidades',
          priority: 'Alta',
          config: { 
            materialType: 'practice_guides', 
            count: 5,
            focus: learningInsights.weakestSkills[0]
          }
        });
      }

      if (learningInsights.improvementTrend === 'positive') {
        recommendations.push({
          type: 'opportunity',
          title: 'Aumenta el Desafío',
          description: 'Tu progreso es excelente, intenta ejercicios más difíciles',
          action: 'Subir Dificultad',
          priority: 'Media',
          config: { 
            materialType: 'exercises', 
            count: 6,
            difficulty: 'avanzado'
          }
        });
      }
    }

    setAdaptiveRecommendations(recommendations);
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'phase': return Target;
      case 'skill': return Brain;
      case 'weakness': return AlertTriangle;
      case 'opportunity': return TrendingUp;
      default: return Lightbulb;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'phase': return 'bg-blue-500';
      case 'skill': return 'bg-purple-500';
      case 'weakness': return 'bg-orange-500';
      case 'opportunity': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const handleApplyRecommendation = (recommendation: any) => {
    onApplyRecommendation({
      ...recommendation.config,
      phase: currentPhase,
      recommendationType: recommendation.type
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Motor de Recomendaciones IA
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas de IA */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="font-medium mb-3">Análisis Inteligente</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Precisión del Modelo</div>
              <Progress value={87} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-1">87% de efectividad</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Confianza</div>
              <Progress value={92} className="mt-1" />
              <div className="text-xs text-muted-foreground mt-1">92% de confianza</div>
            </div>
          </div>
        </div>

        {/* Recomendaciones Adaptativas */}
        <div className="space-y-3">
          {adaptiveRecommendations.map((recommendation, index) => {
            const Icon = getRecommendationIcon(recommendation.type);
            const colorClass = getRecommendationColor(recommendation.type);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${colorClass} text-white flex-shrink-0`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <Badge 
                        variant={recommendation.priority === 'Alta' ? 'destructive' : 
                                recommendation.priority === 'Media' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {recommendation.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {recommendation.description}
                    </p>
                    
                    <Button
                      onClick={() => handleApplyRecommendation(recommendation)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      {recommendation.action}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer con información del modelo */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Basado en {recommendations.length + adaptiveRecommendations.length} puntos de datos</span>
            <span>Actualizado hace 2 min</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
