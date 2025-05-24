
import { useState, useCallback } from 'react';
import { PAESService, PAESQuestion } from '@/services/paes/paes-service';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

/**
 * Hook para integrar preguntas oficiales de PAES con LectoGuía
 */
export function usePAESIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [paesStats, setPaesStats] = useState<any>(null);

  // Mapeo de materias de LectoGuía a códigos de examen PAES
  const subjectToExamMap: Record<string, string> = {
    'matematicas-basica': 'FORMA_113_2024',
    'matematicas-avanzada': 'FORMA_113_2024', // Cuando tengamos Matemática 2
    'lectura': 'COMPETENCIA_LECTORA_2024',     // Cuando tengamos Comprensión Lectora
    'ciencias': 'CIENCIAS_2024',               // Cuando tengamos Ciencias
    'historia': 'HISTORIA_2024'                // Cuando tengamos Historia
  };

  // Mapeo de habilidades a dificultad conceptual
  const skillToDifficultyMap: Record<TPAESHabilidad, 'BASICO' | 'INTERMEDIO' | 'AVANZADO'> = {
    'TRACK_LOCATE': 'BASICO',
    'INTERPRET_RELATE': 'INTERMEDIO',
    'EVALUATE_REFLECT': 'AVANZADO',
    'SOLVE_PROBLEMS': 'BASICO',
    'REPRESENT': 'INTERMEDIO', 
    'MODEL': 'AVANZADO',
    'ARGUE_COMMUNICATE': 'AVANZADO',
    'IDENTIFY_THEORIES': 'BASICO',
    'PROCESS_ANALYZE': 'INTERMEDIO',
    'APPLY_PRINCIPLES': 'AVANZADO',
    'SCIENTIFIC_ARGUMENT': 'AVANZADO',
    'TEMPORAL_THINKING': 'BASICO',
    'SOURCE_ANALYSIS': 'INTERMEDIO',
    'MULTICAUSAL_ANALYSIS': 'AVANZADO',
    'CRITICAL_THINKING': 'AVANZADO',
    'REFLECTION': 'INTERMEDIO'
  };

  /**
   * Convertir pregunta PAES a formato Exercise de LectoGuía
   */
  const convertPAESToExercise = useCallback((
    paesQuestion: PAESQuestion,
    prueba: TPAESPrueba,
    skill: TPAESHabilidad
  ): Exercise => {
    const correctOption = paesQuestion.opciones.find(opt => opt.es_correcta);
    
    return {
      id: `paes-${paesQuestion.id}`,
      nodeId: '',
      nodeName: '',
      prueba,
      skill,
      difficulty: 'INTERMEDIATE',
      question: paesQuestion.contexto 
        ? `${paesQuestion.contexto}\n\n${paesQuestion.enunciado}`
        : paesQuestion.enunciado,
      options: paesQuestion.opciones.map(opt => opt.contenido),
      correctAnswer: correctOption?.contenido || paesQuestion.opciones[0].contenido,
      explanation: `Esta es una pregunta oficial de PAES ${prueba} (Pregunta #${paesQuestion.numero}). ${correctOption ? 'La respuesta correcta es la opción ' + correctOption.letra + '.' : ''}`
    };
  }, []);

  /**
   * Generar ejercicio oficial de PAES
   */
  const generatePAESExercise = useCallback(async (
    activeSubject: string,
    skill: TPAESHabilidad,
    prueba: TPAESPrueba
  ): Promise<Exercise | null> => {
    setIsLoading(true);
    
    try {
      console.log(`🎯 Generando ejercicio PAES para ${activeSubject} (${skill}, ${prueba})`);
      
      // Obtener código de examen basado en la materia
      const examCode = subjectToExamMap[activeSubject];
      if (!examCode) {
        console.warn(`No hay examen PAES disponible para ${activeSubject}`);
        return null;
      }

      // Solo usar PAES para matemáticas por ahora (tenemos esos datos)
      if (!activeSubject.includes('matematicas')) {
        console.log(`📚 Materia ${activeSubject} no tiene datos PAES aún, usando generación AI`);
        return null;
      }

      // Determinar dificultad basada en la habilidad
      const difficulty = skillToDifficultyMap[skill] || 'INTERMEDIO';
      
      // Obtener pregunta PAES
      const paesQuestion = await PAESService.getQuestionsByDifficulty(examCode, difficulty);
      
      if (!paesQuestion) {
        console.warn(`No se encontró pregunta PAES para dificultad ${difficulty}`);
        return null;
      }

      // Convertir a formato Exercise
      const exercise = convertPAESToExercise(paesQuestion, prueba, skill);
      
      console.log(`✅ Ejercicio PAES generado: Pregunta #${paesQuestion.numero}`);
      return exercise;

    } catch (error) {
      console.error('Error generando ejercicio PAES:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [convertPAESToExercise, subjectToExamMap, skillToDifficultyMap]);

  /**
   * Obtener estadísticas de PAES
   */
  const loadPAESStats = useCallback(async () => {
    try {
      const stats = await PAESService.getExamStats();
      setPaesStats(stats);
      return stats;
    } catch (error) {
      console.error('Error cargando estadísticas PAES:', error);
      return null;
    }
  }, []);

  /**
   * Verificar si hay contenido PAES disponible para una materia
   */
  const hasPAESContent = useCallback((activeSubject: string): boolean => {
    return activeSubject.includes('matematicas') && !!subjectToExamMap[activeSubject];
  }, [subjectToExamMap]);

  return {
    generatePAESExercise,
    loadPAESStats,
    hasPAESContent,
    isLoading,
    paesStats,
    subjectToExamMap
  };
}
