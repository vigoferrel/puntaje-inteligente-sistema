import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useIntersectional } from '@/contexts/IntersectionalProvider';
import { useQualityLectoGuia } from '@/hooks/useQualityLectoGuia';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Brain, 
  MessageCircle, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Zap, 
  Shield,
  CheckCircle,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

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
    qualityReport,
    qualityStats,
    handleSendMessage,
    generateQualityExercise,
    handleOptionSelect,
    testOpenRouterConnection
  } = useQualityLectoGuia();

  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');

  // Manejo optimizado de envío de mensajes
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    await handleSendMessage(inputMessage);
    setInputMessage('');
  }, [inputMessage, handleSendMessage]);

  // Generación de ejercicio con feedback
  const handleExerciseGeneration = useCallback(async () => {
    const exercise = await generateQualityExercise();
    if (exercise) {
      setActiveTab('exercise');
    }
  }, [generateQualityExercise]);

  // Renderizado de mensaje con indicador de calidad
  const renderMessage = useCallback((message: any, index: number) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        message.type === 'user' 
          ? 'bg-cyan-600 text-white' 
          : 'bg-gray-700 text-white'
      }`}>
        <p className="text-sm">{message.content}</p>
        {message.qualityScore !== undefined && (
          <div className="flex items-center gap-2 mt-2 text-xs">
            {message.qualityScore >= 0.8 ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : message.qualityScore >= 0.6 ? (
              <AlertTriangle className="w-3 h-3 text-yellow-400" />
            ) : (
              <AlertTriangle className="w-3 h-3 text-red-400" />
            )}
            <span className="opacity-70">
              Calidad: {(message.qualityScore * 100).toFixed(0)}%
            </span>
            {message.source && (
              <span className="opacity-50">• {message.source}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  ), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header con Métricas de Calidad */}
        <Card className="bg-black/40 backdrop-blur-xl border-cyan-500/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8 text-cyan-400" />
                <div>
                  <CardTitle className="text-white text-2xl">LectoGuía Neural IA</CardTitle>
                  <p className="text-cyan-300">Sistema de Calidad Garantizada</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Shield className="w-4 h-4 mr-1" />
                  Calidad: {qualityStats.qualityMetrics.averageQuality}%
                </Badge>
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  <Zap className="w-4 h-4 mr-1" />
                  Éxito: {qualityStats.qualityMetrics.successRate}%
                </Badge>
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Neural: {Math.round(neuralHealth.neural_efficiency)}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{qualityStats.exercisesCompleted}</div>
                <div className="text-sm text-gray-400">Ejercicios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{qualityStats.averageScore}%</div>
                <div className="text-sm text-gray-400">Precisión</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{qualityStats.streak}</div>
                <div className="text-sm text-gray-400">Racha</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{qualityStats.todayStudyTime}min</div>
                <div className="text-sm text-gray-400">Hoy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400">{qualityStats.qualityMetrics.totalGenerated}</div>
                <div className="text-sm text-gray-400">Generados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interfaz Principal con Tabs */}
        <Card className="bg-black/40 backdrop-blur-xl border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat IA
                  </TabsTrigger>
                  <TabsTrigger value="exercise" className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Ejercicios
                  </TabsTrigger>
                  <TabsTrigger value="quality" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Calidad
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} className="space-y-6">
              {/* Chat con IA */}
              <TabsContent value="chat" className="space-y-4">
                <div className="h-96 overflow-y-auto bg-gray-900/30 rounded-lg p-4 space-y-4">
                  {messages.map((message, index) => renderMessage(message, index))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-700 text-white px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Pregunta sobre tu materia de estudio..."
                    className="flex-1 bg-gray-800 border-gray-600 text-white"
                    disabled={isTyping}
                  />
                  <Button type="submit" disabled={isTyping} className="bg-cyan-600 hover:bg-cyan-700">
                    Enviar
                  </Button>
                </form>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={testOpenRouterConnection}
                    variant="outline" 
                    size="sm"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Probando...' : 'Probar Conexión'}
                  </Button>
                </div>
              </TabsContent>

              {/* Ejercicios de Calidad */}
              <TabsContent value="exercise" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-white text-lg font-semibold">Ejercicios de Alta Calidad</h3>
                  <Button 
                    onClick={handleExerciseGeneration}
                    disabled={isLoading}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isLoading ? 'Generando...' : 'Nuevo Ejercicio'}
                  </Button>
                </div>
                
                {currentExercise && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 rounded-lg p-6 space-y-4"
                  >
                    <div className="text-white">
                      <h4 className="font-semibold mb-2">Pregunta:</h4>
                      <p className="text-sm leading-relaxed">{currentExercise.question}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-white font-semibold">Alternativas:</h4>
                      {currentExercise.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionSelect(option)}
                          disabled={showFeedback}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            selectedOption === option
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                    
                    {showFeedback && currentExercise.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-blue-900/30 rounded-lg p-4"
                      >
                        <h4 className="text-white font-semibold mb-2">Explicación:</h4>
                        <p className="text-blue-200 text-sm">{currentExercise.explanation}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}
                
                {qualityReport && (
                  <Card className="bg-gray-800/30 border-gray-600">
                    <CardHeader>
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Reporte de Calidad
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-gray-300">
                          Precisión: <span className="text-white">{(qualityReport.metrics.contentAccuracy * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-gray-300">
                          PAES: <span className="text-white">{(qualityReport.metrics.paesCompliance * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-gray-300">
                          Dificultad: <span className="text-white">{(qualityReport.metrics.difficultyConsistency * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-gray-300">
                          Relevancia: <span className="text-white">{(qualityReport.metrics.subjectRelevance * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="text-center pt-2 border-t border-gray-600">
                        <div className="text-lg font-bold text-white">
                          Calidad Total: {(qualityReport.metrics.overallScore * 100).toFixed(1)}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Panel de Calidad */}
              <TabsContent value="quality" className="space-y-4">
                <div className="text-white">Panel de calidad en desarrollo...</div>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="text-white">Analytics en desarrollo...</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
