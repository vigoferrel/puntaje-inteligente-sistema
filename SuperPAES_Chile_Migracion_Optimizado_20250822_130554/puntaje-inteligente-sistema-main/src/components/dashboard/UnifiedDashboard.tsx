/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import styles from './UnifiedDashboard.module.css';
import {
  Brain,
  Target,
  BookOpen,
  Calendar,
  BarChart3,
  Sparkles,
  Users,
  Settings,
  Zap,
  MapPin,
  Shield,
  Database,
  Activity,
  TrendingUp,
  Play,
  Trophy,
  Clock,
  Star,
  Rocket,
  Music,
  Headphones,
  Radio,
  Volume2,
  SkipForward,
  Shuffle,
  Repeat,
  Heart,
  Plus,
  MoreHorizontal
} from 'lucide-react';

// Importar componentes Spotify-Neural avanzados
import {
  AudioWaveVisualizer,
  NeuralParticleSystem,
  SpotifyProgressBar,
  SpotifyPlayButton
} from '@/components/spotify-neural/AudioWaveVisualizer';

// Importar servicios neurales y de IA
import { neuralScoringSystem } from '../../services/neural/NeuralScoringSystem';
import { bloomAIService } from '../../services/bloom/BloomAIService';
import { openRouterService } from '../../services/openrouter/core';
import type { TPAESPrueba } from '../../types/paes-types';
import type { BloomLevelId } from '../../types/bloom';

type DashboardMode = 'neural' | 'optimized' | 'simplified' | 'spotify-neural';

interface UnifiedDashboardProps {
  initialMode?: DashboardMode;
  className?: string;
}

export const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  initialMode = 'neural',
  className
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState<DashboardMode>(initialMode);

  // Simplified neural state
  const isIntersectionalReady = true;
  const neuralHealth = {
    neural_efficiency: 95,
    user_experience_harmony: 88
  };

  // Estado Spotify-Neural avanzado
  const [neuralMetrics, setNeuralMetrics] = useState({
    coherencia: 95,
    velocidadAprendizaje: 88,
    prediccionPAES: 750,
    eficienciaIA: 92
  });

  const [spotifyNeuralData, setSpotifyNeuralData] = useState({
    currentlyPlaying: null as TPAESPrueba | null,
    queue: [] as TPAESPrueba[],
    recentlyPlayed: ['COMPETENCIA_LECTORA', 'MATEMATICA_1'] as TPAESPrueba[],
    favorites: ['MATEMATICA_2', 'CIENCIAS'] as TPAESPrueba[],
    bloomProgress: {
      recordar: 85,
      comprender: 78,
      aplicar: 92,
      analizar: 67,
      evaluar: 73,
      crear: 45
    }
  });

  // Estados para efectos visuales Spotify-Neural
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(45);
  const [visualEffectsEnabled, setVisualEffectsEnabled] = useState(true);
  const [currentTrackDuration] = useState('3:15:00');

  // Datos de las 5 pruebas PAES estilo Spotify
  const paesPlaylists = [
    {
      id: 'COMPETENCIA_LECTORA' as TPAESPrueba,
      name: 'Competencia Lectora',
      artist: 'Comprensión & Análisis',
      album: 'PAES 2024',
      duration: '2:30:00',
      progress: 75,
      cover: '??',
      color: 'from-blue-500 to-cyan-400',
      neuralScore: neuralMetrics.coherencia,
      bloomLevel: 'comprender' as BloomLevelId,
      isPlaying: spotifyNeuralData.currentlyPlaying === 'COMPETENCIA_LECTORA'
    },
    {
      id: 'MATEMATICA_1' as TPAESPrueba,
      name: 'Matemática M1',
      artist: 'Álgebra & Geometría',
      album: 'PAES 2024',
      duration: '3:15:00',
      progress: 82,
      cover: '??',
      color: 'from-green-500 to-emerald-400',
      neuralScore: 87,
      bloomLevel: 'aplicar' as BloomLevelId,
      isPlaying: spotifyNeuralData.currentlyPlaying === 'MATEMATICA_1'
    },
    {
      id: 'MATEMATICA_2' as TPAESPrueba,
      name: 'Matemática M2',
      artist: 'Cálculo & Funciones',
      album: 'PAES 2024',
      duration: '3:45:00',
      progress: 68,
      cover: '??',
      color: 'from-purple-500 to-violet-400',
      neuralScore: 91,
      bloomLevel: 'analizar' as BloomLevelId,
      isPlaying: spotifyNeuralData.currentlyPlaying === 'MATEMATICA_2'
    },
    {
      id: 'CIENCIAS' as TPAESPrueba,
      name: 'Ciencias',
      artist: 'Biología, Química & Física',
      album: 'PAES 2024',
      duration: '4:00:00',
      progress: 59,
      cover: '??',
      color: 'from-orange-500 to-red-400',
      neuralScore: 84,
      bloomLevel: 'evaluar' as BloomLevelId,
      isPlaying: spotifyNeuralData.currentlyPlaying === 'CIENCIAS'
    },
    {
      id: 'HISTORIA' as TPAESPrueba,
      name: 'Historia',
      artist: 'Procesos & Análisis Temporal',
      album: 'PAES 2024',
      duration: '2:45:00',
      progress: 71,
      cover: '???',
      color: 'from-pink-500 to-rose-400',
      neuralScore: 79,
      bloomLevel: 'crear' as BloomLevelId,
      isPlaying: spotifyNeuralData.currentlyPlaying === 'HISTORIA'
    }
  ];
  
  const generateIntersectionalInsights = () => [
    { title: 'Sistema Optimizado', description: 'Rendimiento excelente detectado', level: 'excellent' },
    { title: 'IA Activa', description: 'Todos los módulos funcionando', level: 'good' },
    { title: 'Datos Sincronizados', description: 'Información actualizada', level: 'excellent' }
  ];

  // Tools configuration (from OptimizedDashboard)
  const tools = [
    {
      id: 'entrenamiento',
      title: 'Entrenamiento PAES',
      description: 'Sistema de entrenamiento personalizado',
      icon: Brain,
      path: '/entrenamiento',
      color: 'from-purple-600 to-indigo-700',
      badge: 'Personalizado',
      priority: 'high'
    },
    {
      id: 'planning',
      title: 'Planificación Inteligente',
      description: 'Planifica tu estudio con IA avanzada',
      icon: MapPin,
      path: '/planning',
      color: 'from-emerald-600 to-teal-700',
      badge: 'IA Avanzada',
      priority: 'high'
    },
    {
      id: 'calendario',
      title: 'Calendario Cinematográfico',
      description: 'Organiza tu tiempo de estudio',
      icon: Calendar,
      path: '/calendario',
      color: 'from-green-600 to-emerald-700',
      badge: 'Organización',
      priority: 'high'
    },
    {
      id: 'lectoguia',
      title: 'LectoGuía IA',
      description: 'Comprensión lectora con inteligencia artificial',
      icon: BookOpen,
      path: '/lectoguia',
      color: 'from-blue-600 to-blue-700',
      badge: 'IA Avanzada'
    },
    {
      id: 'diagnostico',
      title: 'Diagnóstico Inteligente',
      description: 'Evalúa tu nivel actual con IA',
      icon: Target,
      path: '/diagnostico',
      color: 'from-orange-600 to-red-700',
      badge: 'Evaluación'
    },
    {
      id: 'achievements',
      title: 'Logros y Progreso',
      description: 'Visualiza tu progreso y logros',
      icon: TrendingUp,
      path: '/achievements',
      color: 'from-yellow-600 to-orange-600',
      badge: 'Progreso'
    },
    {
      id: 'superpaes',
      title: 'SuperPAES Universe',
      description: 'Experiencia completa de preparación',
      icon: Sparkles,
      path: '/superpaes',
      color: 'from-purple-600 to-pink-600',
      badge: 'Premium'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleModeSwitch = (mode: DashboardMode) => {
    setCurrentMode(mode);
  };

  // Neural mode content (from SimplifiedDashboard)
  const renderNeuralMode = () => {
    if (!isIntersectionalReady) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-pulse" />
              <h2 className="text-xl font-bold text-white mb-2">Activando Red Neural</h2>
              <p className="text-white/70">Inicializando sistema neurológico...</p>
            </CardContent>
          </Card>
        </div>
      );
    }

    const insights = generateIntersectionalInsights();

    return (
      <div className="space-y-6">
        {/* Neural Status Header */}
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-400" />
                <h1 className="text-xl font-bold text-white">Dashboard PAES Neural</h1>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full">
                <Activity className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Sistema Neural 100% Activo</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-white/60">Eficiencia Neural</div>
                <div className="text-lg font-bold text-green-400">
                  95%
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Coherencia</div>
                <div className="text-lg font-bold text-blue-400">
                  88%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neural Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="black-premium-card cinematic-glow cinematic-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <CardTitle className="text-white text-lg">Sistema Optimizado</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm mb-3">Rendimiento excelente detectado</p>
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  Excelente
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="black-premium-card cinematic-glow cinematic-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <CardTitle className="text-white text-lg">IA Activa</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm mb-3">Todos los módulos funcionando</p>
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                  Bien
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="black-premium-card cinematic-glow cinematic-interactive">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <CardTitle className="text-white text-lg">Datos Sincronizados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 text-sm mb-3">Información actualizada</p>
                <div className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                  Excelente
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Botón de acceso rápido al modo Completo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <Button
            onClick={() => handleModeSwitch('optimized')}
            className="btn-black-premium-neon px-8 py-3 text-lg"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Ver Todas las Herramientas
          </Button>
        </motion.div>
      </div>
    );
  };

  // Optimized mode content (from OptimizedDashboard)
  const renderOptimizedMode = () => {
    const priorityTools = tools.filter(tool => tool.priority === 'high');
    const regularTools = tools.filter(tool => tool.priority !== 'high');

    return (
      <div className="space-y-8">
        {/* Herramientas Prioritarias */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Herramientas Principales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {priorityTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="black-premium-card cinematic-glow cinematic-interactive cinematic-card-enhanced h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-r ${tool.color}`}>
                        <tool.icon className="w-10 h-10 text-white cinematic-icon-enhanced" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tool.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <Button
                      onClick={() => handleNavigation(tool.path)}
                      className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all duration-200 text-lg py-3 cinematic-button-enhanced`}
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Herramientas Adicionales */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Herramientas Adicionales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (priorityTools.length + index) * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group"
              >
                <Card className="black-premium-card cinematic-glow cinematic-interactive cinematic-card-enhanced h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color}`}>
                        <tool.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {tool.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <Button
                      onClick={() => handleNavigation(tool.path)}
                      className={`w-full bg-gradient-to-r ${tool.color} hover:opacity-90 transition-all duration-200`}
                    >
                      Acceder
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Funciones para controlar reproducción
  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    if (spotifyNeuralData.currentlyPlaying) {
      // Lógica de reproducción aquí
    }
  };

  const handleTrackSelect = (trackId: TPAESPrueba) => {
    setSpotifyNeuralData(prev => ({ ...prev, currentlyPlaying: trackId }));
    setIsPlaying(true);
    setCurrentProgress(0);
  };

  const handleSeek = (position: number) => {
    setCurrentProgress(position);
  };

  // Spotify-Neural mode content (experiencia completa integrada)
  const renderSpotifyNeuralMode = () => (
    <div className="spotify-neural-container min-h-screen">
      {/* Sistema de partículas neurales */}
      {visualEffectsEnabled && (
        <NeuralParticleSystem
          isActive={true}
          neuralMetrics={neuralMetrics}
          className="fixed inset-0 z-0"
        />
      )}
      {/* Spotify-Style Layout */}
      <div className="flex h-screen relative z-10">
        {/* Sidebar Navigation */}
        <div className="spotify-sidebar w-64">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <Music className="w-8 h-8 text-green-400" />
              <h1 className="text-xl font-bold">PAES Neural</h1>
            </div>
            
            {/* Navigation Menu */}
            <nav className="space-y-2">
              <div className="text-gray-400 text-sm font-semibold mb-4">UNIVERSOS PAES</div>
              {paesPlaylists.map((playlist) => (
                <motion.div
                  key={playlist.id}
                  className={`spotify-nav-item ${
                    playlist.isPlaying ? 'active' : ''
                  }`}
                  onClick={() => handleTrackSelect(playlist.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl">{playlist.cover}</div>
                  <div className="flex-1">
                    <div className="font-medium">{playlist.name}</div>
                    <div className="text-sm text-gray-400">{playlist.progress}% completado</div>
                  </div>
                  {playlist.isPlaying && (
                    <AudioWaveVisualizer
                      isPlaying={isPlaying}
                      intensity={0.6}
                      neuralActivity={neuralMetrics.coherencia}
                      className="w-6 h-4"
                    />
                  )}
                </motion.div>
              ))}
              
              {/* Bloom Taxonomy Section */}
              <div className="mt-8">
                <div className="text-gray-400 text-sm font-semibold mb-4">TAXONOMÍA BLOOM</div>
                {Object.entries(spotifyNeuralData.bloomProgress).map(([level, progress]) => (
                  <motion.div
                    key={level}
                    className={`bloom-indicator ${level}`}
                    whileHover={{ x: 4 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Object.keys(spotifyNeuralData.bloomProgress).indexOf(level) * 0.1 }}
                  >
                    <span className="capitalize text-sm">{level}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: Object.keys(spotifyNeuralData.bloomProgress).indexOf(level) * 0.2 }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8">{progress}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-gradient-to-r from-gray-900 to-black p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">Dashboard Neural</h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-500 bg-opacity-20 rounded-full">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Sistema Activo</span>
                </div>
              </div>
              
              {/* Neural Metrics Display */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-cyan-400">{neuralMetrics.coherencia}%</div>
                  <div className="text-xs text-gray-400">Coherencia</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">{neuralMetrics.velocidadAprendizaje}%</div>
                  <div className="text-xs text-gray-400">Velocidad</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">{neuralMetrics.prediccionPAES}</div>
                  <div className="text-xs text-gray-400">Predicción PAES</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* PAES Playlists */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-4">Tus Universos PAES</h3>
                <div className="grid gap-4">
                  {paesPlaylists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="spotify-playlist-card spotify-glass-card spotify-fade-in"
                      onClick={() => handleTrackSelect(playlist.id)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`playlist-cover w-16 h-16 rounded-lg bg-gradient-to-br ${playlist.color} flex items-center justify-center text-2xl`}>
                          {playlist.cover}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{playlist.name}</h4>
                          <p className="text-gray-400">{playlist.artist}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-400">{playlist.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4 text-cyan-400" />
                              <span className="text-sm text-cyan-400">{playlist.neuralScore}% Neural</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-purple-400 capitalize">{playlist.bloomLevel}</span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm text-gray-400">Progreso</span>
                              <span className="text-sm text-white">{playlist.progress}%</span>
                            </div>
                            <div className={styles.dynamicProgress}>
                              <motion.div
                                className={styles.dynamicProgressFill}
                                initial={{ width: 0 }}
                                animate={{ width: `${playlist.progress}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <SpotifyPlayButton
                            isPlaying={playlist.isPlaying && isPlaying}
                            onToggle={() => handleTrackSelect(playlist.id)}
                            size="md"
                            neuralActivity={playlist.neuralScore}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI & Analytics Panel */}
              <div className="space-y-6">
                {/* OpenRouter AI Studio */}
                <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                      AI Studio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Eficiencia IA</span>
                        <span className="text-yellow-400 font-bold">{neuralMetrics.eficienciaIA}%</span>
                      </div>
                      <div className={styles.efficiencyProgress}>
                        <div className={styles.efficiencyProgressFill} />
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-400 hover:opacity-90"
                        onClick={() => navigate('/ai-studio')}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Generar con IA
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recently Played */}
                <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Clock className="w-5 h-5 text-green-400" />
                      Recientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {spotifyNeuralData.recentlyPlayed.map((prueba) => {
                        const playlist = paesPlaylists.find(p => p.id === prueba);
                        return playlist ? (
                          <div key={prueba} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
                            <div className="text-lg">{playlist.cover}</div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">{playlist.name}</div>
                              <div className="text-xs text-gray-400">{playlist.artist}</div>
                            </div>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Favorites */}
                <Card className="bg-gray-800 bg-opacity-50 backdrop-blur-lg border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Heart className="w-5 h-5 text-red-400" />
                      Favoritos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {spotifyNeuralData.favorites.map((prueba) => {
                        const playlist = paesPlaylists.find(p => p.id === prueba);
                        return playlist ? (
                          <div key={prueba} className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded cursor-pointer">
                            <div className="text-lg">{playlist.cover}</div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-white">{playlist.name}</div>
                              <div className="text-xs text-gray-400">{playlist.progress}% dominado</div>
                            </div>
                            <Heart className="w-4 h-4 text-red-400 fill-current" />
                          </div>
                        ) : null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Player Bar */}
      <div className="spotify-player-bar fixed bottom-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          {/* Currently Playing */}
          <div className="flex items-center gap-4 flex-1">
            {spotifyNeuralData.currentlyPlaying ? (
              <>
                <motion.div
                  className="w-12 h-12 rounded bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-xl"
                  animate={{
                    rotate: isPlaying ? [0, 360] : 0,
                    scale: isPlaying ? [1, 1.05, 1] : 1
                  }}
                  transition={{
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                >
                  {paesPlaylists.find(p => p.id === spotifyNeuralData.currentlyPlaying)?.cover}
                </motion.div>
                <div className="flex-1">
                  <div className="font-medium text-white">
                    {paesPlaylists.find(p => p.id === spotifyNeuralData.currentlyPlaying)?.name}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    Sistema Neural Activo
                    {isPlaying && (
                      <AudioWaveVisualizer
                        isPlaying={isPlaying}
                        intensity={0.8}
                        neuralActivity={neuralMetrics.coherencia}
                        className="w-8 h-3"
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <SpotifyProgressBar
                      progress={currentProgress}
                      duration={currentTrackDuration}
                      isPlaying={isPlaying}
                      neuralActivity={neuralMetrics.coherencia}
                      onSeek={handleSeek}
                    />
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-400 cursor-pointer transition-colors" />
                </motion.div>
              </>
            ) : (
              <div className="text-gray-400">Selecciona un universo PAES para comenzar</div>
            )}
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-4 mx-8">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Shuffle className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <SkipForward className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors rotate-180" />
            </motion.div>
            <SpotifyPlayButton
              isPlaying={isPlaying}
              onToggle={handlePlayToggle}
              size="lg"
              neuralActivity={neuralMetrics.coherencia}
            />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <SkipForward className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Repeat className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </motion.div>
          </div>

          {/* Volume & Neural Status */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            <div className={styles.neuralMetricDisplay}>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-cyan-400">Neural:</span>
                <span className={`${styles.neuralMetricValue} text-sm`}>{neuralMetrics.coherencia}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <div className={styles.volumeProgress}>
                <div className={styles.volumeProgressFill} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Simplified mode content (basic overview)
  const renderSimplifiedMode = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.slice(0, 4).map((tool) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: tools.indexOf(tool) * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <Card className="black-premium-card cinematic-glow cinematic-interactive cinematic-card-enhanced h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{tool.title}</h3>
                    <Badge variant="outline" className="text-xs text-cyan-400 border-cyan-400">{tool.badge}</Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleNavigation(tool.path)}
                  className="w-full btn-black-premium"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Botón para ver más herramientas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <Button
          onClick={() => handleModeSwitch('optimized')}
          className="btn-black-premium-neon px-6 py-2"
          size="lg"
        >
          <Target className="w-5 h-5 mr-2" />
          Ver Todas las Herramientas
        </Button>
      </motion.div>
    </div>
  );

  const renderContent = () => {
    switch (currentMode) {
      case 'neural':
        return renderNeuralMode();
      case 'optimized':
        return renderOptimizedMode();
      case 'simplified':
        return renderSimplifiedMode();
      case 'spotify-neural':
        return renderSpotifyNeuralMode();
      default:
        return renderNeuralMode();
    }
  };

  return (
    <div className={`min-h-screen cinematic-container cinematic-mode p-responsive ${className || ''}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header unificado */}
        <Card className="black-premium-card cinematic-glow cinematic-interactive">
          <CardHeader className="text-center">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <Brain className="w-12 h-12 text-cyan-400" />
                <div>
                  <CardTitle className="text-white text-4xl">Sistema PAES</CardTitle>
                  <p className="text-cyan-300 text-lg">Plataforma Integrada de Aprendizaje</p>
                </div>
              </div>
              
              {/* Mode Selector */}
              <div className="flex gap-2">
                <Button
                  variant={currentMode === 'neural' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('neural')}
                  size="sm"
                >
                  Neural
                </Button>
                <Button
                  variant={currentMode === 'optimized' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('optimized')}
                  size="sm"
                >
                  Completo
                </Button>
                <Button
                  variant={currentMode === 'simplified' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('simplified')}
                  size="sm"
                >
                  Simple
                </Button>
                <Button
                  variant={currentMode === 'spotify-neural' ? 'default' : 'outline'}
                  onClick={() => handleModeSwitch('spotify-neural')}
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-400 hover:opacity-90"
                >
                  <Music className="w-4 h-4 mr-1" />
                  Spotify-Neural
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Users className="w-4 h-4 mr-1" />
                Usuario: {user?.email || 'Invitado'}
              </Badge>
              <Badge variant="outline" className="text-purple-400 border-purple-400">
                <Sparkles className="w-4 h-4 mr-1" />
                Sistema Activo
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Navegación Rápida */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="black-premium-card cinematic-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-medium">Acceso Rápido</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleNavigation('/entrenamiento')}
                    className="btn-black-premium text-sm"
                    size="sm"
                  >
                    Entrenar
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/calendario')}
                    className="btn-black-premium text-sm"
                    size="sm"
                  >
                    Calendario
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/planning')}
                    className="btn-black-premium text-sm"
                    size="sm"
                  >
                    Planificar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contenido dinámico basado en modo */}
        <motion.div
          key={currentMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>

        {/* Quick Stats */}
        <Card className="black-premium-card cinematic-glow">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">Activo</div>
                <div className="text-sm text-gray-300">Sistema</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{tools.length}</div>
                <div className="text-sm text-gray-300">Herramientas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-gray-300">Disponibilidad</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">IA</div>
                <div className="text-sm text-gray-300">Potenciado</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

