
import { useState, useCallback } from 'react';
import { useLectoGuiaReal } from './useLectoGuiaReal';

export type LectoGuiaTab = 'chat' | 'exercise' | 'analysis' | 'simulation';

/**
 * Hook simplificado que usa la implementación real sin duplicados
 */
export function useLectoGuiaSimplified() {
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
    skillLevels,
    activeSkill,
    setActiveSkill
  } = useLectoGuiaReal();

  return {
    // Tab management
    activeTab,
    setActiveTab,
    
    // Chat functionality
    messages,
    isTyping,
    handleSendMessage,
    
    // Subject management
    activeSubject,
    handleSubjectChange,
    
    // Exercise functionality
    currentExercise,
    selectedOption,
    showFeedback,
    handleOptionSelect,
    handleNewExercise,
    
    // Loading states
    isLoading,
    
    // Statistics
    getStats,
    
    // Skills
    skillLevels,
    activeSkill,
    setActiveSkill
  };
}
