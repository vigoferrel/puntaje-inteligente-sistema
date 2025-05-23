
import { useState, useCallback, useEffect } from 'react';
import { TPAESPrueba } from '@/types/system-types';
import { useLectoGuiaChat } from '@/hooks/lectoguia-chat';

/**
 * Hook mejorado para manejar la selección de tipos de prueba PAES
 * con sincronización global del estado
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
  
  // Mapeo inverso para sincronización
  const subjectToTestMap: Record<string, TPAESPrueba> = {
    'lectura': 'COMPETENCIA_LECTORA',
    'matematicas-basica': 'MATEMATICA_1',
    'matematicas-avanzada': 'MATEMATICA_2',
    'ciencias': 'CIENCIAS',
    'historia': 'HISTORIA'
  };
  
  // Manejar cambio de tipo de prueba con propagación global
  const handleTestChange = useCallback((test: TPAESPrueba) => {
    if (selectedTest !== test) {
      console.log(`🔄 Cambiando tipo de prueba: ${selectedTest} → ${test}`);
      
      setSelectedTest(test);
      
      // Sincronizar con el sistema de chat
      const subject = testToSubjectMap[test];
      setActiveSubject(subject);
      
      // Mensaje de confirmación al usuario
      const testNames = {
        'COMPETENCIA_LECTORA': 'Competencia Lectora',
        'MATEMATICA_1': 'Matemática 1 (7° a 2° medio)',
        'MATEMATICA_2': 'Matemática 2 (3° y 4° medio)',
        'CIENCIAS': 'Ciencias',
        'HISTORIA': 'Historia'
      };
      
      addAssistantMessage(
        `Ahora estamos enfocados en **${testNames[test]}**. Los nodos de aprendizaje y ejercicios se filtrarán específicamente para esta prueba. ¿En qué puedo ayudarte?`
      );
    }
  }, [selectedTest, setActiveSubject, addAssistantMessage, testToSubjectMap]);
  
  // Sincronizar cuando cambie la materia activa externamente
  const syncWithActiveSubject = useCallback((activeSubject: string) => {
    const correspondingTest = subjectToTestMap[activeSubject];
    if (correspondingTest && correspondingTest !== selectedTest) {
      console.log(`🔄 Sincronizando con materia activa: ${activeSubject} → ${correspondingTest}`);
      setSelectedTest(correspondingTest);
    }
  }, [selectedTest, subjectToTestMap]);
  
  // Obtener información del tipo de prueba actual
  const getCurrentTestInfo = useCallback(() => {
    const testInfo = {
      'COMPETENCIA_LECTORA': {
        name: 'Competencia Lectora',
        description: 'Comprensión y análisis de textos',
        skills: ['Localizar información', 'Interpretar y relacionar', 'Evaluar y reflexionar'],
        color: 'blue',
        subject: 'lectura'
      },
      'MATEMATICA_1': {
        name: 'Matemática 1',
        description: 'Matemáticas de 7° básico a 2° medio',
        skills: ['Resolución de problemas', 'Representación'],
        color: 'green',
        subject: 'matematicas-basica'
      },
      'MATEMATICA_2': {
        name: 'Matemática 2',
        description: 'Matemáticas de 3° y 4° medio',
        skills: ['Modelamiento', 'Resolución de problemas'],
        color: 'purple',
        subject: 'matematicas-avanzada'
      },
      'CIENCIAS': {
        name: 'Ciencias',
        description: 'Física, química y biología',
        skills: ['Interpretar y relacionar', 'Evaluar y reflexionar', 'Modelamiento'],
        color: 'orange',
        subject: 'ciencias'
      },
      'HISTORIA': {
        name: 'Historia',
        description: 'Historia, geografía y ciencias sociales',
        skills: ['Localizar información', 'Interpretar y relacionar', 'Evaluar y reflexionar'],
        color: 'red',
        subject: 'historia'
      }
    };
    
    return testInfo[selectedTest];
  }, [selectedTest]);
  
  return {
    selectedTest,
    handleTestChange,
    syncWithActiveSubject,
    getCurrentTestInfo,
    currentSubject: testToSubjectMap[selectedTest]
  };
}
