
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUnifiedCinematic } from '@/components/cinematic/UnifiedCinematicProvider';
import { 
  Brain, 
  Target, 
  Zap, 
  BookOpen, 
  Users, 
  Award,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';

export const SuperPAESMain: React.FC = () => {
  const { state } = useUnifiedCinematic();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <div className="text-xl font-bold">SuperPAES Neural Activado</div>
          <div className="text-sm text-purple-200 mt-2">Coordinación vocacional en línea...</div>
        </motion.div>
      </div>
    );
  }

  const superpaesModules = [
    {
      id: 'overview',
      name: 'Vista General',
      icon: Brain,
      description: 'Panel principal del sistema SuperPAES'
    },
    {
      id: 'diagnostic',
      name: 'Diagnóstico',
      icon: Target,
      description: 'Evaluación adaptativa neural'
    },
    {
      id: 'preparation',
      name: 'Preparación',
      icon: BookOpen,
      description: 'Entrenamiento personalizado'
    },
    {
      id: 'progress',
      name: 'Progreso',
      icon: TrendingUp,
      description: 'Métricas de rendimiento'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Energía Neural
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={85} className="h-3" />
                  <div className="text-yellow-400 text-2xl font-bold">85%</div>
                  <div className="text-white/70 text-sm">Sistema operativo</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Precisión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Progress value={92} className="h-3" />
                  <div className="text-green-400 text-2xl font-bold">92%</div>
                  <div className="text-white/70 text-sm">Tasa de acierto</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Tiempo Activo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-cyan-400 text-2xl font-bold">2h 45m</div>
                  <div className="text-white/70 text-sm">Sesión actual</div>
                  <Badge className="bg-cyan-600">En línea</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'diagnostic':
        return (
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Sistema de Diagnóstico Neural</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-purple-400 animate-pulse" />
                <div className="text-white text-lg mb-2">Diagnóstico Adaptativo</div>
                <div className="text-white/60 mb-6">Evaluación personalizada basada en IA</div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Iniciar Diagnóstico
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'preparation':
        return (
          <div className="space-y-6">
            <Card className="bg-black/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Plan de Preparación Personalizado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">Matemáticas</span>
                    </div>
                    <Progress value={75} className="h-2 mb-2" />
                    <div className="text-blue-400 text-sm">75% completado</div>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-green-400" />
                      <span className="text-white font-medium">Lenguaje</span>
                    </div>
                    <Progress value={88} className="h-2 mb-2" />
                    <div className="text-green-400 text-sm">88% completado</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'progress':
        return (
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Métricas de Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">127</div>
                  <div className="text-white/70 text-sm">Ejercicios Completados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">89%</div>
                  <div className="text-white/70 text-sm">Promedio General</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">12</div>
                  <div className="text-white/70 text-sm">Días de Racha</div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Brain className="w-8 h-8 text-purple-400" />
            SuperPAES Neural
          </h1>
          <p className="text-white/70 text-lg">Sistema de Preparación Avanzada con IA</p>
        </div>

        {/* Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 backdrop-blur-xl">
            {superpaesModules.map((module) => {
              const Icon = module.icon;
              return (
                <TabsTrigger
                  key={module.id}
                  value={module.id}
                  className="flex items-center gap-2 text-white/70 data-[state=active]:text-white data-[state=active]:bg-purple-600"
                >
                  <Icon className="w-4 h-4" />
                  {module.name}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <TabsContent key={activeTab} value={activeTab} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderTabContent()}
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </div>
  );
};
