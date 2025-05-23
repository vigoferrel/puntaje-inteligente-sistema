
import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Exercise } from '@/types/ai-types';

import { LectoGuiaContextType, SUBJECT_TO_PRUEBA_MAP } from './types';
import { LectoGuiaContext } from './useLectoGuia';
import { useTabs } from './useTabs';
import { useNodes } from './useNodes';
import { useSkills } from './useSkills';
import { useExercises } from './useExercises';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useSubjects } from './useSubjects';

// Proveedor del contexto
export const LectoGuiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const { user } = useAuth();
  
  // Hooks para cada conjunto de funcionalidad
  const { activeTab, setActiveTab } = useTabs();
  
  const {
    messages,
    isTyping: chatIsTyping,
    activeSubject,
    processUserMessage,
    serviceStatus,
    connectionStatus,
    resetConnectionStatus,
    showConnectionStatus,
    setActiveSubject
  } = useLectoGuiaChat();
  
  // Usar el hook useSubjects para manejar el cambio de materias
  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
  };

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
    handleNewExercise,
    isLoading,
    setCurrentExercise,
    setIsLoading
  } = useExercises(user?.id, updateSkillLevel, getSkillIdFromCode);
  
  // Generar un ejercicio para un nodo específico
  const generateExerciseForNode = async (nodeId: string) => {
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
      
      // Crear solicitud para generar ejercicio según el nodo
      const response = await processUserMessage(
        `Genera un ejercicio para el nodo "${node.title}" con habilidad ${node.skill} de dificultad ${node.difficulty || "INTERMEDIATE"}`,
        undefined
      );
      
      if (response) {
        // Crear un objeto de ejercicio a partir de la respuesta
        const exercise: Exercise = {
          id: node.id,
          nodeId: node.id,
          nodeName: node.title,
          prueba: node.prueba,
          skill: node.skill,
          difficulty: node.difficulty || "INTERMEDIATE",
          question: response,
          options: [
            "Opción 1",
            "Opción 2",
            "Opción 3",
            "Opción 4"
          ],
          correctAnswer: "Opción 1",
          explanation: "Por favor selecciona una opción para recibir retroalimentación."
        };
        
        setCurrentExercise(exercise);
        setActiveTab('exercise');
        return exercise;
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
  };
  
  // Manejador para selección de nodo
  const handleNodeSelect = (nodeId: string) => {
    generateExerciseForNode(nodeId);
  };
  
  // Manejo de envío de mensajes
  const handleSendMessage = async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    try {
      // Detectar si el mensaje contiene una solicitud de ejercicio
      const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                              message.toLowerCase().includes("practica") || 
                              message.toLowerCase().includes("ejemplo");
      
      if (isExerciseRequest) {
        await processUserMessage(message, imageData);
        handleNewExercise();
        setActiveTab('exercise');
      } else {
        // Procesar mensaje normal
        await processUserMessage(message, imageData);
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    }
  };
  
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
    selectedPrueba,
    
    // Estado de conexión
    serviceStatus,
    connectionStatus,
    resetConnectionStatus,
    showConnectionStatus
  }), [
    activeTab, isLoading, messages, chatIsTyping, activeSubject, 
    currentExercise, selectedOption, showFeedback, skillLevels, 
    nodes, nodeProgress, selectedTestId, selectedPrueba,
    handleSendMessage, handleSubjectChange, handleOptionSelect, 
    handleNewExercise, handleStartSimulation, handleNodeSelect,
    setActiveTab, setSelectedTestId, serviceStatus, connectionStatus,
    resetConnectionStatus, showConnectionStatus
  ]);
  
  return (
    <LectoGuiaContext.Provider value={contextValue}>
      {children}
    </LectoGuiaContext.Provider>
  );
};
