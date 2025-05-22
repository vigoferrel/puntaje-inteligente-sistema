
import React, { useState, useEffect } from "react";
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
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { useLearningPlan } from "@/hooks/use-learning-plan";

// Componente principal de LectoGuía convertido en asistente completo
const LectoGuia = () => {
  // Estado para gestionar la pestaña activa
  const [activeTab, setActiveTab] = useState("chat");
  
  // Hooks para estados y lógica
  const { session, saveExerciseAttempt } = useLectoGuiaSession();
  const { 
    messages, 
    isTyping, 
    processUserMessage, 
    addAssistantMessage,
    activeSubject,
    changeSubject,
    detectSubjectFromMessage 
  } = useLectoGuiaChat();
  
  const { 
    currentExercise, 
    selectedOption, 
    showFeedback, 
    generateExercise, 
    handleOptionSelect, 
    resetExercise 
  } = useLectoGuiaExercise();
  
  // Hooks adicionales para acceder a datos de la plataforma
  const { tests } = useDiagnostic();
  const { plan } = useLearningPlan();
  
  // Manejar el envío de mensajes
  const handleSendMessage = async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    // If there's an image, process it
    if (imageData) {
      await processUserMessage(message, imageData);
      return;
    }
    
    // Detectar la materia del mensaje y cambiar si es necesario
    const detectedSubject = detectSubjectFromMessage(message);
    if (detectedSubject && detectedSubject !== activeSubject) {
      changeSubject(detectedSubject);
    }
    
    // Detectar si el usuario está pidiendo información sobre alguna sección del sitio
    const isAboutDiagnostic = message.toLowerCase().includes("diagnóstico") || 
                              message.toLowerCase().includes("diagnostic");
    const isAboutPlan = message.toLowerCase().includes("plan") || 
                         message.toLowerCase().includes("aprendizaje");
    
    // Detectar si el usuario está pidiendo un ejercicio
    const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                              message.toLowerCase().includes("practica") || 
                              message.toLowerCase().includes("ejemplo");
    
    if (isExerciseRequest) {
      // Generar ejercicio según la materia activa
      const skillMap: Record<string, string> = {
        'lectura': 'TRACK_LOCATE',
        'matematicas': 'ALGEBRA',
        'ciencias': 'PHYSICS',
        'historia': 'HISTORY',
        'general': 'INTERPRET_RELATE'
      };
      
      const exercise = await generateExercise(skillMap[activeSubject] as any);
      
      if (exercise) {
        setTimeout(() => setActiveTab("exercise"), 500);
        
        // Agregar mensaje del asistente sobre el ejercicio generado
        addAssistantMessage(
          `He preparado un ejercicio de ${activeSubject === 'general' ? 'comprensión lectora' : activeSubject} para ti. Es un ejercicio de dificultad ${exercise.difficulty || "intermedia"} que evalúa la habilidad de ${exercise.skill || "interpretación"}. Puedes resolverlo en la pestaña de Ejercicios.`
        );
      } else {
        addAssistantMessage("Lo siento, no pude generar un ejercicio en este momento. Por favor, inténtalo más tarde.");
      }
    } else if (isAboutDiagnostic && tests) {
      // Responder con información sobre los diagnósticos
      const diagnosticInfo = `La sección de Diagnóstico te permite evaluar tu nivel actual en las distintas habilidades PAES. 
      Actualmente hay ${tests.length} diagnóstico(s) disponible(s) para realizar.
      ${message.toLowerCase().includes("como") ? "Para acceder a esta sección, ve al menú lateral y selecciona 'Diagnóstico'." : ""}`;
      
      await processUserMessage(message);
      setTimeout(() => addAssistantMessage(diagnosticInfo), 1000);
    } else if (isAboutPlan && plan) {
      // Responder con información sobre el plan de aprendizaje
      const planInfo = `Tu Plan de Aprendizaje está diseñado específicamente para mejorar tus habilidades PAES.
      ${plan.title ? `Actualmente tienes un plan llamado "${plan.title}".` : "No tienes un plan activo en este momento."}
      ${message.toLowerCase().includes("como") ? "Para acceder a esta sección, ve al menú lateral y selecciona 'Plan'." : ""}`;
      
      await processUserMessage(message);
      setTimeout(() => addAssistantMessage(planInfo), 1000);
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
    
    addAssistantMessage("Excelente trabajo. ¿Te gustaría continuar con otro ejercicio o prefieres que trabajemos en otra materia?");
  };
  
  // Manejar inicio de simulación
  const handleStartSimulation = () => {
    toast({
      title: "Simulación",
      description: "Función en desarrollo. Estará disponible próximamente."
    });
  };
  
  // Manejar cambio de materia
  const handleSubjectChange = (subject: string) => {
    changeSubject(subject);
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
                  activeSubject={activeSubject}
                  onSubjectChange={handleSubjectChange}
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
                    'EVALUATE_REFLECT': session.skillLevels['EVALUATE_REFLECT'] || 0,
                    'ALGEBRA': session.skillLevels['ALGEBRA'] || 0,
                    'PHYSICS': session.skillLevels['PHYSICS'] || 0,
                    'HISTORY': session.skillLevels['HISTORY'] || 0
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
