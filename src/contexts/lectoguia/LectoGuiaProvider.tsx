
import React, { useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useOpenRouter } from '@/hooks/use-openrouter';
import { getSkillsByPrueba } from '@/utils/lectoguia-utils';
import { toast } from '@/components/ui/use-toast';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad } from '@/types/system-types';
import { v4 as uuidv4 } from 'uuid';

import { LectoGuiaContextType, SUBJECT_TO_PRUEBA_MAP } from './types';
import { LectoGuiaContext } from './useLectoGuia';
import { useTabs } from './useTabs';
import { useSubjects } from './useSubjects';
import { useNodes } from './useNodes';
import { useChat } from './useChat';
import { useSkills } from './useSkills';
import { useExercises } from './useExercises';

// Proveedor del contexto
export const LectoGuiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const { user } = useAuth();
  const { callOpenRouter } = useOpenRouter();
  
  // Hooks para cada conjunto de funcionalidad
  const { messages, isTyping: chatIsTyping, addUserMessage, addAssistantMessage } = useChat();
  const { activeTab, setActiveTab } = useTabs();
  const { activeSubject, handleSubjectChange } = useSubjects(
    'general',
    addAssistantMessage
  );
  const { 
    skillLevels, 
    updateSkillLevel, 
    getSkillIdFromCode, 
    handleStartSimulation 
  } = useSkills(user?.id);
  
  const {
    nodes,
    nodeProgress,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba
  } = useNodes(user?.id);
  
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise: baseHandleNewExercise,
    isLoading,
    setCurrentExercise,
    setIsLoading
  } = useExercises(user?.id, updateSkillLevel, getSkillIdFromCode);
  
  // Generación de ejercicios
  const generateExercise = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Obtener prueba correspondiente a la materia
      const prueba = SUBJECT_TO_PRUEBA_MAP[activeSubject] || 'COMPETENCIA_LECTORA';
      
      // Obtener habilidades disponibles para esta prueba
      const skills = getSkillsByPrueba()[prueba];
      
      // Seleccionar una habilidad aleatoria
      const randomSkill = skills[Math.floor(Math.random() * skills.length)];
      
      // Llamar al API para generar ejercicio
      const response = await callOpenRouter<Exercise>({
        action: "generate_exercise", 
        payload: {
          skill: randomSkill,
          prueba,
          difficulty: "INTERMEDIATE"
        }
      });
      
      if (response) {
        // Asegurarnos que el ejercicio tiene la información de prueba correcta
        response.prueba = prueba;
        setCurrentExercise(response);
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo generar el ejercicio',
          variant: 'destructive'
        });
      }
      
      return response;
    } catch (error) {
      console.error("Error al generar ejercicio:", error);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al generar el ejercicio',
        variant: 'destructive'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [activeSubject, callOpenRouter, setIsLoading, setCurrentExercise]);
  
  // Generar un ejercicio para un nodo específico
  const generateExerciseForNode = useCallback(async (nodeId: string) => {
    try {
      setIsLoading(true);
      
      // Encontrar el nodo
      const node = nodes.find(n => n.id === nodeId);
      if (!node) {
        toast({
          title: 'Error',
          description: 'No se encontró el nodo solicitado',
          variant: 'destructive'
        });
        return null;
      }
      
      // Llamar al API para generar ejercicio según el nodo
      const response = await callOpenRouter<Exercise>({
        action: "generate_exercise", 
        payload: {
          skill: node.skill,
          prueba: node.prueba,
          difficulty: node.difficulty || "INTERMEDIATE",
          nodeContext: {
            nodeId: node.id,
            title: node.title,
            description: node.description
          }
        }
      });
      
      if (response) {
        // Vincular el ejercicio con el nodo
        response.nodeId = node.id;
        response.nodeName = node.title;
        response.prueba = node.prueba;
        
        setCurrentExercise(response);
        setActiveTab('exercise');
        return response;
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo generar el ejercicio para este nodo',
          variant: 'destructive'
        });
      }
      
      return null;
    } catch (error) {
      console.error("Error al generar ejercicio para nodo:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [nodes, callOpenRouter, setActiveTab, setIsLoading, setCurrentExercise]);
  
  // Implementación real de handleNewExercise
  const handleNewExercise = useCallback(async () => {
    baseHandleNewExercise();
    await generateExercise();
  }, [baseHandleNewExercise, generateExercise]);

  // Manejador para selección de nodo
  const handleNodeSelect = useCallback((nodeId: string) => {
    generateExerciseForNode(nodeId);
  }, [generateExerciseForNode]);
  
  // Manejo de envío de mensajes
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    addUserMessage(message, imageData);
    const typingState = chatIsTyping;
    
    try {
      // Detectar si el mensaje contiene una solicitud de ejercicio
      const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                               message.toLowerCase().includes("practica") || 
                               message.toLowerCase().includes("ejemplo");
      
      if (isExerciseRequest) {
        addAssistantMessage("Generando un ejercicio para practicar...");
        handleNewExercise();
        setActiveTab('exercise');
      } else {
        // Procesar mensaje normal
        console.log('Sending message to backend:', message);
        const response = await callOpenRouter<any>({
          action: "provide_feedback", 
          payload: {
            userMessage: message,
            context: `PAES preparation, subject: ${activeSubject}`,
            previousMessages: messages.slice(-6)
          }
        });
        
        console.log('Response received from backend:', response);
        
        // Manejar diferentes formatos de respuesta
        let botResponse: string;
        
        if (!response) {
          botResponse = "Lo siento, no pude procesar tu solicitud. Por favor intenta de nuevo.";
        } else if (typeof response === 'string') {
          botResponse = response;
        } else if (typeof response === 'object') {
          // Si la respuesta ya tiene un campo 'response'
          if ('response' in response) {
            botResponse = response.response || "Lo siento, no pude procesar tu solicitud.";
          } else {
            // Intentar extraer el texto de cualquier campo
            const values = Object.values(response);
            const firstStringValue = values.find(v => typeof v === 'string');
            botResponse = firstStringValue as string || "Lo siento, no pude procesar tu solicitud.";
          }
        } else {
          botResponse = "Lo siento, no pude procesar tu solicitud correctamente.";
        }
        
        addAssistantMessage(botResponse);
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      addAssistantMessage("Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo.");
    }
  }, [messages, activeSubject, addUserMessage, addAssistantMessage, callOpenRouter, setActiveTab, handleNewExercise, chatIsTyping]);
  
  // Valores del contexto
  const contextValue = useMemo((): LectoGuiaContextType => ({
    // Estado general
    activeTab,
    setActiveTab,
    isLoading,
    
    // Chat
    messages,
    isTyping: chatIsTyping,
    activeSubject,
    handleSendMessage,
    handleSubjectChange,
    
    // Ejercicios
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    
    // Progreso
    skillLevels,
    handleStartSimulation,
    
    // Nodos
    nodes,
    nodeProgress,
    handleNodeSelect,
    selectedTestId,
    setSelectedTestId,
    selectedPrueba
  }), [
    activeTab, isLoading, messages, chatIsTyping, activeSubject,
    currentExercise, selectedOption, showFeedback, skillLevels,
    nodes, nodeProgress, selectedTestId, selectedPrueba,
    handleSendMessage, handleSubjectChange, handleOptionSelect,
    handleNewExercise, handleStartSimulation, handleNodeSelect,
    setActiveTab, setSelectedTestId
  ]);
  
  return (
    <LectoGuiaContext.Provider value={contextValue}>
      {children}
    </LectoGuiaContext.Provider>
  );
};
