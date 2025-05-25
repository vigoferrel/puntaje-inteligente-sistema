
import { useCallback } from "react";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";
import { useLectoGuiaChat } from "@/hooks/lectoguia-chat";
import { LectoGuiaSkill } from "@/types/lectoguia-types";
import { useAuth } from "@/contexts/AuthContext";

// Importamos el hook simplificado sin duplicaciones
import { useLectoGuiaSimplified } from "./lectoguia/useLectoGuiaSimplified";

export function useLectoGuia() {
  // Obtener datos del usuario
  const { user, profile } = useAuth();
  
  // Usar el hook simplificado principal
  const {
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
    handleOptionSelect,
    handleNewExercise,
    isLoading,
    getStats
  } = useLectoGuiaSimplified();
  
  // Hooks complementarios para funcionalidad extendida
  const { session } = useLectoGuiaSession();

  // Funciones adicionales para compatibilidad
  const handleExerciseOptionSelect = useCallback((option: number) => {
    handleOptionSelect(option);
  }, [handleOptionSelect]);

  const handleStartSimulation = useCallback(() => {
    // Simular inicio de simulación
    console.log('Iniciando simulación PAES...');
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
    // Simular selección de nodo
    console.log('Seleccionando nodo:', nodeId);
    setActiveTab('exercise');
  }, [setActiveTab]);

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
    handleNodeSelect,
    isLoading,
    getStats
  };
}
