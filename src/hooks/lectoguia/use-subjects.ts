
import { useState } from 'react';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';
import { TPAESPrueba } from '@/types/system-types';

/**
 * Mapeo entre identificadores de materia y tipos de prueba PAES
 */
export const SUBJECT_TO_PRUEBA_MAP: Record<string, TPAESPrueba> = {
  'general': 'COMPETENCIA_LECTORA',
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

/**
 * Hook para gestionar las materias en LectoGuia y su correspondencia con pruebas PAES
 */
export function useSubjects() {
  const [activeSubject, setActiveSubject] = useState('general');
  const { addAssistantMessage, setActiveSubject: setActiveChatSubject } = useLectoGuiaChat();
  
  const subjectNames: Record<string, string> = {
    general: 'modo general',
    lectura: 'Comprensión Lectora',
    'matematicas-basica': 'Matemáticas 7° a 2° medio',
    'matematicas-avanzada': 'Matemáticas 3° y 4° medio',
    ciencias: 'Ciencias',
    historia: 'Historia'
  };
  
  // Manejar cambio de materia
  const handleSubjectChange = (subject: string) => {
    if (activeSubject !== subject) {
      setActiveSubject(subject);
      setActiveChatSubject(subject);
      
      // Notificar al usuario sobre el cambio de materia
      addAssistantMessage(`Ahora estamos en ${subjectNames[subject]}. ¿En qué puedo ayudarte con esta materia?`);
    }
  };
  
  // Obtener el tipo de prueba PAES correspondiente a la materia activa
  const getActivePruebaType = (): TPAESPrueba => {
    return SUBJECT_TO_PRUEBA_MAP[activeSubject] || 'COMPETENCIA_LECTORA';
  };
  
  return {
    activeSubject,
    handleSubjectChange,
    getActivePruebaType,
    subjectNames
  };
}
