/* eslint-disable react-refresh/only-export-components */

import React, { useState, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { 
  Brain, 
  Target, 
  Clock, 
  Play, 
  CheckCircle,
  AlertCircle,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useDiagnosticSystemReal } from '../../hooks/diagnostic/useDiagnosticSystemReal';
import { useAuth } from '../../hooks/useAuth';

interface DiagnosticRecommendation {
  testId: string;
  testName: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  estimatedTime: number;
  difficulty: string;
  nodesCovered: number;
}

export const IntelligentDiagnosticSystem: React.FC = () => {
  const { user } = useAuth();
  const { 
    data, 
    isLoading, 
    error, 
    isSystemReady, 
    systemMetrics,
    diagnosticTests,
    paesTests,
    learningNodes 
  } = useDiagnosticSystemReal();

  const [recommendations, setRecommendations] = useState<DiagnosticRecommendation[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  useEffect(() => {
    if (data && isSystemReady) {
      generateRecommendations();
    }
  }, [data, isSystemReady]);

  const generateRecommendations = () => {
    if (!data) return;

    const recs: DiagnosticRecommendation[] = [];

    // Generar recomendaciones basadas en los tests PAES disponibles
    paesTests.forEach(test => {
      const testNodes = learningNodes.filter(node => node.testId === test.id);
      const priority = test.isRequired ? 'high' : test.relativeWeight > 0.3 ? 'medium' : 'low';
      
      recs.push({
        testId: test.id.toString(),
        testName: test.name,
        priority: priority as 'high' | 'medium' | 'low',
        reason: test.isRequired 
          ? 'Test obligatorio para PAES' 
          : `Peso relativo: ${(test.relativeWeight * 100).toFixed(0)}%`,
        estimatedTime: test.timeMinutes || 45,
        difficulty: test.complexityLevel,
        nodesCovered: testNodes.length
      });
    });

    // Ordenar por prioridad y peso
    recs.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setRecommendations(recs.slice(0, 6)); // MÃ¡ximo 6 recomendaciones
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'CrÃ­tico';
      case 'medium': return 'Importante';
      case 'low': return 'Opcional';
      default: return 'Normal';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Analizando sistema diagnÃ³stico...</p>
        </div>
      </div>
    );
  }

  if (error || !isSystemReady) {
    return (
      <div className="p-6">
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-400 mb-2">Sistema No Disponible</h3>
            <p className="text-red-300">
              {error || 'El sistema diagnÃ³stico no estÃ¡ listo. Verifica la configuraciÃ³n.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header del sistema */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sistema DiagnÃ³stico Inteligente</h1>
          <p className="text-slate-400">
            Basado en {systemMetrics.totalNodes} nodos de aprendizaje y {diagnosticTests.length} tests disponibles
          </p>
        </div>
        <Badge variant="outline" className="text-green-400 border-green-400">
          <CheckCircle className="w-4 h-4 mr-2" />
          Sistema Activo
        </Badge>
      </div>

      {/* MÃ©tricas del sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-600/20 border-blue-500/30">
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-200 text-sm">Nodos Totales</p>
            <p className="text-2xl font-bold text-white">{systemMetrics.totalNodes}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-600/20 border-green-500/30">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-green-200 text-sm">Nodos Completados</p>
            <p className="text-2xl font-bold text-white">{systemMetrics.completedNodes}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-600/20 border-purple-500/30">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-200 text-sm">Tests Disponibles</p>
            <p className="text-2xl font-bold text-white">{systemMetrics.availableTests}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-600/20 border-orange-500/30">
          <CardContent className="p-4 text-center">
            <BarChart3 className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-orange-200 text-sm">Progreso</p>
            <p className="text-2xl font-bold text-white">
              {((systemMetrics.completedNodes / systemMetrics.totalNodes) * 100).toFixed(0)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones inteligentes */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Recomendaciones Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {recommendations.map((rec, index) => (
                <motion.div
                  key={rec.testId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`bg-slate-700/50 border-slate-600 hover:border-cyan-500/50 transition-colors cursor-pointer ${
                      selectedTest === rec.testId ? 'border-cyan-500 bg-cyan-500/10' : ''
                    }`}
                    onClick={() => setSelectedTest(rec.testId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-medium text-sm">{rec.testName}</h3>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {getPriorityLabel(rec.priority)}
                        </Badge>
                      </div>
                      
                      <p className="text-slate-300 text-xs mb-3">{rec.reason}</p>
                      
                      <div className="space-y-2 text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{rec.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{rec.nodesCovered} nodos</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          <span>Nivel: {rec.difficulty}</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full mt-3 bg-cyan-600 hover:bg-cyan-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          // AquÃ­ irÃ­a la lÃ³gica para iniciar el test
                          console.log('Iniciando test:', rec.testId);
                        }}
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Iniciar Test
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

