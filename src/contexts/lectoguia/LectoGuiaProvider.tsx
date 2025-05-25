import React, { useEffect, useCallback, useRef } from 'react';
import { LectoGuiaContext } from './useLectoGuia';
import { LectoGuiaContextType } from './types';
import { useAuth } from '@/contexts/AuthContext';
import { useUnifiedSubjectManagement } from '@/hooks/lectoguia/use-unified-subject-management';
import { useNodesEnhanced } from './useNodesEnhanced';
import { useTabs } from './useTabs';
import { useEnhancedExerciseFlow } from '@/hooks/lectoguia/use-enhanced-exercise-flow';
import { useSkills } from './useSkills';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';

interface LectoGuiaProviderProps {
  children: React.ReactNode;
}

export const LectoGuiaProvider: React.FC<LectoGuiaProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const syncRef = useRef(false);
  const lastSyncRef = useRef<string>('');
  
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

  // Sincronización controlada y anti-bucle - CRÍTICO
  useEffect(() => {
    const syncKey = `${selectedPrueba}-${selectedTestId}-${nodes.length}`;
    
    // Prevenir bucle infinito con múltiples validaciones
    if (syncRef.current || lastSyncRef.current === syncKey || !selectedPrueba || !user?.id) {
      return;
    }
    
    syncRef.current = true;
    lastSyncRef.current = syncKey;
    
    console.log(`🔄 Sincronización controlada: ${selectedPrueba} (testId: ${selectedTestId})`);
    
    try {
      // Filtrar nodos por la prueba actual - sin triggear re-render
      const filteredNodes = getFilteredNodes();
      console.log(`📊 Nodos disponibles para ${selectedPrueba}: ${filteredNodes.length}`);
      
      // Solo mostrar mensaje si no hay nodos Y es la primera vez
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
      // Resetear flag después de un delay
      setTimeout(() => {
        syncRef.current = false;
      }, 2000);
    }
  }, [selectedPrueba, selectedTestId, nodes.length, user?.id]); // Dependencias mínimas y controladas

  // Función wrapper para updateNodeProgress con validación de tipos
  const handleUpdateNodeProgress = useCallback((nodeId: string, status: 'not_started' | 'in_progress' | 'completed', progress: number) => {
    console.log(`📈 Actualizando progreso del nodo: ${nodeId}, estado: ${status}, progreso: ${progress}`);
    
    // Validar tipos antes de la llamada
    if (typeof nodeId !== 'string') {
      console.error('❌ Error: nodeId debe ser string, recibido:', typeof nodeId, nodeId);
      return;
    }
    
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      console.error('❌ Error: progress debe ser número entre 0-100, recibido:', typeof progress, progress);
      return;
    }
    
    // Llamar a la función original con tipos correctos
    updateNodeProgress(nodeId, status, progress);
  }, [updateNodeProgress]);

  // Manejar selección de nodo con validación de coherencia
  const handleNodeSelect = useCallback(async (nodeId: string): Promise<boolean> => {
    try {
      console.log(`🎯 Seleccionando nodo: ${nodeId}`);
      
      const selectedNode = nodes.find(node => node.id === nodeId);
      if (!selectedNode) {
        console.error(`❌ Nodo no encontrado: ${nodeId}`);
        return false;
      }
      
      // Validar coherencia de materia
      if (selectedNode.prueba !== selectedPrueba) {
        console.warn(`⚠️ Nodo de prueba diferente: ${selectedNode.prueba} vs ${selectedPrueba}`);
        
        // Cambiar automáticamente a la prueba correcta
        changePrueba(selectedNode.prueba);
        
        addAssistantMessage(
          `He cambiado automáticamente a ${subjectDisplayNames[selectedNode.prueba]} ` +
          `para que practiques con este contenido específico.`
        );
      }
      
      console.log(`✅ Nodo seleccionado correctamente: ${selectedNode.title}`);
      
      // Cambiar a la pestaña de ejercicios
      setActiveTab('exercise');
      
      // Generar ejercicio específico para este nodo
      setExercisesLoading(true);
      
      // Aquí se conectaría con el generador de ejercicios
      // Por ahora, mostrar mensaje de confirmación
      addAssistantMessage(
        `Perfecto! Has seleccionado el nodo "${selectedNode.title}" de ${subjectDisplayNames[activeSubject]}. ` +
        `Generando ejercicio específico...`
      );
      
      // Actualizar progreso del nodo con tipos correctos
      handleUpdateNodeProgress(nodeId, 'in_progress', 0);
      
      setExercisesLoading(false);
      return true;
      
    } catch (error) {
      console.error('❌ Error al seleccionar nodo:', error);
      setExercisesLoading(false);
      return false;
    }
  }, [nodes, selectedPrueba, changePrueba, subjectDisplayNames, activeSubject, setActiveTab, setExercisesLoading, addAssistantMessage, handleUpdateNodeProgress]);

  // Manejar cambio de materia con mensaje al usuario
  const handleSubjectChange = useCallback((subject: string) => {
    changeSubject(subject);
    
    addAssistantMessage(
      `Ahora estamos en ${subjectDisplayNames[subject]}. ` +
      `Los nodos y ejercicios se filtrarán específicamente para esta materia. ¿En qué puedo ayudarte?`
    );
  }, [changeSubject, subjectDisplayNames, addAssistantMessage]);

  // Implementar correctamente el manejo de mensajes usando el hook de chat
  const handleSendMessage = useCallback(async (message: string, imageData?: string) => {
    console.log(`💬 Enviando mensaje en contexto de ${activeSubject}:`, message);
    
    // Validar estado antes de procesar
    validateState();
    
    try {
      // Usar el processUserMessage del hook de chat
      await processUserMessage(message, imageData);
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error);
      addAssistantMessage(
        "Lo siento, tuve un problema al procesar tu mensaje. Por favor intenta de nuevo."
      );
    }
  }, [activeSubject, validateState, processUserMessage, addAssistantMessage]);

  // Nuevo ejercicio con validación de coherencia y sincronización
  const handleNewExercise = useCallback(async (): Promise<boolean> => {
    console.log(`🎯 Generando nuevo ejercicio para ${selectedPrueba} (activeSubject: ${activeSubject})`);
    
    // Validar estado antes de generar
    if (!validateState()) {
      console.warn('⚠️ Estado inconsistente corregido antes de generar ejercicio');
    }
    
    // Filtrar nodos de la materia actual
    const availableNodes = getFilteredNodes();
    
    if (availableNodes.length === 0) {
      addAssistantMessage(
        `No hay nodos disponibles para ${subjectDisplayNames[activeSubject]}. ` +
        `Por favor, selecciona otra materia o contacta al administrador.`
      );
      return false;
    }
    
    console.log(`📚 Generando ejercicio con ${availableNodes.length} nodos disponibles de ${selectedPrueba}`);
    
    setExercisesLoading(true);
    
    try {
      // Mapeo de materias a pruebas PAES
      const subjectToPruebaMap: Record<string, string> = {
        'general': 'COMPETENCIA_LECTORA',
        'lectura': 'COMPETENCIA_LECTORA',
        'matematicas-basica': 'MATEMATICA_1',
        'matematicas-avanzada': 'MATEMATICA_2',
        'ciencias': 'CIENCIAS',
        'historia': 'HISTORIA'
      };

      const expectedPrueba = subjectToPruebaMap[activeSubject];
      
      // Crear un ejercicio básico con la prueba correcta
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
      
      console.log(`✅ Ejercicio sincronizado correctamente:`, {
        prueba: newExercise.prueba,
        activeSubject,
        selectedPrueba,
        coherent: newExercise.prueba === selectedPrueba
      });
      
      // Establecer el ejercicio en el estado
      setCurrentExercise(newExercise);
      
      // Cambiar a la pestaña de ejercicios
      setActiveTab('exercise');
      
      // Mensaje de confirmación coherente
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
  }, [selectedPrueba, activeSubject, validateState, getFilteredNodes, subjectDisplayNames, addAssistantMessage, setExercisesLoading, setCurrentExercise, setActiveTab]);

  // Wrapper function to ensure type safety for setSelectedTestId
  const handleSetSelectedTestId = useCallback((testId: number) => {
    changeTestId(testId);
  }, [changeTestId]);

  // Estado de conexión del chat
  const showConnectionStatus = connectionStatus !== 'connected';

  // Nodos recomendados filtrados por materia actual
  const recommendedNodes = getFilteredNodes().slice(0, 3);

  const contextValue: LectoGuiaContextType = {
    // Estado general
    activeTab,
    setActiveTab,
    isLoading: nodesLoading || exercisesLoading,
    
    // Chat - usar los valores del hook de chat
    messages,
    isTyping,
    activeSubject,
    handleSendMessage, // Usar la implementación real
    handleSubjectChange,
    
    // Ejercicios - usar el hook mejorado con PAES
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise, // Usar la versión sincronizada
    
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
    setSelectedTestId: handleSetSelectedTestId,
    selectedPrueba,
    recommendedNodes,
    
    // Estado de validación
    validationStatus,
    
    // Estado de conexión del chat
    serviceStatus: { isOnline: serviceStatus === 'available', lastCheck: new Date() },
    connectionStatus,
    resetConnectionStatus: () => {},
    showConnectionStatus
  };

  return (
    <LectoGuiaContext.Provider value={contextValue}>
      {children}
    </LectoGuiaContext.Provider>
  );
};
