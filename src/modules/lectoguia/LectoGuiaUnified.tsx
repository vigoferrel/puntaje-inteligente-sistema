
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  MessageCircle, 
  Target, 
  TrendingUp,
  Brain,
  Sparkles
} from 'lucide-react';

interface LectoGuiaProps {
  userId?: string;
  onNavigate?: (path: string) => void;
}

export const LectoGuiaUnified: React.FC<LectoGuiaProps> = ({
  userId,
  onNavigate
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'reading' | 'analysis'>('chat');

  const handleModeChange = useCallback((mode: 'chat' | 'reading' | 'analysis') => {
    setActiveMode(mode);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-white/10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">LectoGuía IA</h1>
              <p className="text-white/70">Asistente inteligente de comprensión lectora</p>
            </div>
          </div>
          
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <Brain className="w-4 h-4 mr-2" />
            Sistema Neural Activo
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
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Modos de Trabajo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => handleModeChange('chat')}
                  variant={activeMode === 'chat' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Inteligente
                </Button>
                
                <Button
                  onClick={() => handleModeChange('reading')}
                  variant={activeMode === 'reading' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Análisis de Lectura
                </Button>
                
                <Button
                  onClick={() => handleModeChange('analysis')}
                  variant={activeMode === 'analysis' ? 'default' : 'outline'}
                  className="w-full justify-start"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Evaluación PAES
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4 space-y-2">
                <Button 
                  onClick={() => onNavigate?.('/diagnostic')}
                  className="w-full text-sm"
                  variant="outline"
                >
                  Ir a Diagnóstico
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

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 min-h-[600px]">
                  <CardContent className="p-8">
                    {activeMode === 'chat' && (
                      <div className="text-center py-20">
                        <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Chat Inteligente</h3>
                        <p className="text-white/70 mb-6">
                          Conversa con la IA sobre cualquier texto o concepto
                        </p>
                        <div className="max-w-md mx-auto p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/60 text-sm">
                            💡 Sube un texto, imagen o simplemente pregunta sobre comprensión lectora
                          </p>
                        </div>
                      </div>
                    )}

                    {activeMode === 'reading' && (
                      <div className="text-center py-20">
                        <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Análisis de Lectura</h3>
                        <p className="text-white/70 mb-6">
                          Analiza textos con IA para mejorar tu comprensión
                        </p>
                        <div className="max-w-md mx-auto p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/60 text-sm">
                            📚 Herramientas avanzadas de análisis textual y comprensión
                          </p>
                        </div>
                      </div>
                    )}

                    {activeMode === 'analysis' && (
                      <div className="text-center py-20">
                        <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Evaluación PAES</h3>
                        <p className="text-white/70 mb-6">
                          Practica comprensión lectora con enfoque PAES
                        </p>
                        <div className="max-w-md mx-auto p-4 bg-white/5 rounded-lg border border-white/10">
                          <p className="text-white/60 text-sm">
                            🎯 Ejercicios específicos para prueba de Competencia Lectora
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
