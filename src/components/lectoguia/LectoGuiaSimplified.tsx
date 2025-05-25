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
  Bot,
  Sparkles
} from "lucide-react";
import { useLectoGuiaSimplified } from '@/hooks/lectoguia/useLectoGuiaSimplified';
import { supabase } from '@/integrations/supabase/client';

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
    { id: 'COMPETENCIA_LECTORA', name: 'Competencia Lectora', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'MATEMATICA_1', name: 'Matemática M1', icon: Target, color: 'bg-green-500' },
    { id: 'MATEMATICA_2', name: 'Matemática M2', icon: Brain, color: 'bg-purple-500' },
    { id: 'CIENCIAS', name: 'Ciencias', icon: Lightbulb, color: 'bg-orange-500' },
    { id: 'HISTORIA', name: 'Historia', icon: TrendingUp, color: 'bg-red-500' }
  ];

  const stats = getStats();

  const handleSendClick = async () => {
    if (!inputMessage.trim()) return;
    
    try {
      // Usar el servicio edge function real
      const response = await supabase.functions.invoke('lectoguia-chat', {
        body: {
          message: inputMessage,
          subject: activeSubject,
          sessionId: `session_${Date.now()}`
        }
      });

      if (response.error) {
        console.error('Error calling edge function:', response.error);
        // Fallback al método local
        await handleSendMessage(inputMessage);
      } else {
        // Procesar respuesta exitosa
        await handleSendMessage(inputMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Fallback al método local
      await handleSendMessage(inputMessage);
    }
    
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const currentSubject = subjects.find(s => s.id === activeSubject) || subjects[0];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header Cinematográfico */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              LectoGuía IA
            </h1>
            <p className="text-muted-foreground">Tu asistente inteligente de preparación PAES</p>
          </div>
          <div className="ml-auto">
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'} className="gap-2">
              <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-gray-400'}`} />
              {connectionStatus === 'connected' ? 'Conectado' : 'Offline'}
            </Badge>
          </div>
        </div>

        {/* Stats Cinematográficos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
              <div className="text-sm text-blue-700">Consultas IA</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.exercisesCompleted}</div>
              <div className="text-sm text-green-700">Ejercicios</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{currentSubject.name}</div>
              <div className="text-sm text-purple-700">Materia Activa</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-orange-700">IA Activa</div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Selector Cinematográfico */}
        <div className="flex flex-wrap gap-3 mb-6">
          {subjects.map((subject) => {
            const Icon = subject.icon;
            return (
              <Button
                key={subject.id}
                variant={activeSubject === subject.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSubjectChange(subject.id)}
                className={`gap-2 transition-all duration-300 ${
                  activeSubject === subject.id 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4" />
                {subject.name}
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="chat" className="gap-2">
            <MessageCircle className="w-4 h-4" />
            Chat IA
          </TabsTrigger>
          <TabsTrigger value="exercise" className="gap-2">
            <Target className="w-4 h-4" />
            Ejercicios
          </TabsTrigger>
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Resumen
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-purple-600" />
                Conversación con LectoGuía IA
                <Badge className="ml-auto bg-purple-100 text-purple-700">
                  {currentSubject.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 border rounded-lg mb-4 space-y-4 bg-white">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-[70%] rounded-xl p-4 ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <span className="text-xs opacity-70 mt-2 block">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
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
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                  placeholder={`Pregúntame sobre ${currentSubject.name}, ejercicios o estrategias PAES...`}
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendClick}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Exercise Tab */}
        <TabsContent value="exercise">
          <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Ejercicios Interactivos IA
                <Badge className="ml-auto bg-green-100 text-green-700">
                  {currentSubject.name}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!currentExercise ? (
                <div className="text-center py-12">
                  <div className="relative mb-4">
                    <Target className="w-16 h-16 text-gray-400 mx-auto" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-16 h-16 mx-auto border-4 border-transparent border-t-purple-400 rounded-full"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Genera tu ejercicio IA</h3>
                  <p className="text-muted-foreground mb-6">
                    Crea ejercicios personalizados con IA para {currentSubject.name}
                  </p>
                  <Button 
                    onClick={handleNewExercise} 
                    disabled={isLoading} 
                    className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Zap className="w-4 h-4" />
                    {isLoading ? 'Generando con IA...' : 'Nuevo Ejercicio IA'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{currentExercise.question}</h3>
                      <Badge variant="outline" className="gap-2">
                        <Sparkles className="w-3 h-3" />
                        Generado con IA
                      </Badge>
                    </div>
                    <Button 
                      onClick={handleNewExercise} 
                      variant="outline" 
                      size="sm"
                      className="gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Nuevo Ejercicio
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Opciones:</p>
                    {currentExercise.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                          selectedOption === index
                            ? showFeedback
                              ? option === currentExercise.correctAnswer
                                ? 'bg-green-100 border-green-500 text-green-800 shadow-md'
                                : 'bg-red-100 border-red-500 text-red-800 shadow-md'
                              : 'bg-blue-100 border-blue-500 shadow-md scale-105'
                            : 'hover:bg-gray-50 hover:border-gray-300 hover:scale-102'
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

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200"
                    >
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        Explicación IA:
                      </h4>
                      <p className="text-gray-700">{currentExercise.explanation}</p>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <Card className="bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Resumen de Progreso IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Actividad IA
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                      <span>Consultas realizadas</span>
                      <span className="font-medium text-blue-600">{stats.totalMessages}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                      <span>Ejercicios completados</span>
                      <span className="font-medium text-green-600">{stats.exercisesCompleted}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                      <span>Materia actual</span>
                      <span className="font-medium text-purple-600">{currentSubject.name}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
                      <span>Estado del sistema</span>
                      <Badge className="bg-orange-100 text-orange-700">IA Operativo</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                    Recomendaciones IA
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm flex items-start gap-2">
                        <Brain className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        Usa el chat IA para resolver dudas específicas sobre {currentSubject.name}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm flex items-start gap-2">
                        <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Genera ejercicios IA personalizados para practicar diariamente
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        Explora diferentes materias para una preparación integral
                      </p>
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
