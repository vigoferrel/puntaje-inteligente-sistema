
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Environment } from '@react-three/drei';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  ChartBar,
  Cpu,
  Atom,
  Shield,
  Rocket,
  Eye,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUnifiedDiagnostic } from '@/hooks/diagnostic/use-unified-diagnostic';
import { useLectoGuia } from '@/contexts/LectoGuiaContext';
import { useAuth } from '@/contexts/AuthContext';
import { QuantumPortal } from './QuantumPortal';
import { HolographicMetrics } from './HolographicMetrics';
import { MatrixCommandCenter } from './MatrixCommandCenter';
import { IntelligentAssistant } from './IntelligentAssistant';
import { CombatArena } from './CombatArena';
import { TPAESPrueba } from '@/types/system-types';

export const CinematicIntelligenceCenter: React.FC = () => {
  const { user } = useAuth();
  const {
    data,
    isLoading,
    tests,
    skills,
    baselineScores,
    currentScores,
    progressTrends,
    skillAnalysis,
    personalizedStrategies,
    predictedScores,
    needsInitialAssessment,
    performInitialAssessment,
    scheduleProgressAssessment,
    generatePersonalizedExercises
  } = useUnifiedDiagnostic();

  const { sendMessage: askLectoGuia } = useLectoGuia();
  
  const [activeMode, setActiveMode] = useState<'portal' | 'command' | 'combat' | 'matrix'>('portal');
  const [systemPower, setSystemPower] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [assistantActive, setAssistantActive] = useState(false);

  // Efectos de inicialización épicos
  useEffect(() => {
    const initSequence = async () => {
      // Secuencia de encendido del sistema
      for (let i = 0; i <= 100; i += 2) {
        setSystemPower(i);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Escaneo neural simulado
      for (let i = 0; i <= 100; i += 3) {
        setScanProgress(i);
        await new Promise(resolve => setTimeout(resolve, 40));
      }
      
      // Activar asistente IA
      setTimeout(() => setAssistantActive(true), 1000);
    };

    if (!isLoading && data) {
      initSequence();
    }
  }, [isLoading, data]);

  // Calcular métricas del sistema
  const systemMetrics = React.useMemo(() => {
    if (!currentScores || !baselineScores) return null;

    const overallProgress = Object.keys(currentScores).reduce((total, prueba) => {
      const improvement = currentScores[prueba as TPAESPrueba] - baselineScores[prueba as TPAESPrueba];
      return total + improvement;
    }, 0) / Object.keys(currentScores).length;

    const strongestArea = Object.entries(currentScores).reduce((max, [prueba, score]) => 
      score > max.score ? { prueba: prueba as TPAESPrueba, score } : max, 
      { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, score: 0 }
    );

    const weakestArea = Object.entries(currentScores).reduce((min, [prueba, score]) => 
      score < min.score ? { prueba: prueba as TPAESPrueba, score } : min, 
      { prueba: 'COMPETENCIA_LECTORA' as TPAESPrueba, score: 850 }
    );

    return {
      overallProgress: Math.round(overallProgress),
      strongestArea,
      weakestArea,
      totalNodes: tests.length * 10, // Simulado
      completedNodes: Math.round(tests.length * 6), // Simulado
      aiPrediction: predictedScores ? Math.round(Object.values(predictedScores).reduce((a, b) => a + b, 0) / Object.values(predictedScores).length) : 0
    };
  }, [currentScores, baselineScores, tests, predictedScores]);

  if (isLoading || systemPower < 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234F46E5" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Secuencia de carga */}
        <div className="text-center z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative">
              <Brain className="w-24 h-24 text-blue-400 mx-auto animate-pulse" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-white mb-6 tracking-wider"
          >
            CENTRO DE INTELIGENCIA DIAGNÓSTICA
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            <div className="text-blue-300 text-lg">
              Inicializando sistemas neurales...
            </div>
            
            <div className="w-80 mx-auto bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${systemPower}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="text-sm text-gray-400">
              {systemPower < 30 && "Conectando con base de datos PAES..."}
              {systemPower >= 30 && systemPower < 60 && "Analizando perfil de estudiante..."}
              {systemPower >= 60 && systemPower < 90 && "Inicializando IA personalizada..."}
              {systemPower >= 90 && "Cargando universo de aprendizaje..."}
            </div>

            {systemPower >= 90 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-400 text-sm"
              >
                ✓ Sistema listo para combate académico
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (needsInitialAssessment) {
    return (
      <QuantumPortal
        onEnterDiagnostic={performInitialAssessment}
        userProfile={user}
        systemMetrics={systemMetrics}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Fondo Matrix animado */}
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* Header de estado del sistema */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 p-4"
      >
        <Card className="bg-black/40 backdrop-blur-lg border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-mono">SISTEMA ACTIVO</span>
                </div>
                <div className="text-white">
                  Usuario: <span className="text-blue-300">{user?.email}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="border-green-400 text-green-400">
                  {systemMetrics?.completedNodes}/{systemMetrics?.totalNodes} Nodos
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-400">
                  IA Predicción: {systemMetrics?.aiPrediction}
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-400">
                  Progreso: +{systemMetrics?.overallProgress}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selector de modo */}
      <div className="relative z-10 px-4 mb-6">
        <div className="flex justify-center space-x-4">
          {[
            { mode: 'command', icon: ChartBar, label: 'Centro de Comando', color: 'blue' },
            { mode: 'combat', icon: Zap, label: 'Arena de Combate', color: 'red' },
            { mode: 'matrix', icon: Cpu, label: 'Modo Matrix', color: 'green' },
          ].map(({ mode, icon: Icon, label, color }) => (
            <Button
              key={mode}
              variant={activeMode === mode ? "default" : "outline"}
              onClick={() => setActiveMode(mode as any)}
              className={`holographic-button ${
                activeMode === mode 
                  ? `bg-${color}-600 border-${color}-400` 
                  : `border-${color}-400/50 hover:bg-${color}-600/20`
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Contenido principal basado en el modo */}
      <AnimatePresence mode="wait">
        {activeMode === 'command' && (
          <MatrixCommandCenter
            key="command"
            tests={tests}
            skills={skills}
            baselineScores={baselineScores}
            currentScores={currentScores}
            progressTrends={progressTrends}
            skillAnalysis={skillAnalysis}
            personalizedStrategies={personalizedStrategies}
            predictedScores={predictedScores}
            systemMetrics={systemMetrics}
            onScheduleAssessment={scheduleProgressAssessment}
            onGenerateExercises={generatePersonalizedExercises}
          />
        )}

        {activeMode === 'combat' && (
          <CombatArena
            key="combat"
            tests={tests}
            currentScores={currentScores}
            onStartCombat={generatePersonalizedExercises}
            onViewProgress={() => setActiveMode('command')}
          />
        )}

        {activeMode === 'matrix' && (
          <HolographicMetrics
            key="matrix"
            data={data}
            systemMetrics={systemMetrics}
            onExitMatrix={() => setActiveMode('command')}
          />
        )}
      </AnimatePresence>

      {/* Asistente IA flotante */}
      <AnimatePresence>
        {assistantActive && (
          <IntelligentAssistant
            onAskQuestion={askLectoGuia}
            systemMetrics={systemMetrics}
            weakestArea={systemMetrics?.weakestArea}
            onClose={() => setAssistantActive(false)}
          />
        )}
      </AnimatePresence>

      {/* Botón para reactivar asistente */}
      {!assistantActive && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2 }}
        >
          <Button
            onClick={() => setAssistantActive(true)}
            className="bg-purple-600 hover:bg-purple-700 rounded-full w-16 h-16 p-0 shadow-2xl border-2 border-purple-400"
          >
            <Brain className="w-8 h-8 animate-pulse" />
          </Button>
        </motion.div>
      )}

      {/* Botón de salida */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
          <Link to="/">
            <Shield className="w-4 h-4 mr-2" />
            Salir del Centro
          </Link>
        </Button>
      </div>
    </div>
  );
};
