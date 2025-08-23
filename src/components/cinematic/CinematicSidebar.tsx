
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Globe, Brain, Target, Sparkles, ChevronRight, 
  Star, Gamepad2, TrendingUp, Eye, Play
} from 'lucide-react';

interface UniversePreview {
  id: string;
  name: string;
  route: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description: string;
  status: 'active' | 'coming_soon' | 'beta';
  features: string[];
  preview: string;
}

const universeVisualizationsaa: UniversePreview[] = [
  {
    id: 'educational-universe',
    name: 'Universo Educativo',
    route: '/universe/educational',
    icon: Globe,
    color: 'text-blue-400',
    gradient: 'from-blue-600 to-cyan-600',
    description: 'Navegación 3D por galaxias temáticas PAES',
    status: 'active',
    features: ['Galaxias 3D', 'IA Neural', 'Progreso Visual'],
    preview: 'Explora el cosmos educativo con galaxias temáticas interactivas'
  },
  {
    id: 'paes-universe-dashboard',
    name: 'Dashboard Universo PAES',
    route: '/universe/paes-dashboard',
    icon: Star,
    color: 'text-purple-400',
    gradient: 'from-purple-600 to-pink-600',
    description: 'Dashboard épico con modos batalla y métricas',
    status: 'active',
    features: ['Modo Batalla', 'Métricas Épicas', 'Rankings'],
    preview: 'Dashboard cinematográfico con elementos de gamificación'
  },
  {
    id: 'paes-learning-universe',
    name: 'Universo de Aprendizaje',
    route: '/universe/learning',
    icon: Brain,
    color: 'text-green-400',
    gradient: 'from-green-600 to-emerald-600',
    description: 'Nodos de aprendizaje en constelaciones 3D',
    status: 'active',
    features: ['Nodos 3D', 'Constelaciones', 'Rutas Óptimas'],
    preview: 'Visualización de nodos de aprendizaje en constelaciones interactivas'
  }
];

export const CinematicSidebar: React.FC = () => {
  const [expandedUniverse, setExpandedUniverse] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusBadge = (status: UniversePreview['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 text-white text-xs">Activo</Badge>;
      case 'beta':
        return <Badge className="bg-yellow-600 text-white text-xs">Beta</Badge>;
      case 'coming_soon':
        return <Badge className="bg-gray-600 text-white text-xs">Próximamente</Badge>;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="fixed left-4 top-20 bottom-4 w-80 z-40 pointer-events-auto"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full bg-black/40 backdrop-blur-xl border-white/20 overflow-hidden">
        <CardContent className="p-0 h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Universe Explorer</h2>
                <p className="text-white/60 text-sm">Visualizaciones 3D Épicas</p>
              </div>
            </div>
          </div>

          {/* Universe List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {universeVisualizationsaa.map((universe, index) => {
              const Icon = universe.icon;
              const isExpanded = expandedUniverse === universe.id;
              
              return (
                <motion.div
                  key={universe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  {/* Universe Card */}
                  <Card className={`bg-gradient-to-r ${universe.gradient}/20 border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-white/30`}>
                    <CardContent className="p-4">
                      <div 
                        className="flex items-center justify-between mb-3"
                        onClick={() => setExpandedUniverse(isExpanded ? null : universe.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${universe.gradient} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium text-sm">{universe.name}</h3>
                            <p className="text-white/70 text-xs">{universe.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(universe.status)}
                          <ChevronRight className={`w-4 h-4 text-white/60 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>

                      {/* Quick Access Button */}
                      <NavLink to={universe.route}>
                        <Button 
                          className={`w-full bg-gradient-to-r ${universe.gradient} hover:opacity-90 text-white text-sm`}
                          size="sm"
                        >
                          <Play className="w-3 h-3 mr-2" />
                          Explorar Universo
                        </Button>
                      </NavLink>
                    </CardContent>
                  </Card>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Card className="bg-white/5 border-white/10">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-white font-medium text-sm mb-2">Vista Previa</h4>
                                <p className="text-white/70 text-xs">{universe.preview}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-white font-medium text-sm mb-2">Características</h4>
                                <div className="flex flex-wrap gap-1">
                                  {universe.features.map((feature, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs text-white/80 border-white/30">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-2">
                                <NavLink to={universe.route}>
                                  <Button variant="outline" className="w-full text-xs border-white/30 text-white hover:bg-white/10">
                                    <Eye className="w-3 h-3 mr-2" />
                                    Ver en Detalle
                                  </Button>
                                </NavLink>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-white/60 text-xs mb-2">
                🌌 {universeVisualizationsaa.length} Universos Disponibles
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Sistema Neural Activo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
