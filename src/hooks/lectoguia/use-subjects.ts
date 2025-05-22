
import { useState } from 'react';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';

/**
 * Hook para gestionar las materias en LectoGuia
 */
export function useSubjects() {
  const [activeSubject, setActiveSubject] = useState('general');
  const { addAssistantMessage } = useLectoGuiaChat();
  
  const subjectNames: Record<string, string> = {
    general: 'modo general',
    lectura: 'Comprensión Lectora',
    matematicas: 'Matemáticas',
    ciencias: 'Ciencias',
    historia: 'Historia'
  };
  
  // Manejar cambio de materia
  const handleSubjectChange = (subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      
      // Notificar al usuario sobre el cambio de materia
      addAssistantMessage(`Ahora estamos en ${subjectNames[subject]}. ¿En qué puedo ayudarte con esta materia?`);
    }
  };
  
  return {
    activeSubject,
    handleSubjectChange
  };
}
