
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLectoGuiaReal, LectoGuiaTab } from '@/hooks/lectoguia/useLectoGuiaReal';
import { TPAESHabilidad } from '@/types/system-types';

interface OptimizedLectoGuiaContextType {
  activeTab: LectoGuiaTab;
  setActiveTab: React.Dispatch<React.SetStateAction<LectoGuiaTab>>;
  messages: any[];
  isTyping: boolean;
  handleSendMessage: (message: string, imageData?: string) => Promise<void>;
  activeSubject: string;
  handleSubjectChange: (subject: string) => void;
  currentExercise: any;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (option: number) => void;
  handleNewExercise: () => Promise<void>;
  isLoading: boolean;
  getStats: () => any;
  activeSkill: TPAESHabilidad | null;
  setActiveSkill: (skill: TPAESHabilidad | null) => void;
}

const OptimizedLectoGuiaContext = createContext<OptimizedLectoGuiaContextType | undefined>(undefined);

export const OptimizedLectoGuiaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Usar solo el hook real consolidado
  const lectoGuiaData = useLectoGuiaReal();
  
  // Memoizar para evitar re-renders innecesarios
  const contextValue = useMemo(() => lectoGuiaData, [
    lectoGuiaData.activeTab,
    lectoGuiaData.isLoading,
    lectoGuiaData.currentExercise?.id,
    lectoGuiaData.messages.length
  ]);
  
  return (
    <OptimizedLectoGuiaContext.Provider value={contextValue}>
      {children}
    </OptimizedLectoGuiaContext.Provider>
  );
};

export const useOptimizedLectoGuia = () => {
  const context = useContext(OptimizedLectoGuiaContext);
  if (context === undefined) {
    throw new Error('useOptimizedLectoGuia must be used within an OptimizedLectoGuiaProvider');
  }
  return context;
};
