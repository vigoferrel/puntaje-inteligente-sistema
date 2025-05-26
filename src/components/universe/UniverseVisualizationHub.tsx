
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, Brain, Star, Play, Eye, Sparkles, 
  Target, TrendingUp, Gamepad2, ArrowRight
} from 'lucide-react';

interface UniverseCard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  route: string;
  icon: React.ComponentType<any>;
  gradient: string;
  features: string[];
  stats: { label: string; value: string; color: string }[];
}

const universeCards: UniverseCard[] = [
  {
    id: 'educational',
    title: 'Universo Educativo',
    subtitle: 'Navegación 3D Galáctica',
    description: 'Explora galaxias temáticas con navegación neural y progreso visual en tiempo real.',
    route: '/universe/educational',
    icon: Globe,
    gradient: 'from-blue-600 via-cyan-500 to-teal-600',
    features: ['Galaxias 3D Interactivas', 'Sistema Neural Activo', 'Predicciones IA', 'Progreso Visual'],
    stats: [
      { label: 'Galaxias', value: '5', color: 'text-blue-400' },
      { label: 'Nodos', value: '277', color: 'text-cyan-400' },
      { label: 'Completado', value: '89', color: 'text-green-400' }
    ]
  },
  {
    id: 'paes-dashboard',
    title: 'Dashboard Universo PAES',
    subtitle: 'Épico Sistema de Batalla',
    description: 'Dashboard cinematográfico con modos batalla, rankings y métricas avanzadas de gamificación.',
    route: '/universe/paes-dashboard',
    icon: Star,
    gradient: 'from-purple-600 via-pink-500 to-red-600',
    features: ['Modo Batalla PvP', 'Rankings Nacional', 'Métricas Épicas', 'Sistema de Logros'],
    stats: [
      { label: 'Nivel', value: '15', color: 'text-purple-400' },
      { label: 'Batalla Pts', value: '1456', color: 'text-pink-400' },
      { label: 'Ranking', value: '#287', color: 'text-yellow-400' }
    ]
  },
  {
    id: 'learning',
    title: 'Universo de Aprendizaje',
    subtitle: 'Constelaciones de Conocimiento',
    description: 'Visualización 3D de nodos de aprendizaje organizados en constelaciones por materia.',
    route: '/universe/learning',
    icon: Brain,
    gradient: 'from-green-600 via-emerald-500 to-teal-600',
    features: ['Nodos 3D Interactivos', 'Constelaciones Temáticas', 'Rutas Óptimas', 'Progreso Adaptativo'],
    stats: [
      { label: 'Constelaciones', value: '5', color: 'text-green-400' },
      { label: 'Nodos Totales', value: '215', color: 'text-emerald-400' },
      { label: 'Progreso', value: '67%', color: 'text-teal-400' }
    ]
  }
];

export const UniverseVisualizationHub: React.FC = () => {
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-white text-3xl">Universe Explorer</CardTitle>
                  <p className="text-purple-200 text-lg">
                    Centro de Visualizaciones 3D Épicas
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-purple-300">Universos Activos</div>
                <div className="text-3xl font-bold text-white">{universeCards.length}</div>
                <Badge className="mt-2 bg-green-600 text-white">
                  Sistema Neural Online
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Universe Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {universeCards.map((universe, index) => {
            const Icon = universe.icon;
            const isSelected = selectedUniverse === universe.id;
            
            return (
              <motion.div
                key={universe.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onHoverStart={() => setSelectedUniverse(universe.id)}
                onHoverEnd={() => setSelectedUniverse(null)}
              >
                <Card className={`h-full bg-gradient-to-br ${universe.gradient}/20 border-white/20 backdrop-blur-xl overflow-hidden cursor-pointer transition-all duration-500 ${isSelected ? 'border-white/40 shadow-2xl' : ''}`}>
                  <CardContent className="p-6 h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${universe.gradient} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-xl">{universe.title}</h3>
                        <p className="text-white/70 text-sm">{universe.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-white/80 text-sm mb-6 flex-1">
                      {universe.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {universe.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                          <div className="text-white/60 text-xs">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="text-white font-medium text-sm mb-3">Características Principales</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {universe.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs text-white/80 border-white/30 justify-start">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <NavLink to={universe.route} className="block">
                        <Button className={`w-full bg-gradient-to-r ${universe.gradient} hover:opacity-90 text-white`}>
                          <Play className="w-4 h-4 mr-2" />
                          Explorar Universo
                        </Button>
                      </NavLink>
                      
                      <Button 
                        variant="outline" 
                        className="w-full border-white/30 text-white hover:bg-white/10"
                        onClick={() => {/* Quick preview */}}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Vista Previa
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <Card className="bg-black/20 backdrop-blur-xl border-white/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">3</div>
                <div className="text-white/60 text-sm">Universos Activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">497</div>
                <div className="text-white/60 text-sm">Nodos Totales</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">89%</div>
                <div className="text-white/60 text-sm">Sistema Neural</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">24/7</div>
                <div className="text-white/60 text-sm">Disponibilidad</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
