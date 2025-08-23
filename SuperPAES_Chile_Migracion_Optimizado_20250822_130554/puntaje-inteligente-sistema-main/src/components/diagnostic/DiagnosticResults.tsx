/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Trophy, Target, TrendingUp, Brain, RotateCcw, 
  CheckCircle, AlertCircle, Star 
} from 'lucide-react';
import { DiagnosticResult } from '../../types/diagnostic';
import { TPAESHabilidad } from '../../types/system-types';

interface DiagnosticResultsProps {
  results: DiagnosticResult;
  onRestart: () => void;
}

export const DiagnosticResults: FC<DiagnosticResultsProps> = ({
  results,
  onRestart
}) => {
  // Calcular mÃ©tricas de resumen
  const skillEntries = Object.entries(results.results);
  const averageScore = skillEntries.length > 0 
    ? skillEntries.reduce((sum, [_, score]) => sum + score, 0) / skillEntries.length 
    : 0;
  
  const projectedPAESScore = Math.round(150 + (averageScore * 7));
  const strongAreas = skillEntries.filter(([_, score]) => score >= 0.7);
  const improvementAreas = skillEntries.filter(([_, score]) => score < 0.5);

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-500';
    if (score >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 0.7) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const skillDisplayNames: Record<TPAESHabilidad, string> = {
    INTERPRET_RELATE: 'Interpretar y Relacionar',
    SOLVE_PROBLEMS: 'Resolver Problemas',
    REPRESENT: 'Representar',
    MODEL: 'Modelar',
    EVALUATE_REFLECT: 'Evaluar y Reflexionar',
    TRACK_LOCATE: 'Localizar InformaciÃ³n',
    ARGUE_COMMUNICATE: 'Argumentar y Comunicar',
    IDENTIFY_THEORIES: 'Identificar TeorÃ­as',
    PROCESS_ANALYZE: 'Procesar y Analizar',
    APPLY_PRINCIPLES: 'Aplicar Principios',
    SCIENTIFIC_ARGUMENT: 'ArgumentaciÃ³n CientÃ­fica',
    TEMPORAL_THINKING: 'Pensamiento Temporal',
    SOURCE_ANALYSIS: 'AnÃ¡lisis de Fuentes',
    MULTICAUSAL_ANALYSIS: 'AnÃ¡lisis Multicausal',
    CRITICAL_THINKING: 'Pensamiento CrÃ­tico',
    REFLECTION: 'ReflexiÃ³n'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center space-x-3">
          <Trophy className="w-12 h-12 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">
            DiagnÃ³stico Completado
          </h1>
        </div>
        <p className="text-lg text-gray-600">
          AnÃ¡lisis completo de tu nivel actual en competencias PAES
        </p>
      </motion.div>

      {/* Resumen General */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span>Resumen de Resultados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {Math.round(averageScore * 100)}%
                </div>
                <div className="text-sm text-gray-600">Nivel Promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {projectedPAESScore}
                </div>
                <div className="text-sm text-gray-600">Puntaje Proyectado PAES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {strongAreas.length}
                </div>
                <div className="text-sm text-gray-600">Ãreas Fuertes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Resultados por Habilidad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-6 h-6 text-purple-600" />
              <span>AnÃ¡lisis por Habilidades</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {skillEntries.map(([skill, score]) => (
                <div key={skill} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      score >= 0.7 ? 'bg-green-500' : 
                      score >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className="font-medium">
                      {skillDisplayNames[skill as TPAESHabilidad] || skill}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          score >= 0.7 ? 'bg-green-500' : 
                          score >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        className="dynamic-progress-fill" data-progress={score * 100}
                      />
                    </div>
                    <Badge className={getScoreBadgeColor(score)}>
                      {Math.round(score * 100)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fortalezas y Ãreas de Mejora */}
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Fortalezas */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Fortalezas Identificadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {strongAreas.length > 0 ? (
              <div className="space-y-2">
                {strongAreas.map(([skill, score]) => (
                  <div key={skill} className="flex items-center justify-between p-2 bg-green-50 rounded">
                    <span className="text-sm font-medium">
                      {skillDisplayNames[skill as TPAESHabilidad] || skill}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-600">
                        {Math.round(score * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                ContinÃºa practicando para desarrollar tus fortalezas
              </p>
            )}
          </CardContent>
        </Card>

        {/* Ãreas de Mejora */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              <span>Oportunidades de Mejora</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {improvementAreas.length > 0 ? (
              <div className="space-y-2">
                {improvementAreas.map(([skill, score]) => (
                  <div key={skill} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                    <span className="text-sm font-medium">
                      {skillDisplayNames[skill as TPAESHabilidad] || skill}
                    </span>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-bold text-orange-600">
                        {Math.round(score * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Â¡Excelente! No se identificaron Ã¡reas crÃ­ticas de mejora
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Acciones */}
      <motion.div
        className="flex justify-center space-x-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Button onClick={onRestart} className="flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>Realizar Otro DiagnÃ³stico</span>
        </Button>
      </motion.div>

      {/* InformaciÃ³n adicional */}
      <motion.div
        className="text-center text-sm text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p>
          DiagnÃ³stico completado el {new Date(results.completedAt).toLocaleDateString('es-CL')}
        </p>
        <p className="mt-1">
          Los resultados se han guardado en tu perfil para futuras referencias
        </p>
      </motion.div>
    </div>
  );
};


