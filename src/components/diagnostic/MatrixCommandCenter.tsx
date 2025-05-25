
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChartBar, 
  TrendingUp, 
  Target, 
  Zap, 
  Brain,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface MatrixCommandCenterProps {
  tests: any[];
  skills: any[];
  baselineScores: any;
  currentScores: any;
  progressTrends: any[];
  skillAnalysis: any;
  personalizedStrategies: any[];
  predictedScores: any;
  systemMetrics: any;
  onScheduleAssessment: () => void;
  onGenerateExercises: (prueba: string) => void;
}

export const MatrixCommandCenter: React.FC<MatrixCommandCenterProps> = ({
  tests,
  skills,
  baselineScores,
  currentScores,
  progressTrends,
  skillAnalysis,
  personalizedStrategies,
  predictedScores,
  systemMetrics,
  onScheduleAssessment,
  onGenerateExercises
}) => {
  const [activePanel, setActivePanel] = useState<'overview' | 'strategies' | 'analytics'>('overview');
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL');

  // Calculate key metrics
  const overallImprovement = React.useMemo(() => {
    if (!baselineScores || !currentScores) return 0;
    const baseline = Object.values(baselineScores).reduce((a: number, b: number) => a + b, 0) / Object.values(baselineScores).length;
    const current = Object.values(currentScores).reduce((a: number, b: number) => a + b, 0) / Object.values(currentScores).length;
    return Math.round(current - baseline);
  }, [baselineScores, currentScores]);

  const criticalAreas = React.useMemo(() => {
    if (!currentScores) return [];
    return Object.entries(currentScores)
      .filter(([_, score]) => (score as number) < 400)
      .sort(([_, a], [__, b]) => (a as number) - (b as number));
  }, [currentScores]);

  const strongAreas = React.useMemo(() => {
    if (!currentScores) return [];
    return Object.entries(currentScores)
      .filter(([_, score]) => (score as number) > 600)
      .sort(([_, a], [__, b]) => (b as number) - (a as number));
  }, [currentScores]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black p-6"
    >
      {/* Command Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6"
      >
        <Card className="bg-black/80 backdrop-blur-lg border-blue-500/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <ChartBar className="w-10 h-10 text-blue-400" />
                <div>
                  <h1 className="text-3xl font-bold text-white">Centro de Comando</h1>
                  <p className="text-blue-300">Sistema de Inteligencia Diagnóstica PAES Pro</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge className={`${
                  systemStatus === 'OPERATIONAL' 
                    ? 'bg-green-600/20 text-green-400 border-green-400/50' 
                    : 'bg-red-600/20 text-red-400 border-red-400/50'
                }`}>
                  <Activity className="w-3 h-3 mr-1" />
                  {systemStatus}
                </Badge>
                <div className="text-blue-300 text-sm">
                  Nodos Activos: {systemMetrics?.completedNodes || 0}/{systemMetrics?.totalNodes || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Panel Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2 bg-black/50 rounded-lg p-2">
          {[
            { key: 'overview', label: 'Vista General', icon: Target },
            { key: 'strategies', label: 'Estrategias', icon: Brain },
            { key: 'analytics', label: 'Análisis', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={activePanel === key ? "default" : "ghost"}
              onClick={() => setActivePanel(key as any)}
              className={`${
                activePanel === key 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-300 hover:bg-blue-600/20'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Dynamic Panel Content */}
      <AnimatePresence mode="wait">
        {activePanel === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Performance Overview */}
            <Card className="bg-black/60 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Rendimiento General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {overallImprovement > 0 ? '+' : ''}{overallImprovement}
                  </div>
                  <div className="text-blue-300 text-sm">Puntos de mejora</div>
                </div>
                
                {currentScores && Object.entries(currentScores).map(([prueba, score]) => (
                  <div key={prueba} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{prueba}</span>
                      <span className="text-white font-mono">{score}</span>
                    </div>
                    <Progress 
                      value={(score as number) / 8.5} 
                      className="h-2"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Critical Areas */}
            <Card className="bg-black/60 backdrop-blur-sm border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Áreas Críticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {criticalAreas.length > 0 ? (
                  criticalAreas.map(([prueba, score]) => (
                    <div key={prueba} className="flex items-center justify-between p-3 bg-red-900/20 rounded border border-red-500/30">
                      <div>
                        <div className="text-red-300 font-semibold">{prueba}</div>
                        <div className="text-red-200 text-sm">Requiere atención inmediata</div>
                      </div>
                      <div className="text-red-400 font-mono text-lg">{score}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-green-400">No hay áreas críticas</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Strong Areas */}
            <Card className="bg-black/60 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Fortalezas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {strongAreas.length > 0 ? (
                  strongAreas.map(([prueba, score]) => (
                    <div key={prueba} className="flex items-center justify-between p-3 bg-green-900/20 rounded border border-green-500/30">
                      <div>
                        <div className="text-green-300 font-semibold">{prueba}</div>
                        <div className="text-green-200 text-sm">Rendimiento sobresaliente</div>
                      </div>
                      <div className="text-green-400 font-mono text-lg">{score}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <Target className="w-8 h-8 mx-auto mb-2" />
                    <div>Desarrollando fortalezas</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activePanel === 'strategies' && (
          <motion.div
            key="strategies"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {personalizedStrategies.length > 0 ? (
              personalizedStrategies.map((strategy, index) => (
                <Card key={index} className="bg-black/60 backdrop-blur-sm border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-400 flex items-center justify-between">
                      <div className="flex items-center">
                        <Brain className="w-5 h-5 mr-2" />
                        Estrategia: {strategy.area}
                      </div>
                      <Badge className={`${
                        strategy.priority === 'high' 
                          ? 'bg-red-600/20 text-red-400 border-red-400/50'
                          : strategy.priority === 'medium'
                          ? 'bg-yellow-600/20 text-yellow-400 border-yellow-400/50'
                          : 'bg-green-600/20 text-green-400 border-green-400/50'
                      }`}>
                        {strategy.priority.toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300">{strategy.strategy}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-white font-semibold mb-2">Ejercicios Recomendados</h4>
                        {strategy.exercises.map((exercise: any, idx: number) => (
                          <div key={idx} className="text-sm text-gray-400 mb-1">
                            • {exercise.type} ({exercise.difficulty}) - {exercise.estimated_time}min
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-2">Mejora Estimada</h4>
                        <div className="text-2xl font-bold text-green-400">
                          +{strategy.estimated_improvement} puntos
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => onGenerateExercises(strategy.area)}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Generar Ejercicios
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-black/60 backdrop-blur-sm border-gray-500/30">
                <CardContent className="py-12 text-center">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl text-white mb-2">Generando Estrategias</h3>
                  <p className="text-gray-400 mb-4">
                    Analizando tu rendimiento para crear estrategias personalizadas
                  </p>
                  <Button onClick={onScheduleAssessment} className="bg-blue-600 hover:bg-blue-700">
                    <Clock className="w-4 h-4 mr-2" />
                    Realizar Evaluación
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activePanel === 'analytics' && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Progress Trends */}
            <Card className="bg-black/60 backdrop-blur-sm border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Tendencias de Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressTrends.slice(0, 5).map((trend, index) => (
                    <div key={index} className="border-b border-gray-700 pb-2">
                      <div className="text-sm text-gray-400 mb-1">
                        {new Date(trend.date).toLocaleDateString()}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white">Promedio General</span>
                        <span className="text-blue-400 font-mono">
                          {Math.round(Object.values(trend.scores).reduce((a: number, b: number) => a + b, 0) / Object.values(trend.scores).length)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictions */}
            <Card className="bg-black/60 backdrop-blur-sm border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Predicciones IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                {predictedScores ? (
                  <div className="space-y-3">
                    {Object.entries(predictedScores).map(([prueba, score]) => (
                      <div key={prueba} className="flex justify-between items-center">
                        <span className="text-gray-300">{prueba}</span>
                        <div className="text-right">
                          <div className="text-green-400 font-mono">{Math.round(score as number)}</div>
                          <div className="text-xs text-gray-400">proyectado</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <Brain className="w-12 h-12 mx-auto mb-2" />
                    <div>IA calculando predicciones...</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Panel */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-6 left-6 right-6 z-20"
      >
        <Card className="bg-black/80 backdrop-blur-lg border-blue-500/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-blue-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Sistema Operacional</span>
                </div>
                <div>Tests Disponibles: {tests.length}</div>
                <div>Skills Mapeadas: {skills.length}</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onScheduleAssessment}
                  className="border-blue-400/50 text-blue-400 hover:bg-blue-400/10"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Nueva Evaluación
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Exportar Datos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
