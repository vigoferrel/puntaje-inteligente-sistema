
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { ChatInterface, ChatMessage } from "@/components/ai/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOpenRouter } from "@/hooks/use-openrouter";
import { BookOpen, Play, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";

const WELCOME_MESSAGE = `👋 ¡Hola! Soy LectoGuía, tu asistente personalizado para la preparación de la PAES.

Puedo ayudarte con:

• Ejercicios de Comprensión Lectora personalizados
• Explicaciones detalladas de conceptos
• Análisis de tu progreso
• Técnicas específicas para mejorar tus habilidades

¿En qué puedo ayudarte hoy?`;

interface ExerciseInterface {
  id: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: number;
  skill: string;
  difficulty: string;
}

const LectoGuia = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const { callOpenRouter, loading: openRouterLoading } = useOpenRouter();
  
  const [currentExercise, setCurrentExercise] = useState<ExerciseInterface | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Handle exercise requests
      if (message.toLowerCase().includes("ejercicio") || 
          message.toLowerCase().includes("practica") || 
          message.toLowerCase().includes("ejemplo")) {
        
        // Switch to exercise tab if requested
        if (activeTab === "chat") {
          setTimeout(() => setActiveTab("exercise"), 500);
        }
        
        // Generate sample exercise (in a real app, this would come from the API)
        const sampleExercise: ExerciseInterface = {
          id: uuidv4(),
          text: "En países más dichosos, los poetas, obviamente, quieren ser publicados, leídos y entendidos, pero ya no hacen nada o casi nada en su vida cotidiana para destacar entre la gente. Sin embargo, hace poco, en las primeras décadas de nuestro siglo, a los poetas les gustaba escandalizar con su ropa extravagante y con un comportamiento excéntrico. Aquellos no eran más que espectáculos para el público, ya que siempre tenía que llegar el momento en que el poeta cerraba la puerta, se quitaba toda esa parafernalia: capas y oropeles, y se detenía en el silencio, en espera de sí mismo frente a una hoja de papel en blanco, que en el fondo es lo único que importa.",
          question: "Según el texto, ¿qué representaban las excentricidades de los poetas a principios del siglo XX?",
          options: [
            "Una forma de expresión artística coherente con su obra",
            "Un espectáculo público que no reflejaba su verdadero trabajo",
            "Una estrategia para conseguir ser publicados y leídos",
            "Una característica inherente a la personalidad creativa"
          ],
          correctAnswer: 1,
          skill: "Interpretar-Relacionar",
          difficulty: "Intermedio"
        };
        
        setCurrentExercise(sampleExercise);
        setSelectedOption(null);
        setShowFeedback(false);
        
        const botMessage: ChatMessage = {
          id: uuidv4(),
          role: "assistant",
          content: `He preparado un ejercicio de comprensión lectora para ti. Es un ejercicio de dificultad ${sampleExercise.difficulty} que evalúa la habilidad de ${sampleExercise.skill}. Puedes resolverlo en la pestaña de Ejercicios.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Regular conversation - in real app would call OpenRouter
        setTimeout(() => {
          const botMessage: ChatMessage = {
            id: uuidv4(),
            role: "assistant",
            content: "Para mejorar tu comprensión lectora, es importante enfocarte en las tres habilidades principales que evalúa la PAES: Rastrear-Localizar, Interpretar-Relacionar y Evaluar-Reflexionar. ¿Te gustaría que trabajemos en alguna de ellas en específico?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
        }, 1500);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu mensaje. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setTimeout(() => {
      setShowFeedback(true);
    }, 300);
  };

  const handleNewExercise = () => {
    setActiveTab("chat");
    setSelectedOption(null);
    setShowFeedback(false);
    
    const botMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content: "Excelente trabajo. ¿Te gustaría continuar con otro ejercicio o prefieres que trabajemos en otra habilidad?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <AppLayout>
      <div className="container max-w-6xl mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">LectoGuía AI</h1>
            <p className="text-muted-foreground">Tu asistente personalizado para mejorar tu competencia lectora en la PAES</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="bg-secondary/30">
                <TabsTrigger value="chat" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="exercise" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Ejercicios
                </TabsTrigger>
                <TabsTrigger value="progress" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  Progreso
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-4">
              <TabsContent value="chat" className="m-0">
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="h-[calc(100vh-280px)] min-h-[500px]">
                      <ChatInterface
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isTyping={isTyping}
                        placeholder="Pregunta cualquier cosa sobre comprensión lectora..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="exercise" className="m-0">
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto custom-scrollbar">
                      {currentExercise ? (
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-lg font-semibold text-foreground mb-1">Lectura</h3>
                              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                {currentExercise.skill}
                              </span>
                            </div>
                            <div className="bg-secondary/30 p-4 rounded-lg text-foreground border border-border">
                              {currentExercise.text}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-4">{currentExercise.question}</h3>
                            
                            <div className="space-y-3 mb-6">
                              {currentExercise.options.map((option, index) => (
                                <button
                                  key={index}
                                  className={`w-full text-left p-3 rounded-lg transition-all duration-300 ${
                                    selectedOption === index 
                                      ? 'bg-primary/20 border border-primary/50' 
                                      : 'bg-secondary/30 border border-border hover:bg-secondary'
                                  }`}
                                  onClick={() => !showFeedback && handleOptionSelect(index)}
                                  disabled={showFeedback}
                                >
                                  <div className="flex items-start">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mr-3 mt-0.5 ${
                                      selectedOption === index ? 'bg-primary text-white' : 'border border-muted-foreground'
                                    }`}>
                                      {selectedOption === index && <ArrowRight size={12} />}
                                    </div>
                                    <span>{option}</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                            
                            {showFeedback && (
                              <div className={`p-4 rounded-lg mt-4 ${
                                selectedOption === currentExercise.correctAnswer 
                                  ? 'bg-green-500/20 border border-green-500/30' 
                                  : 'bg-red-500/20 border border-red-500/30'
                              }`}>
                                <h4 className="font-semibold mb-2">
                                  {selectedOption === currentExercise.correctAnswer 
                                    ? '¡Correcto!' 
                                    : 'Incorrecto'
                                  }
                                </h4>
                                <p>
                                  {selectedOption === currentExercise.correctAnswer 
                                    ? 'El texto indica claramente que las excentricidades de los poetas "no eran más que espectáculos para el público", contraponiendo esta actitud pública con el verdadero momento de creación poética que ocurre en soledad.' 
                                    : `Respuesta incorrecta. La opción correcta es: "${currentExercise.options[currentExercise.correctAnswer]}". El texto menciona que "Aquellos no eran más que espectáculos para el público", contrastando esta actitud pública con el verdadero trabajo poético que ocurre en soledad.`
                                  }
                                </p>
                                
                                <div className="mt-4 flex justify-end">
                                  <Button onClick={handleNewExercise}>
                                    Continuar
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                          <BookOpen className="h-16 w-16 text-muted-foreground" />
                          <h3 className="text-xl font-medium text-foreground">No hay ejercicios activos</h3>
                          <p className="text-muted-foreground max-w-md">
                            Pídele a LectoGuía que te genere un ejercicio de comprensión lectora según tus necesidades.
                          </p>
                          <Button onClick={() => setActiveTab("chat")}>
                            Ir al chat
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="m-0">
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto custom-scrollbar">
                      <h3 className="text-xl font-semibold mb-6">Tu progreso en Competencia Lectora</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Rastrear-Localizar</h4>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Previo: 55%</span>
                            <span className="text-green-400">Actual: 70%</span>
                          </div>
                        </div>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Interpretar-Relacionar</h4>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Previo: 30%</span>
                            <span className="text-yellow-400">Actual: 45%</span>
                          </div>
                        </div>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Evaluar-Reflexionar</h4>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Previo: 40%</span>
                            <span className="text-blue-400">Actual: 60%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold">Recomendaciones de LectoGuía</h3>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                          <div className="flex items-start space-x-3">
                            <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-400">
                              <BarChart3 className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground mb-1">Enfócate en Interpretar-Relacionar</h4>
                              <p className="text-sm text-muted-foreground">
                                Esta es tu área con mayor oportunidad de mejora. Te recomiendo realizar más ejercicios 
                                de inferencia textual y análisis de relaciones entre ideas.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-secondary/30 p-4 rounded-lg border border-border">
                          <div className="flex items-start space-x-3">
                            <div className="bg-green-500/20 p-2 rounded-full text-green-400">
                              <Play className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="font-medium text-foreground mb-1">Próximo paso sugerido</h4>
                              <p className="text-sm text-muted-foreground">
                                Realiza el simulacro de Competencia Lectora que hemos preparado para ti. 
                                Contiene 20 preguntas balanceadas según tus necesidades de mejora.
                              </p>
                              <Button variant="link" className="text-primary p-0 h-auto mt-2">
                                Iniciar simulacro personalizado
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default LectoGuia;
