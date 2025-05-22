
import { useState, useCallback } from "react";
import { Exercise } from "@/types/ai-types";
import { LectoGuiaSkill, TLearningNode } from "@/types/lectoguia-types";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";
import { useLectoGuiaChat } from "@/hooks/lectoguia-chat";
import { useLectoGuiaExercise } from "@/hooks/use-lectoguia-exercise";
import { toast } from "@/components/ui/use-toast";
import { useLearningNodes } from "@/hooks/use-learning-nodes";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNodeById } from "@/services/learning-node-service";
import { TPAESHabilidad } from "@/types/system-types";

export function useLectoGuia() {
  // Estado para gestionar la pestaña activa
  const [activeTab, setActiveTab] = useState("chat");
  const { user } = useAuth();
  
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
    resetExercise,
    generateExerciseForNode
  } = useLectoGuiaExercise();

  const {
    updateNodeProgress,
  } = useLearningNodes();

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
      // Generar ejercicio según la materia activa - ACTUALIZADO con los nombres correctos de las habilidades
      const skillMap: Record<string, TPAESHabilidad> = {
        'lectura': 'TRACK_LOCATE',
        'matematicas': 'SOLVE_PROBLEMS',
        'ciencias': 'IDENTIFY_THEORIES',
        'historia': 'TEMPORAL_THINKING',
        'general': 'INTERPRET_RELATE'
      };
      
      const exercise = await generateExercise(skillMap[activeSubject]);
      
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

  // Nueva función para manejar la selección de nodo
  const handleNodeSelect = useCallback(async (nodeId: string) => {
    if (!user?.id) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para acceder a este nodo de aprendizaje",
        variant: "destructive"
      });
      return;
    }

    try {
      // 1. Marcar el nodo como "in_progress"
      const nodeUpdateSuccess = await updateNodeProgress(
        user.id,
        nodeId,
        'in_progress',
        0.1, // Iniciamos con un 10% de progreso
        1 // Añadimos un minuto de tiempo invertido inicialmente
      );

      if (!nodeUpdateSuccess) {
        throw new Error("No se pudo actualizar el estado del nodo");
      }

      // 2. Obtener los detalles del nodo
      const nodeDetails = await fetchNodeById(nodeId);
      if (!nodeDetails) {
        throw new Error("No se pudo obtener la información del nodo");
      }

      // 3. Cambiar a la pestaña de chat
      setActiveTab("chat");

      // 4. Generar mensaje del asistente sobre el nodo
      const welcomeMessage = `
Estamos trabajando ahora en el nodo de aprendizaje **${nodeDetails.title}**. 

Este nodo se enfoca en la habilidad **${nodeDetails.skill}** y tiene un nivel de dificultad **${nodeDetails.difficulty}**.

${nodeDetails.description}

Trabajemos en este tema para mejorar tu dominio. ¿Te gustaría comenzar con:
1. Una explicación del concepto principal
2. Ver un ejercicio de ejemplo
3. Practicar con un ejercicio relacionado
`;

      addAssistantMessage(welcomeMessage);

      // 5. Preparar un ejercicio relacionado con la habilidad del nodo
      const exercise = await generateExerciseForNode(nodeDetails);

      if (exercise) {
        // Cambiamos a la pestaña de ejercicios después de generarlo
        setTimeout(() => {
          setActiveTab("exercise");
          
          toast({
            title: "Ejercicio generado",
            description: "Se ha generado un ejercicio relacionado con este nodo de aprendizaje. ¡Resuélvelo para avanzar!",
          });
        }, 800);
      }

      return true;
    } catch (error) {
      console.error("Error al iniciar nodo de aprendizaje:", error);
      toast({
        title: "Error",
        description: "No se pudo iniciar el nodo de aprendizaje",
        variant: "destructive"
      });
      return false;
    }
  }, [user, updateNodeProgress, addAssistantMessage, generateExerciseForNode, setActiveTab]);

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
    skillLevels: session.skillLevels as Record<LectoGuiaSkill, number>,
    handleNodeSelect
  };
}
