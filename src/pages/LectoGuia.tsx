
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { v4 as uuidv4 } from "uuid";
import { toast } from "@/components/ui/use-toast";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";
import { useLectoGuiaChat } from "@/hooks/use-lectoguia-chat";
import { useLectoGuiaExercise } from "@/hooks/use-lectoguia-exercise";
import { LectoGuiaHeader } from "@/components/lectoguia/LectoGuiaHeader";
import { ChatTab } from "@/components/lectoguia/ChatTab";
import { ExerciseTab } from "@/components/lectoguia/ExerciseTab";
import { ProgressTab } from "@/components/lectoguia/ProgressTab";

// Componente principal de LectoGuía
const LectoGuia = () => {
  // Estado para gestionar la pestaña activa
  const [activeTab, setActiveTab] = useState("chat");
  
  // Hooks para estados y lógica
  const { session, saveExerciseAttempt } = useLectoGuiaSession();
  const { messages, isTyping, processUserMessage, addAssistantMessage } = useLectoGuiaChat();
  const { 
    currentExercise, 
    selectedOption, 
    showFeedback, 
    generateExercise, 
    handleOptionSelect, 
    resetExercise 
  } = useLectoGuiaExercise();
  
  // Manejar el envío de mensajes
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Detectar si el usuario está pidiendo un ejercicio
    const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
        message.toLowerCase().includes("practica") || 
        message.toLowerCase().includes("ejemplo");
    
    if (isExerciseRequest) {
      // Generar ejercicio y cambiar a la pestaña de ejercicios
      const exercise = await generateExercise();
      
      if (exercise) {
        setTimeout(() => setActiveTab("exercise"), 500);
        
        // Agregar mensaje del asistente sobre el ejercicio generado
        addAssistantMessage(
          `He preparado un ejercicio de comprensión lectora para ti. Es un ejercicio de dificultad ${exercise.difficulty || "intermedia"} que evalúa la habilidad de ${exercise.skill || "Interpretar-Relacionar"}. Puedes resolverlo en la pestaña de Ejercicios.`
        );
      } else {
        addAssistantMessage("Lo siento, no pude generar un ejercicio en este momento. Por favor, inténtalo más tarde.");
      }
    } else {
      // Procesamiento normal de mensajes
      await processUserMessage(message);
    }
  };

  // Manejar la selección de una opción en el ejercicio
  const handleExerciseOptionSelect = (index: number) => {
    handleOptionSelect(index);
    
    setTimeout(() => {
      // Guardar el intento de ejercicio si el usuario está logueado y el ejercicio es válido
      if (currentExercise && currentExercise.id && currentExercise.options) {
        const correctAnswerIndex = currentExercise.options.findIndex(
          option => option === currentExercise.correctAnswer
        );
        
        const isCorrect = index === (correctAnswerIndex >= 0 ? correctAnswerIndex : 0);
        
        saveExerciseAttempt(
          currentExercise,
          index,
          isCorrect,
          currentExercise.skill || 'INTERPRET_RELATE'
        );
      }
    }, 300);
  };

  // Manejar la solicitud de un nuevo ejercicio
  const handleNewExercise = () => {
    setActiveTab("chat");
    resetExercise();
    
    addAssistantMessage("Excelente trabajo. ¿Te gustaría continuar con otro ejercicio o prefieres que trabajemos en otra habilidad?");
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
          <LectoGuiaHeader />

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
                <ChatTab 
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                />
              </TabsContent>

              <TabsContent value="exercise" className="m-0">
                <ExerciseTab
                  exercise={currentExercise}
                  selectedOption={selectedOption}
                  showFeedback={showFeedback}
                  onOptionSelect={handleExerciseOptionSelect}
                  onContinue={handleNewExercise}
                />
              </TabsContent>

              <TabsContent value="progress" className="m-0">
                <ProgressTab 
                  skillLevels={{
                    'TRACK_LOCATE': session.skillLevels['TRACK_LOCATE'] || 0,
                    'INTERPRET_RELATE': session.skillLevels['INTERPRET_RELATE'] || 0,
                    'EVALUATE_REFLECT': session.skillLevels['EVALUATE_REFLECT'] || 0
                  }}
                  onStartSimulation={handleStartSimulation}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default LectoGuia;
