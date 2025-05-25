
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Brain, Award, Calendar, ArrowRight } from 'lucide-react';
import { IntersectionalContext, CrossModuleAction } from '@/types/intersectional-types';

interface ProgressIntersectionalProps {
  context: IntersectionalContext & { moduleState: any; ecosystemAlignment?: number };
  onNavigateToTool: (tool: string, context?: any) => void;
  onDispatchAction: (action: CrossModuleAction) => void;
}

export const ProgressIntersectional: React.FC<ProgressIntersectionalProps> = ({
  context,
  onNavigateToTool,
  onDispatchAction
}) => {
  const metrics = context.crossModuleMetrics;
  const ecosystemAlignment = context.ecosystemAlignment || 0;

  // Calcular progreso interseccional
  const calculateIntersectionalProgress = () => {
    const academicProgress = metrics.averagePerformance;
    const consistencyBonus = metrics.streakDays * 2;
    const volumeBonus = Math.min(metrics.exercisesCompleted * 1.5, 20);
    
    return Math.min(100, academicProgress + consistencyBonus + volumeBonus);
  };

  const intersectionalProgress = calculateIntersectionalProgress();

  // Análisis de fortalezas y oportunidades
  const getAnalysis = () => {
    const analysis = {
      strengths: [] as string[],
      opportunities: [] as string[],
      recommendations: [] as { title: string; action: string; tool: string }[]
    };

    // Fortalezas
    if (metrics.streakDays >= 7) {
      analysis.strengths.push('Consistencia excepcional en el estudio');
    }
    if (metrics.averagePerformance >= 80) {
      analysis.strengths.push('Alto rendimiento académico');
    }
    if (metrics.exercisesCompleted >= 50) {
      analysis.strengths.push('Gran volumen de práctica');
    }

    // Oportunidades
    if (metrics.averagePerformance < 70) {
      analysis.opportunities.push('Mejorar precisión en ejercicios');
      analysis.recommendations.push({
        title: 'Entrenamiento dirigido',
        action: 'Practicar áreas específicas de debilidad',
        tool: 'exercise'
      });
    }
    
    if (ecosystemAlignment < 60) {
      analysis.opportunities.push('Alinear estudio con plan académico');
      analysis.recommendations.push({
        title: 'Revisar plan de estudio',
        action: 'Ajustar objetivos y cronograma',
        tool: 'planning'
      });
    }
    
    if (context.financialGoals && metrics.averagePerformance < 85) {
      analysis.opportunities.push('Alcanzar nivel requerido para carrera objetivo');
      analysis.recommendations.push({
        title: 'Explorar apoyo financiero',
        action: 'Revisar becas y opciones de financiamiento',
        tool: 'financial'
      });
    }

    return analysis;
  };

  const analysis = getAnalysis();

  // Proyección de rendimiento
  const getPerformanceProjection = () => {
    const currentTrend = metrics.streakDays > 0 ? 'positive' : 'neutral';
    const projectedImprovement = currentTrend === 'positive' ? 
      Math.min(100, metrics.averagePerformance + (metrics.streakDays * 1.5)) :
      metrics.averagePerformance;

    return {
      trend: currentTrend,
      projected: Math.round(projectedImprovement),
      timeToGoal: context.financialGoals ? 
        Math.max(1, Math.ceil((85 - metrics.averagePerformance) / 2)) : null
    };
  };

  const projection = getPerformanceProjection();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Progreso Interseccional
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {Math.round(intersectionalProgress)}% Global
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Métricas Principales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              label: 'Rendimiento', 
              value: `${metrics.averagePerformance}%`, 
              icon: Target,
              color: metrics.averagePerformance >= 80 ? 'text-green-600' : metrics.averagePerformance >= 60 ? 'text-yellow-600' : 'text-red-600'
            },
            { 
              label: 'Racha', 
              value: `${metrics.streakDays} días`, 
              icon: Award,
              color: metrics.streakDays >= 7 ? 'text-green-600' : 'text-gray-600'
            },
            { 
              label: 'Ejercicios', 
              value: metrics.exercisesCompleted, 
              icon: Brain,
              color: 'text-blue-600'
            },
            { 
              label: 'Tiempo Hoy', 
              value: `${metrics.totalStudyTime}min`, 
              icon: Calendar,
              color: 'text-purple-600'
            }
          ].map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border"
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Progreso por Área */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Progreso por Área</h3>
          
          {[
            { area: 'Rendimiento Académico', progress: metrics.averagePerformance, target: 85 },
            { area: 'Consistencia de Estudio', progress: Math.min(100, metrics.streakDays * 10), target: 100 },
            { area: 'Volumen de Práctica', progress: Math.min(100, metrics.exercisesCompleted * 2), target: 100 },
            { area: 'Alineación con Objetivos', progress: ecosystemAlignment, target: 80 }
          ].map((item, index) => (
            <motion.div
              key={item.area}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{item.area}</span>
                <span className="text-gray-600">{Math.round(item.progress)}% / {item.target}%</span>
              </div>
              <div className="relative">
                <Progress value={item.progress} className="h-3" />
                <div 
                  className="absolute top-0 h-3 w-1 bg-red-400 rounded"
                  style={{ left: `${item.target}%` }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proyección de Rendimiento */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Proyección Inteligente
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Tendencia Actual</div>
              <div className={`font-semibold ${
                projection.trend === 'positive' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {projection.trend === 'positive' ? '📈 Positiva' : '➡️ Estable'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Rendimiento Proyectado</div>
              <div className="font-semibold text-blue-600">{projection.projected}%</div>
            </div>
            
            {projection.timeToGoal && (
              <div>
                <div className="text-sm text-gray-600">Tiempo al Objetivo</div>
                <div className="font-semibold text-purple-600">{projection.timeToGoal} semanas</div>
              </div>
            )}
          </div>
        </div>

        {/* Análisis y Recomendaciones */}
        <div className="space-y-4">
          {/* Fortalezas */}
          {analysis.strengths.length > 0 && (
            <div>
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                ✅ Fortalezas Identificadas
              </h4>
              <div className="space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                    {strength}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Oportunidades */}
          {analysis.opportunities.length > 0 && (
            <div>
              <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                🎯 Oportunidades de Mejora
              </h4>
              <div className="space-y-1">
                {analysis.opportunities.map((opportunity, index) => (
                  <div key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                    {opportunity}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recomendaciones Accionables */}
          {analysis.recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
                🚀 Acciones Recomendadas
              </h4>
              <div className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div>
                      <div className="font-medium text-blue-900">{rec.title}</div>
                      <div className="text-sm text-blue-700">{rec.action}</div>
                    </div>
                    <Button
                      onClick={() => onNavigateToTool(rec.tool)}
                      size="sm"
                      className="gap-1"
                    >
                      Ir <ArrowRight className="w-3 h-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
