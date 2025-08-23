
import React, { Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGlobalCinematic } from '@/contexts/GlobalCinematicContext';
import { EcosystemIntegrationEngine } from '@/components/educational-ecosystem/EcosystemIntegrationEngine';
import { RealTimeMetricsDashboard } from '@/components/cinematic/RealTimeMetricsDashboard';
import { AchievementTracker } from '@/components/achievement-system/AchievementTracker';
import { CinematicParticleSystem } from '@/components/cinematic/CinematicParticleSystem';
import { 
  Atom, 
  Brain, 
  Zap, 
  Target, 
  Sparkles,
  Globe,
  Network,
  Settings
} from 'lucide-react';

interface OptimizedEducationalUniverseProps {
  className?: string;
}

export const OptimizedEducationalUniverse: React.FC<OptimizedEducationalUniverseProps> = ({ 
  className = "" 
}) => {
  const { state, updatePreferences } = useGlobalCinematic();
  const [activeModule, setActiveModule] = useState<string>('overview');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Inicialización del universo educativo
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const universeModules = [
    {
      id: 'overview',
      name: 'Vista General',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      description: 'Panorama completo del universo educativo'
    },
    {
      id: 'neural',
      name: 'Red Neural',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      description: 'Conexiones neuronales de aprendizaje'
    },
    {
      id: 'ecosystem',
      name: 'Ecosistema',
      icon: Network,
      color: 'from-green-500 to-emerald-500',
      description: 'Integración de todos los módulos'
    },
    {
      id: 'achievements',
      name: 'Logros',
      icon: Target,
      color: 'from-yellow-500 to-orange-500',
      description: 'Sistema de logros y progreso'
    }
  ];

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'overview':
        return (
          <div className="space-y-6">
            <RealTimeMetricsDashboard />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Atom className="w-5 h-5 text-cyan-400" />
                    Núcleo Cuántico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-cyan-400 text-center">
                      <Atom className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                      <div className="text-sm">Sistema Activo</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 backdrop-blur-xl border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Energía Neural
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-yellow-400 text-center">
                      <Zap className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                      <div className="text-sm">Energía: {state.systemHealth}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'neural':
        return (
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Red Neural Educativa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-white text-xs">Nodo {i + 1}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {Math.floor(Math.random() * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'ecosystem':
        return (
          <div className="space-y-6">
            <EcosystemIntegrationEngine />
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <AchievementTracker />
          </div>
        );

      default:
        return null;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium">Inicializando Universo Educativo...</div>
          <div className="text-sm text-white/60 mt-2">Conectando módulos neurales</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 ${className}`}>
      {/* Sistema de partículas cinematográfico */}
      <CinematicParticleSystem
        intensity={state.preferences.particleIntensity === 'high' ? 80 : state.preferences.particleIntensity === 'medium' ? 50 : 20}
        isActive={state.preferences.particleIntensity !== 'low'}
        variant={state.preferences.visualMode === 'cosmic' ? 'cosmic' : state.preferences.visualMode === 'energy' ? 'energy' : 'neural'}
      />

      <div className="relative z-10 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header del universo */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-cyan-400" />
              Universo Educativo Optimizado
            </h1>
            <p className="text-white/70 text-lg">Exploración inmersiva del conocimiento PAES</p>
          </div>

          {/* Navegación de módulos */}
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-4">
              {universeModules.map((module) => {
                const Icon = module.icon;
                const isActive = activeModule === module.id;
                
                return (
                  <Button
                    key={module.id}
                    onClick={() => setActiveModule(module.id)}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isActive 
                        ? `bg-gradient-to-r ${module.color} text-white shadow-lg scale-105` 
                        : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {module.name}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Contenido del módulo activo */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                  <div className="text-white/60">Cargando módulo...</div>
                </div>
              }>
                {renderModuleContent()}
              </Suspense>
            </motion.div>
          </AnimatePresence>

          {/* Panel de configuración */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-6 right-6"
          >
            <Button
              onClick={() => updatePreferences({ 
                particleIntensity: state.preferences.particleIntensity === 'high' ? 'low' : 'high' 
              })}
              className="bg-black/40 backdrop-blur-xl border border-white/10 text-white hover:bg-black/60"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
