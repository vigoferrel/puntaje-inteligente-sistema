/* eslint-disable react-refresh/only-export-components */

import React, { useEffect, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress';
import { Award, Target, TrendingUp, BookOpen, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePAESPlanIntegration } from '../../../hooks/lectoguia/use-paes-plan-integration';
import { PAESPlanMetrics } from './PAESPlanMetrics';
import { supabase } from '../../../integrations/supabase/leonardo-auth-client';

export const PAESPlanDashboard: React.FC = () => {
  const {
    loading,
    planMetrics,
    paesBasedNodes,
    generateAdaptivePlan,
    loadPAESBasedNodes,
    loadPlanMetrics
  } = usePAESPlanIntegration();

  const [adaptivePlan, setAdaptivePlan] = useState<unknown>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadPlanMetrics();
    loadPAESBasedNodes();
  }, [loadPlanMetrics, loadPAESBasedNodes]);

  const handleGeneratePlan = async () => {
    setGeneratingPlan(true);
    try {
      const plan = await generateAdaptivePlan();
      setAdaptivePlan(plan);
    } catch (error) {
      console.error('Error generando plan:', error);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const getReadinessStatus = (readiness: number) => {
    if (readiness >= 80) return { label: 'Excelente', color: 'bg-green-500' };
    if (readiness >= 60) return { label: 'Bueno', color: 'bg-blue-500' };
    if (readiness >= 40) return { label: 'Regular', color: 'bg-yellow-500' };
    return { label: 'Inicial', color: 'bg-red-500' };
  };

  const readinessStatus = getReadinessStatus(planMetrics.estimatedReadiness);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Award className="h-6 w-6 text-green-600" />
          Mi Plan PAES Personalizado
        </h2>
        <p className="text-muted-foreground">
          Plan adaptativo basado en preguntas oficiales PAES resueltas
        </p>
      </motion.div>

      {/* MÃ©tricas PAES */}
      <PAESPlanMetrics metrics={planMetrics} loading={loading} />

      {/* Estado de PreparaciÃ³n */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Estado de PreparaciÃ³n
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Nivel de PreparaciÃ³n</span>
              <Badge className={`${readinessStatus.color} text-white`}>
                {readinessStatus.label}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Progress value={planMetrics.estimatedReadiness} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span className="font-medium">{planMetrics.estimatedReadiness}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{planMetrics.totalPAESQuestions}</div>
                <div className="text-sm text-muted-foreground">Preguntas Oficiales</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.round(planMetrics.paesAccuracy)}%</div>
                <div className="text-sm text-muted-foreground">PrecisiÃ³n</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Generador de Plan Adaptativo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Plan Adaptativo Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Genera un plan de estudio personalizado basado en tu rendimiento en preguntas oficiales PAES.
            </p>
            
            <Button 
              onClick={handleGeneratePlan}
              disabled={generatingPlan || planMetrics.totalPAESQuestions === 0}
              className="w-full"
              size="lg"
            >
              {generatingPlan ? (
                <>
                  <TrendingUp className="h-4 w-4 mr-2 animate-spin" />
                  Generando Plan...
                </>
              ) : (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Generar Plan Personalizado
                </>
              )}
            </Button>

            {planMetrics.totalPAESQuestions === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Resuelve algunas preguntas oficiales PAES para generar tu plan personalizado
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Plan Generado */}
      {adaptivePlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                {adaptivePlan.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-green-700">{adaptivePlan.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Ãreas de Enfoque:</h4>
                  <div className="space-y-1">
                    {adaptivePlan.focusAreas?.map((area: string, index: number) => (
                      <Badge key={index} variant="destructive" className="mr-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-green-800 mb-2">Fortalezas a Mantener:</h4>
                  <div className="space-y-1">
                    {adaptivePlan.reinforcementAreas?.map((area: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    DuraciÃ³n estimada: {adaptivePlan.estimatedDuration} dÃ­as
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">
                    {adaptivePlan.recommendedNodes?.length || 0} nodos recomendados
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Nodos Recomendados */}
      {paesBasedNodes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Nodos de Aprendizaje Recomendados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paesBasedNodes.slice(0, 4).map((node, index) => (
                  <div key={node.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <h4 className="font-medium text-sm">{node.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{node.description}</p>
                    {node.recommendationReason && (
                      <Badge variant="outline" className="text-xs mt-2">
                        {node.recommendationReason}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};


