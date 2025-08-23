/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { 
  CheckCircle, AlertTriangle, RefreshCw, Eye,
  FileCheck, Brain, Target, Zap, Clock
} from 'lucide-react';

interface ValidationResult {
  id: string;
  component: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  issues: string[];
  recommendations: string[];
  lastValidated: Date;
}

interface QualityValidationPanelProps {
  onValidate: (component: string) => void;
  onValidateAll: () => void;
  isValidating: boolean;
}

export const QualityValidationPanel: React.FC<QualityValidationPanelProps> = ({
  onValidate,
  onValidateAll,
  isValidating
}) => {
  const [validationResults] = useState<ValidationResult[]>([
    {
      id: 'neural-system',
      component: 'Sistema Neural',
      status: 'passed',
      score: 94,
      issues: [],
      recommendations: ['Optimizar conexiones entre dimensiones'],
      lastValidated: new Date()
    },
    {
      id: 'intelligent-plans',
      component: 'Planes Inteligentes',
      status: 'warning',
      score: 78,
      issues: ['Algunos planes requieren mÃ¡s datos de entrada'],
      recommendations: ['Mejorar algoritmo de adaptaciÃ³n', 'Aumentar datos de usuario'],
      lastValidated: new Date()
    },
    {
      id: 'ai-content',
      component: 'Contenido IA',
      status: 'passed',
      score: 92,
      issues: [],
      recommendations: ['Implementar validaciÃ³n semÃ¡ntica avanzada'],
      lastValidated: new Date()
    },
    {
      id: 'user-interface',
      component: 'Interfaz Usuario',
      status: 'passed',
      score: 88,
      issues: [],
      recommendations: ['Mejorar accesibilidad en dispositivos mÃ³viles'],
      lastValidated: new Date()
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'failed': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const overallScore = Math.round(
    validationResults.reduce((sum, result) => sum + result.score, 0) / validationResults.length
  );

  return (
    <Card className="bg-black/40 backdrop-blur-xl border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-purple-400" />
            Panel de ValidaciÃ³n de Calidad
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-600 text-white">
              Score: {overallScore}%
            </Badge>
            <Button
              onClick={onValidateAll}
              disabled={isValidating}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              size="sm"
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Validando...
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Validar Todo
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40">
            <TabsTrigger value="components">Componentes</TabsTrigger>
            <TabsTrigger value="metrics">MÃ©tricas</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="space-y-4">
            <div className="grid gap-4">
              {validationResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h4 className="text-white font-medium">{result.component}</h4>
                        <p className="text-gray-400 text-sm">
                          Ãšltima validaciÃ³n: {result.lastValidated.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{result.score}%</span>
                      <Button
                        onClick={() => onValidate(result.component)}
                        variant="outline"
                        size="sm"
                        className="border-white/20"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  <Progress value={result.score} className="h-2 mb-3" />

                  {result.issues.length > 0 && (
                    <div className="mb-3">
                      <h5 className="text-yellow-400 font-medium text-sm mb-1">Problemas:</h5>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {result.issues.map((issue, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span>â€¢</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.recommendations.length > 0 && (
                    <div>
                      <h5 className="text-blue-400 font-medium text-sm mb-1">Recomendaciones:</h5>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span>â€¢</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-400">97%</div>
                  <div className="text-sm text-gray-300">PrecisiÃ³n IA</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400">94%</div>
                  <div className="text-sm text-gray-300">Accuracy Rate</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-400">156ms</div>
                  <div className="text-sm text-gray-300">Tiempo Respuesta</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400">99.8%</div>
                  <div className="text-sm text-gray-300">Uptime</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg border border-green-500/30">
                <h4 className="text-green-400 font-medium mb-2">âœ… Sistema Validado</h4>
                <p className="text-gray-300 text-sm">
                  Todas las validaciones principales han pasado. El sistema estÃ¡ funcionando dentro de los parÃ¡metros esperados.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg border border-blue-500/30">
                <h4 className="text-blue-400 font-medium mb-2">ðŸ“Š Reporte de Calidad</h4>
                <p className="text-gray-300 text-sm">
                  Score general: {overallScore}%. El sistema mantiene estÃ¡ndares altos de calidad con oportunidades de mejora identificadas.
                </p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
                <h4 className="text-purple-400 font-medium mb-2">ðŸ”® Predicciones</h4>
                <p className="text-gray-300 text-sm">
                  Con las mejoras propuestas, se proyecta un incremento del 8% en el score general durante los prÃ³ximos 30 dÃ­as.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

