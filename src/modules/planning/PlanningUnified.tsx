
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Plus,
  BookOpen,
  Clock
} from 'lucide-react';

interface PlanningProps {
  userId?: string;
  onNavigate?: (path: string) => void;
}

export const PlanningUnified: React.FC<PlanningProps> = ({
  userId,
  onNavigate
}) => {
  const [activeView, setActiveView] = useState<'overview' | 'create' | 'calendar'>('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-teal-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Planificador Inteligente</h1>
              <p className="text-white/70">Tu hoja de ruta hacia el éxito PAES</p>
            </div>
          </div>
          
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <TrendingUp className="w-4 h-4 mr-2" />
            Adaptativo
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Vistas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setActiveView('overview')}
                  variant={activeView === 'overview' ? 'default' : 'outline'}
                  className="w-full justify-start text-sm"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Resumen
                </Button>
                
                <Button
                  onClick={() => setActiveView('create')}
                  variant={activeView === 'create' ? 'default' : 'outline'}
                  className="w-full justify-start text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Plan
                </Button>
                
                <Button
                  onClick={() => setActiveView('calendar')}
                  variant={activeView === 'calendar' ? 'default' : 'outline'}
                  className="w-full justify-start text-sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendario
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 space-y-2">
                <Button 
                  onClick={() => onNavigate?.('/lectoguia')}
                  className="w-full text-sm"
                  variant="outline"
                >
                  Ir a LectoGuía
                </Button>
                <Button 
                  onClick={() => onNavigate?.('/diagnostic')}
                  className="w-full text-sm"
                  variant="outline"
                >
                  Ver Diagnóstico
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeView === 'overview' && (
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Resumen de Planificación
                      </h3>
                      <p className="text-white/70 mb-6">
                        Visualiza tu progreso y planes de estudio activos
                      </p>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-green-400">0</div>
                          <div className="text-xs text-white/70">Planes Activos</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-blue-400">0h</div>
                          <div className="text-xs text-white/70">Esta Semana</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-lg">
                          <div className="text-2xl font-bold text-purple-400">0%</div>
                          <div className="text-xs text-white/70">Progreso</div>
                        </div>
                      </div>
                      
                      <Button onClick={() => setActiveView('create')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Mi Primer Plan
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {activeView === 'create' && (
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-8 text-center">
                      <Plus className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Crear Plan de Estudios
                      </h3>
                      <p className="text-white/70 mb-6">
                        Genera un plan personalizado basado en tus objetivos
                      </p>
                      
                      <div className="max-w-md mx-auto space-y-4">
                        <Card className="bg-white/5 border-white/10 p-4">
                          <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-green-400" />
                            <div className="text-left">
                              <div className="text-white font-medium">Plan PAES 2024</div>
                              <div className="text-white/60 text-sm">Preparación integral</div>
                            </div>
                          </div>
                        </Card>
                        
                        <Button className="w-full">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Crear Plan Automático
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeView === 'calendar' && (
                  <Card className="bg-white/10 border-white/20">
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Calendario de Estudios
                      </h3>
                      <p className="text-white/70 mb-6">
                        Organiza tu tiempo y mantén el seguimiento
                      </p>
                      
                      <div className="max-w-md mx-auto p-4 bg-white/5 rounded-lg border border-white/10">
                        <Clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">
                          📅 Vista de calendario disponible cuando tengas planes activos
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
