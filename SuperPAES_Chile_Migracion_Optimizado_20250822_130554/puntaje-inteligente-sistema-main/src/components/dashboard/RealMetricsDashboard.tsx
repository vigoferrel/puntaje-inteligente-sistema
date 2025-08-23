/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import { 
  Brain, 
  BookOpen, 
  Target, 
  TrendingUp,
  Clock,
  Award,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import { useRealDiagnosticData } from '../../hooks/useRealDiagnosticData';
import { useRealProgressData } from '../../hooks/useRealProgressData';

export const RealMetricsDashboard: FC = () => {
  const { metrics: diagnosticMetrics, isLoading: diagnosticLoading } = useRealDiagnosticData();
  const { metrics: progressMetrics, isLoading: progressLoading } = useRealProgressData();

  if (diagnosticLoading || progressLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-700 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const readinessLevel = diagnosticMetrics?.readinessLevel || 0;
  const overallProgress = progressMetrics?.overallProgress || 0;
  const completedNodes = progressMetrics?.completedNodes || 0;
  const totalNodes = progressMetrics?.totalNodes || 1;

  const getReadinessColor = (level: number) => {
    if (level >= 80) return 'text-green-400';
    if (level >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getReadinessLabel = (level: number) => {
    if (level >= 80) return 'Excelente';
    if (level >= 60) return 'Bueno';
    if (level >= 40) return 'Regular';
    return 'Requiere Refuerzo';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Centro de Comando PAES</h1>
          <p className="text-slate-400">Sistema basado en datos reales de tu progreso</p>
        </div>
        <Badge variant="outline" className="text-cyan-400 border-cyan-400">
          <Brain className="w-4 h-4 mr-2" />
          Sistema Activo
        </Badge>
      </div>

      {/* MÃ©tricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm font-medium">PreparaciÃ³n PAES</p>
                  <p className={`text-2xl font-bold ${getReadinessColor(readinessLevel)}`}>
                    {readinessLevel}%
                  </p>
                  <p className="text-xs text-blue-300">
                    {getReadinessLabel(readinessLevel)}
                  </p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-200 text-sm font-medium">Progreso Global</p>
                  <p className="text-2xl font-bold text-white">{overallProgress}%</p>
                  <p className="text-xs text-green-300">
                    {completedNodes} de {totalNodes} nodos
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-200 text-sm font-medium">Velocidad</p>
                  <p className="text-2xl font-bold text-white">
                    {progressMetrics?.learningVelocity || 0}%
                  </p>
                  <p className="text-xs text-purple-300">Ritmo de aprendizaje</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-200 text-sm font-medium">Racha</p>
                  <p className="text-2xl font-bold text-white">
                    {progressMetrics?.streakDays || 0}
                  </p>
                  <p className="text-xs text-orange-300">dÃ­as consecutivos</p>
                </div>
                <Award className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Progreso por materia */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Progreso por Materia PAES
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {progressMetrics?.subjectProgress && Object.entries(progressMetrics.subjectProgress).map(([subject, progress]) => (
            <div key={subject} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">
                  {subject.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
                <span className="text-cyan-400 font-bold">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DiagnÃ³sticos disponibles */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            Sistema de DiagnÃ³stico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Tests Completados</p>
              <p className="text-2xl font-bold text-green-400">
                {diagnosticMetrics?.completedDiagnostics || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">Tests Disponibles</p>
              <p className="text-2xl font-bold text-blue-400">
                {diagnosticMetrics?.availableTests || 0}
              </p>
            </div>
            <div className="text-center p-4 bg-slate-700/50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">Puntaje Promedio</p>
              <p className="text-2xl font-bold text-purple-400">
                {diagnosticMetrics?.averageScore || 0}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

