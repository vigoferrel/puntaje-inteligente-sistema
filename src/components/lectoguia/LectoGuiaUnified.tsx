
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useOptimizedLectoGuia } from '@/hooks/useOptimizedLectoGuia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, MessageCircle, Target, TrendingUp, Sparkles, Zap } from 'lucide-react';

interface LectoGuiaUnifiedProps {
  initialSubject?: string;
  onNavigateToTool?: (tool: string, context?: any) => void;
}

export const LectoGuiaUnified: React.FC<LectoGuiaUnifiedProps> = ({
  initialSubject = 'COMPETENCIA_LECTORA',
  onNavigateToTool
}) => {
  const { user } = useAuth();
  const { isIntersectionalReady, neuralHealth } = useIntersectional();
  
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

  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Estadísticas en tiempo real
  const realTimeStats = useMemo(() => getStats(), [getStats]);

  // Manejo optimizado de envío de mensajes
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    await handleSendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, handleSendMessage]);

  // Generación de ejercicio con feedback
  const handleExerciseGeneration = useCallback(async () => {
    const exercise = await generateOptimizedExercise();
    if (exercise) {
      setActiveTab('exercise');
    }
  }, [generateOptimizedExercise]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header con Métricas Neurales */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-cyan-400" />
                <div>
                  <CardTitle className="text-white text-2xl">LectoGuía Neural IA</CardTitle>
                  <p className="text-cyan-300">Sistema Unificado de Aprendizaje Adaptativo</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Neural: {Math.round(neuralHealth.neural_efficiency)}%
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  <Zap className="w-4 h-4 mr-1" />
                  Optimización: {optimizationStats?.quality || 'Excelente'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{realTimeStats.exercisesCompleted}</div>
                <div className="text-sm text-gray-400">Ejercicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{realTimeStats.averageScore}%</div>
                <div className="text-sm text-gray-400">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{realTimeStats.streak}</div>
                <div className="text-sm text-gray-400">Racha</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{realTimeStats.todayStudyTime}min</div>
                <div className="text-sm text-gray-400">Hoy</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interfaz Principal con Tabs */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-black/60">
              <TabsTrigger value="chat" className="data-[state=active]:bg-cyan-600">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat IA
              </TabsTrigger>
              <TabsTrigger value="exercise" className="data-[state=active]:bg-purple-600">
                <Target className="w-4 h-4 mr-2" />
                Ejercicios
              </TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-green-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progreso
              </TabsTrigger>
            </TabsList>

            {/* Chat Tab */}
            <TabsContent value="chat" className="mt-6">
              <div className="space-y-4">
                <div className="h-96 overflow-y-auto bg-black/20 rounded-lg p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-cyan-600 text-white' 
                            : 'bg-gray-700 text-gray-100'
                        }`}>
                          <p>{message.content}</p>
                          {message.source && (
                            <Badge className="mt-2" variant="secondary">
                              {message.source}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-700 text-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Pregúntame sobre PAES, solicita ejercicios o pide ayuda..."
                    className="flex-1 bg-black/20 border-cyan-500/30 text-white"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    disabled={isTyping || !inputMessage.trim()}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Enviar
                  </Button>
                </form>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleExerciseGeneration}
                    variant="outline"
                    className="border-purple-500 text-purple-400 hover:bg-purple-500/10"
                    disabled={isLoading}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Generar Ejercicio
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Exercise Tab */}
            <TabsContent value="exercise" className="mt-6">
              <div className="space-y-6">
                {currentExercise ? (
                  <div className="space-y-4">
                    <div className="bg-black/20 p-6 rounded-lg">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {currentExercise.question}
                      </h3>
                      
                      <div className="space-y-2">
                        {currentExercise.options.map((option, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleOptionSelect(index)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedOption === option
                                ? showFeedback
                                  ? option === currentExercise.correctAnswer
                                    ? 'bg-green-600/20 border-green-500 text-green-300'
                                    : 'bg-red-600/20 border-red-500 text-red-300'
                                  : 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                            }`}
                            disabled={showFeedback}
                          >
                            {String.fromCharCode(65 + index)}. {option}
                          </motion.button>
                        ))}
                      </div>
                      
                      {showFeedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 bg-blue-600/20 border-blue-500 border rounded-lg"
                        >
                          <p className="text-blue-300 font-medium">Explicación:</p>
                          <p className="text-blue-200 mt-2">{currentExercise.explanation}</p>
                          
                          <div className="mt-4 flex items-center gap-2">
                            <Badge variant="outline">
                              Fuente: {currentExercise.source}
                            </Badge>
                            {currentExercise.metadata.costSaving && (
                              <Badge variant="outline" className="text-green-400">
                                Ahorro: ${currentExercise.metadata.costSaving.toFixed(3)}
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                    
                    {showFeedback && (
                      <Button 
                        onClick={handleExerciseGeneration}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Siguiente Ejercicio
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-gray-400">
                      No hay ejercicio activo. Genera uno desde el chat o usa el botón.
                    </div>
                    <Button 
                      onClick={handleExerciseGeneration}
                      className="bg-purple-600 hover:bg-purple-700"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generando...' : 'Generar Ejercicio'}
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/20 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Rendimiento Neural</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Eficiencia Neural</span>
                        <span className="text-cyan-400">{Math.round(neuralHealth.neural_efficiency)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-cyan-400 h-2 rounded-full transition-all"
                          style={{ width: `${neuralHealth.neural_efficiency}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Aprendizaje Adaptativo</span>
                        <span className="text-purple-400">{Math.round(neuralHealth.adaptive_learning_score)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-400 h-2 rounded-full transition-all"
                          style={{ width: `${neuralHealth.adaptive_learning_score}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/20 border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-cyan-400">Optimización IA</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {optimizationStats && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Contenido Oficial</span>
                          <span className="text-green-400">{optimizationStats.officialContentUsage?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Uso de IA</span>
                          <span className="text-yellow-400">{optimizationStats.aiUsage?.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Ahorro de Costos</span>
                          <span className="text-cyan-400">${optimizationStats.costSavings?.toFixed(2)}</span>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};
