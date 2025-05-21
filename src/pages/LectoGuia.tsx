
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/app-layout";
import { ChatInterface, ChatMessage } from "@/components/ai/ChatInterface";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOpenRouter } from "@/hooks/use-openrouter";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { Exercise } from "@/types/ai-types";
import { ExerciseView } from "@/components/lectoguia/ExerciseView";
import { ProgressView } from "@/components/lectoguia/ProgressView";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";

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

// Componente principal de LectoGuía
const LectoGuia = () => {
  // Estado para gestionar la pestaña activa
  const [activeTab, setActiveTab] = useState("chat");
  
  // Mensajes de chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: WELCOME_MESSAGE,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  
  // Hooks para API y estado de la sesión
  const { callOpenRouter, loading } = useOpenRouter();
  const { session, saveExerciseAttempt } = useLectoGuiaSession();
  const [isTyping, setIsTyping] = useState(false);
  
  // Estado del ejercicio actual
  const [currentExercise, setCurrentExercise] = useState<ExerciseInterface | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Manejar el envío de mensajes
  const handleSendMessage = async (message: string) => {
    // Agregar mensaje del usuario a la conversación
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    try {
      // Detectar si el usuario está pidiendo un ejercicio
      const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
          message.toLowerCase().includes("practica") || 
          message.toLowerCase().includes("ejemplo");
      
      if (isExerciseRequest) {
        // Generar un ejercicio usando OpenRouter
        const exercise = await callOpenRouter<Exercise>("generate_exercise", {
          skill: "INTERPRET_RELATE",
          prueba: "COMPREHENSION_LECTORA",
          difficulty: "INTERMEDIATE",
          previousExercises: []
        });

        if (exercise) {
          // Cambiar a la pestaña de ejercicios
          setTimeout(() => setActiveTab("exercise"), 500);
          
          // Crear un objeto de ejercicio a partir de la respuesta
          const generatedExercise: ExerciseInterface = {
            id: uuidv4(),
            text: exercise.context || "En países más dichosos, los poetas, obviamente, quieren ser publicados, leídos y entendidos, pero ya no hacen nada o casi nada en su vida cotidiana para destacar entre la gente. Sin embargo, hace poco, en las primeras décadas de nuestro siglo, a los poetas les gustaba escandalizar con su ropa extravagante y con un comportamiento excéntrico. Aquellos no eran más que espectáculos para el público, ya que siempre tenía que llegar el momento en que el poeta cerraba la puerta, se quitaba toda esa parafernalia: capas y oropeles, y se detenía en el silencio, en espera de sí mismo frente a una hoja de papel en blanco, que en el fondo es lo único que importa.",
            question: exercise.question || "¿Cuál es la idea principal del texto?",
            options: exercise.options || [
              "Los poetas disfrutan ser reconocidos en público",
              "La verdadera creación poética ocurre en soledad",
              "La poesía moderna es muy diferente a la antigua",
              "En el pasado los poetas eran más excéntricos"
            ],
            correctAnswer: exercise.options?.indexOf(exercise.correctAnswer) || 1,
            skill: "Interpretar-Relacionar",
            difficulty: "Intermedio"
          };
          
          // Actualizar estado del ejercicio
          setCurrentExercise(generatedExercise);
          setSelectedOption(null);
          setShowFeedback(false);
          
          // Agregar mensaje del asistente sobre el ejercicio generado
          const botMessage: ChatMessage = {
            id: uuidv4(),
            role: "assistant",
            content: `He preparado un ejercicio de comprensión lectora para ti. Es un ejercicio de dificultad ${generatedExercise.difficulty} que evalúa la habilidad de ${generatedExercise.skill}. Puedes resolverlo en la pestaña de Ejercicios.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => [...prev, botMessage]);
        } else {
          throw new Error("No se pudo generar el ejercicio");
        }
      } else {
        // Conversación normal usando OpenRouter
        const response = await callOpenRouter<{ response: string }>("provide_feedback", {
          userMessage: message,
          context: "PAES preparation, reading comprehension"
        });

        if (response) {
          const botMessage: ChatMessage = {
            id: uuidv4(),
            role: "assistant",
            content: response.response || "Para mejorar tu comprensión lectora, es importante enfocarte en las tres habilidades principales que evalúa la PAES: Rastrear-Localizar, Interpretar-Relacionar y Evaluar-Reflexionar. ¿Te gustaría que trabajemos en alguna de ellas en específico?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => [...prev, botMessage]);
        } else {
          throw new Error("No se pudo obtener una respuesta");
        }
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      // Respuesta alternativa en caso de error
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: "assistant",
        content: "Lo siento, tuve un problema procesando tu mensaje. ¿Podrías intentarlo de nuevo?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un problema al procesar tu mensaje",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Manejar la selección de una opción en el ejercicio
  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
    setTimeout(() => {
      setShowFeedback(true);
      
      // Guardar el intento de ejercicio si el usuario está logueado
      if (currentExercise) {
        const isCorrect = index === currentExercise.correctAnswer;
        saveExerciseAttempt(
          currentExercise as unknown as Exercise,
          index,
          isCorrect,
          'INTERPRET_RELATE'
        );
      }
    }, 300);
  };

  // Manejar la solicitud de un nuevo ejercicio
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
  
  // Manejar inicio de simulación
  const handleStartSimulation = () => {
    toast({
      title: "Simulación",
      description: "Función en desarrollo. Estará disponible próximamente."
    });
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
                        isTyping={isTyping || loading}
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
                      <ExerciseView
                        exercise={currentExercise}
                        selectedOption={selectedOption}
                        showFeedback={showFeedback}
                        onOptionSelect={handleOptionSelect}
                        onContinue={handleNewExercise}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="progress" className="m-0">
                <Card className="border-border bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="h-[calc(100vh-280px)] min-h-[500px] overflow-auto custom-scrollbar">
                      <ProgressView 
                        skillLevels={session.skillLevels}
                        onStartSimulation={handleStartSimulation}
                      />
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
