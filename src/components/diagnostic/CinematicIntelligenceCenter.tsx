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
  Activity,
  CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useComprehensiveDiagnostic } from '@/hooks/diagnostic/use-comprehensive-diagnostic';
import { QuantumPortal } from './QuantumPortal';
import { HolographicMetrics } from './HolographicMetrics';
import { MatrixCommandCenter } from './MatrixCommandCenter';
import { IntelligentAssistant } from './IntelligentAssistant';
import { CombatArena } from './CombatArena';

export const CinematicIntelligenceCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    data,
    isInitializing,
    isSystemReady,
    startQuantumDiagnostic,
    diagnosticTests,
    systemMetrics
  } = useComprehensiveDiagnostic();

  const [activeMode, setActiveMode] = useState<'portal' | 'command' | 'combat' | 'matrix'>('portal');
  const [systemPower, setSystemPower] = useState(0);
  const [assistantActive, setAssistantActive] = useState(false);

  // Epic initialization sequence
  useEffect(() => {
    const initSequence = async () => {
      // System power-up sequence
      for (let i = 0; i <= 100; i += 4) {
        setSystemPower(i);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      
      // Activate AI assistant after system is ready
      setTimeout(() => setAssistantActive(true), 500);
    };

    if (!isInitializing && isSystemReady) {
      initSequence();
    }
  }, [isInitializing, isSystemReady]);

  // Handle quantum diagnostic start
  const handleStartQuantumDiagnostic = async () => {
    const success = await startQuantumDiagnostic();
    if (success && diagnosticTests.length > 0) {
      console.log('🎯 Diagnóstico cuántico iniciado exitosamente');
      setActiveMode('command');
    }
  };

  // Loading state with better UX
  if (isInitializing || systemPower < 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 animate-pulse"></div>
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Loading sequence */}
        <div className="text-center z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative">
              <Brain className="w-32 h-32 text-blue-400 mx-auto animate-pulse" />
              <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-ping"></div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-white mb-8 tracking-wider"
          >
            CENTRO DE INTELIGENCIA DIAGNÓSTICA
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="space-y-6"
          >
            <div className="text-blue-300 text-xl font-medium">
              {systemPower < 20 && "Conectando con base de datos PAES..."}
              {systemPower >= 20 && systemPower < 40 && "Cargando exámenes oficiales 2024..."}
              {systemPower >= 40 && systemPower < 60 && "Generando diagnósticos desde exámenes reales..."}
              {systemPower >= 60 && systemPower < 80 && "Mapeando 170 nodos de aprendizaje..."}
              {systemPower >= 80 && systemPower < 95 && "Activando sistema LectoGuía..."}
              {systemPower >= 95 && "Iniciando protocolo cuántico..."}
            </div>
            
            <div className="w-96 mx-auto bg-gray-800 rounded-full h-4 overflow-hidden border border-blue-500/30">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: `${systemPower}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="text-sm text-gray-400 space-y-2">
              <div>Sistema Neural: {systemPower >= 100 ? 'OPERACIONAL' : 'CARGANDO'}</div>
              <div>Diagnósticos: {diagnosticTests.length} listos</div>
              <div>Nodos: {systemMetrics.totalNodes} mapeados</div>
            </div>

            {systemPower >= 95 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center space-x-2 text-green-400 text-lg"
              >
                <CheckCircle className="w-6 h-6" />
                <span>Sistema listo para diagnóstico cuántico</span>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Show portal if system is ready but no diagnostic has been started
  if (activeMode === 'portal') {
    return (
      <QuantumPortal
        onEnterDiagnostic={handleStartQuantumDiagnostic}
        userProfile={user}
        systemMetrics={systemMetrics}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black relative overflow-hidden">
      {/* Matrix background */}
      <div className="absolute inset-0 opacity-20">
        <Canvas>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <Environment preset="night" />
        </Canvas>
      </div>

      {/* System status header - enhanced */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 p-4"
      >
        <Card className="bg-black/60 backdrop-blur-lg border-green-500/40">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                  <span className="text-green-400 font-mono font-bold">SISTEMA OPERACIONAL</span>
                </div>
                <div className="text-white">
                  Usuario: <span className="text-blue-300 font-semibold">{user?.email}</span>
                </div>
                <div className="text-sm text-gray-300">
                  Diagnósticos disponibles: <span className="text-yellow-400 font-bold">{diagnosticTests.length}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="border-green-400 text-green-400 bg-green-400/10">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {systemMetrics.totalNodes} Nodos
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-400 bg-blue-400/10">
                  <Target className="w-3 h-3 mr-1" />
                  {diagnosticTests.length} Diagnósticos
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-400 bg-purple-400/10">
                  <Zap className="w-3 h-3 mr-1" />
                  {data?.officialExercises.length || 0} Oficiales
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Mode selector */}
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
              className={`${
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

      {/* Main content based on active mode */}
      <AnimatePresence mode="wait">
        {activeMode === 'command' && (
          <MatrixCommandCenter
            key="command"
            tests={diagnosticTests}
            skills={data?.paesSkills || []}
            baselineScores={{}}
            currentScores={{}}
            progressTrends={[]}
            skillAnalysis={{}}
            personalizedStrategies={[]}
            predictedScores={{}}
            systemMetrics={systemMetrics}
            onScheduleAssessment={() => console.log('Schedule assessment')}
            onGenerateExercises={(prueba) => console.log('Generate exercises for:', prueba)}
          />
        )}

        {activeMode === 'combat' && (
          <CombatArena
            key="combat"
            tests={diagnosticTests}
            currentScores={{}}
            onStartCombat={(prueba) => console.log('Start combat for:', prueba)}
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

      {/* AI Assistant */}
      <AnimatePresence>
        {assistantActive && (
          <IntelligentAssistant
            onAskQuestion={(question) => console.log('AI Question:', question)}
            systemMetrics={systemMetrics}
            weakestArea={{ prueba: 'COMPETENCIA_LECTORA', score: 400 }}
            onClose={() => setAssistantActive(false)}
          />
        )}
      </AnimatePresence>

      {/* Assistant reactivation button */}
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

      {/* Exit button */}
      <div className="fixed top-4 left-4 z-50">
        <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10">
          <Link to="/">
            <Shield className="w-4 h-4 mr-2" />
            Salir del Centro
          </Link>
        </Button>
      </div>

      {/* Enhanced debug info with better styling */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm">
          <Card className="bg-black/90 backdrop-blur-lg border-yellow-500/70 shadow-2xl">
            <CardContent className="p-4">
              <div className="text-yellow-300 text-xs font-mono space-y-2">
                <div className="text-yellow-200 font-bold mb-3 flex items-center">
                  <Cpu className="w-4 h-4 mr-2" />
                  Sistema Integral Debug
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex justify-between">
                    <span>Sistema Listo:</span> 
                    <span className="text-green-400 font-bold">{isSystemReady ? 'SÍ' : 'NO'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diagnósticos:</span> 
                    <span className="text-blue-400 font-bold">{diagnosticTests.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nodos Totales:</span> 
                    <span className="text-purple-400 font-bold">{systemMetrics.totalNodes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ejercicios:</span> 
                    <span className="text-orange-400 font-bold">{data?.officialExercises.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Skills PAES:</span> 
                    <span className="text-pink-400 font-bold">{data?.paesSkills.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modo:</span> 
                    <span className="text-cyan-400 font-bold">{activeMode.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
