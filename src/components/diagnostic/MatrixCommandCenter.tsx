
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChartBar, 
  TrendingUp, 
  Brain, 
  Target, 
  Zap, 
  Shield,
  Activity,
  Cpu,
  Eye
} from 'lucide-react';
import { TPAESPrueba, getPruebaDisplayName } from '@/types/system-types';
import { PAESTest } from '@/types/unified-diagnostic';

interface MatrixCommandCenterProps {
  tests: PAESTest[];
  skills: any[];
  baselineScores: Record<TPAESPrueba, number> | null;
  currentScores: Record<TPAESPrueba, number> | null;
  progressTrends: any[];
  skillAnalysis: any;
  personalizedStrategies: any[];
  predictedScores: Record<TPAESPrueba, number> | null;
  systemMetrics: any;
  onScheduleAssessment: () => void;
  onGenerateExercises: (prueba: TPAESPrueba) => void;
}

export const MatrixCommandCenter: React.FC<MatrixCommandCenterProps> = ({
  tests,
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
  const [activeTerminal, setActiveTerminal] = useState<'overview' | 'analysis' | 'predictions' | 'combat'>('overview');
  const [matrixCode, setMatrixCode] = useState<string[]>([]);

  // Generar efecto Matrix
  useEffect(() => {
    const generateMatrixCode = () => {
      const chars = '01アカサタナハマヤラワガザダバパ';
      const newCode = Array.from({ length: 50 }, () => 
        chars[Math.floor(Math.random() * chars.length)]
      );
      setMatrixCode(newCode);
    };

    const interval = setInterval(generateMatrixCode, 200);
    return () => clearInterval(interval);
  }, []);

  const terminalScreens = [
    {
      id: 'overview',
      title: 'SISTEMA GENERAL',
      icon: ChartBar,
      color: 'blue',
      data: systemMetrics
    },
    {
      id: 'analysis',
      title: 'ANÁLISIS NEURAL',
      icon: Brain,
      color: 'purple',
      data: skillAnalysis
    },
    {
      id: 'predictions',
      title: 'PREDICCIONES IA',
      icon: Target,
      color: 'green',
      data: predictedScores
    },
    {
      id: 'combat',
      title: 'MODO COMBATE',
      icon: Zap,
      color: 'red',
      data: personalizedStrategies
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 p-6"
    >
      {/* Efecto Matrix de fondo */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 flex flex-wrap">
          {matrixCode.map((char, i) => (
            <motion.span
              key={i}
              className="text-green-400 font-mono text-xs"
              style={{
                position: 'absolute',
                left: `${(i % 50) * 2}%`,
                top: `${Math.floor(i / 50) * 5}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Header del centro de comando */}
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <Card className="bg-black/60 backdrop-blur-lg border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-green-400 font-mono tracking-wider">
                  MATRIX COMMAND CENTER
                </h1>
                <p className="text-green-300/80 font-mono">
                  &gt; Sistema de control neuronal activo
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-mono">ONLINE</span>
                </div>
                <Badge className="bg-green-600/20 text-green-400 border-green-400/50">
                  NIVEL MÁXIMO
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selector de terminales */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {terminalScreens.map(({ id, title, icon: Icon, color }) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={activeTerminal === id ? "default" : "outline"}
              onClick={() => setActiveTerminal(id as any)}
              className={`w-full h-20 p-4 font-mono ${
                activeTerminal === id
                  ? `bg-${color}-600/30 border-${color}-400 text-${color}-300`
                  : `border-${color}-400/30 hover:bg-${color}-600/10`
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <Icon className="w-6 h-6" />
                <span className="text-xs">{title}</span>
              </div>
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Pantallas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Terminal principal */}
        <div className="lg:col-span-2">
          <Card className="bg-black/80 backdrop-blur-lg border-green-500/50 min-h-[600px]">
            <CardHeader>
              <CardTitle className="text-green-400 font-mono flex items-center">
                <Cpu className="w-5 h-5 mr-2" />
                TERMINAL_{activeTerminal.toUpperCase()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {activeTerminal === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600/20 p-4 rounded border border-blue-400/30">
                      <div className="text-2xl font-bold text-blue-400 font-mono">
                        {systemMetrics?.completedNodes || 0}
                      </div>
                      <div className="text-blue-300 text-sm">NODOS COMPLETADOS</div>
                    </div>
                    <div className="bg-purple-600/20 p-4 rounded border border-purple-400/30">
                      <div className="text-2xl font-bold text-purple-400 font-mono">
                        +{systemMetrics?.overallProgress || 0}%
                      </div>
                      <div className="text-purple-300 text-sm">MEJORA NEURAL</div>
                    </div>
                  </div>

                  {/* Gráfico de progreso por materia */}
                  <div className="space-y-4">
                    <h3 className="text-green-400 font-mono">ANÁLISIS POR MATERIA:</h3>
                    {tests.map((test) => {
                      const prueba = test.code as TPAESPrueba;
                      const baseline = baselineScores?.[prueba] || 0;
                      const current = currentScores?.[prueba] || 0;
                      const improvement = current - baseline;
                      
                      return (
                        <div key={test.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-green-300 font-mono">
                              {getPruebaDisplayName(prueba)}
                            </span>
                            <span className="text-green-400 font-mono">
                              {current} ({improvement > 0 ? '+' : ''}{improvement})
                            </span>
                          </div>
                          <Progress 
                            value={(current / 850) * 100} 
                            className="h-2 bg-gray-800"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTerminal === 'analysis' && (
                <div className="space-y-4">
                  <div className="text-green-400 font-mono text-sm">
                    &gt; Ejecutando análisis neuronal profundo...
                  </div>
                  <div className="space-y-3">
                    {skillAnalysis && Object.entries(skillAnalysis).slice(0, 8).map(([skill, data]: [string, any]) => (
                      <div key={skill} className="flex items-center justify-between p-3 bg-gray-800/50 rounded border border-gray-600/30">
                        <span className="text-gray-300 font-mono text-sm">{skill}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={data.accuracy_rate * 100} className="w-20 h-1" />
                          <span className="text-green-400 font-mono text-xs">
                            {Math.round(data.accuracy_rate * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTerminal === 'predictions' && (
                <div className="space-y-4">
                  <div className="text-green-400 font-mono text-sm">
                    &gt; Calculando predicciones con IA avanzada...
                  </div>
                  {predictedScores && (
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(predictedScores).map(([prueba, score]) => (
                        <div key={prueba} className="p-4 bg-green-600/10 rounded border border-green-400/30">
                          <div className="flex justify-between items-center">
                            <span className="text-green-300 font-mono">
                              {getPruebaDisplayName(prueba as TPAESPrueba)}
                            </span>
                            <span className="text-2xl font-bold text-green-400 font-mono">
                              {Math.round(score)}
                            </span>
                          </div>
                          <div className="text-xs text-green-500 mt-2">
                            Predicción para próximo examen
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTerminal === 'combat' && (
                <div className="space-y-4">
                  <div className="text-red-400 font-mono text-sm">
                    &gt; Preparando arsenal de ejercicios...
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {tests.map((test) => (
                      <motion.div
                        key={test.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-red-600/10 rounded border border-red-400/30 cursor-pointer"
                        onClick={() => onGenerateExercises(test.code as TPAESPrueba)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-red-300 font-mono font-bold">
                              COMBATE: {getPruebaDisplayName(test.code as TPAESPrueba)}
                            </div>
                            <div className="text-red-500 text-xs">
                              Click para iniciar sesión de entrenamiento
                            </div>
                          </div>
                          <Zap className="w-6 h-6 text-red-400" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral de control */}
        <div className="space-y-6">
          {/* Estado del sistema */}
          <Card className="bg-black/80 backdrop-blur-lg border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-blue-400 font-mono text-sm">
                ESTADO SISTEMA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">CPU Neural:</span>
                  <span className="text-blue-400 font-mono text-xs">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Memoria IA:</span>
                  <span className="text-green-400 font-mono text-xs">ÓPTIMA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">Conexión PAES:</span>
                  <span className="text-green-400 font-mono text-xs">ACTIVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-xs">LectoGuía:</span>
                  <span className="text-green-400 font-mono text-xs">ONLINE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones rápidas */}
          <Card className="bg-black/80 backdrop-blur-lg border-purple-500/50">
            <CardHeader>
              <CardTitle className="text-purple-400 font-mono text-sm">
                ACCIONES RÁPIDAS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={onScheduleAssessment}
                className="w-full bg-purple-600/20 hover:bg-purple-600/40 border border-purple-400/50 text-purple-300 font-mono"
              >
                <Brain className="w-4 h-4 mr-2" />
                DIAGNÓSTICO
              </Button>
              <Button 
                className="w-full bg-green-600/20 hover:bg-green-600/40 border border-green-400/50 text-green-300 font-mono"
              >
                <Eye className="w-4 h-4 mr-2" />
                ESCANEAR
              </Button>
              <Button 
                className="w-full bg-orange-600/20 hover:bg-orange-600/40 border border-orange-400/50 text-orange-300 font-mono"
              >
                <Shield className="w-4 h-4 mr-2" />
                BACKUP
              </Button>
            </CardContent>
          </Card>

          {/* Log del sistema */}
          <Card className="bg-black/80 backdrop-blur-lg border-gray-500/50">
            <CardHeader>
              <CardTitle className="text-gray-400 font-mono text-sm">
                SISTEMA LOG
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs font-mono">
                <div className="text-green-400">&gt; Sistema iniciado</div>
                <div className="text-blue-400">&gt; IA conectada</div>
                <div className="text-yellow-400">&gt; Datos sincronizados</div>
                <div className="text-green-400">&gt; Listo para combate</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
