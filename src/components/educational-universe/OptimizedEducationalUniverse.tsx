
import React, { Suspense, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Rocket, 
  Brain, 
  Target, 
  BookOpen, 
  Calculator,
  Atom,
  Zap,
  Star,
  Sparkles,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { SafeThreeProvider } from '@/core/three/SafeThreeProvider';
import { NeuralErrorBoundary } from '@/components/neural/NeuralErrorBoundary';

// Lazy loading para componentes pesados
const PAESUniverseDashboard = React.lazy(() => 
  import('@/components/paes-universe/PAESUniverseDashboard').then(module => ({
    default: module.PAESUniverseDashboard
  }))
);

const OptimizedLoadingSpinner = () => (
  <div className="h-96 flex items-center justify-center bg-black/20 rounded-2xl border border-white/20">
    <div className="text-center space-y-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1.5, repeat: Infinity }
        }}
        className="w-16 h-16 mx-auto bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center"
      >
        <Brain className="w-8 h-8 text-white" />
      </motion.div>
      <div className="text-white/80">Inicializando Sistema Neural...</div>
      <div className="text-cyan-400 text-sm">Cargando Universo 3D</div>
    </div>
  </div>
);

const SystemHealthIndicator = ({ systemHealth }: { systemHealth: 'stable' | 'recovering' | 'critical' }) => {
  const getHealthColor = () => {
    switch (systemHealth) {
      case 'stable': return 'from-green-500 to-emerald-500';
      case 'recovering': return 'from-yellow-500 to-orange-500';
      case 'critical': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getHealthIcon = () => {
    switch (systemHealth) {
      case 'stable': return <Zap className="w-4 h-4" />;
      case 'recovering': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <Badge className={`bg-gradient-to-r ${getHealthColor()}`}>
      {getHealthIcon()}
      <span className="ml-2">
        {systemHealth === 'stable' && 'IA Neural Activa'}
        {systemHealth === 'recovering' && 'Sistema Estabilizando'}
        {systemHealth === 'critical' && 'Modo Seguro'}
      </span>
    </Badge>
  );
};

export const OptimizedEducationalUniverse: React.FC = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [battleModeActive, setBattleModeActive] = useState(false);
  const [systemHealth, setSystemHealth] = useState<'stable' | 'recovering' | 'critical'>('stable');
  const [neuralRetryCount, setNeuralRetryCount] = useState(0);

  // Monitor de salud del sistema
  useEffect(() => {
    const healthMonitor = setInterval(() => {
      // Simular verificación de salud basada en rendimiento
      const now = performance.now();
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      if (memoryUsage > 100 * 1024 * 1024) { // 100MB
        setSystemHealth('recovering');
      } else if (neuralRetryCount > 3) {
        setSystemHealth('critical');
      } else {
        setSystemHealth('stable');
      }
    }, 5000);

    return () => clearInterval(healthMonitor);
  }, [neuralRetryCount]);

  const galaxies = [
    {
      id: 'matematicas',
      name: 'Galaxia Matemática',
      description: 'Explora los misterios de números y ecuaciones',
      icon: Calculator,
      color: 'from-blue-500 to-cyan-500',
      planets: ['Álgebra', 'Geometría', 'Cálculo', 'Estadística'],
      progress: 76
    },
    {
      id: 'lenguaje',
      name: 'Constelación Lingüística',
      description: 'Navega por el universo de las palabras',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-500',
      planets: ['Comprensión Lectora', 'Vocabulario', 'Gramática', 'Literatura'],
      progress: 68
    },
    {
      id: 'ciencias',
      name: 'Nebulosa Científica',
      description: 'Descubre las leyes que rigen el cosmos',
      icon: Atom,
      color: 'from-green-500 to-emerald-500',
      planets: ['Física', 'Química', 'Biología', 'Astronomía'],
      progress: 82
    },
    {
      id: 'historia',
      name: 'Dimensión Temporal',
      description: 'Viaja a través del tiempo y la historia',
      icon: Globe,
      color: 'from-orange-500 to-red-500',
      planets: ['Historia Universal', 'Chile', 'Arte', 'Filosofía'],
      progress: 59
    }
  ];

  const handleGalaxySelect = useCallback((galaxyId: string) => {
    setSelectedGalaxy(galaxyId);
    console.log(`🌌 Navegando a galaxia: ${galaxyId}`);
  }, []);

  const handleBattleMode = useCallback(() => {
    setBattleModeActive(prev => !prev);
    console.log(`⚔️ Battle Mode: ${!battleModeActive ? 'ACTIVADO' : 'DESACTIVADO'}`);
  }, [battleModeActive]);

  const handleNeuralError = useCallback((error: Error) => {
    console.error('🧠 Error Neural:', error.message);
    setNeuralRetryCount(prev => prev + 1);
    setSystemHealth('recovering');
    
    // Auto-recovery después de 5 segundos
    setTimeout(() => {
      setSystemHealth('stable');
    }, 5000);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header del Universo Optimizado */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity }
              }}
              className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                PAES Universe
              </h1>
              <p className="text-white/80 text-lg">Exploración Educativa Optimizada</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <SystemHealthIndicator systemHealth={systemHealth} />
            
            <Button
              onClick={handleBattleMode}
              className={`${
                battleModeActive 
                  ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                  : 'bg-gradient-to-r from-gray-600 to-gray-700'
              } hover:opacity-90`}
            >
              <Target className="w-4 h-4 mr-2" />
              {battleModeActive ? 'Battle Mode ON' : 'Battle Mode OFF'}
            </Button>
          </div>
        </motion.div>

        {/* Tabs del Universo con Error Boundaries */}
        <Tabs defaultValue="explorer" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-xl border border-white/20">
            <TabsTrigger 
              value="explorer" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 text-white"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Explorador 3D
            </TabsTrigger>
            <TabsTrigger 
              value="galaxies" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Galaxias
            </TabsTrigger>
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 text-white"
            >
              <Brain className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Explorador 3D Optimizado */}
          <TabsContent value="explorer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
            >
              <NeuralErrorBoundary onError={handleNeuralError}>
                <SafeThreeProvider>
                  <Suspense fallback={<OptimizedLoadingSpinner />}>
                    <PAESUniverseDashboard battleMode={battleModeActive} />
                  </Suspense>
                </SafeThreeProvider>
              </NeuralErrorBoundary>
            </motion.div>
          </TabsContent>

          {/* Galaxias Educativas - Sin cambios mayores */}
          <TabsContent value="galaxies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galaxies.map((galaxy, index) => {
                const Icon = galaxy.icon;
                return (
                  <motion.div
                    key={galaxy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => handleGalaxySelect(galaxy.id)}
                  >
                    <Card className={`bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-xl border-white/20 hover:border-white/40 transition-all ${
                      selectedGalaxy === galaxy.id ? 'ring-2 ring-cyan-400' : ''
                    }`}>
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${galaxy.color} rounded-xl flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-white">{galaxy.name}</CardTitle>
                            <p className="text-gray-300 text-sm">{galaxy.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-white/80">Progreso</span>
                          <span className="text-cyan-400 font-semibold">{galaxy.progress}%</span>
                        </div>
                        
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${galaxy.color} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${galaxy.progress}%` }}
                            transition={{ delay: index * 0.2, duration: 1 }}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {galaxy.planets.map((planet) => (
                            <Badge 
                              key={planet}
                              variant="outline" 
                              className="text-white/80 border-white/20 text-xs"
                            >
                              <Star className="w-3 h-3 mr-1" />
                              {planet}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          className={`w-full bg-gradient-to-r ${galaxy.color} hover:opacity-90`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGalaxySelect(galaxy.id);
                          }}
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Explorar Galaxia
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Dashboard Universo Optimizado */}
          <TabsContent value="dashboard" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <NeuralErrorBoundary onError={handleNeuralError}>
                <Suspense fallback={<OptimizedLoadingSpinner />}>
                  <PAESUniverseDashboard battleMode={battleModeActive} />
                </Suspense>
              </NeuralErrorBoundary>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Footer del Universo con Métricas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-8 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <SystemHealthIndicator systemHealth={systemHealth} />
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <span>Battle Mode: {battleModeActive ? 'ON' : 'OFF'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Galaxias Exploradas: {selectedGalaxy ? '1' : '0'}/4</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-green-400" />
                  <span>Recovery: {neuralRetryCount}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
