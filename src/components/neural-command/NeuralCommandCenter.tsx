
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Zap, Target, Settings, Users, Calendar,
  DollarSign, BookOpen, BarChart3, Gamepad2, Play
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';
import { DiagnosticIntelligenceCenter } from '@/components/diagnostic/DiagnosticIntelligenceCenter';

type NeuralDimension = 
  | 'neural_training' 
  | 'progress_analysis' 
  | 'battle_mode' 
  | 'vocational_prediction' 
  | 'universe_exploration'
  | 'calendar_management'
  | 'settings_control'
  | 'financial_center';

interface NeuralCommandCenterProps {
  initialDimension?: NeuralDimension;
}

export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = ({
  initialDimension = 'universe_exploration'
}) => {
  const { user } = useAuth();
  const [activeDimension, setActiveDimension] = useState<NeuralDimension>(initialDimension);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  
  const {
    isIntersectionalReady,
    neuralHealth,
    systemVitals,
    generateIntersectionalInsights
  } = useSimplifiedIntersectional();

  // Neural dimensions configuration
  const neuralDimensions = [
    {
      id: 'universe_exploration' as NeuralDimension,
      name: 'Universo PAES',
      description: 'Exploración 3D del universo educativo',
      icon: Target,
      color: 'from-blue-600 to-purple-600',
      metrics: Math.round(neuralHealth.neural_efficiency)
    },
    {
      id: 'neural_training' as NeuralDimension,
      name: 'Entrenamiento Neural',
      description: 'LectoGuía y ejercitación adaptativa',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
      metrics: Math.round(neuralHealth.adaptive_learning_score)
    },
    {
      id: 'progress_analysis' as NeuralDimension,
      name: 'Análisis de Progreso',
      description: 'Diagnósticos y métricas avanzadas',
      icon: BarChart3,
      color: 'from-green-600 to-teal-600',
      metrics: Math.round(neuralHealth.cross_pollination_rate)
    },
    {
      id: 'battle_mode' as NeuralDimension,
      name: 'Modo Batalla PAES',
      description: 'Simulaciones y evaluaciones',
      icon: Gamepad2,
      color: 'from-red-600 to-orange-600',
      metrics: Math.round(neuralHealth.user_experience_harmony)
    },
    {
      id: 'vocational_prediction' as NeuralDimension,
      name: 'Predicción Vocacional',
      description: 'Plan inteligente de futuro',
      icon: Target,
      color: 'from-indigo-600 to-blue-600',
      metrics: Math.round((neuralHealth.neural_efficiency + neuralHealth.adaptive_learning_score) / 2)
    },
    {
      id: 'calendar_management' as NeuralDimension,
      name: 'Gestión Temporal',
      description: 'Calendario inteligente PAES',
      icon: Calendar,
      color: 'from-cyan-600 to-blue-600',
      metrics: Math.round(systemVitals.cardiovascular.circulation)
    },
    {
      id: 'financial_center' as NeuralDimension,
      name: 'Centro Financiero',
      description: 'Gestión económica educativa',
      icon: DollarSign,
      color: 'from-emerald-600 to-green-600',
      metrics: Math.round(systemVitals.cardiovascular.oxygenation)
    },
    {
      id: 'settings_control' as NeuralDimension,
      name: 'Control Neural',
      description: 'Configuración y preferencias',
      icon: Settings,
      color: 'from-gray-600 to-slate-600',
      metrics: Math.round(systemVitals.respiratory.oxygenLevel)
    }
  ];

  const activeDimensionData = neuralDimensions.find(d => d.id === activeDimension);
  const insights = generateIntersectionalInsights();

  // Handle diagnostic activation
  const handleStartDiagnostic = () => {
    setShowDiagnostic(true);
  };

  // If diagnostic is active, show it
  if (showDiagnostic) {
    return (
      <DiagnosticIntelligenceCenter 
        onStartAssessment={() => {
          console.log('🎯 Iniciando evaluación desde Neural Command Center');
          // Here you would start the actual diagnostic flow
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Cosmic Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Neural Command Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Centro de Comando Neural PAES
            </h1>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-blue-200">
            Sistema Neural Unificado • {user?.email || 'Comandante Neural'}
          </p>
          <Badge className="mt-2 bg-green-600 text-white">
            {isIntersectionalReady ? 'Sistema Neural Activo' : 'Activando Neural...'}
          </Badge>
        </motion.div>

        {/* System Health Metrics */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-white">{Math.round(neuralHealth.neural_efficiency)}%</div>
              <div className="text-xs text-white/70">Eficiencia Neural</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold text-white">{Math.round(neuralHealth.adaptive_learning_score)}</div>
              <div className="text-xs text-white/70">Aprendizaje Adaptativo</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-white">{Math.round(neuralHealth.cross_pollination_rate)}</div>
              <div className="text-xs text-white/70">Cross-Pollination</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold text-white">{Math.round(neuralHealth.user_experience_harmony)}</div>
              <div className="text-xs text-white/70">Armonía UX</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Neural Dimensions Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {neuralDimensions.map((dimension, index) => {
            const Icon = dimension.icon;
            const isActive = activeDimension === dimension.id;
            
            return (
              <motion.div
                key={dimension.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    isActive 
                      ? 'bg-white/20 border-white/40 shadow-xl scale-105' 
                      : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                  } backdrop-blur-sm`}
                  onClick={() => setActiveDimension(dimension.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${dimension.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{dimension.metrics}%</div>
                        <div className="text-xs text-white/60">Neural</div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2">{dimension.name}</h3>
                    <p className="text-white/70 text-sm">{dimension.description}</p>
                    
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4"
                      >
                        <Button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white border-white/20"
                          onClick={() => {
                            if (dimension.id === 'progress_analysis') {
                              handleStartDiagnostic();
                            } else {
                              console.log(`🚀 Activando dimensión: ${dimension.name}`);
                            }
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Activar Dimensión
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Active Dimension Details */}
        {activeDimensionData && (
          <motion.div
            key={activeDimension}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <activeDimensionData.icon className="w-6 h-6" />
                  {activeDimensionData.name}
                  <Badge className={`bg-gradient-to-r ${activeDimensionData.color} text-white`}>
                    Activo
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Estado Neural</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Actividad Neural:</span>
                        <span className="text-white font-bold">{activeDimensionData.metrics}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Sistema Cardiovascular:</span>
                        <span className="text-green-400 font-bold">{systemVitals.cardiovascular.heartRate} BPM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Oxigenación:</span>
                        <span className="text-blue-400 font-bold">{systemVitals.cardiovascular.oxygenation}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Insights Neurales</h4>
                    <div className="space-y-2">
                      {insights.slice(0, 3).map((insight, index) => (
                        <div key={index} className="bg-white/10 rounded-lg p-3">
                          <div className="text-sm text-white/90">{insight.title}</div>
                          <div className="text-xs text-white/70">{insight.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Access Neural Commands */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-blue-200 text-sm mb-4">
            Centro de Comando Neural PAES • Sincronización Neural: Tiempo Real
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleStartDiagnostic}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Diagnóstico Neural
            </Button>
            <Button 
              onClick={() => setActiveDimension('neural_training')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              Entrenamiento
            </Button>
            <Button 
              onClick={() => setActiveDimension('universe_exploration')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Target className="w-4 h-4 mr-2" />
              Universo PAES
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
