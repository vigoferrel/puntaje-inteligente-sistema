
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, 
  Brain, 
  Target, 
  TrendingUp,
  Send,
  BookOpen,
  Lightbulb,
  Zap,
  CheckCircle,
  User,
  Bot
} from "lucide-react";
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';

export const LectoGuiaSimplified: React.FC = () => {
  const {
    // Estado
    messages,
    isTyping,
    currentExercise,
    selectedOption,
    showFeedback,
    isLoading,
    activeTab,
    activeSubject,
    connectionStatus,
    
    // Acciones
    handleSendMessage,
    handleNewExercise,
    handleOptionSelect,
    setActiveTab,
    handleSubjectChange,
    getStats
  } = useLectoGuiaSimplified();

  const [inputMessage, setInputMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const subjects = [
    { id: 'general', name: 'General', icon: Brain },
    { id: 'matematicas', name: 'Matemática', icon: Target },
    { id: 'ciencias', name: 'Ciencias', icon: Lightbulb },
    { id: 'lectura', name: 'Comprensión Lectora', icon: BookOpen },
    { id: 'historia', name: 'Historia', icon: TrendingUp }
  ];

  const stats = getStats();

  const handleSendClick = async () => {
    if (!inputMessage.trim()) return;
    
    await handleSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">LectoGuía IA</h1>
            <p className="text-muted-foreground">Tu asistente inteligente de preparación PAES</p>
          </div>
          <div className="ml-auto">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
              {connectionStatus === 'connected' ? 'Conectado' : 'Offline'}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
              <div className="text-sm text-muted-foreground">Consultas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-green-600">{stats.exercisesCompleted}</div>
              <div className="text-sm text-muted-foreground">Ejercicios</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-purple-600">
                {subjects.find(s => s.id === activeSubject)?.name || 'General'}
              </div>
              <div className="text-sm text-muted-foreground">Materia Activa</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-muted-foreground">Disponibilidad</div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Selector */}
        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map((subject) => (
            <Button
              key={subject.id}
              variant={activeSubject === subject.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleSubjectChange(subject.id)}
              className="gap-2"
            >
              <subject.icon className="w-4 h-4" />
              {subject.name}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="exercise" className="gap-2">
            <Target className="w-4 h-4" />
            Ejercicios
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Progreso
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Conversación con LectoGuía
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 border rounded-lg mb-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Pregúntame sobre PAES, ejercicios o estrategias de estudio..."
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                />
                <Button 
                  onClick={handleSendClick}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Tab */}
        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Ejercicios Interactivos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentExercise ? (
                <div className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Genera tu primer ejercicio</h3>
                  <p className="text-muted-foreground mb-6">
                    Crea ejercicios personalizados para la materia {subjects.find(s => s.id === activeSubject)?.name}
                  </p>
                  <Button onClick={handleNewExercise} disabled={isLoading} className="gap-2">
                    <Zap className="w-4 h-4" />
                    {isLoading ? 'Generando...' : 'Nuevo Ejercicio'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Exercise Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{currentExercise.nodeName}</h3>
                      <Badge variant="outline">{currentExercise.prueba}</Badge>
                    </div>
                    <Button onClick={handleNewExercise} variant="outline" size="sm">
                      Nuevo Ejercicio
                    </Button>
                  </div>

                  {/* Question */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="font-medium mb-2">Pregunta:</p>
                    <p>{currentExercise.question}</p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    <p className="font-medium">Opciones:</p>
                    {currentExercise.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          selectedOption === index
                            ? showFeedback
                              ? option === currentExercise.correctAnswer
                                ? 'bg-green-100 border-green-500 text-green-800'
                                : 'bg-red-100 border-red-500 text-red-800'
                              : 'bg-blue-100 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                        disabled={showFeedback}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{String.fromCharCode(65 + index)})</span>
                          <span>{option}</span>
                          {showFeedback && option === currentExercise.correctAnswer && (
                            <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Feedback */}
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 rounded-lg"
                    >
                      <h4 className="font-medium mb-2">Explicación:</h4>
                      <p>{currentExercise.explanation}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Tab */}
        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Tu Progreso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Resumen de Actividad</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Consultas realizadas</span>
                      <span className="font-medium">{stats.totalMessages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ejercicios completados</span>
                      <span className="font-medium">{stats.exercisesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Materia actual</span>
                      <span className="font-medium">{subjects.find(s => s.id === activeSubject)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado del sistema</span>
                      <Badge variant="default">Operativo</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Recomendaciones</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm">💡 Practica ejercicios diariamente para mejorar tu rendimiento</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm">📚 Explora diferentes materias para una preparación integral</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <p className="text-sm">🎯 Usa el chat para resolver dudas específicas</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
