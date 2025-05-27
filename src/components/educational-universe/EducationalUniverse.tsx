
import React, { Suspense, useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { SafeThreeProvider } from '@/core/three/SafeThreeProvider';
import { PAESUniverseDashboard } from '@/components/paes-universe/PAESUniverseDashboard';

export const EducationalUniverse: React.FC = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [battleModeActive, setBattleModeActive] = useState(false);

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

  const handleGalaxySelect = (galaxyId: string) => {
    setSelectedGalaxy(galaxyId);
    console.log(`🌌 Navegando a galaxia: ${galaxyId}`);
  };

  const handleBattleMode = () => {
    setBattleModeActive(!battleModeActive);
    console.log(`⚔️ Battle Mode: ${!battleModeActive ? 'ACTIVADO' : 'DESACTIVADO'}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header del Universo */}
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
              <p className="text-white/80 text-lg">Exploración Educativa en 3D</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500">
              <Brain className="w-4 h-4 mr-2" />
              IA Neural Activa
            </Badge>
            
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

        {/* Tabs del Universo */}
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

          {/* Explorador 3D */}
          <TabsContent value="explorer" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
            >
              <SafeThreeProvider>
                <Suspense fallback={
                  <div className="h-96 flex items-center justify-center">
                    <div className="text-white/60">Cargando Universo 3D...</div>
                  </div>
                }>
                  <PAESUniverseDashboard battleMode={battleModeActive} />
                </Suspense>
              </SafeThreeProvider>
            </motion.div>
          </TabsContent>

          {/* Galaxias Educativas */}
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

          {/* Dashboard Universo */}
          <TabsContent value="dashboard" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <PAESUniverseDashboard battleMode={battleModeActive} />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Footer del Universo */}
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
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Neural IA: Activa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-red-400" />
                  <span>Battle Mode: {battleModeActive ? 'ON' : 'OFF'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span>Galaxias Exploradas: {selectedGalaxy ? '1' : '0'}/4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
