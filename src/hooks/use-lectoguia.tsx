
import { useState } from "react";
import { Exercise } from "@/types/ai-types";
import { LectoGuiaSkill } from "@/types/lectoguia-types";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";
import { useLectoGuiaChat } from "@/hooks/use-lectoguia-chat";
import { useLectoGuiaExercise } from "@/hooks/use-lectoguia-exercise";
import { toast } from "@/components/ui/use-toast";

export function useLectoGuia() {
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
    } else if (isAboutDiagnostic) {
      // Responder con información sobre los diagnósticos
      await processUserMessage(message);
    } else if (isAboutPlan) {
      // Responder con información sobre el plan de aprendizaje
      await processUserMessage(message);
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

  return {
    activeTab,
    setActiveTab,
    messages,
    isTyping,
    handleSendMessage,
    activeSubject,
    handleSubjectChange,
    currentExercise,
    selectedOption,
    showFeedback,
    handleExerciseOptionSelect,
    handleNewExercise,
    handleStartSimulation,
    skillLevels: session.skillLevels as Record<LectoGuiaSkill, number>
  };
}
