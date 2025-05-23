
import { useState, useCallback, useEffect } from 'react';
import { TPAESPrueba } from '@/types/system-types';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';

/**
 * Hook para manejar la selección de tipos de prueba PAES
 */
export function useTestSelection() {
  const [selectedTest, setSelectedTest] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  const { setActiveSubject, addAssistantMessage } = useLectoGuiaChat();
  
  // Mapeo de tipos de prueba a materias del sistema de chat
  const testToSubjectMap: Record<TPAESPrueba, string> = {
    'COMPETENCIA_LECTORA': 'lectura',
    'MATEMATICA_1': 'matematicas-basica',
    'MATEMATICA_2': 'matematicas-avanzada',
    'CIENCIAS': 'ciencias',
    'HISTORIA': 'historia'
  };
  
  // Manejar cambio de tipo de prueba
  const handleTestChange = useCallback((test: TPAESPrueba) => {
    if (selectedTest !== test) {
      setSelectedTest(test);
      
      // Sincronizar con el sistema de chat
      const subject = testToSubjectMap[test];
      setActiveSubject(subject);
      
      // Mensaje de confirmación al usuario
      addAssistantMessage(
        `Ahora estamos enfocados en ${test === 'COMPETENCIA_LECTORA' ? 'Competencia Lectora' : 
         test === 'MATEMATICA_1' ? 'Matemática 1 (7° a 2° medio)' :
         test === 'MATEMATICA_2' ? 'Matemática 2 (3° y 4° medio)' :
         test === 'CIENCIAS' ? 'Ciencias' : 'Historia'}. ¿En qué puedo ayudarte con esta prueba?`
      );
    }
  }, [selectedTest, setActiveSubject, addAssistantMessage, testToSubjectMap]);
  
  // Obtener información del tipo de prueba actual
  const getCurrentTestInfo = useCallback(() => {
    const testInfo = {
      'COMPETENCIA_LECTORA': {
        name: 'Competencia Lectora',
        description: 'Comprensión y análisis de textos',
        skills: ['Localizar información', 'Interpretar y relacionar', 'Evaluar y reflexionar'],
        color: 'blue'
      },
      'MATEMATICA_1': {
        name: 'Matemática 1',
        description: 'Matemáticas de 7° básico a 2° medio',
        skills: ['Resolución de problemas', 'Representación'],
        color: 'green'
      },
      'MATEMATICA_2': {
        name: 'Matemática 2',
        description: 'Matemáticas de 3° y 4° medio',
        skills: ['Modelamiento', 'Resolución de problemas'],
        color: 'purple'
      },
      'CIENCIAS': {
        name: 'Ciencias',
        description: 'Física, química y biología',
        skills: ['Interpretar y relacionar', 'Evaluar y reflexionar', 'Modelamiento'],
        color: 'orange'
      },
      'HISTORIA': {
        name: 'Historia',
        description: 'Historia, geografía y ciencias sociales',
        skills: ['Localizar información', 'Interpretar y relacionar', 'Evaluar y reflexionar'],
        color: 'red'
      }
    };
    
    return testInfo[selectedTest];
  }, [selectedTest]);
  
  return {
    selectedTest,
    handleTestChange,
    getCurrentTestInfo,
    currentSubject: testToSubjectMap[selectedTest]
  };
}
