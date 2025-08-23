
import { useState, useCallback } from 'react';
import { UseSubjectsState, SUBJECT_DISPLAY_NAMES } from './types';

export function useSubjects(
  initialSubject: string = 'general',
  addAssistantMessage: (content: string) => any
): UseSubjectsState {
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  
  const handleSubjectChange = useCallback((subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      addAssistantMessage(`Ahora estamos en ${SUBJECT_DISPLAY_NAMES[subject] || subject}. ¿En qué puedo ayudarte?`);
    }
  }, [activeSubject, addAssistantMessage]);
  
  return {
    activeSubject,
    setActiveSubject,
    handleSubjectChange
  };
}
