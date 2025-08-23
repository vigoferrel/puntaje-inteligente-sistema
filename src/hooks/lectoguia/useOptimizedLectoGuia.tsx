
/**
 * LECTOGUÍA OPTIMIZADA v2.0
 * Hook principal que centraliza toda la funcionalidad de LectoGuía
 */

import { useCallback, useMemo } from 'react';
import { useUnifiedEducation } from '@/providers/UnifiedEducationProvider';
import { toast } from '@/hooks/use-toast';

const SUBJECT_TO_PRUEBA_MAP: Record<string, string> = {
  'competencia-lectora': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  'competencia-lectora': 'Competencia Lectora',
  'matematicas-basica': 'Matemática M1',
  'matematicas-avanzada': 'Matemática M2',
  'ciencias': 'Ciencias',
  'historia': 'Historia y Ciencias Sociales'
};

export const useOptimizedLectoGuia = () => {
  const {
    lectoguia,
    user,
    system,
    setLectoGuiaSubject,
    updateLectoGuiaNodes,
    updateNodeProgress,
    addLectoGuiaMessage,
    updateUserPreferences,
    setActiveModule,
  } = useUnifiedEducation();

  // Cambio de materia optimizado
  const changeSubject = useCallback((newSubject: string) => {
    if (newSubject === lectoguia.activeSubject) return;
    
    setLectoGuiaSubject(newSubject);
    
    // Notificar cambio
    addLectoGuiaMessage({
      type: 'system',
      content: `Cambiando a ${SUBJECT_DISPLAY_NAMES[newSubject]}...`,
      metadata: { subject: newSubject }
    });
    
    toast({
      title: "📚 Materia Cambiada",
      description: `Ahora estás en ${SUBJECT_DISPLAY_NAMES[newSubject]}`,
    });
  }, [lectoguia.activeSubject, setLectoGuiaSubject, addLectoGuiaMessage]);

  // Gestión de nodos optimizada
  const handleNodeSelect = useCallback(async (nodeId: string) => {
    const selectedNode = lectoguia.nodes.find(node => node.id === nodeId);
    if (!selectedNode) {
      console.error(`❌ Nodo no encontrado: ${nodeId}`);
      return false;
    }

    // Actualizar progreso
    updateNodeProgress(nodeId, {
      status: 'in_progress',
      lastAccessed: new Date(),
      progress: lectoguia.nodeProgress[nodeId]?.progress || 0
    });

    // Mensaje de confirmación
    addLectoGuiaMessage({
      type: 'assistant',
      content: `✅ Has seleccionado el nodo "${selectedNode.title}" de ${SUBJECT_DISPLAY_NAMES[lectoguia.activeSubject]}. Generando ejercicio específico...`,
      metadata: { nodeId, nodeName: selectedNode.title }
    });

    return true;
  }, [lectoguia.nodes, lectoguia.activeSubject, lectoguia.nodeProgress, updateNodeProgress, addLectoGuiaMessage]);

  // Envío de mensajes optimizado
  const sendMessage = useCallback(async (message: string, imageData?: string) => {
    if (!message.trim()) return;

    // Añadir mensaje del usuario
    addLectoGuiaMessage({
      type: 'user',
      content: message,
      imageData,
      metadata: { 
        subject: lectoguia.activeSubject,
        timestamp: Date.now()
      }
    });

    // Simular respuesta del asistente (aquí se integraría con el servicio real)
    setTimeout(() => {
      addLectoGuiaMessage({
        type: 'assistant',
        content: `Entiendo tu consulta sobre ${SUBJECT_DISPLAY_NAMES[lectoguia.activeSubject]}. Estoy procesando tu solicitud...`,
        metadata: { 
          subject: lectoguia.activeSubject,
          responseTime: Date.now()
        }
      });
    }, 500);

  }, [lectoguia.activeSubject, addLectoGuiaMessage]);

  // Preferencias optimizadas
  const updatePreference = useCallback(async (key: string, value: string) => {
    const newPreferences = {
      ...user.preferences,
      [`lectoguia_${key}`]: value
    };
    
    updateUserPreferences(newPreferences);
    
    toast({
      title: "⚙️ Preferencia Actualizada",
      description: `${key}: ${value}`,
    });

    return true;
  }, [user.preferences, updateUserPreferences]);

  // Estado computado para optimizar renders
  const computedState = useMemo(() => {
    const activeNodes = lectoguia.nodes.filter(node => 
      node.prueba === SUBJECT_TO_PRUEBA_MAP[lectoguia.activeSubject]
    );
    
    const completedNodes = activeNodes.filter(node => 
      lectoguia.nodeProgress[node.id]?.status === 'completed'
    );
    
    const progressPercentage = activeNodes.length > 0 
      ? (completedNodes.length / activeNodes.length) * 100 
      : 0;

    return {
      activeNodes,
      completedNodes,
      progressPercentage,
      totalMessages: lectoguia.messages.length,
      currentPrueba: SUBJECT_TO_PRUEBA_MAP[lectoguia.activeSubject],
      displayName: SUBJECT_DISPLAY_NAMES[lectoguia.activeSubject],
    };
  }, [lectoguia.nodes, lectoguia.nodeProgress, lectoguia.activeSubject, lectoguia.messages]);

  // Activar módulo LectoGuía
  const activateLectoGuia = useCallback(() => {
    setActiveModule('lectoguia');
  }, [setActiveModule]);

  return {
    // Estado actual
    activeSubject: lectoguia.activeSubject,
    nodes: lectoguia.nodes,
    nodeProgress: lectoguia.nodeProgress,
    messages: lectoguia.messages,
    isTyping: lectoguia.isTyping,
    activeSkill: lectoguia.activeSkill,
    
    // Estado computado
    ...computedState,
    
    // Acciones
    changeSubject,
    handleNodeSelect,
    sendMessage,
    updatePreference,
    activateLectoGuia,
    
    // Utilidades
    isReady: system.isInitialized && user.id !== null,
    subjectOptions: Object.keys(SUBJECT_TO_PRUEBA_MAP),
    preferences: user.preferences,
    
    // Mapeos
    SUBJECT_TO_PRUEBA_MAP,
    SUBJECT_DISPLAY_NAMES,
  };
};
