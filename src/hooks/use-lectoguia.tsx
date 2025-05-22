
import { useCallback } from "react";
import { useLectoGuiaSession } from "@/hooks/use-lectoguia-session";
import { useLectoGuiaChat } from "@/hooks/lectoguia-chat";
import { LectoGuiaSkill } from "@/types/lectoguia-types";
import { useAuth } from "@/contexts/AuthContext";

// Importamos los hooks refactorizados
import { 
  useTabManagement,
  useSubjects,
  useExerciseFlow,
  useNodeInteraction 
} from "./lectoguia";
import { useMessageHandler } from "./lectoguia/use-message-handler";

export function useLectoGuia() {
  // Obtener datos del usuario
  const { user } = useAuth();
  
  // Hooks de sesión y chat
  const { session } = useLectoGuiaSession();
  const { messages, isTyping } = useLectoGuiaChat();
  
  // Hooks refactorizados
  const { activeTab, setActiveTab } = useTabManagement();
  const { activeSubject, handleSubjectChange } = useSubjects();
  
  const { 
    currentExercise, 
    selectedOption, 
    showFeedback,
    handleOptionSelect,
    handleNewExercise
  } = useExerciseFlow(activeSubject, setActiveTab);
  
  const {
    handleSendMessage,
    handleStartSimulation
  } = useMessageHandler(activeSubject, setActiveTab);
  
  const { handleNodeSelect } = useNodeInteraction(user?.id, setActiveTab);

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
    handleExerciseOptionSelect: handleOptionSelect,
    handleNewExercise,
    handleStartSimulation,
    skillLevels: session.skillLevels as Record<LectoGuiaSkill, number>,
    handleNodeSelect
  };
}
