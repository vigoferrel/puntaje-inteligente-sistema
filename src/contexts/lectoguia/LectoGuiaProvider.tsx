import React, { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Exercise } from '@/types/ai-types';

import { LectoGuiaContextType } from './types';
import { LectoGuiaContext } from './useLectoGuia';
import { useTabs } from './useTabs';
import { useNodes } from './useNodes';
import { useSkills } from './useSkills';
import { useExercises } from './useExercises';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { useTestSelection } from '@/hooks/lectoguia/use-test-selection';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

// Proveedor del contexto
export const LectoGuiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth
  const { user } = useAuth();
  
  // Hooks para cada conjunto de funcionalidad
  const { activeTab, setActiveTab } = useTabs();
  
  // Hook centralizado para manejo de selección de prueba
  const {
    selectedTest,
    handleTestChange,
    getCurrentTestInfo,
    currentSubject,
    getTestIdFromPrueba
  } = useTestSelection();

  const {
    messages,
    isTyping: chatIsTyping,
    activeSubject,
    processUserMessage,
    serviceStatus,
    connectionStatus,
    resetConnectionStatus,
    showConnectionStatus,
    setActiveSubject,
    addAssistantMessage,
    changeSubject,
    detectSubjectFromMessage,
    activeSkill,
    setActiveSkill,
    recommendedNodes,
    generateExerciseForNode,
    generateExerciseForSkill,
    updateNodeProgress,
    updateSkillLevel
  } = useLectoGuiaChat();
  
  const { 
    skillLevels, 
    updateSkillLevel: updateSkillLevelUI, 
    getSkillIdFromCode, 
    handleStartSimulation 
  } = useSkills(user?.id);
  
  const {
    nodes,
    nodeProgress,
    selectedTestId,
    selectedPrueba,
    handlePruebaChange,
    getFilteredNodes
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
  } = useExercises(user?.id, updateSkillLevelUI, getSkillIdFromCode);

  // Función centralizada para cambio de tipo de prueba
  const handleTestSelect = (test: TPAESPrueba) => {
    console.log(`🎯 LectoGuiaProvider: Cambiando a prueba ${test}`);
    
    // Usar el hook centralizado
    handleTestChange(test);
    
    // Sincronizar con useNodes
    handlePruebaChange(test);
  };
  
  // Manejar la selección de nodos de aprendizaje
  const handleNodeSelect = async (nodeId: string) => {
    try {
      setIsLoading(true);
      
      // Usar la función generateExerciseForNode para obtener un ejercicio
      const exercise = await generateExerciseForNode(nodeId);
      
      if (exercise) {
        // Actualizar el ejercicio actual
        setCurrentExercise(exercise);
        
        // Actualizar progreso del nodo
        if (user?.id) {
          await updateNodeProgress(nodeId, 0.3);
        }
        
        // Cambiar a la pestaña de ejercicios
        setActiveTab('exercise');
        
        toast({
          title: "Ejercicio generado",
          description: "Se ha generado un ejercicio para este nodo de aprendizaje."
        });
        
        return true;
      } else {
        toast({
          title: "Error",
          description: "No se pudo generar un ejercicio para este nodo.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error al seleccionar nodo:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar generar el ejercicio.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar la selección de habilidades
  const handleSkillSelect = async (skill: TPAESHabilidad) => {
    try {
      setIsLoading(true);
      setActiveSkill(skill);
      
      // Usar la función generateExerciseForSkill para obtener un ejercicio
      const exercise = await generateExerciseForSkill(skill);
      
      if (exercise) {
        // Actualizar el ejercicio actual
        setCurrentExercise(exercise);
        
        // Cambiar a la pestaña de ejercicios
        setActiveTab('exercise');
        
        toast({
          title: "Ejercicio generado",
          description: `Se ha generado un ejercicio para practicar la habilidad ${skill}.`
        });
        
        return true;
      } else {
        toast({
          title: "Error",
          description: "No se pudo generar un ejercicio para esta habilidad.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Error al seleccionar habilidad:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al intentar generar el ejercicio.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mejorado: Función para solicitar ejercicios que utiliza la habilidad activa
  const handleExerciseRequest = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Limpiar estado actual
      setCurrentExercise(null);
      
      // Si hay una habilidad activa, generar ejercicio específico
      if (activeSkill) {
        return await handleSkillSelect(activeSkill);
      }
      
      // Determinar una habilidad apropiada según la materia activa
      let skill: TPAESHabilidad;
      
      switch (activeSubject) {
        case 'lectura':
          skill = 'INTERPRET_RELATE';
          break;
        case 'matematicas-basica':
        case 'matematicas-avanzada':
          skill = 'SOLVE_PROBLEMS';
          break;
        case 'ciencias':
          skill = 'PROCESS_ANALYZE';
          break;
        case 'historia':
          skill = 'SOURCE_ANALYSIS';
          break;
        default:
          skill = 'INTERPRET_RELATE';
      }
      
      // Generar ejercicio para esta habilidad
      return await handleSkillSelect(skill);
    } catch (error) {
      console.error("Error en solicitud de ejercicio:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejo de envío de mensajes actualizado
  const handleSendMessage = async (message: string, imageData?: string) => {
    if (!message.trim() && !imageData) return;
    
    try {
      // Detectar menciones de nodos específicos
      const nodeIdMatch = message.match(/nodo:([a-f0-9-]+)/i);
      if (nodeIdMatch && nodeIdMatch[1]) {
        // Primero procesar el mensaje para que se registre en el historial
        await processUserMessage(message, imageData);
        // Luego seleccionar el nodo
        await handleNodeSelect(nodeIdMatch[1]);
        return;
      }
      
      // Detectar menciones de habilidades específicas
      const skillMatch = message.match(/habilidad:(TRACK_LOCATE|INTERPRET_RELATE|EVALUATE_REFLECT|SOLVE_PROBLEMS|REPRESENT|MODEL|ARGUE_COMMUNICATE|IDENTIFY_THEORIES|PROCESS_ANALYZE|APPLY_PRINCIPLES|SCIENTIFIC_ARGUMENT|TEMPORAL_THINKING|SOURCE_ANALYSIS|MULTICAUSAL_ANALYSIS|CRITICAL_THINKING|REFLECTION)/i);
      if (skillMatch && skillMatch[1]) {
        // Primero procesar el mensaje para que se registre en el historial
        await processUserMessage(message, imageData);
        // Luego seleccionar la habilidad
        await handleSkillSelect(skillMatch[1] as TPAESHabilidad);
        return;
      }
      
      // Detectar si el mensaje contiene una solicitud de ejercicio
      const isExerciseRequest = message.toLowerCase().includes("ejercicio") || 
                              message.toLowerCase().includes("practica") || 
                              message.toLowerCase().includes("ejemplo") ||
                              message.toLowerCase().includes("problema");
      
      if (isExerciseRequest && !imageData) {
        // Primero procesar el mensaje para que se registre en el historial
        await processUserMessage(message, imageData);
        // Luego generar el ejercicio
        await handleExerciseRequest();
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
    handleSubjectChange: (subject: string) => setActiveSubject(subject),
    
    // Ejercicios
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise: handleExerciseRequest,
    
    // Habilidades
    activeSkill,
    setActiveSkill,
    handleSkillSelect,
    
    // Progreso
    skillLevels,
    handleStartSimulation,
    
    // Nodos
    nodes,
    nodeProgress,
    handleNodeSelect,
    selectedTestId: getTestIdFromPrueba(selectedTest),
    setSelectedTestId: (testId: number) => {
      const pruebaMap = {
        1: 'COMPETENCIA_LECTORA' as TPAESPrueba,
        2: 'MATEMATICA_1' as TPAESPrueba,
        3: 'MATEMATICA_2' as TPAESPrueba,
        4: 'CIENCIAS' as TPAESPrueba,
        5: 'HISTORIA' as TPAESPrueba
      };
      const prueba = pruebaMap[testId];
      if (prueba) {
        handleTestSelect(prueba);
      }
    },
    selectedPrueba: selectedTest,
    recommendedNodes,
    
    // Estado de validación
    validationStatus: {
      isValid: true,
      issuesCount: 0,
      lastValidation: new Date()
    },
    
    // Estado de conexión
    serviceStatus: {
      isOnline: true,
      lastCheck: new Date()
    },
    connectionStatus,
    resetConnectionStatus,
    showConnectionStatus
  }), [
    activeTab, isLoading, messages, chatIsTyping, activeSubject, 
    currentExercise, selectedOption, showFeedback, skillLevels, 
    nodes, nodeProgress, selectedTest, recommendedNodes,
    handleSendMessage, handleOptionSelect, 
    handleExerciseRequest, handleStartSimulation, handleNodeSelect,
    handleSkillSelect, activeSkill, setActiveSkill,
    setActiveTab, serviceStatus, connectionStatus,
    resetConnectionStatus, showConnectionStatus, getTestIdFromPrueba
  ]);
  
  return (
    <LectoGuiaContext.Provider value={contextValue}>
      {children}
    </LectoGuiaContext.Provider>
  );
};
