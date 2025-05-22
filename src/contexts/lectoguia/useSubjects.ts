
import { useState, useCallback } from 'react';
import { UseSubjectsState, SUBJECT_DISPLAY_NAMES } from './types';
import { v4 as uuidv4 } from 'uuid';

export function useSubjects(
  initialSubject: string = 'general',
  addAssistantMessage: (content: string) => any
): UseSubjectsState {
  const [activeSubject, setActiveSubject] = useState(initialSubject);
  
  const handleSubjectChange = useCallback((subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      addAssistantMessage(`Ahora estamos en ${SUBJECT_DISPLAY_NAMES[subject]}. ¿En qué puedo ayudarte?`);
    }
  }, [activeSubject, addAssistantMessage]);
  
  return {
    activeSubject,
    handleSubjectChange
  };
}
