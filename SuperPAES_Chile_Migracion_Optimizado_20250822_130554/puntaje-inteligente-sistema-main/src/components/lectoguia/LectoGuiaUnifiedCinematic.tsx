/* eslint-disable react-refresh/only-export-components */
import { FC, useEffect, useState } from 'react';
import '@/styles/CinematicAnimations.css';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import { 
  MessageSquare, 
  Target, 
  TrendingUp, 
  Zap, 
  DollarSign,
  CheckCircle2,
  BookOpen,
  Brain
} from 'lucide-react';
import { useOptimizedLectoGuia } from '../../hooks/useOptimizedLectoGuia';

interface LectoGuiaUnifiedCinematicProps {
  initialSubject?: string;
  onSubjectChange?: (subject: string) => void;
  onNavigateToTool?: (tool: string, context?: unknown) => void;
}

export const LectoGuiaUnifiedCinematic: FC<LectoGuiaUnifiedCinematicProps> = ({
  initialSubject = 'COMPETENCIA_LECTORA',
  onSubjectChange,
  onNavigateToTool
}) => {
  const {
    messages,
    isTyping,
    activeSubject,
    currentExercise,
    selectedOption,
    showFeedback,
    isLoading,
    optimizationStats,
    handleSendMessage,
    handleSubjectChange,
    generateOptimizedExercise,
    handleOptionSelect,
    getStats
  } = useOptimizedLectoGuia();

  useEffect(() => {
    if (initialSubject !== activeSubject) {
      handleSubjectChange(initialSubject);
    }
  }, [initialSubject, activeSubject, handleSubjectChange]);

  useEffect(() => {
    if (onSubjectChange) {
      onSubjectChange(activeSubject);
    }
  }, [activeSubject, onSubjectChange]);

  const stats = getStats();
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      handleSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  const subjectDisplayNames = {
    'COMPETENCIA_LECTORA': 'ComprensiÃƒÂ³n Lectora',
    'MATEMATICA_1': 'MatemÃƒÂ¡tica M1',
    'MATEMATICA_2': 'MatemÃƒÂ¡tica M2',
    'CIENCIAS': 'Ciencias',
    'HISTORIA': 'Historia y GeografÃƒÂ­a'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-6">
      {/* Header optimizado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 cinematic-text-glow">
              LectoGuÃƒÂ­a Optimizado
            </h1>
            <p className="text-purple-200">
              Contenido oficial PAES + IA contextual inteligente
            </p>
          </div>
          
          {/* MÃƒÂ©tricas de optimizaciÃƒÂ³n */}
          {stats.optimizationStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {stats.optimizationStats.officialContentUsage.toFixed(0)}%
                </div>
                <div className="text-xs text-green-200">Contenido Oficial</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  ${stats.optimizationStats.costSavings.toFixed(2)}
                </div>
                <div className="text-xs text-blue-200">Ahorro API</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.exercisesCompleted}
                </div>
                <div className="text-xs text-purple-200">Ejercicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {stats.optimizationStats.quality}
                </div>
                <div className="text-xs text-yellow-200">Calidad</div>
              </div>
            </div>
          )}
        </div>

        {/* Selector de materia */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {Object.entries(subjectDisplayNames).map(([key, name]) => (
            <Button
              key={key}
              variant={activeSubject === key ? "default" : "outline"}
              onClick={() => handleSubjectChange(key)}
              className={`whitespace-nowrap ${
                activeSubject === key 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-purple-400 text-purple-200 hover:bg-purple-800'
              }`}
            >
              {name}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Principal */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardContent className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">
                  Chat Inteligente - {subjectDisplayNames[activeSubject]}
                </h3>
                <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                  Optimizado
                </Badge>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      <p>{message.content}</p>
                      {message.source && (
                        <div className="mt-2 flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              message.source === 'oficial' 
                                ? 'bg-green-500/20 text-green-300' 
                                : message.source === 'ai_contextual'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {message.source === 'oficial' && <BookOpen className="w-3 h-3 mr-1" />}
                            {message.source === 'ai_contextual' && <Brain className="w-3 h-3 mr-1" />}
                            {message.source === 'oficial' ? 'Oficial PAES' : 
                             message.source === 'ai_contextual' ? 'IA Contextual' : 
                             message.source === 'hibrido' ? 'HÃƒÂ­brido' : 'Cache'}
                          </Badge>
                          {message.metadata?.costSaving && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-300 text-xs">
                              <DollarSign className="w-3 h-3 mr-1" />
                              Ahorro: ${message.metadata.costSaving.toFixed(3)}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-700 text-slate-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce loading-dot delay-1"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce loading-dot delay-2"></div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pregunta sobre tu materia..."
                  className="flex-1 bg-slate-700 text-white border border-purple-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-400"
                  disabled={isTyping}
                />
                <Button 
                  type="submit" 
                  disabled={isTyping || !inputMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Enviar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Ejercicio actual */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Ejercicio Inteligente</h3>
              </div>

              {currentExercise ? (
                <div className="space-y-4">
                  <div className="bg-slate-700/50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className={`${
                          currentExercise.source === 'oficial' 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {currentExercise.source === 'oficial' ? 'Ã°Å¸Ââ€ºÃ¯Â¸Â Oficial PAES' : 'Ã°Å¸Â§Â  IA Optimizada'}
                      </Badge>
                      {currentExercise.metadata.costSaving && (
                        <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
                          Ã°Å¸â€™Â° ${currentExercise.metadata.costSaving.toFixed(3)} ahorrado
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-white mb-4">{currentExercise.question}</p>
                    
                    <div className="space-y-2">
                      {currentExercise.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => !showFeedback && handleOptionSelect(option)}
                          disabled={showFeedback}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            selectedOption === option
                              ? showFeedback
                                ? option === currentExercise.correctAnswer
                                  ? 'bg-green-500/20 border-green-500 text-green-300'
                                  : 'bg-red-500/20 border-red-500 text-red-300'
                                : 'bg-purple-500/20 border-purple-500 text-purple-300'
                              : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            {showFeedback && selectedOption === option && (
                              <CheckCircle2 className={`w-5 h-5 ${
                                option === currentExercise.correctAnswer ? 'text-green-400' : 'text-red-400'
                              }`} />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                      >
                        <p className="text-blue-200 text-sm">
                          <strong>ExplicaciÃƒÂ³n:</strong> {currentExercise.explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">
                    Ã‚Â¿Listo para un ejercicio optimizado?
                  </p>
                  <Button
                    onClick={generateOptimizedExercise}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Generando...
                      </div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Ejercicio Inteligente
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progreso optimizado */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Progreso Optimizado</h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{stats.exercisesCompleted}</div>
                    <div className="text-sm text-slate-400">Ejercicios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.averageScore}%</div>
                    <div className="text-sm text-slate-400">Rendimiento</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-300">Progreso General</span>
                    <span className="text-purple-300">{stats.averageScore}%</span>
                  </div>
                  <Progress value={stats.averageScore} className="h-2" />
                </div>

                {stats.optimizationStats && (
                  <div className="bg-slate-700/50 p-3 rounded-lg">
                    <div className="text-sm text-slate-300 mb-2">OptimizaciÃƒÂ³n de Recursos</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-green-300">Contenido Oficial:</span>
                        <span className="text-green-400">{stats.optimizationStats.officialContentUsage.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-300">IA Usada:</span>
                        <span className="text-blue-400">{stats.optimizationStats.aiUsage.toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-300">Ahorro Total:</span>
                        <span className="text-yellow-400">${stats.optimizationStats.costSavings.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Acciones rÃƒÂ¡pidas */}
          <Card className="bg-slate-800/50 border-purple-500/30 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Acciones RÃƒÂ¡pidas</h3>
              <div className="space-y-2">
                <Button
                  onClick={generateOptimizedExercise}
                  disabled={isLoading}
                  className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Nuevo Ejercicio
                </Button>
                <Button
                  onClick={() => onNavigateToTool?.('diagnostic')}
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-800"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  DiagnÃƒÂ³stico
                </Button>
                <Button
                  onClick={() => onNavigateToTool?.('plan')}
                  variant="outline"
                  className="w-full justify-start border-purple-500/30 text-purple-300 hover:bg-purple-800"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Mi Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};


