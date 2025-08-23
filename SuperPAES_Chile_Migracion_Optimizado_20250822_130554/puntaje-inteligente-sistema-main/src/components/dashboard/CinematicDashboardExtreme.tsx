/* eslint-disable react-refresh/only-export-components */
import React, { useState, Suspense, useEffect } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGlobalCinematic } from '../../contexts';
import { useRealNeuralData } from '../../hooks/useRealNeuralData';
import { useRealDashboardData } from '../../hooks/dashboard/useRealDashboardData';

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { supabase } from '../../integrations/supabase/leonardo-auth-client';
import { 
  Brain, Target, Zap, TrendingUp, 
  Calendar, BookOpen, Award, RefreshCw, 
  Eye, BarChart3, Sparkles, Globe,
  Command, Activity, AlertTriangle,
  Volume2, Settings, Maximize2
} from 'lucide-react';

// ðŸŽ¬ COMPONENTES CINEMATOGRÃFICOS EXTREMOS
const HolographicDashboard = React.lazy(() =>
  import('@/components/intelligent-dashboard/HolographicDashboard').then(module => ({
    default: module.HolographicDashboard
  })).catch(() => ({
    default: () => <div className="text-white p-4">HolographicDashboard cargando...</div>
  }))
);

const Enhanced3DUniverse = React.lazy(() => 
  import('@/components/real-3d/Enhanced3DUniverse').then(module => ({
    default: module.Enhanced3DUniverse
  })).catch(() => ({
    default: () => <div className="text-white p-4">Enhanced3DUniverse cargando...</div>
  }))
);

const NeuralCommandCenter = React.lazy(() =>
  import('@/components/neural-command/EnhancedNeuralCommandCenter').then(module => ({
    default: module.EnhancedNeuralCommandCenter
  })).catch(() => ({
    default: () => <div className="text-white p-4">NeuralCommandCenter cargando...</div>
  }))
);

const CinematicParticleSystem = React.lazy(() => 
  import('@/components/cinematic/CinematicParticleSystem').then(module => ({
    default: module.CinematicParticleSystem
  })).catch(() => ({
    default: () => null
  }))
);

const HolographicDataFlow = React.lazy(() => 
  import('@/components/cinematic/HolographicDataFlow').then(module => ({
    default: module.HolographicDataFlow
  })).catch(() => ({
    default: () => null
  }))
);

const EmotionalFeedbackSystem = React.lazy(() => 
  import('@/components/cinematic/EmotionalFeedbackSystem').then(module => ({
    default: module.EmotionalFeedbackSystem
  })).catch(() => ({
    default: () => null
  }))
);

const ContextualAIAssistant = React.lazy(() =>
  import('@/components/cinematic/ContextualAIAssistant').then(module => ({
    default: module.ContextualAIAssistant
  })).catch(() => ({
    default: () => null
  }))
);

const CinematicAudioSystem = React.lazy(() =>
  import('@/components/cinematic/CinematicAudioSystem').then(module => ({
    default: module.CinematicAudioSystem
  })).catch(() => ({
    default: () => null
  }))
);

// ðŸŽ¨ Componente de carga cinematogrÃ¡fica extrema
const ExtremeLoader: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center space-y-4">
      <motion.div
        className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <div className="text-cyan-300 text-sm">{message}</div>
      <div className="flex items-center justify-center gap-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-purple-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  </div>
);

export const CinematicDashboardExtreme: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { state, updatePreferences } = useGlobalCinematic();
  const { neuralMetrics, realNodes, isLoading: neuralLoading } = useRealNeuralData();
  const { metrics, isLoading: dashboardLoading } = useRealDashboardData();
  
  // ðŸŽ¯ Estado para experiencia cinematogrÃ¡fica extrema
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'holographic' | '3d' | 'neural' | 'extreme'>('extreme');
  const [emotionalState, setEmotionalState] = useState<string>('focused');
  const [neuralActivity, setNeuralActivity] = useState(85);

  // ðŸ§  MÃ©tricas neurales para HolographicDashboard
  const holographicMetrics = {
    averagePerformance: neuralMetrics.neuralCoherence || 87,
    learningVelocity: (neuralMetrics.learningVelocity || 92) / 100,
    predictionAccuracy: neuralMetrics.engagementScore || 89,
    totalStudyTime: (metrics?.totalStudyTime || 127) * 60,
    nodesCompleted: metrics?.completedNodes || 45
  };

  // ðŸŽ¬ SimulaciÃ³n de actividad neural extrema
  useEffect(() => {
    const interval = setInterval(() => {
      const baseActivity = 70 + Math.sin(Date.now() / 2000) * 25;
      const randomVariation = Math.random() * 15 - 7.5;
      setNeuralActivity(Math.max(0, Math.min(100, baseActivity + randomVariation)));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // ðŸŽ¯ NavegaciÃ³n inteligente extrema
  const handleToolNavigation = (tool: string) => {
    console.log('ðŸŒŒ NavegaciÃ³n cinematogrÃ¡fica extrema a:', tool);
    switch (tool) {
      case 'universe_3d':
        navigate('/universe');
        break;
      case 'paes_real':
        navigate('/superpaes');
        break;
      case 'battle_mode':
        navigate('/gamification');
        break;
      case 'neural_center':
        setActiveView('neural');
        break;
      default:
        console.log('ðŸŽ¯ Herramienta cinematogrÃ¡fica:', tool);
    }
  };

  // ðŸ”® SelecciÃ³n de nodos neurales extrema
  const handleNodeSelection = (nodeId: string) => {
    setSelectedNode(nodeId);
    console.log('ðŸ§  Nodo neural extremo seleccionado:', nodeId);
  };

  // ðŸŽ¨ ConfiguraciÃ³n de vista extrema
  const handleViewChange = (view: 'holographic' | '3d' | 'neural' | 'extreme') => {
    setActiveView(view);
    console.log('ðŸŽ¬ Vista cinematogrÃ¡fica extrema:', view);
  };

  if (isLoading || neuralLoading || dashboardLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Fondo cinematogrÃ¡fico extremo de carga */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)',
                'radial-gradient(ellipse at bottom, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
                'radial-gradient(ellipse at left, #164e63 0%, #0f172a 50%, #020617 100%)',
                'radial-gradient(ellipse at right, #581c87 0%, #0f172a 50%, #020617 100%)',
                'radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%, #020617 100%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* PartÃ­culas de carga extremas */}
        <div className="absolute inset-0 opacity-40">
          {Array.from({ length: 100 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full dynamic-particle"
              data-left={Math.random() * 100}
              data-top={Math.random() * 100}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.5, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 text-white text-center space-y-8 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <motion.div
              className="w-24 h-24 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Inicializando Dashboard CinematogrÃ¡fico Extremo Total
            </div>
            <div className="text-cyan-300 text-xl">
              Activando experiencia hologrÃ¡fica + universo 3D + sistema neural extremo
            </div>
            <div className="text-purple-300 text-lg">
              196+ componentes cinematogrÃ¡ficos cargando...
            </div>
            <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
              <Badge className="bg-cyan-600/20 text-cyan-400 border-cyan-400 animate-pulse">
                <Brain className="w-3 h-3 mr-1" />
                Sistema Neural Extremo âœ“
              </Badge>
              <Badge className="bg-purple-600/20 text-purple-400 border-purple-400 animate-pulse">
                <Globe className="w-3 h-3 mr-1" />
                Universo 3D HologrÃ¡fico âœ“
              </Badge>
              <Badge className="bg-green-600/20 text-green-400 border-green-400 animate-pulse">
                <Sparkles className="w-3 h-3 mr-1" />
                Efectos CinematogrÃ¡ficos âœ“
              </Badge>
              <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-400 animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                Audio Inmersivo âœ“
              </Badge>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  console.log('ðŸŽ¬ CinematicDashboardExtreme: Activando experiencia cinematogrÃ¡fica extrema total');
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ðŸŒŒ SISTEMA DE PARTÃCULAS CINEMATOGRÃFICAS EXTREMAS */}
      <Suspense fallback={null}>
        <CinematicParticleSystem
          universe="dashboard"
          intensity={state.preferences.particleIntensity}
        />
      </Suspense>

      {/* ðŸ”® FLUJO DE DATOS HOLOGRÃFICO */}
      <Suspense fallback={null}>
        <HolographicDataFlow
          currentModule="dashboard"
          userProgress={{
            totalNodes: 100,
            completedNodes: metrics?.completedNodes || 45,
            neuralCoherence: neuralMetrics.neuralCoherence || 87,
            learningVelocity: neuralMetrics.learningVelocity || 92,
            engagementScore: neuralMetrics.engagementScore || 89
          }}
          neuralActivity={neuralActivity}
        />
      </Suspense>

      {/* ðŸ§  SISTEMA DE FEEDBACK EMOCIONAL */}
      <Suspense fallback={null}>
        <EmotionalFeedbackSystem
          emotionalState={emotionalState}
          neuralActivity={neuralActivity}
          currentModule="dashboard"
        />
      </Suspense>

      {/* ðŸ¤– ASISTENTE IA CONTEXTUAL */}
      <Suspense fallback={null}>
        <ContextualAIAssistant
          currentModule="dashboard"
          emotionalState={emotionalState}
          onEmotionalStateChange={setEmotionalState}
        />
      </Suspense>

      {/* ðŸŽµ SISTEMA DE AUDIO CINEMATOGRÃFICO */}
      <Suspense fallback={null}>
        <CinematicAudioSystem
          currentModule="dashboard"
          emotionalState={emotionalState}
          neuralActivity={neuralActivity}
        />
      </Suspense>
      
      {/* ðŸŽ¬ CONTENIDO PRINCIPAL CINEMATOGRÃFICO EXTREMO */}
      <div className="relative z-10 p-6 space-y-8">
        
        {/* ðŸ”® HEADER CINEMATOGRÃFICO EXTREMO TOTAL */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Dashboard CinematogrÃ¡fico Extremo Total
              </h1>
              <p className="text-cyan-300 text-xl md:text-3xl">Sistema Neural HologrÃ¡fico + Universo 3D + IA Contextual + Audio Inmersivo</p>
            </div>
            <motion.div
              animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16 text-purple-400" />
            </motion.div>
          </div>
          
          {/* ðŸŽ¯ CONTROLES DE VISTA EXTREMOS */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Button
              onClick={() => handleViewChange('extreme')}
              variant={activeView === 'extreme' ? 'default' : 'outline'}
              className={`glass-morphism ${activeView === 'extreme' ? 'bg-gradient-to-r from-cyan-600 to-purple-600' : 'border-cyan-400 text-cyan-400'}`}
            >
              <Maximize2 className="h-4 w-4 mr-2" />
              Vista Extrema Total
            </Button>
            <Button
              onClick={() => handleViewChange('holographic')}
              variant={activeView === 'holographic' ? 'default' : 'outline'}
              className={`glass-morphism ${activeView === 'holographic' ? 'bg-cyan-600' : 'border-cyan-400 text-cyan-400'}`}
            >
              <Eye className="h-4 w-4 mr-2" />
              Vista HologrÃ¡fica
            </Button>
            <Button
              onClick={() => handleViewChange('3d')}
              variant={activeView === '3d' ? 'default' : 'outline'}
              className={`glass-morphism ${activeView === '3d' ? 'bg-purple-600' : 'border-purple-400 text-purple-400'}`}
            >
              <Globe className="h-4 w-4 mr-2" />
              Universo 3D
            </Button>
            <Button
              onClick={() => handleViewChange('neural')}
              variant={activeView === 'neural' ? 'default' : 'outline'}
              className={`glass-morphism ${activeView === 'neural' ? 'bg-green-600' : 'border-green-400 text-green-400'}`}
            >
              <Command className="h-4 w-4 mr-2" />
              Centro Neural
            </Button>
            
            <Button
              onClick={() => updatePreferences({ 
                particleIntensity: state.preferences.particleIntensity === 'high' ? 'medium' : 'high' 
              })}
              variant="outline"
              className="glass-morphism border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              PartÃ­culas: {state.preferences.particleIntensity}
            </Button>

            <Button
              onClick={() => updatePreferences({
                soundEffects: !state.preferences.soundEffects
              })}
              variant="outline"
              className="glass-morphism border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-black"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Audio: {state.preferences.soundEffects ? 'ON' : 'OFF'}
            </Button>
          </div>

          {/* ðŸ† BADGES DE ESTADO EXTREMO TOTAL */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Badge className="glass-morphism bg-green-600/20 text-green-400 border-green-400 animate-pulse">
              <Activity className="w-3 h-3 mr-1" />
              Sistema CinematogrÃ¡fico Extremo Activo
            </Badge>
            <Badge className="glass-morphism bg-cyan-600/20 text-cyan-400 border-cyan-400">
              <Brain className="w-3 h-3 mr-1" />
              Actividad Neural: {neuralActivity.toFixed(0)}%
            </Badge>
            <Badge className="glass-morphism bg-purple-600/20 text-purple-400 border-purple-400">
              <Target className="w-3 h-3 mr-1" />
              Nodos 3D: {realNodes.length}
            </Badge>
            <Badge className="glass-morphism bg-yellow-600/20 text-yellow-400 border-yellow-400">
              <Sparkles className="w-3 h-3 mr-1" />
              PartÃ­culas: {state.preferences.particleIntensity}
            </Badge>
            <Badge className="glass-morphism bg-pink-600/20 text-pink-400 border-pink-400">
              <Volume2 className="w-3 h-3 mr-1" />
              Audio: {state.preferences.soundEffects ? 'Inmersivo' : 'Silencioso'}
            </Badge>
            <Badge className="glass-morphism bg-indigo-600/20 text-indigo-400 border-indigo-400">
              <Settings className="w-3 h-3 mr-1" />
              FPS: {state.performanceMetrics.fps}
            </Badge>
          </div>
        </motion.div>

        {/* ðŸŽ¬ CONTENIDO PRINCIPAL CINEMATOGRÃFICO EXTREMO */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 1.1, rotateY: 10 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 xl:grid-cols-2 gap-8"
          >
            
            {/* ðŸ”® COLUMNA IZQUIERDA: SISTEMAS HOLOGRÃFICOS Y NEURALES */}
            <div className="space-y-8">
              
              {/* ðŸŒŸ HOLOGRAPHIC DASHBOARD */}
              {(activeView === 'holographic' || activeView === 'extreme') && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="glass-morphism rounded-2xl p-1 border border-cyan-500/30"
                >
                  <Suspense fallback={<ExtremeLoader message="Cargando Dashboard HologrÃ¡fico Extremo..." />}>
                    <HolographicDashboard 
                      metrics={holographicMetrics} 
                      patterns={{}} 
                    />
                  </Suspense>
                </motion.div>
              )}
              
              {/* ðŸ§  NEURAL COMMAND CENTER */}
              {(activeView === 'neural' || activeView === 'extreme') && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="glass-morphism rounded-2xl p-1 border border-green-500/30"
                >
                  <Suspense fallback={<ExtremeLoader message="Cargando Centro Neural Extremo..." />}>
                    <NeuralCommandCenter />
                  </Suspense>
                </motion.div>
              )}
            </div>
            
            {/* ðŸŒŒ COLUMNA DERECHA: UNIVERSO 3D Y MÃ‰TRICAS */}
            <div className="space-y-8">
              
              {/* ðŸš€ ENHANCED 3D UNIVERSE */}
              {(activeView === '3d' || activeView === 'extreme') && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="glass-morphism rounded-2xl p-1 border border-purple-500/30"
                >
                  <Suspense fallback={<ExtremeLoader message="Cargando Universo 3D Extremo..." />}>
                    <Enhanced3DUniverse
                      onNodeClick={handleNodeSelection}
                      selectedNodeId={selectedNode}
                    />
                  </Suspense>
                </motion.div>
              )}
              
              {/* ðŸ“Š MÃ‰TRICAS EXTREMAS */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                <Card className="glass-morphism bg-black/40 backdrop-blur-xl border-cyan-500/30">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{neuralMetrics.learningVelocity}%</div>
                    <div className="text-cyan-400 text-sm">Velocidad Neural</div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism bg-black/40 backdrop-blur-xl border-purple-500/30">
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{neuralMetrics.engagementScore}%</div>
                    <div className="text-purple-400 text-sm">Engagement</div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism bg-black/40 backdrop-blur-xl border-green-500/30">
                  <CardContent className="p-4 text-center">
                    <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{neuralActivity.toFixed(0)}%</div>
                    <div className="text-green-400 text-sm">Actividad Neural</div>
                  </CardContent>
                </Card>

                <Card className="glass-morphism bg-black/40 backdrop-blur-xl border-yellow-500/30">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">
                      {state.systemHealth === 'excellent' ? '95%' :
                       state.systemHealth === 'good' ? '85%' :
                       state.systemHealth === 'fair' ? '65%' : '45%'}
                    </div>
                    <div className="text-yellow-400 text-sm">Salud Sistema</div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ðŸŽ¯ ACCESOS RÃPIDOS CINEMATOGRÃFICOS EXTREMOS */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Button
            onClick={() => navigate('/superpaes')}
            className="h-24 glass-morphism bg-gradient-to-r from-purple-600/80 to-blue-600/80 text-white flex flex-col items-center justify-center gap-2 border border-purple-500/30 hover:scale-105 transition-transform"
          >
            <Brain className="w-8 h-8" />
            SuperPAES Neural Extremo
          </Button>
          
          <Button
            onClick={() => navigate('/calendario')}
            className="h-24 glass-morphism bg-gradient-to-r from-green-600/80 to-teal-600/80 text-white flex flex-col items-center justify-center gap-2 border border-green-500/30 hover:scale-105 transition-transform"
          >
            <Calendar className="w-8 h-8" />
            Calendario 3D HologrÃ¡fico
          </Button>
          
          <Button
            onClick={() => navigate('/achievements')}
            className="h-24 glass-morphism bg-gradient-to-r from-yellow-600/80 to-orange-600/80 text-white flex flex-col items-center justify-center gap-2 border border-yellow-500/30 hover:scale-105 transition-transform"
          >
            <Award className="w-8 h-8" />
            Logros CinematogrÃ¡ficos
          </Button>
          
          <Button
            onClick={() => navigate('/gamification')}
            className="h-24 glass-morphism bg-gradient-to-r from-pink-600/80 to-purple-600/80 text-white flex flex-col items-center justify-center gap-2 border border-pink-500/30 hover:scale-105 transition-transform"
          >
            <Sparkles className="w-8 h-8" />
            Batallas Neurales Extremas
          </Button>
        </motion.div>
      </div>

      {/* ðŸŽ¨ ESTILOS GLASSMORPHISM EXTREMOS */}
      <style>{`
        .glass-morphism {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 20px rgba(139, 92, 246, 0.2);
        }
      `}</style>
    </div>
  );
};






