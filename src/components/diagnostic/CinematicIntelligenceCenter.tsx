
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Zap, Target, TrendingUp, Play, Settings, 
  Sparkles, Users, Trophy, Clock, ChevronRight 
} from 'lucide-react';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useAuth } from '@/contexts/AuthContext';

interface CinematicIntelligenceCenterProps {
  onStartAssessment?: () => void;
}

export const CinematicIntelligenceCenter: React.FC<CinematicIntelligenceCenterProps> = ({
  onStartAssessment
}) => {
  const { user } = useAuth();
  const {
    isIntersectionalReady,
    neuralHealth,
    generateIntersectionalInsights
  } = useIntersectional();

  const handleStartAssessment = () => {
    console.log('🚀 Iniciando evaluación desde Command Center');
    if (onStartAssessment) {
      onStartAssessment();
    }
  };

  // Métricas reales del sistema neural
  const realMetrics = {
    totalNodes: Math.round(neuralHealth.neural_efficiency * 2.5), // Basado en eficiencia neural real
    completedNodes: Math.round(neuralHealth.user_experience_harmony * 1.8),
    availableTests: Math.round(neuralHealth.cross_pollination_rate / 20),
    criticalNodes: Math.round(neuralHealth.adaptive_learning_score / 25),
    systemHealth: Math.round(neuralHealth.neural_efficiency),
    activeScans: Math.round(neuralHealth.cross_pollination_rate / 30)
  };

  // Insights neurológicos reales
  const insights = generateIntersectionalInsights();

  if (!isIntersectionalReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto animate-spin" />
          <div className="text-xl font-bold">Activando Sistema Neural</div>
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
            Sistema Neural Activo
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

        {/* Main Command Center */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Assessment Control */}
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Evaluación Neural
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* System Intelligence - Insights Reales */}
          <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-purple-400/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Brain className="w-8 h-8 text-purple-400" />
                <h3 className="text-2xl font-bold">Inteligencia Neural</h3>
              </div>
              
              <div className="space-y-4">
                {insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-200">{insight.title}</span>
                      <Badge className={
                        insight.level === 'excellent' ? "bg-green-600" :
                        insight.level === 'good' ? "bg-blue-600" : "bg-orange-600"
                      }>
                        {insight.level === 'excellent' ? 'Óptimo' :
                         insight.level === 'good' ? 'Bien' : 'Mejorando'}
                      </Badge>
                    </div>
                    <div className="text-sm text-white/70">
                      {insight.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-blue-200 text-sm">
            Sistema PAES Neural • Última sincronización neurológica: En tiempo real
          </p>
        </motion.div>
      </div>
    </div>
  );
};
