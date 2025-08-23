/* eslint-disable react-refresh/only-export-components */
// Sistema CinematogrÃ¡fico Profesional - DiseÃ±o Clase Mundial
import React, { useState, useEffect, Suspense } from 'react'
import { memo } from 'react';;
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DashboardUniverse } from './worlds/DashboardUniverse';
import { SuperPAESUniverse } from './worlds/SuperPAESUniverse';
import { NeuralHubUniverse } from './worlds/NeuralHubUniverse';
import AnalyticsUniverse from './worlds/AnalyticsUniverse';
import PAESStudioPage from '../../pages/PAESStudioPage';
import { useCinematicUniverse } from '../../contexts/cinematic-universe/CinematicUniverseContext';
import { useAdaptivePerformance } from '../../components/cinematic/useAdaptivePerformance';
import { useCinematicBackendBridge } from '../../components/cinematic/CinematicBackendBridge';
import { useGlobalCinematic } from '../../hooks/useGlobalCinematic';
import { 
  BarChart3, 
  Brain, 
  Zap, 
  Target, 
  Layers,
  Activity,
  Database,
  Cpu,
  Network,
  Shield
} from 'lucide-react';

const UniverseLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center relative"
    >
      {/* Loader profesional con geometrÃ­a avanzada */}
      <div className="relative w-32 h-32 mx-auto mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-transparent border-t-blue-400 border-r-purple-400 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border-2 border-transparent border-b-cyan-400 border-l-indigo-400 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm"
        />
      </div>
      
      <h2 className="text-2xl font-light text-white mb-2 tracking-wide">
        Inicializando Sistema Neural
      </h2>
      <p className="text-gray-400 text-sm font-mono">Cargando arquitectura avanzada...</p>
    </motion.div>
  </div>
);

const UniverseSelector: React.FC<{ onUniverseSelect: (universe: string) => void }> = ({ onUniverseSelect }) => {
  const { state } = useGlobalCinematic();
  const preferences = state.preferences;
  
  const universes = [
    {
      id: 'paes-studio',
      name: 'PAES Studio',
      description: 'Ecosistema de aprendizaje inspirado en Spotify Premium con IA adaptativa',
      color: 'from-purple-600 to-pink-600',
      accent: 'border-purple-500/30',
      icon: Brain,
      category: 'Premium Learning',
      featured: true
    },
    {
      id: 'dashboard',
      name: 'Control Center',
      description: 'Centro de comando con mÃ©tricas en tiempo real y anÃ¡lisis predictivo',
      color: 'from-slate-600 to-slate-800',
      accent: 'border-blue-500/30',
      icon: BarChart3,
      category: 'Analytics'
    },
    {
      id: 'analytics',
      name: 'Neural Analytics',
      description: 'Sistema de inteligencia artificial para anÃ¡lisis profundo de datos',
      color: 'from-emerald-600 to-teal-700',
      accent: 'border-emerald-500/30',
      icon: Activity,
      category: 'Intelligence'
    },
    {
      id: 'superpaes',
      name: 'PAES Enterprise',
      description: 'Ecosistema educativo completo con gamificaciÃ³n avanzada',
      color: 'from-violet-600 to-purple-800',
      accent: 'border-violet-500/30',
      icon: Target,
      category: 'Education'
    },
    {
      id: 'neural-hub',
      name: 'Neural Hub',
      description: 'Centro de procesamiento neuronal y machine learning',
      color: 'from-cyan-600 to-blue-700',
      accent: 'border-cyan-500/30',
      icon: Cpu,
      category: 'AI Core'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center p-8 relative overflow-hidden">
      {/* Fondo geomÃ©trico profesional */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl" />
      </div>
      
      {/* Grid pattern sutil */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="max-w-7xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-light text-white tracking-tight">
              PAES <span className="font-semibold">Neural System</span>
            </h1>
          </motion.div>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Selecciona el mÃ³dulo especializado para acceder a las capacidades avanzadas del sistema
          </p>
        </motion.div>

        {/* PAES Studio Featured Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-[2px] rounded-2xl">
            <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(147,51,234,0.1)_25%,transparent_25%),linear-gradient(-45deg,rgba(147,51,234,0.1)_25%,transparent_25%)] bg-[size:20px_20px]" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-1">PAES Studio</h2>
                      <p className="text-purple-300 font-medium">Premium Learning Experience</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-lg mb-6 max-w-2xl">
                    Ecosistema de aprendizaje inspirado en Spotify Premium con IA adaptativa.
                    Descubre, aprende y domina con la mejor experiencia educativa.
                  </p>
                  
                  <motion.button
                    onClick={() => onUniverseSelect('paes-studio')}
                    className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Zap className="w-5 h-5" />
                    Acceder a PAES Studio
                  </motion.button>
                </div>
                
                <div className="hidden lg:block">
                  <div className="w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Brain className="w-16 h-16 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Modules */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-white mb-6">Otros MÃ³dulos Disponibles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {universes.slice(1).map((universe, index) => {
              const IconComponent = universe.icon;
              
              return (
                <motion.div
                  key={universe.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 1) * 0.1 }}
                  whileHover={{
                    y: -4,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => onUniverseSelect(universe.id)}
                  className="cursor-pointer group"
                >
                  <div className={`relative bg-gradient-to-br ${universe.color} p-[1px] rounded-xl overflow-hidden`}>
                    <div className={`bg-gray-900/95 backdrop-blur-sm rounded-xl p-4 h-full border ${universe.accent} transition-all duration-300 group-hover:bg-gray-800/95`}>
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                          {universe.category}
                        </span>
                        <div className="w-6 h-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-3 h-3 text-gray-300" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {universe.name}
                      </h3>
                      
                      <p className="text-gray-400 text-xs leading-relaxed mb-3">
                        {universe.description}
                      </p>
                      
                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        <span className="text-xs text-gray-500">Disponible</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Footer con informaciÃ³n del sistema */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full border border-gray-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Sistema Neural Activo</span>
            </div>
            <div className="w-px h-4 bg-gray-600" />
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-400">205 Nodos Cargados</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export const CinematicUniverseMain: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useCinematicUniverse();
  const { settings } = useAdaptivePerformance();
  const { isConnected } = useCinematicBackendBridge();
  
  const [currentUniverse, setCurrentUniverse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Determinar universo actual basado en la ruta
    const path = location.pathname;
    if (path.includes('/paes-studio')) {
      setCurrentUniverse('paes-studio');
    } else if (path.includes('/dashboard')) {
      setCurrentUniverse('dashboard');
    } else if (path.includes('/analytics')) {
      setCurrentUniverse('analytics');
    } else if (path.includes('/superpaes')) {
      setCurrentUniverse('superpaes');
    } else if (path.includes('/neural-hub')) {
      setCurrentUniverse('neural-hub');
    } else {
      setCurrentUniverse(null);
    }

    // Carga optimizada
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleUniverseChange = (universe: string) => {
    setIsLoading(true);

    setTimeout(() => {
      navigate(`/${universe}`);
      setCurrentUniverse(universe);
      setIsLoading(false);
    }, 200);
  };

  if (isLoading) {
    return <UniverseLoader />;
  }

  return (
    <div className="min-h-screen relative bg-gray-900">
      {/* Indicadores de sistema profesionales */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50 flex gap-3"
      >
        <div className={`px-3 py-1.5 rounded-lg text-xs font-mono border backdrop-blur-sm ${
          isConnected 
            ? 'bg-green-500/10 text-green-300 border-green-500/20' 
            : 'bg-red-500/10 text-red-300 border-red-500/20'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
            {isConnected ? 'CONNECTED' : 'OFFLINE'}
          </div>
        </div>
        
        {settings && (
          <div className="px-3 py-1.5 rounded-lg text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20 backdrop-blur-sm">
            QUALITY: {settings.animationQuality.toUpperCase()}
          </div>
        )}
      </motion.div>

      <Routes>
        <Route
          path="/"
          element={<UniverseSelector onUniverseSelect={handleUniverseChange} />}
        />
        <Route
          path="/paes-studio"
          element={
            <Suspense fallback={<UniverseLoader />}>
              <PAESStudioPage />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<UniverseLoader />}>
              <DashboardUniverse
                userType={state.userType || 'estudiante'}
                onUniverseChange={handleUniverseChange}
              />
            </Suspense>
          }
        />
        <Route
          path="/analytics"
          element={
            <Suspense fallback={<UniverseLoader />}>
              <AnalyticsUniverse
                userType={state.userType || 'estudiante'}
                onUniverseChange={handleUniverseChange}
              />
            </Suspense>
          }
        />
        <Route
          path="/superpaes"
          element={
            <Suspense fallback={<UniverseLoader />}>
              <SuperPAESUniverse
                userType={state.userType || 'estudiante'}
                onUniverseChange={handleUniverseChange}
              />
            </Suspense>
          }
        />
        <Route
          path="/neural-hub"
          element={
            <Suspense fallback={<UniverseLoader />}>
              <NeuralHubUniverse
                userType={state.userType || 'estudiante'}
                onUniverseChange={handleUniverseChange}
              />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
};

export default React.memo(CinematicUniverseMain);

