
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
      for (let i = 0; i <= 100; i += 2) {
        setSystemPower(i);
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      // Activate AI assistant after system is ready
      setTimeout(() => setAssistantActive(true), 1000);
    };

    if (!isInitializing && isSystemReady) {
      initSequence();
    }
  }, [isInitializing, isSystemReady]);

  // Handle quantum diagnostic start
  const handleStartQuantumDiagnostic = async () => {
    const success = await startQuantumDiagnostic();
    if (success) {
      // Navigate to diagnostic selection/execution
      setActiveMode('command');
      
      // If we have diagnostics available, we can proceed
      if (diagnosticTests.length > 0) {
        // For now, let's show the command center
        // In the future, this could automatically start the first diagnostic
        console.log('🎯 Diagnóstico cuántico iniciado, mostrando centro de comando');
      }
    }
  };

  // Loading state with better UX
  if (isInitializing || systemPower < 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 animate-pulse"></div>
          {Array.from({ length: 30 }).map((_, i) => (
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

        {/* Loading sequence */}
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
              {isInitializing ? 'Cargando sistema integral...' : 'Inicializando sistemas neurales...'}
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
              {systemPower >= 30 && systemPower < 60 && "Cargando ejercicios oficiales..."}
              {systemPower >= 60 && systemPower < 90 && "Inicializando generador IA..."}
              {systemPower >= 90 && "Activando sistema LectoGuía..."}
            </div>

            {systemPower >= 90 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-green-400 text-sm"
              >
                ✓ Sistema listo para diagnóstico cuántico
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

      {/* System status header */}
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
                  {systemMetrics.completedNodes}/{systemMetrics.totalNodes} Nodos
                </Badge>
                <Badge variant="outline" className="border-blue-400 text-blue-400">
                  {diagnosticTests.length} Diagnósticos
                </Badge>
                <Badge variant="outline" className="border-purple-400 text-purple-400">
                  Sistema: {isSystemReady ? 'OPERACIONAL' : 'CARGANDO'}
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
            skills={[]}
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

      {/* Improved debug info with better contrast */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 max-w-sm">
          <Card className="bg-black/80 backdrop-blur-lg border-yellow-500/50">
            <CardContent className="p-3">
              <div className="text-yellow-400 text-xs font-mono space-y-1">
                <div className="text-yellow-300 font-bold mb-2">📊 Sistema Debug</div>
                <div>Sistema Listo: <span className="text-green-400">{isSystemReady ? 'SÍ' : 'NO'}</span></div>
                <div>Diagnósticos: <span className="text-blue-400">{diagnosticTests.length}</span></div>
                <div>Nodos Totales: <span className="text-purple-400">{systemMetrics.totalNodes}</span></div>
                <div>Ejercicios Oficiales: <span className="text-orange-400">{data?.officialExercises.length || 0}</span></div>
                <div>Skills PAES: <span className="text-pink-400">{data?.paesSkills.length || 0}</span></div>
                <div>Modo Activo: <span className="text-cyan-400">{activeMode}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
