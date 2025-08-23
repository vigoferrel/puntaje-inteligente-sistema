
import { useCallback } from "react";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";
import { LectoGuiaSkill } from "@/types/lectoguia-types";
import { useAuth } from "@/contexts/AuthContext";
import { useLectoGuiaSimplified } from "./lectoguia/useLectoGuiaSimplified";

/**
 * Hook principal consolidado para LectoGuía - versión final para producción
 */
export function useLectoGuia() {
  const { user } = useAuth();
  const { session } = useLectoGuiaSession();
  
  // Usar el hook simplificado real
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
    getStats,
    activeSkill,
    setActiveSkill
  } = useLectoGuiaSimplified();

  // Funciones adicionales consolidadas
  const handleExerciseOptionSelect = useCallback((option: number) => {
    handleOptionSelect(option);
  }, [handleOptionSelect]);

  const handleStartSimulation = useCallback(() => {
    console.log('Iniciando simulación PAES...');
  }, []);

  const handleNodeSelect = useCallback((nodeId: string) => {
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
    getStats,
    activeSkill,
    setActiveSkill,
    handleSkillSelect: async (skill: any) => {
      setActiveSkill(skill);
      return true;
    }
  };
}
