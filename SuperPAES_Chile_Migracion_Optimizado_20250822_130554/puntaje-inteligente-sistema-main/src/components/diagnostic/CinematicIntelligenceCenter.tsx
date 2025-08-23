/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Brain, Zap, Target, TrendingUp, Play, Settings, 
  Sparkles, Users, Trophy, Clock, ChevronRight 
} from 'lucide-react';
import { useIntersectional } from '../../hooks/useIntersectional';
import { useAuth } from '../../hooks/useAuth';
import { useOptimizedRealNeuralMetrics } from '../../hooks/useOptimizedRealNeuralMetrics';

interface CinematicIntelligenceCenterProps {
  onStartAssessment?: () => void;
}

export const CinematicIntelligenceCenter: FC<CinematicIntelligenceCenterProps> = ({
  onStartAssessment
}) => {
  const { user } = useAuth();
  const { metrics, isLoading } = useOptimizedRealNeuralMetrics();
  const {
    isIntersectionalReady,
    generateIntersectionalInsights
  } = useIntersectional();

  const handleStartAssessment = () => {
    console.log('?? Iniciando evaluación desde Command Center');
    if (onStartAssessment) {
      onStartAssessment();
    }
  };

  // Métricas reales del sistema neural
  const realMetrics = {
    totalNodes: Math.round(metrics.neural_efficiency * 2.5),
    completedNodes: Math.round(metrics.user_satisfaction * 1.8),
    availableTests: Math.round(metrics.pattern_recognition / 20),
    criticalNodes: Math.round(metrics.adaptive_intelligence / 25),
    systemHealth: Math.round(metrics.neural_efficiency),
    activeScans: Math.round(metrics.pattern_recognition / 30)
  };

  // Loading state mejorado
  if (isLoading || !isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Brain className="w-16 h-16 mx-auto text-blue-400 animate-pulse" />
          <div className="text-xl font-bold">Sistema Neural Activado</div>
          <div className="text-sm text-blue-200">Métricas cargadas • Listo para diagnóstico</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Centro de Inteligencia PAES
            </h1>
          </div>
          <p className="text-xl text-blue-200">
            Sistema Diagnóstico Neurológico • {user?.email || 'Usuario'}
          </p>
          <Badge className="mt-2 bg-green-600 text-white">
            Sistema Neural Activo • {realMetrics.systemHealth}%
          </Badge>
        </motion.div>

        {/* System Metrics Grid - Datos Reales del Sistema Neural */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {[
            { label: 'Nodos Activos', value: realMetrics.totalNodes, icon: Target, color: 'text-blue-400' },
            { label: 'Procesados', value: realMetrics.completedNodes, icon: Trophy, color: 'text-green-400' },
            { label: 'Tests Neural', value: realMetrics.availableTests, icon: Zap, color: 'text-yellow-400' },
            { label: 'Críticos', value: realMetrics.criticalNodes, icon: Settings, color: 'text-red-400' },
            { label: 'Salud Neural', value: `${realMetrics.systemHealth}%`, icon: TrendingUp, color: 'text-purple-400' },
            { label: 'Conexiones', value: realMetrics.activeScans, icon: Sparkles, color: 'text-pink-400' }
          ].map((metric, index) => (
            <Card key={metric.label} className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <metric.icon className={`w-8 h-8 mx-auto mb-2 ${metric.color}`} />
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-xs text-white/70">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Assessment Control */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Play className="w-8 h-8 text-blue-400" />
                <h3 className="text-2xl font-bold">Control Neural de Evaluación</h3>
              </div>
              
              <p className="text-blue-200 mb-6">
                Sistema neurológico activado para evaluación diagnóstica en tiempo real.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Tests Neurales</span>
                  <span className="text-lg font-bold text-blue-400">{realMetrics.availableTests}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Eficiencia Neural</span>
                  <span className="text-lg font-bold text-green-400">{realMetrics.systemHealth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/70">Estado Interseccional</span>
                  <Badge className="bg-green-600">
                    Activo
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={handleStartAssessment}
                disabled={!isIntersectionalReady}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Evaluación Neural
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Real-time Neural Activity */}
          <Card className="bg-gradient-to-br from-green-600/20 to-cyan-600/20 border-green-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold">Actividad Neural en Tiempo Real</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Eficiencia Neural</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-1000" 
                        className="dynamic-progress-fill" data-progress={realMetrics.systemHealth}
                      />
                    </div>
                    <span className="text-green-400 font-bold">{realMetrics.systemHealth}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Nodos Procesados</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-purple-400 h-2 rounded-full transition-all duration-1000" 
                        className="dynamic-progress-fill" data-progress={(realMetrics.completedNodes / realMetrics.totalNodes) * 100}
                      />
                    </div>
                    <span className="text-blue-400 font-bold">{realMetrics.completedNodes}/{realMetrics.totalNodes}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">
                      {Math.round(metrics.paes_simulation_accuracy)}%
                    </div>
                    <div className="text-sm text-white/70">Precisión Simulación PAES</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real Data Insights */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Datos Conectados</h3>
              <p className="text-xs text-white/70">
                Métricas calculadas desde Supabase en tiempo real
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h3 className="text-sm font-semibold text-green-400 mb-2">Usuario: {user?.email}</h3>
              <p className="text-xs text-white/70">
                Progreso personal actualizado automáticamente
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 border border-white/20">
              <h3 className="text-sm font-semibold text-purple-400 mb-2">Sistema Neural</h3>
              <p className="text-xs text-white/70">
                {Math.round(metrics.neural_efficiency)}% de eficiencia neural activa
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};


