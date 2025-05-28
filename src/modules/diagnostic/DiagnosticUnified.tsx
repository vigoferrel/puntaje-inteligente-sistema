
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  BarChart3, 
  Brain, 
  Play,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface DiagnosticProps {
  userId?: string;
  onNavigate?: (path: string) => void;
}

export const DiagnosticUnified: React.FC<DiagnosticProps> = ({
  userId,
  onNavigate
}) => {
  const [activePhase, setActivePhase] = useState<'selection' | 'testing' | 'results'>('selection');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const availableTests = [
    { id: 'comprension', name: 'Comprensión Lectora', icon: Target, color: 'from-blue-500 to-cyan-500' },
    { id: 'matematica1', name: 'Matemática M1', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
    { id: 'matematica2', name: 'Matemática M2', icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
    { id: 'ciencias', name: 'Ciencias', icon: Brain, color: 'from-orange-500 to-red-500' },
  ];

  const handleTestToggle = useCallback((testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  }, []);

  const handleStartDiagnostic = useCallback(() => {
    if (selectedTests.length > 0) {
      setActivePhase('testing');
    }
  }, [selectedTests.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
              <Target className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Centro Diagnóstico</h1>
              <p className="text-white/70">Evaluación inteligente y adaptativa</p>
            </div>
          </div>
          
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Brain className="w-4 h-4 mr-2" />
            IA Neural Activa
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {activePhase === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Test Selection */}
                <div className="lg:col-span-2 space-y-6">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Selecciona las Pruebas PAES a Evaluar
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {availableTests.map((test) => {
                        const Icon = test.icon;
                        const isSelected = selectedTests.includes(test.id);
                        
                        return (
                          <motion.div
                            key={test.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Card 
                              className={`cursor-pointer transition-all ${
                                isSelected 
                                  ? 'bg-white/20 border-cyan-400' 
                                  : 'bg-white/5 border-white/10 hover:bg-white/10'
                              }`}
                              onClick={() => handleTestToggle(test.id)}
                            >
                              <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg bg-gradient-to-r ${test.color}`}>
                                    <Icon className="w-5 h-5 text-white" />
                                  </div>
                                  <span className="text-white font-medium">{test.name}</span>
                                </div>
                                {isSelected && (
                                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <Card className="bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white text-sm">
                        Configuración
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-cyan-400">
                          {selectedTests.length}
                        </div>
                        <div className="text-xs text-white/70">
                          Pruebas Seleccionadas
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleStartDiagnostic}
                        disabled={selectedTests.length === 0}
                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Diagnóstico
                      </Button>

                      <div className="space-y-2 text-xs text-white/60">
                        <p>• Duración: ~15-20 min por prueba</p>
                        <p>• Adaptativo basado en respuestas</p>
                        <p>• Resultados inmediatos</p>
                      </div>
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
                        onClick={() => onNavigate?.('/planning')}
                        className="w-full text-sm"
                        variant="outline"
                      >
                        Ver Planificación
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activePhase === 'testing' && (
            <motion.div
              key="testing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="bg-white/10 border-white/20 max-w-4xl mx-auto">
                <CardContent className="p-8 text-center">
                  <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Diagnóstico en Progreso
                  </h3>
                  <p className="text-white/70 mb-8">
                    El sistema está generando preguntas adaptativas basadas en tu perfil
                  </p>
                  
                  <Progress value={65} className="mb-6" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-cyan-400 font-bold">12/20</div>
                      <div className="text-white/60">Preguntas</div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-green-400 font-bold">85%</div>
                      <div className="text-white/60">Precisión</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
