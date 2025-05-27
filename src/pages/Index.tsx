
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicSystemWrapper } from '@/components/cinematic/CinematicSystemWrapper';
import { SuperPAESMain } from '@/components/super-paes/SuperPAESMain';
import { OptimizedCinematicProvider } from '@/components/cinematic/OptimizedCinematicSystem';
import { CinematicAudioProvider } from '@/components/cinematic/UniversalCinematicSystem';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UnifiedEducationalHub } from '@/components/unified-dashboard/UnifiedEducationalHub';
import { EnhancedNeuralCommandCenter } from '@/components/neural-command/EnhancedNeuralCommandCenter';
import { EducationalUniverse } from '@/components/educational-universe/EducationalUniverse';
import { Brain, Rocket, Globe, Crown } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleNavigateToTool = (tool: string) => {
    console.log(`🎬 Navegación cinematográfica: ${tool}`);
    
    const toolRoutes: Record<string, string> = {
      'lectoguia': '/lectoguia',
      'financial': '/financial',
      'diagnostic': '/diagnostic',
      'planning': '/planning',
      'centro-financiero': '/financial',
      'diagnostico': '/diagnostic',
      'planificador': '/planning',
      'ecosystem': '/ecosystem',
      'achievements': '/achievements',
      'universe': '/universe'
    };

    const route = toolRoutes[tool];
    if (route) {
      navigate(route);
    } else {
      console.warn(`Ruta no encontrada para la herramienta: ${tool}`);
    }
  };

  return (
    <OptimizedCinematicProvider>
      <CinematicAudioProvider>
        <CinematicSystemWrapper cinematicMode={true}>
          <div className="min-h-screen relative">
            {/* Header Cinematográfico Principal */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-50 p-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity }
                  }}
                  className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-full flex items-center justify-center"
                >
                  <Crown className="w-12 h-12 text-white" />
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2"
                >
                  SuperPAES Neural
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl text-white/80"
                >
                  Experiencia Educativa Cinematográfica
                </motion.p>
                
                {profile && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-lg text-cyan-300 mt-2"
                  >
                    Bienvenido al futuro, {profile.name} 🚀
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Tabs Cinematográficos Principales */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative z-40 px-6"
            >
              <Tabs defaultValue="superpaes" className="w-full max-w-7xl mx-auto">
                <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-xl border border-white/20 mb-8">
                  <TabsTrigger 
                    value="superpaes" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 text-white"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    SuperPAES
                  </TabsTrigger>
                  <TabsTrigger 
                    value="universe" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 text-white"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Universo 3D
                  </TabsTrigger>
                  <TabsTrigger 
                    value="neural" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 text-white"
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Neural Center
                  </TabsTrigger>
                  <TabsTrigger 
                    value="hub" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 text-white"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    Hub Clásico
                  </TabsTrigger>
                </TabsList>

                {/* SuperPAES Dashboard Principal */}
                <TabsContent value="superpaes" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <SuperPAESMain />
                  </motion.div>
                </TabsContent>

                {/* Universo Educativo 3D */}
                <TabsContent value="universe" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, rotateY: -20 }}
                    animate={{ opacity: 1, rotateY: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="min-h-screen"
                  >
                    <EducationalUniverse />
                  </motion.div>
                </TabsContent>

                {/* Neural Command Center */}
                <TabsContent value="neural" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <EnhancedNeuralCommandCenter />
                  </motion.div>
                </TabsContent>

                {/* Hub Clásico */}
                <TabsContent value="hub" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <UnifiedEducationalHub onNavigateToTool={handleNavigateToTool} />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Efectos de Fondo Cinematográficos Adicionales */}
            <div className="fixed inset-0 pointer-events-none z-0">
              {/* Gradiente dinámico de fondo */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  background: [
                    'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(255, 119, 255, 0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Líneas de circuito neuronal */}
              <svg className="absolute inset-0 w-full h-full opacity-20">
                <defs>
                  <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <path d="M0,50 Q25,25 50,50 T100,50" stroke="url(#gradient)" strokeWidth="1" fill="none" />
                    <path d="M50,0 Q75,25 50,50 T50,100" stroke="url(#gradient)" strokeWidth="1" fill="none" />
                  </pattern>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#circuit)" />
              </svg>
            </div>
          </div>
        </CinematicSystemWrapper>
      </CinematicAudioProvider>
    </OptimizedCinematicProvider>
  );
};

export default Index;
