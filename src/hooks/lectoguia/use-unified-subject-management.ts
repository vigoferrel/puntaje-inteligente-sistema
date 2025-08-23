
import { useState, useCallback, useEffect } from 'react';
import { TPAESPrueba } from '@/types/system-types';
import { toast } from '@/components/ui/use-toast';

/**
 * Hook centralizado para gestionar de manera unificada:
 * - activeSubject (string para UI)
 * - selectedPrueba (TPAESPrueba para filtros)
 * - selectedTestId (number para compatibilidad)
 */
export function useUnifiedSubjectManagement() {
  const [activeSubject, setActiveSubject] = useState<string>('lectura');
  const [selectedPrueba, setSelectedPrueba] = useState<TPAESPrueba>('COMPETENCIA_LECTORA');
  const [selectedTestId, setSelectedTestId] = useState<number>(1);

  // Mapeos bidireccionales
  const subjectToPruebaMap: Record<string, TPAESPrueba> = {
    'general': 'COMPETENCIA_LECTORA',
    'lectura': 'COMPETENCIA_LECTORA',
    'matematicas-basica': 'MATEMATICA_1',
    'matematicas-avanzada': 'MATEMATICA_2',
    'ciencias': 'CIENCIAS',
    'historia': 'HISTORIA'
  };

  const pruebaToSubjectMap: Record<TPAESPrueba, string> = {
    'COMPETENCIA_LECTORA': 'lectura',
    'MATEMATICA_1': 'matematicas-basica',
    'MATEMATICA_2': 'matematicas-avanzada',
    'CIENCIAS': 'ciencias',
    'HISTORIA': 'historia'
  };

  const pruebaToTestIdMap: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };

  const testIdToPruebaMap: Record<number, TPAESPrueba> = {
    1: 'COMPETENCIA_LECTORA',
    2: 'MATEMATICA_1',
    3: 'MATEMATICA_2',
    4: 'CIENCIAS',
    5: 'HISTORIA'
  };

  const subjectDisplayNames: Record<string, string> = {
    'general': 'General',
    'lectura': 'Competencia Lectora',
    'matematicas-basica': 'Matemática 1',
    'matematicas-avanzada': 'Matemática 2',
    'ciencias': 'Ciencias',
    'historia': 'Historia'
  };

  // Función principal para cambiar de materia (sincroniza todo)
  const changeSubject = useCallback((newSubject: string) => {
    console.log(`🔄 Cambiando materia unificada: ${activeSubject} → ${newSubject}`);
    
    const newPrueba = subjectToPruebaMap[newSubject];
    const newTestId = pruebaToTestIdMap[newPrueba];
    
    setActiveSubject(newSubject);
    setSelectedPrueba(newPrueba);
    setSelectedTestId(newTestId);
    
    toast({
      title: "Materia cambiada",
      description: `Ahora estás en ${subjectDisplayNames[newSubject]}`,
    });
    
    console.log(`✅ Estado unificado actualizado: subject=${newSubject}, prueba=${newPrueba}, testId=${newTestId}`);
  }, [activeSubject, subjectToPruebaMap, pruebaToTestIdMap, subjectDisplayNames]);

  // Función para cambiar por prueba (sincroniza todo)
  const changePrueba = useCallback((newPrueba: TPAESPrueba) => {
    console.log(`🔄 Cambiando prueba unificada: ${selectedPrueba} → ${newPrueba}`);
    
    const newSubject = pruebaToSubjectMap[newPrueba];
    const newTestId = pruebaToTestIdMap[newPrueba];
    
    setSelectedPrueba(newPrueba);
    setActiveSubject(newSubject);
    setSelectedTestId(newTestId);
    
    console.log(`✅ Estado unificado actualizado: prueba=${newPrueba}, subject=${newSubject}, testId=${newTestId}`);
  }, [selectedPrueba, pruebaToSubjectMap, pruebaToTestIdMap]);

  // Función para cambiar por testId (sincroniza todo)
  const changeTestId = useCallback((newTestId: number) => {
    console.log(`🔄 Cambiando testId unificado: ${selectedTestId} → ${newTestId}`);
    
    const newPrueba = testIdToPruebaMap[newTestId];
    const newSubject = pruebaToSubjectMap[newPrueba];
    
    setSelectedTestId(newTestId);
    setSelectedPrueba(newPrueba);
    setActiveSubject(newSubject);
    
    console.log(`✅ Estado unificado actualizado: testId=${newTestId}, prueba=${newPrueba}, subject=${newSubject}`);
  }, [selectedTestId, testIdToPruebaMap, pruebaToSubjectMap]);

  // Validar coherencia del estado
  const validateState = useCallback(() => {
    const expectedPrueba = subjectToPruebaMap[activeSubject];
    const expectedTestId = pruebaToTestIdMap[selectedPrueba];
    
    if (selectedPrueba !== expectedPrueba || selectedTestId !== expectedTestId) {
      console.warn('⚠️ Estado inconsistente detectado, corrigiendo...');
      
      // Usar activeSubject como fuente de verdad
      const correctPrueba = subjectToPruebaMap[activeSubject];
      const correctTestId = pruebaToTestIdMap[correctPrueba];
      
      setSelectedPrueba(correctPrueba);
      setSelectedTestId(correctTestId);
      
      return false;
    }
    
    return true;
  }, [activeSubject, selectedPrueba, selectedTestId, subjectToPruebaMap, pruebaToTestIdMap]);

  // Validar estado en cada cambio
  useEffect(() => {
    validateState();
  }, [validateState]);

  return {
    // Estado actual
    activeSubject,
    selectedPrueba,
    selectedTestId,
    
    // Funciones de cambio
    changeSubject,
    changePrueba,
    changeTestId,
    
    // Utilidades
    validateState,
    subjectDisplayNames,
    
    // Mapeos para compatibilidad
    subjectToPruebaMap,
    pruebaToSubjectMap,
    pruebaToTestIdMap,
    testIdToPruebaMap
  };
}
