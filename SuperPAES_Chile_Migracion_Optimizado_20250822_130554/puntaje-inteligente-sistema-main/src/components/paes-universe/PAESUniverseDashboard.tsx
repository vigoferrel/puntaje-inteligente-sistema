/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect, useRef } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Text, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import {
  Target, Brain, Zap, Trophy, Play, TrendingUp,
  Sparkles, Gamepad2, Crown, Rocket, Star, Settings
} from 'lucide-react';
import { usePAESData } from '../../hooks/use-paes-data';
import { useLearningNodes } from '../../hooks/use-learning-nodes';
import { useAuth } from './../../hooks/useAuth';
import { GalacticSubjectMap } from './GalacticSubjectMap';
import { TemporalProgressFlow } from './TemporalProgressFlow';
import { CognitiveMatrix } from './CognitiveMatrix';
import { BattleDashboard } from './BattleDashboard';
import { QuantumInsights } from './QuantumInsights';
import { TPAESTest } from '../../types/system-types';

// Importar componentes del Ecosistema PAES
import { PAESCoreEngine } from '../../components/core/PAESCoreEngine';
import { NeuralScoringEngine } from '../../components/neural/NeuralScoringEngine';
import { GamificationEngine } from '../../components/gamification/GamificationEngine';
import { PAESServicesEngine } from '../../components/services/PAESServicesEngine';
import { AnalyticsEngine } from '../../components/analytics/AnalyticsEngine';

interface UniverseMode {
  mode: 'galaxy' | 'battle' | 'temporal' | 'cognitive' | 'quantum' | 'ecosistema';
  focus?: string;
}

export const PAESUniverseDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const { tests: paesTestsData, skills: paesSkillsData, loading } = usePAESData();
  const { nodes, nodeProgress } = useLearningNodes();
  
  const [universeMode, setUniverseMode] = useState<UniverseMode>({ mode: 'galaxy' });
  const [gameStats] = useState({
    level: 15,
    experience: 2847,
    maxExperience: 3200,
    streak: 12,
    nationalRank: 287,
    battlePoints: 1456
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // SimplificaciÃ³n: usar datos directamente sin transformaciones complejas
  const tests: TPAESTest[] = React.useMemo(() => {
    if (!paesTestsData.length) {
      // Fallback con datos mock para desarrollo
      return [
        { id: 1, code: 'COMPETENCIA_LECTORA' as unknown, name: 'Competencia Lectora', skillsCount: 5, nodesCount: 12, userProgress: 75 },
        { id: 2, code: 'MATEMATICA_1' as unknown, name: 'MatemÃ¡tica 1', skillsCount: 4, nodesCount: 15, userProgress: 60 },
        { id: 3, code: 'MATEMATICA_2' as unknown, name: 'MatemÃ¡tica 2', skillsCount: 4, nodesCount: 18, userProgress: 45 },
        { id: 4, code: 'CIENCIAS' as unknown, name: 'Ciencias', skillsCount: 6, nodesCount: 20, userProgress: 55 },
        { id: 5, code: 'HISTORIA' as unknown, name: 'Historia', skillsCount: 4, nodesCount: 14, userProgress: 70 }
      ];
    }
    
    return paesTestsData.map(test => ({
      id: test.id,
      code: test.code as unknown,
      name: test.name,
      description: test.description,
      skillsCount: test.skillsCount,
      nodesCount: test.nodesCount,
      userProgress: test.userProgress
    }));
  }, [paesTestsData]);

  // MÃ©tricas simplificadas
  const cinematicMetrics = React.useMemo(() => {
    const totalNodes = nodes.length || 100;
    const completedNodes = Object.values(nodeProgress).filter(p => p.status === 'completed').length || 45;
    const progressPercentage = (completedNodes / totalNodes) * 100;
    
    return {
      totalNodes,
      completedNodes,
      progressPercentage,
      projectedScore: Math.round(400 + (progressPercentage / 100) * 450),
      galaxyCompletion: Math.round(progressPercentage),
      quantumPower: Math.round(progressPercentage * 1.2),
      cognitiveLevel: Math.min(Math.floor(progressPercentage / 10) + 1, 10)
    };
  }, [nodes, nodeProgress]);

  // Efectos de sonido espacial
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.1;
    }
  }, []);

  const handleModeChange = (newMode: UniverseMode['mode']) => {
    setUniverseMode({ mode: newMode });
    
    // Efecto de sonido para cambio de modo
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const ModeSelector = () => (
    <motion.div 
      className="fixed top-4 left-4 z-50 bg-black/20 backdrop-blur-xl rounded-2xl p-2 border border-white/10"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex space-x-2">
        {[
          { mode: 'galaxy', icon: Star, label: 'Galaxy', color: 'from-blue-500 to-purple-600' },
          { mode: 'battle', icon: Gamepad2, label: 'Battle', color: 'from-red-500 to-orange-600' },
          { mode: 'temporal', icon: TrendingUp, label: 'Timeline', color: 'from-green-500 to-teal-600' },
          { mode: 'cognitive', icon: Brain, label: 'Matrix', color: 'from-purple-500 to-pink-600' },
          { mode: 'quantum', icon: Sparkles, label: 'Quantum', color: 'from-yellow-500 to-amber-600' },
          { mode: 'ecosistema', icon: Settings, label: 'Ecosistema', color: 'from-cyan-500 to-blue-600' }
        ].map(({ mode, icon: Icon, label, color }) => (
          <motion.button
            key={mode}
            onClick={() => handleModeChange(mode as UniverseMode['mode'])}
            className={`relative p-3 rounded-xl transition-all duration-300 ${
              universeMode.mode === mode 
                ? `bg-gradient-to-br ${color} text-white shadow-2xl transform scale-110` 
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5" />
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium opacity-80">
              {label}
            </div>
            {universeMode.mode === mode && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                layoutId="activeModeIndicator"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const PowerStats = () => (
    <motion.div 
      className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 min-w-80"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg">{profile?.name || 'Commander'}</span>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
            LVL {gameStats.level}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Experience</span>
            <span>{gameStats.experience} / {gameStats.maxExperience}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(gameStats.experience / gameStats.maxExperience) * 100}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{cinematicMetrics.projectedScore}</div>
            <div className="text-xs opacity-70">Projected PAES</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">#{gameStats.nationalRank}</div>
            <div className="text-xs opacity-70">National Rank</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{gameStats.battlePoints}</div>
            <div className="text-xs opacity-70">Battle Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{gameStats.streak}</div>
            <div className="text-xs opacity-70">Day Streak</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderUniverseContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full text-white">
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          >
            <Rocket className="w-16 h-16 mx-auto text-blue-400" />
            <div className="text-2xl font-bold">Initializing PAES Universe...</div>
            <div className="text-blue-300">Loading {cinematicMetrics.totalNodes} learning nodes</div>
          </motion.div>
        </div>
      );
    }

    switch (universeMode.mode) {
      case 'galaxy':
        return (
          <GalacticSubjectMap
            nodes={nodes}
            nodeProgress={nodeProgress}
            tests={tests}
            onNodeSelect={(nodeId) => console.log('Selected node:', nodeId)}
          />
        );
      
      case 'battle':
        return (
          <BattleDashboard
            gameStats={gameStats}
            cinematicMetrics={cinematicMetrics}
            onBattleAction={(action) => console.log('Battle action:', action)}
          />
        );
      
      case 'temporal':
        return (
          <TemporalProgressFlow
            nodeProgress={nodeProgress}
            nodes={nodes}
            onTimelineSelect={(period) => console.log('Timeline period:', period)}
          />
        );
      
      case 'cognitive':
        return (
          <CognitiveMatrix
            skills={paesSkillsData}
            nodes={nodes}
            cognitiveLevel={cinematicMetrics.cognitiveLevel}
            onMatrixSelect={(skill) => console.log('Matrix skill:', skill)}
          />
        );
      
      case 'quantum':
        return (
          <QuantumInsights
            cinematicMetrics={cinematicMetrics}
            predictions={{
              nextWeekScore: cinematicMetrics.projectedScore + 15,
              strongestSubject: 'Competencia Lectora',
              improvementAreas: ['MatemÃ¡tica M2', 'Ciencias']
            }}
            onQuantumAction={(action) => console.log('Quantum action:', action)}
          />
        );
      
      case 'ecosistema':
        return (
          <div className="h-full overflow-y-auto p-6 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl font-bold text-white mb-2">
                ðŸš€ Ecosistema PAES Completo
              </h2>
              <p className="text-cyan-300 text-lg">
                Sistema integral con 5 dimensiones: Core + Neural + GamificaciÃ³n + Servicios + Analytics
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Core PAES Engine */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/30"
              >
                <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Core PAES (4 Ãreas Oficiales)
                </h3>
                <PAESCoreEngine />
              </motion.div>

              {/* Neural Scoring Engine */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30"
              >
                <h3 className="text-2xl font-bold text-purple-400 mb-4 flex items-center">
                  <Brain className="w-6 h-6 mr-2" />
                  Neural + Scoring Engine
                </h3>
                <NeuralScoringEngine />
              </motion.div>

              {/* Gamification Engine */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30"
              >
                <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
                  <Trophy className="w-6 h-6 mr-2" />
                  GamificaciÃ³n + Simulaciones
                </h3>
                <GamificationEngine />
              </motion.div>

              {/* PAES Services Engine */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/30"
              >
                <h3 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
                  <Rocket className="w-6 h-6 mr-2" />
                  Servicios (FUAS + Becas + Calendario)
                </h3>
                <PAESServicesEngine />
              </motion.div>
            </div>

            {/* Analytics Engine - Full Width */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30"
            >
              <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2" />
                Analytics + Banco Ejercicios
              </h3>
              <AnalyticsEngine />
            </motion.div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          className="text-center text-white space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-2xl font-bold">Entering PAES Universe</div>
          <div className="text-blue-300">Prepare for an epic learning journey...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden relative">
      {/* Audio para efectos de sonido */}
      <audio
        ref={audioRef}
        preload="auto"
        src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IAAAAAEAAQBAAQAAgD4AAQACABAAZGF0YQQAAAB7fn4fggAA"
      />

      {/* Controles y stats */}
      <ModeSelector />
      <PowerStats />

      {/* Canvas 3D o contenido especÃ­fico del modo */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={universeMode.mode}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            {renderUniverseContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BotÃ³n de acciÃ³n principal */}
      <motion.div 
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl"
          onClick={() => console.log('Continue learning journey')}
        >
          <Play className="w-6 h-6 mr-2" />
          Continue Learning Journey
        </Button>
      </motion.div>
    </div>
  );
};

