/* eslint-disable react-refresh/only-export-components */
import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { UserType } from '../../../types/cinematic-universe';
import { Brain, Target, Zap, BarChart3, Play, Sparkles } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { DiagnosticoNeuralCompleto } from '../../../components/diagnostic-neural/DiagnosticoNeuralCompleto';

interface DiagnosticoUniverseNeuralProps {
  userType: UserType;
  onUniverseChange: (universe: string) => void;
}

export const DiagnosticoUniverseNeural: React.FC<DiagnosticoUniverseNeuralProps> = ({ 
  userType, 
  onUniverseChange 
}) => {
  const [activeMode, setActiveMode] = useState<'selection' | 'neural-diagnostic'>('selection');

  const getUserTheme = () => {
    switch (userType) {
      case 'estudiante':
        return {
          primary: 'from-cyan-400 to-purple-500',
          secondary: 'from-blue-500 to-cyan-400',
          accent: 'text-cyan-400',
          bg: 'from-blue-900 via-purple-900 to-indigo-900'
        };
      case 'profesor':
        return {
          primary: 'from-emerald-400 to-yellow-500',
          secondary: 'from-green-500 to-emerald-400',
          accent: 'text-emerald-400',
          bg: 'from-green-900 via-emerald-900 to-teal-900'
        };
      default:
        return {
          primary: 'from-purple-400 to-pink-500',
          secondary: 'from-indigo-500 to-purple-400',
          accent: 'text-purple-400',
          bg: 'from-purple-900 via-indigo-900 to-blue-900'
        };
    }
  };

  const theme = getUserTheme();

  const startNeuralDiagnostic = () => {
    setActiveMode('neural-diagnostic');
  };

  const handleDiagnosticComplete = () => {
    setActiveMode('selection');
    // Opcional: redirigir a otro universo
    // onUniverseChange('dashboard');
  };

  const renderSelectionMode = () => (
    <div className="space-y-8">
      {/* Header cinematogrÃ¡fico */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity }
          }}
          className="w-24 h-24 mx-auto mb-6"
        >
          <Brain className={`w-full h-full ${theme.accent}`} />
        </motion.div>

        <h1 className={`text-6xl font-bold bg-gradient-to-r ${theme.primary} bg-clip-text text-transparent mb-4`}>
          ðŸŽ¯ DiagnÃ³stico Universe
        </h1>
        <p className="text-xl text-cyan-300 mb-2">
          Sistema de EvaluaciÃ³n Neural CinematogrÃ¡fico
        </p>
        <p className="text-gray-400">
          DiagnÃ³stico adaptativo con IA, predicciones PAES reales y analytics neurales
        </p>
      </motion.div>

      {/* Opciones de diagnÃ³stico */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
      >
        {/* DiagnÃ³stico Neural Completo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02, y: -5 }}
          className="cursor-pointer"
        >
          <Card className="bg-black/40 backdrop-blur-md border-white/20 hover:border-cyan-400/50 transition-all duration-300 h-full">
            <CardHeader className="text-center pb-4">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto mb-4"
              >
                <div className={`w-full h-full rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center`}>
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <CardTitle className="text-2xl text-white mb-2">
                DiagnÃ³stico Neural Completo
              </CardTitle>
              <p className="text-gray-300 text-sm">
                EvaluaciÃ³n adaptativa con IA neural avanzada
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* CaracterÃ­sticas principales */}
              <div className="space-y-3">
                {[
                  { icon: Brain, text: 'IA Neural Adaptativa', desc: 'Se adapta en tiempo real a tu rendimiento' },
                  { icon: Target, text: 'Predicciones PAES Reales', desc: 'Algoritmos de predicciÃ³n con 85% de precisiÃ³n' },
                  { icon: Zap, text: 'Bloom Levels DinÃ¡micos', desc: 'EvaluaciÃ³n cognitiva progresiva' },
                  { icon: BarChart3, text: 'Analytics Neurales', desc: 'MÃ©tricas avanzadas de aprendizaje' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <feature.icon className={`w-5 h-5 mt-1 ${theme.accent} flex-shrink-0`} />
                    <div>
                      <div className="text-white font-medium text-sm">{feature.text}</div>
                      <div className="text-gray-400 text-xs">{feature.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* MÃ©tricas del sistema */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                {[
                  { label: 'DuraciÃ³n', value: '15-25 min', color: 'text-cyan-400' },
                  { label: 'Preguntas', value: 'Adaptativo', color: 'text-purple-400' },
                  { label: 'PrecisiÃ³n IA', value: '85%', color: 'text-green-400' },
                  { label: 'Bloom Levels', value: '6 niveles', color: 'text-yellow-400' }
                ].map((metric, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-lg font-bold ${metric.color}`}>{metric.value}</div>
                    <div className="text-xs text-gray-400">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* BotÃ³n de inicio */}
              <Button 
                onClick={startNeuralDiagnostic}
                className={`w-full bg-gradient-to-r ${theme.primary} hover:opacity-90 text-white py-3 text-lg font-semibold`}
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar DiagnÃ³stico Neural
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* InformaciÃ³n adicional */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-6"
        >
          {/* QuÃ© incluye */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Â¿QuÃ© incluye el DiagnÃ³stico Neural?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                'EvaluaciÃ³n adaptativa que se ajusta a tu nivel en tiempo real',
                'Predicciones PAES precisas usando algoritmos de IA neural',
                'AnÃ¡lisis de velocidad de aprendizaje y retenciÃ³n cognitiva',
                'Mapa personalizado de habilidades con niveles de Bloom',
                'Plan de estudio personalizado basado en tus resultados',
                'GamificaciÃ³n neural con logros y mÃ©tricas de engagement',
                'Recomendaciones de nodos de aprendizaje especÃ­ficos'
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${theme.accent.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                  <span className="text-gray-300 text-sm">{item}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Beneficios por tipo de usuario */}
          <Card className="bg-black/30 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Beneficios para {userType === 'estudiante' ? 'Estudiantes' : userType === 'profesor' ? 'Profesores' : 'Administradores'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userType === 'estudiante' && (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">â€¢ Conoce tu nivel real en cada materia PAES</p>
                  <p className="text-gray-300 text-sm">â€¢ ObtÃ©n predicciones precisas de tu puntaje</p>
                  <p className="text-gray-300 text-sm">â€¢ Recibe un plan de estudio personalizado</p>
                  <p className="text-gray-300 text-sm">â€¢ Descubre tu tiempo Ã³ptimo de estudio</p>
                </div>
              )}
              {userType === 'profesor' && (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">â€¢ EvalÃºa el nivel de tus estudiantes</p>
                  <p className="text-gray-300 text-sm">â€¢ Identifica Ã¡reas de mejora grupales</p>
                  <p className="text-gray-300 text-sm">â€¢ ObtÃ©n analytics de aprendizaje</p>
                  <p className="text-gray-300 text-sm">â€¢ Personaliza la enseÃ±anza por estudiante</p>
                </div>
              )}
              {userType === 'administrador' && (
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">â€¢ Monitorea el rendimiento institucional</p>
                  <p className="text-gray-300 text-sm">â€¢ ObtÃ©n mÃ©tricas de efectividad</p>
                  <p className="text-gray-300 text-sm">â€¢ Identifica tendencias de aprendizaje</p>
                  <p className="text-gray-300 text-sm">â€¢ Optimiza recursos educativos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* NavegaciÃ³n */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center"
      >
        <Button
          variant="outline"
          onClick={() => onUniverseChange('dashboard')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Volver al Dashboard
        </Button>
      </motion.div>
    </div>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.bg} p-6`}>
      <div className="max-w-7xl mx-auto pt-20">
        <AnimatePresence mode="wait">
          {activeMode === 'selection' && (
            <motion.div
              key="selection"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.5 }}
            >
              {renderSelectionMode()}
            </motion.div>
          )}
          
          {activeMode === 'neural-diagnostic' && (
            <motion.div
              key="neural-diagnostic"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <DiagnosticoNeuralCompleto 
                userType={userType}
                onComplete={handleDiagnosticComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
