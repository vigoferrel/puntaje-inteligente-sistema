/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { Enhanced3DUniverse } from '../../components/real-3d/Enhanced3DUniverse';
import { RealEducationalUniverse } from '../../components/universe/RealEducationalUniverse';
import { RealAdaptiveEngine } from '../../components/ai-recommendations/RealAdaptiveEngine';
import { RealAchievementSystem } from '../../components/achievements/RealAchievementSystem';
import { WebGLContextProvider } from '../../core/webgl/WebGLContextManager';
import { useRealNeuralData } from '../../hooks/useRealNeuralData';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { 
  Brain, 
  Sparkles, 
  Globe, 
  Target, 
  Award,
  Zap,
  Eye
} from 'lucide-react';

type ViewMode = 'enhanced3d' | 'educational' | 'recommendations' | 'achievements';

export const NeuralEcosystemHub: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('enhanced3d');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const { neuralMetrics, realNodes, isLoading } = useRealNeuralData();

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    console.log('Nodo Neural Seleccionado:', nodeId);
  };

  const handleGalaxyClick = (testCode: string) => {
    setSelectedGalaxy(testCode);
    console.log('Galaxia Seleccionada:', testCode);
  };

  const viewConfigs = {
    enhanced3d: {
      title: 'Universo Neural 3D',
      description: 'VisualizaciÃ³n avanzada de nodos con mÃ©tricas neurales',
      icon: Brain,
      gradient: 'from-cyan-600 to-blue-600',
      particleVariant: 'neural' as const
    },
    educational: {
      title: 'Galaxias Educativas',
      description: 'ExploraciÃ³n por materias y dominios PAES',
      icon: Globe,
      gradient: 'from-purple-600 to-indigo-600',
      particleVariant: 'cosmic' as const
    },
    recommendations: {
      title: 'IA Adaptativa',
      description: 'Recomendaciones inteligentes personalizadas',
      icon: Target,
      gradient: 'from-green-600 to-emerald-600',
      particleVariant: 'energy' as const
    },
    achievements: {
      title: 'Sistema de Logros',
      description: 'Progreso y reconocimientos reales',
      icon: Award,
      gradient: 'from-yellow-600 to-orange-600',
      particleVariant: 'energy' as const
    }
  };

  const currentConfig = viewConfigs[activeView];

  const renderMainContent = () => {
    switch (activeView) {
      case 'enhanced3d':
        return (
          <Enhanced3DUniverse 
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode}
          />
        );
      case 'educational':
        return (
          <RealEducationalUniverse
            onGalaxyClick={handleGalaxyClick}
            selectedGalaxy={selectedGalaxy}
          />
        );
      case 'recommendations':
        return <RealAdaptiveEngine />;
      case 'achievements':
        return <RealAchievementSystem />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <WebGLContextProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-6"></div>
            <div className="text-2xl font-bold">Inicializando Ecosistema Neural...</div>
            <div className="text-cyan-300 mt-2">Conectando con {realNodes.length} nodos reales</div>
          </div>
        </div>
      </WebGLContextProvider>
    );
  }

  return (
    <WebGLContextProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-4 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header del Ecosistema */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-4">
              <Brain className="w-12 h-12 text-cyan-400 animate-pulse" />
              <div>
                <h1 className="text-4xl font-bold text-white">Ecosistema Neural PAES</h1>
                <p className="text-cyan-300 text-lg">Sistema Inteligente de Aprendizaje 3D</p>
              </div>
              <Sparkles className="w-12 h-12 text-purple-400 animate-bounce" />
            </div>
            
            {/* MÃ©tricas en tiempo real */}
            <div className="flex justify-center gap-6">
              <Badge className="bg-cyan-600 text-white px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Coherencia: {neuralMetrics.neuralCoherence}%
              </Badge>
              <Badge className="bg-purple-600 text-white px-4 py-2">
                <Brain className="w-4 h-4 mr-2" />
                Velocidad: {neuralMetrics.learningVelocity}%
              </Badge>
              <Badge className="bg-green-600 text-white px-4 py-2">
                <Target className="w-4 h-4 mr-2" />
                Engagement: {neuralMetrics.engagementScore}%
              </Badge>
            </div>
          </motion.div>

          {/* NavegaciÃ³n de vistas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {Object.entries(viewConfigs).map(([key, config]) => {
              const Icon = config.icon;
              const isActive = activeView === key;
              
              return (
                <Button
                  key={key}
                  onClick={() => setActiveView(key as ViewMode)}
                  variant={isActive ? 'default' : 'outline'}
                  className={`${
                    isActive 
                      ? `bg-gradient-to-r ${config.gradient} text-white` 
                      : 'border-white/30 text-white hover:bg-white/10'
                  } transition-all duration-300`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {config.title}
                </Button>
              );
            })}
          </motion.div>

          {/* Vista principal */}
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Card className="bg-black/20 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <currentConfig.icon className="w-6 h-6" />
                  {currentConfig.title}
                  <Badge variant="outline" className="text-xs">
                    {currentConfig.description}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="wait">
                  {renderMainContent()}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Panel de estado del sistema */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="bg-black/30 backdrop-blur-sm border-cyan-500/30">
              <CardContent className="p-4 text-center">
                <Eye className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-white font-medium">Vista Activa</div>
                <div className="text-cyan-400 text-sm">{currentConfig.title}</div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-sm border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Globe className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-white font-medium">Nodos Cargados</div>
                <div className="text-purple-400 text-sm">{realNodes.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-sm border-green-500/30">
              <CardContent className="p-4 text-center">
                <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-white font-medium">Sistema Neural</div>
                <div className="text-green-400 text-sm">Activo</div>
              </CardContent>
            </Card>

            <Card className="bg-black/30 backdrop-blur-sm border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-white font-medium">PartÃ­culas</div>
                <div className="text-yellow-400 text-sm capitalize">{currentConfig.particleVariant}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </WebGLContextProvider>
  );
};

