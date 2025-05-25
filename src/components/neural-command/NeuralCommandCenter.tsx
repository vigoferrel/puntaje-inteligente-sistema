
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Zap, Target, Settings, Users, Calendar,
  DollarSign, BookOpen, BarChart3, Gamepad2, Play,
  Matrix, Sparkles, Globe, TrendingUp, Eye, Layers
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSimplifiedIntersectional } from '@/hooks/useSimplifiedIntersectional';
import { DiagnosticIntelligenceCenter } from '@/components/diagnostic/DiagnosticIntelligenceCenter';
import { CinematicFinancialCenter } from '@/components/financial-center/CinematicFinancialCenter';
import { PAESUniverseDashboard } from '@/components/paes-universe/PAESUniverseDashboard';

type NeuralDimension = 
  | 'neural_training' 
  | 'progress_analysis' 
  | 'battle_mode' 
  | 'vocational_prediction' 
  | 'universe_exploration'
  | 'calendar_management'
  | 'settings_control'
  | 'financial_center'
  | 'matrix_diagnostics'
  | 'intelligence_hub'
  | 'holographic_analytics'
  | 'educational_universe'
  | 'paes_universe';

interface NeuralCommandCenterProps {
  initialDimension?: NeuralDimension;
}

export const NeuralCommandCenter: React.FC<NeuralCommandCenterProps> = ({
  initialDimension = 'universe_exploration'
}) => {
  const { user } = useAuth();
  const [activeDimension, setActiveDimension] = useState<NeuralDimension>(initialDimension);
  const [showDimensionContent, setShowDimensionContent] = useState(false);
  
  const {
    isIntersectionalReady,
    neuralHealth,
    systemVitals,
    generateIntersectionalInsights
  } = useSimplifiedIntersectional();

  // Neural dimensions configuration with educational flow
  const neuralDimensions = [
    // Fase 1: Diagnóstico
    {
      id: 'matrix_diagnostics' as NeuralDimension,
      name: 'Matrix Diagnóstico',
      description: 'Sistema de evaluación neural avanzado',
      icon: Matrix,
      color: 'from-green-600 to-emerald-600',
      metrics: Math.round(neuralHealth.neural_efficiency),
      phase: 'Diagnóstico',
      order: 1
    },
    {
      id: 'intelligence_hub' as NeuralDimension,
      name: 'Centro de Inteligencia',
      description: 'Hub de análisis y procesamiento neural',
      icon: Eye,
      color: 'from-purple-600 to-violet-600',
      metrics: Math.round(neuralHealth.adaptive_learning_score),
      phase: 'Diagnóstico',
      order: 2
    },
    
    // Fase 2: Planificación
    {
      id: 'vocational_prediction' as NeuralDimension,
      name: 'Predicción Vocacional',
      description: 'Plan inteligente de futuro académico',
      icon: Target,
      color: 'from-indigo-600 to-blue-600',
      metrics: Math.round((neuralHealth.neural_efficiency + neuralHealth.adaptive_learning_score) / 2),
      phase: 'Planificación',
      order: 3
    },
    {
      id: 'financial_center' as NeuralDimension,
      name: 'Centro Financiero',
      description: 'Gestión económica educativa neural',
      icon: DollarSign,
      color: 'from-emerald-600 to-green-600',
      metrics: Math.round(systemVitals.cardiovascular.oxygenation),
      phase: 'Planificación',
      order: 4
    },
    
    // Fase 3: Práctica
    {
      id: 'neural_training' as NeuralDimension,
      name: 'Entrenamiento Neural',
      description: 'LectoGuía y ejercitación adaptativa',
      icon: Brain,
      color: 'from-purple-600 to-pink-600',
      metrics: Math.round(neuralHealth.adaptive_learning_score),
      phase: 'Práctica',
      order: 5
    },
    {
      id: 'educational_universe' as NeuralDimension,
      name: 'Universo Educativo',
      description: 'Exploración 3D del conocimiento',
      icon: Globe,
      color: 'from-cyan-600 to-blue-600',
      metrics: Math.round(neuralHealth.cross_pollination_rate),
      phase: 'Práctica',
      order: 6
    },
    
    // Fase 4: Evaluación
    {
      id: 'battle_mode' as NeuralDimension,
      name: 'Modo Batalla PAES',
      description: 'Simulaciones y evaluaciones reales',
      icon: Gamepad2,
      color: 'from-red-600 to-orange-600',
      metrics: Math.round(neuralHealth.user_experience_harmony),
      phase: 'Evaluación',
      order: 7
    },
    {
      id: 'paes_universe' as NeuralDimension,
      name: 'Universo PAES',
      description: 'Exploración completa del ecosistema PAES',
      icon: Sparkles,
      color: 'from-blue-600 to-purple-600',
      metrics: Math.round(neuralHealth.neural_efficiency),
      phase: 'Evaluación',
      order: 8
    },
    
    // Fase 5: Análisis
    {
      id: 'progress_analysis' as NeuralDimension,
      name: 'Análisis de Progreso',
      description: 'Métricas neurales en tiempo real',
      icon: BarChart3,
      color: 'from-green-600 to-teal-600',
      metrics: Math.round(neuralHealth.cross_pollination_rate),
      phase: 'Análisis',
      order: 9
    },
    {
      id: 'holographic_analytics' as NeuralDimension,
      name: 'Análisis Holográfico',
      description: 'Visualización avanzada de datos neurales',
      icon: Layers,
      color: 'from-violet-600 to-purple-600',
      metrics: Math.round(systemVitals.respiratory.oxygenLevel),
      phase: 'Análisis',
      order: 10
    },
    
    // Fase 6: Gestión
    {
      id: 'calendar_management' as NeuralDimension,
      name: 'Gestión Temporal',
      description: 'Calendario inteligente neural',
      icon: Calendar,
      color: 'from-cyan-600 to-blue-600',
      metrics: Math.round(systemVitals.cardiovascular.circulation),
      phase: 'Gestión',
      order: 11
    },
    {
      id: 'settings_control' as NeuralDimension,
      name: 'Control Neural',
      description: 'Configuración del ecosistema',
      icon: Settings,
      color: 'from-gray-600 to-slate-600',
      metrics: Math.round(systemVitals.respiratory.oxygenLevel),
      phase: 'Gestión',
      order: 12
    }
  ];

  const activeDimensionData = neuralDimensions.find(d => d.id === activeDimension);
  const insights = generateIntersectionalInsights();

  // Group dimensions by phase
  const dimensionsByPhase = neuralDimensions.reduce((acc, dimension) => {
    if (!acc[dimension.phase]) {
      acc[dimension.phase] = [];
    }
    acc[dimension.phase].push(dimension);
    return acc;
  }, {} as Record<string, typeof neuralDimensions>);

  // Handle dimension activation
  const handleDimensionActivation = (dimensionId: NeuralDimension) => {
    setActiveDimension(dimensionId);
    setShowDimensionContent(true);
    console.log(`🚀 Activando dimensión neural: ${dimensionId}`);
  };

  // Render dimension content
  const renderDimensionContent = () => {
    switch (activeDimension) {
      case 'intelligence_hub':
        return (
          <DiagnosticIntelligenceCenter 
            onStartAssessment={() => {
              console.log('🎯 Iniciando evaluación desde Intelligence Hub');
            }}
          />
        );
      
      case 'financial_center':
        return <CinematicFinancialCenter />;
      
      case 'paes_universe':
        return <PAESUniverseDashboard />;
      
      case 'matrix_diagnostics':
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Matrix className="w-8 h-8 text-green-400" />
                <h2 className="text-3xl font-bold text-green-400">Matrix Diagnóstico Neural</h2>
              </div>
              <p className="text-white/70 max-w-2xl mx-auto">
                Sistema avanzado de evaluación neural que analiza patrones de aprendizaje 
                y genera diagnósticos precisos de habilidades cognitivas.
              </p>
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {Math.round(neuralHealth.neural_efficiency)}%
                    </div>
                    <div className="text-green-300">Eficiencia Neural</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {Math.round(neuralHealth.adaptive_learning_score)}
                    </div>
                    <div className="text-blue-300">Aprendizaje Adaptativo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400 mb-2">
                      {Math.round(neuralHealth.cross_pollination_rate)}%
                    </div>
                    <div className="text-purple-300">Cross-Pollination</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <div className="flex items-center justify-center space-x-3 mb-6">
                {activeDimensionData && <activeDimensionData.icon className="w-8 h-8 text-white" />}
                <h2 className="text-3xl font-bold text-white">
                  {activeDimensionData?.name || 'Dimensión Neural'}
                </h2>
              </div>
              <p className="text-white/70 max-w-2xl mx-auto">
                {activeDimensionData?.description || 'Dimensión neural en desarrollo'}
              </p>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-4xl mx-auto">
                <p className="text-white/60">
                  Dimensión neural lista para integración completa
                </p>
              </div>
            </motion.div>
          </div>
        );
    }
  };

  // If dimension content is active, show it
  if (showDimensionContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Back button */}
        <div className="absolute top-4 left-4 z-50">
          <Button
            onClick={() => setShowDimensionContent(false)}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            ← Volver al Centro Neural
          </Button>
        </div>
        
        {renderDimensionContent()}
      </div>
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
          <p className="text-xl text-blue-200 mb-4">
            Ecosistema Neural Unificado • {user?.email || 'Comandante Neural'}
          </p>
          <Badge className="bg-green-600 text-white">
            {isIntersectionalReady ? 'Todas las Dimensiones Conectadas' : 'Activando Neural...'}
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

        {/* Educational Flow Phases */}
        <div className="space-y-8">
          {Object.entries(dimensionsByPhase).map(([phase, dimensions], phaseIndex) => (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: phaseIndex * 0.1 }}
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {phase} Neural
                </h3>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-full opacity-30" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {dimensions.map((dimension, index) => {
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
                        onClick={() => handleDimensionActivation(dimension.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-r ${dimension.color} group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-white">{dimension.metrics}%</div>
                              <div className="text-xs text-white/60">Neural</div>
                            </div>
                          </div>
                          
                          <h4 className="text-lg font-bold text-white mb-2">{dimension.name}</h4>
                          <p className="text-white/70 text-sm mb-4">{dimension.description}</p>
                          
                          <Button 
                            className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDimensionActivation(dimension.id);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Activar Dimensión
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Neural Insights */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Insights del Ecosistema Neural
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {insights.slice(0, 3).map((insight, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm font-medium text-white mb-1">{insight.title}</div>
                    <div className="text-xs text-white/70">{insight.description}</div>
                    <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                      insight.level === 'excellent' ? 'bg-green-500/20 text-green-400' :
                      insight.level === 'good' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {insight.level === 'excellent' ? 'Excelente' :
                       insight.level === 'good' ? 'Bien' : 'Mejorable'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Neural Command Footer */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <p className="text-blue-200 text-sm mb-4">
            Ecosistema Neural PAES Unificado • {neuralDimensions.length} Dimensiones Activas • Sincronización Neural: Tiempo Real
          </p>
          <div className="text-xs text-white/50">
            🧠 Arquitectura Neural Optimizada • 🚀 Flujo Educativo Integrado • ⚡ Cero Duplicación de Trabajo
          </div>
        </motion.div>
      </div>
    </div>
  );
};
