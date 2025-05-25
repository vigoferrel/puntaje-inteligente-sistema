
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Target, 
  BookOpen, 
  MessageSquare, 
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  Clock
} from "lucide-react";
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';

interface LectoGuiaUnifiedCinematicProps {
  initialSubject?: string;
  onSubjectChange?: (subject: string) => void;
  onNavigateToTool?: (tool: string) => void;
}

export const LectoGuiaUnifiedCinematic: React.FC<LectoGuiaUnifiedCinematicProps> = ({
  initialSubject = 'COMPETENCIA_LECTORA',
  onSubjectChange,
  onNavigateToTool
}) => {
  const [activeMode, setActiveMode] = useState<'chat' | 'exercise' | 'overview'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  const { getStats, generateExercise, chatHistory } = useLectoGuiaSimplified();
  const stats = getStats();

  const cinematicModes = useMemo(() => [
    {
      id: 'overview',
      title: 'Centro de Control',
      description: 'Vista general de tu progreso',
      icon: Target,
      color: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'chat',
      title: 'IA Conversacional',
      description: 'Asistente inteligente personalizado',
      icon: MessageSquare,
      color: 'from-purple-400 to-pink-500'
    },
    {
      id: 'exercise',
      title: 'Ejercicios Adaptativos',
      description: 'Práctica personalizada en tiempo real',
      icon: Brain,
      color: 'from-green-400 to-emerald-500'
    }
  ], []);

  const handleModeChange = (mode: 'chat' | 'exercise' | 'overview') => {
    setIsLoading(true);
    setTimeout(() => {
      setActiveMode(mode);
      setIsLoading(false);
    }, 300);
  };

  const renderOverviewMode = () => (
    <div className="space-y-6">
      {/* Métricas Cinematográficas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Ejercicios Completados',
            value: stats.exercisesCompleted,
            icon: Target,
            color: 'from-blue-500 to-cyan-500',
            trend: '+12%'
          },
          {
            title: 'Precisión Promedio',
            value: `${stats.averageScore}%`,
            icon: Award,
            color: 'from-green-500 to-emerald-500',
            trend: '+8%'
          },
          {
            title: 'Racha Actual',
            value: `${stats.streak} días`,
            icon: Zap,
            color: 'from-purple-500 to-pink-500',
            trend: 'Activa'
          }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="cinematic-card group hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${metric.color}`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-white/10 text-white border-white/20">
                    {metric.trend}
                  </Badge>
                </div>
                <h3 className="text-white/80 text-sm font-medium poppins-body mb-2">
                  {metric.title}
                </h3>
                <p className="text-3xl font-bold text-white cinematic-text-glow poppins-title">
                  {metric.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Acciones Rápidas Cinematográficas */}
      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            Entrenamientos Recomendados
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Comprensión Lectora Avanzada',
              description: 'Textos complejos con análisis profundo',
              difficulty: 'Avanzado',
              time: '15 min',
              action: () => handleModeChange('exercise')
            },
            {
              title: 'Análisis Conversacional',
              description: 'Discusión guiada con IA especializada',
              difficulty: 'Intermedio',
              time: '20 min',
              action: () => handleModeChange('chat')
            }
          ].map((training, index) => (
            <motion.div
              key={training.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cinematic-glass rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-white poppins-subtitle">
                  {training.title}
                </h4>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  {training.difficulty}
                </Badge>
              </div>
              <p className="text-white/70 text-sm poppins-body">
                {training.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/60">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{training.time}</span>
                </div>
                <Button
                  onClick={training.action}
                  className="cinematic-button"
                  size="sm"
                >
                  Iniciar
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Progreso General */}
      <Card className="cinematic-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3 poppins-title">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Evolución Semanal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {['Comprensión Lectora', 'Análisis Crítico', 'Vocabulario'].map((skill, index) => (
              <div key={skill} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm poppins-body">{skill}</span>
                  <span className="text-cyan-400 font-medium">
                    {Math.min(100, 60 + index * 15)}%
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, 60 + index * 15)} 
                  className="h-2 bg-white/10"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderChatMode = () => (
    <Card className="cinematic-card h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3 poppins-title">
          <MessageSquare className="w-6 h-6 text-purple-400" />
          Asistente IA Conversacional
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 bg-black/20 rounded-xl p-4 mb-4 overflow-y-auto cinematic-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="text-center text-white/60 space-y-4 mt-20">
              <Brain className="w-16 h-16 mx-auto text-purple-400/50" />
              <p className="poppins-body">
                ¡Hola! Soy tu asistente de LectoGuía. ¿En qué puedo ayudarte hoy?
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {chatHistory.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-cyan-500/20 text-white border border-cyan-500/30'
                      : 'bg-purple-500/20 text-white border border-purple-500/30'
                  }`}>
                    <p className="text-sm poppins-body">{message.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 poppins-body"
          />
          <Button className="cinematic-button px-6">
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderExerciseMode = () => (
    <Card className="cinematic-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-3 poppins-title">
          <Brain className="w-6 h-6 text-green-400" />
          Ejercicios Adaptativos IA
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6 py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto border-3 border-green-400/30 border-t-green-400 rounded-full"
        />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white poppins-subtitle">
            Generando Ejercicio Personalizado
          </h3>
          <p className="text-white/70 poppins-body">
            Adaptando dificultad según tu progreso...
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-6 space-y-6 font-poppins">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold cinematic-gradient-text poppins-heading">
          LectoGuía IA
        </h1>
        <p className="text-lg text-white/80 poppins-body">
          Asistente inteligente para Competencia Lectora PAES
        </p>
      </motion.div>

      {/* Navegación de Modos */}
      <Card className="cinematic-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cinematicModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              
              return (
                <motion.div
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => handleModeChange(mode.id as any)}
                    className={`h-auto p-6 w-full ${
                      isActive 
                        ? `bg-gradient-to-r ${mode.color} shadow-lg scale-105` 
                        : `bg-gradient-to-r ${mode.color} opacity-70 hover:opacity-90`
                    }`}
                    disabled={isLoading}
                  >
                    <div className="text-center space-y-3">
                      <Icon className="w-8 h-8 mx-auto" />
                      <div>
                        <h3 className="font-semibold text-sm poppins-subtitle">{mode.title}</h3>
                        <p className="text-xs opacity-90 poppins-caption">{mode.description}</p>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del Modo Activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          {isLoading ? (
            <Card className="cinematic-card">
              <CardContent className="p-12 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto border-3 border-cyan-400/30 border-t-cyan-400 rounded-full mb-4"
                />
                <p className="text-white/70 poppins-body">Cargando modo...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {activeMode === 'overview' && renderOverviewMode()}
              {activeMode === 'chat' && renderChatMode()}
              {activeMode === 'exercise' && renderExerciseMode()}
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
