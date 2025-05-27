
import React, { useEffect, useCallback, useRef } from 'react';
import { LectoGuiaContext } from './useLectoGuia';
import { LectoGuiaContextType } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalEducation } from '@/contexts/GlobalEducationProvider';
import { useUnifiedSubjectManagement } from '@/hooks/lectoguia/use-unified-subject-management';
import { useNodesEnhanced } from './useNodesEnhanced';
import { useTabs } from './useTabs';
import { useEnhancedExerciseFlow } from '@/hooks/lectoguia/use-enhanced-exercise-flow';
import { useSkills } from './useSkills';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';

interface UnifiedLectoGuiaProviderProps {
  children: React.ReactNode;
}

export const UnifiedLectoGuiaProvider: React.FC<UnifiedLectoGuiaProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { setActiveModule } = useGlobalEducation();
  const syncRef = useRef(false);
  
  // Notificar al contexto global que LectoGuía está activo
  useEffect(() => {
    setActiveModule('lectoguia');
    return () => setActiveModule(null);
  }, [setActiveModule]);
  
  // Hook unificado para gestión de materias
  const {
    activeSubject,
    selectedPrueba,
    selectedTestId,
    changeSubject,
    changePrueba,
    changeTestId,
    validateState,
    subjectDisplayNames
  } = useUnifiedSubjectManagement();
  
  // Otros hooks del sistema
  const { activeTab, setActiveTab } = useTabs();
  
  const {
    nodes,
    nodeProgress,
    loading: nodesLoading,
    error: nodesError,
    validationStatus,
    updateNodeProgress,
    refreshNodes,
    getFilteredNodes
  } = useNodesEnhanced(user?.id);
  
  // Integrar correctamente el hook de chat
  const {
    messages,
    isTyping,
    processUserMessage,
    activeSkill,
    setActiveSkill,
    connectionStatus,
    serviceStatus,
    addAssistantMessage
  } = useLectoGuiaChat();
  
  const {
    skillLevels,
    updateSkillLevel,
    getSkillIdFromCode,
    handleStartSimulation
  } = useSkills(user?.id);
  
  // Usar el hook mejorado de ejercicios con integración PAES
  const {
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise: enhancedHandleNewExercise,
    isLoading: exercisesLoading,
    setCurrentExercise,
    setIsLoading: setExercisesLoading,
    exerciseSource
  } = useEnhancedExerciseFlow(activeSubject, setActiveTab);

  // Sincronización controlada y anti-bucle
  useEffect(() => {
    const syncKey = `${selectedPrueba}-${selectedTestId}-${nodes.length}`;
    
    if (syncRef.current || !selectedPrueba || !user?.id) {
      return;
    }
    
    syncRef.current = true;
    
    try {
      const filteredNodes = getFilteredNodes();
      console.log(`📊 Nodos disponibles para ${selectedPrueba}: ${filteredNodes.length}`);
      
      if (filteredNodes.length === 0 && nodes.length > 0) {
        setTimeout(() => {
          addAssistantMessage(
            `Detecté que estás en ${subjectDisplayNames[activeSubject]}. ` +
            `Estoy preparando el contenido específico para esta materia.`
          );
        }, 1000);
      }
    } catch (error) {
      console.error('Error en sincronización:', error);
    } finally {
      setTimeout(() => {
        syncRef.current = false;
      }, 2000);
    }
  }, [selectedPrueba, selectedTestId, nodes.length, user?.id]);

  // Función wrapper para updateNodeProgress con validación de tipos
  const handleUpdateNodeProgress = useCallback((nodeId: string, status: 'not_started' | 'in_progress' | 'completed', progress: number) => {
    if (typeof nodeId !== 'string' || typeof progress !== 'number' || progress < 0 || progress > 100) {
      console.error('❌ Error: parámetros inválidos para updateNodeProgress');
      return;
    }
    
    updateNodeProgress(nodeId, status, progress);
  }, [updateNodeProgress]);

  // Manejar selección de nodo
  const handleNodeSelect = useCallback(async (nodeId: string): Promise<boolean> => {
    try {
      const selectedNode = nodes.find(node => node.id === nodeId);
      if (!selectedNode) {
        console.error(`❌ Nodo no encontrado: ${nodeId}`);
        return false;
      }
      
      // Validar coherencia de materia
      if (selectedNode.prueba !== selectedPrueba) {
        changePrueba(selectedNode.prueba);
        addAssistantMessage(
          `He cambiado automáticamente a ${subjectDisplayNames[selectedNode.prueba]} ` +
          `para que practiques con este contenido específico.`
        );
      }
      
      setActiveTab('exercise');
      setExercisesLoading(true);
      
      addAssistantMessage(
        `Perfecto! Has seleccionado el nodo "${selectedNode.title}" de ${subjectDisplayNames[activeSubject]}. ` +
        `Generando ejercicio específico...`
      );
      
      handleUpdateNodeProgress(nodeId, 'in_progress', 0);
      setExercisesLoading(false);
      return true;
      
    } catch (error) {
      console.error('❌ Error al seleccionar nodo:', error);
      setExercisesLoading(false);
      return false;
    }
  }, [nodes, selectedPrueba, changePrueba, subjectDisplayNames, activeSubject, setActiveTab, setExercisesLoading, addAssistantMessage, handleUpdateNodeProgress]);

  // Manejar cambio de materia
  const handleSubjectChange = useCallback((subject: string) => {
    changeSubject(subject);
    addAssistantMessage(
      `Ahora estamos en ${subjectDisplayNames[subject]}. ` +
      `Los nodos y ejercicios se filtrarán específicamente para esta materia. ¿En qué puedo ayudarte?`
    );
  }, [changeSubject, subjectDisplayNames, addAssistantMessage]);

  // Manejar envío de mensajes
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    validateState();
    
    try {
      await processUserMessage(message, imageData);
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error);
      addAssistantMessage(
        "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo."
      );
    }
  }, [validateState, processUserMessage, addAssistantMessage]);

  // Generar nuevo ejercicio
  const handleNewExercise = useCallback(async (): Promise<boolean> => {
    if (!validateState()) {
      console.warn('⚠️ Estado inconsistente corregido antes de generar ejercicio');
    }
    
    const availableNodes = getFilteredNodes();
    
    if (availableNodes.length === 0) {
      addAssistantMessage(
        `No hay nodos disponibles para ${subjectDisplayNames[activeSubject]}. ` +
        `Por favor, selecciona otra materia o contacta al administrador.`
      );
      return false;
    }
    
    setExercisesLoading(true);
    
    try {
      const subjectToPruebaMap: Record<string, string> = {
        'general': 'COMPETENCIA_LECTORA',
        'lectura': 'COMPETENCIA_LECTORA',
        'matematicas-basica': 'MATEMATICA_1',
        'matematicas-avanzada': 'MATEMATICA_2',
        'ciencias': 'CIENCIAS',
        'historia': 'HISTORIA'
      };

      const expectedPrueba = subjectToPruebaMap[activeSubject];
      
      const newExercise = {
        id: `exercise-${Date.now()}`,
        nodeId: '',
        nodeName: '',
        prueba: expectedPrueba,
        skill: 'INTERPRET_RELATE' as any,
        difficulty: 'INTERMEDIATE',
        question: `Ejercicio de ${subjectDisplayNames[activeSubject]}`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 'Opción A',
        explanation: 'Explicación del ejercicio'
      };
      
      setCurrentExercise(newExercise);
      setActiveTab('exercise');
      
      addAssistantMessage(
        `✅ He generado un ejercicio de ${subjectDisplayNames[activeSubject]} (${expectedPrueba}). ` +
        `Puedes verlo en la pestaña de Ejercicios.`
      );
      
      return true;
    } catch (error) {
      console.error('❌ Error generando ejercicio:', error);
      addAssistantMessage(
        `❌ No pude generar un ejercicio para ${subjectDisplayNames[activeSubject]}. ` +
        `Por favor, intenta de nuevo.`
      );
      return false;
    } finally {
      setExercisesLoading(false);
    }
  }, [validateState, getFilteredNodes, subjectDisplayNames, activeSubject, addAssistantMessage, setExercisesLoading, setCurrentExercise, setActiveTab]);

  const contextValue: LectoGuiaContextType = {
    // Estado general
    activeTab,
    setActiveTab,
    isLoading: nodesLoading || exercisesLoading,
    
    // Chat
    messages,
    isTyping,
    activeSubject,
    handleSendMessage,
    handleSubjectChange,
    
    // Ejercicios
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    
    // Habilidades
    activeSkill,
    setActiveSkill,
    handleSkillSelect: async (skill) => {
      setActiveSkill(skill);
      return true;
    },
    
    // Progreso
    skillLevels,
    handleStartSimulation,
    
    // Nodos unificados
    nodes,
    nodeProgress,
    handleNodeSelect,
    selectedTestId,
    setSelectedTestId: changeTestId,
    selectedPrueba,
    recommendedNodes: getFilteredNodes().slice(0, 3),
    
    // Estado de validación
    validationStatus,
    
    // Estado de conexión
    serviceStatus: { isOnline: serviceStatus === 'available', lastCheck: new Date() },
    connectionStatus,
    resetConnectionStatus: () => {},
    showConnectionStatus: connectionStatus !== 'connected'
  };

  return (
    <LectoGuiaContext.Provider value={contextValue}>
      {children}
    </LectoGuiaContext.Provider>
  );
};
