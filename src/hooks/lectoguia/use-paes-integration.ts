import { useState, useCallback } from 'react';
import { PAESService, PAESQuestion } from '@/services/paes/paes-service';
import { Exercise } from '@/types/ai-types';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

/**
 * Hook para integrar preguntas oficiales de PAES con LectoGuía - Versión Real
 */
export function usePAESIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [paesStats, setPaesStats] = useState<any>(null);
  const [availableExams, setAvailableExams] = useState<any[]>([]);

  // Mapeo de materias de LectoGuía a códigos de examen PAES reales
  const subjectToExamMap: Record<string, string> = {
    'matematicas-basica': 'MATEMATICA_M2_2024_FORMA_153',
    'matematicas-avanzada': 'MATEMATICA_M2_2024_FORMA_153',
    'lectura': 'PAES-2024-FORM-103',
    'ciencias': 'CIENCIAS_2024_FORMA_153',
    'historia': 'HISTORIA_2024_FORMA_123'
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
      correctAnswer: correctOption?.contenido || paesQuestion.opciones[0]?.contenido || '',
      explanation: `Esta es una pregunta oficial de PAES ${prueba} (Pregunta #${paesQuestion.numero}). ${correctOption ? 'La respuesta correcta es la opción ' + correctOption.letra + '.' : ''}`
    };
  }, []);

  /**
   * Generar ejercicio oficial de PAES usando datos reales
   */
  const generatePAESExercise = useCallback(async (
    activeSubject: string,
    skill: TPAESHabilidad,
    prueba: TPAESPrueba
  ): Promise<Exercise | null> => {
    setIsLoading(true);
    
    try {
      console.log(`🎯 Generando ejercicio PAES real para ${activeSubject} (${skill}, ${prueba})`);
      
      // Obtener código de examen basado en la materia
      const examCode = subjectToExamMap[activeSubject];
      if (!examCode) {
        console.warn(`No hay examen PAES disponible para ${activeSubject}`);
        return null;
      }

      // Validar que el examen existe en la base de datos
      const isValidExam = await PAESService.validateExam(examCode);
      if (!isValidExam) {
        console.warn(`Examen ${examCode} no encontrado en la base de datos`);
        return null;
      }

      // Determinar dificultad basada en la habilidad
      const difficulty = skillToDifficultyMap[skill] || 'INTERMEDIO';
      
      // Obtener pregunta PAES real
      const paesQuestion = await PAESService.getQuestionsByDifficulty(examCode, difficulty);
      
      if (!paesQuestion) {
        console.warn(`No se encontró pregunta PAES para dificultad ${difficulty} en ${examCode}`);
        return null;
      }

      // Convertir a formato Exercise
      const exercise = convertPAESToExercise(paesQuestion, prueba, skill);
      
      console.log(`✅ Ejercicio PAES real generado: Pregunta #${paesQuestion.numero} de ${examCode}`);
      return exercise;

    } catch (error) {
      console.error('Error generando ejercicio PAES real:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [convertPAESToExercise, subjectToExamMap, skillToDifficultyMap]);

  /**
   * Obtener estadísticas de PAES reales
   */
  const loadPAESStats = useCallback(async (examCode?: string) => {
    try {
      console.log('📊 Cargando estadísticas PAES reales...');
      
      const defaultExamCode = examCode || 'PAES-2024-FORM-103';
      const stats = await PAESService.getExamStats(defaultExamCode);
      
      if (stats) {
        setPaesStats(stats);
        console.log(`✅ Estadísticas PAES cargadas: ${stats.questionsLoaded}/${stats.totalQuestions} preguntas`);
      }
      
      return stats;
    } catch (error) {
      console.error('Error cargando estadísticas PAES:', error);
      return null;
    }
  }, []);

  /**
   * Cargar exámenes disponibles
   */
  const loadAvailableExams = useCallback(async () => {
    try {
      console.log('📚 Cargando exámenes disponibles...');
      
      const exams = await PAESService.getAvailableExams();
      setAvailableExams(exams);
      
      console.log(`✅ ${exams.length} exámenes disponibles cargados`);
      return exams;
    } catch (error) {
      console.error('Error cargando exámenes disponibles:', error);
      return [];
    }
  }, []);

  /**
   * Verificar si hay contenido PAES real disponible para una materia
   */
  const hasPAESContent = useCallback(async (activeSubject: string): Promise<boolean> => {
    const examCode = subjectToExamMap[activeSubject];
    if (!examCode) return false;
    
    try {
      return await PAESService.validateExam(examCode);
    } catch (error) {
      console.error('Error verificando contenido PAES:', error);
      return false;
    }
  }, [subjectToExamMap]);

  /**
   * Obtener múltiples preguntas para una sesión de práctica
   */
  const generatePracticeSession = useCallback(async (
    activeSubject: string,
    questionCount: number = 5
  ): Promise<Exercise[]> => {
    const examCode = subjectToExamMap[activeSubject];
    if (!examCode) return [];

    try {
      console.log(`🏋️ Generando sesión de práctica: ${questionCount} preguntas`);
      
      const exercises: Exercise[] = [];
      const usedNumbers = new Set<number>();
      
      for (let i = 0; i < questionCount; i++) {
        const question = await PAESService.getRandomQuestion(examCode);
        
        if (question && !usedNumbers.has(question.numero)) {
          usedNumbers.add(question.numero);
          
          // Determinar prueba y skill basado en la materia
          const prueba = activeSubject.includes('matematicas') ? 'MATEMATICA_1' : 'COMPETENCIA_LECTORA';
          const skill = 'INTERPRET_RELATE'; // Skill por defecto, se puede hacer más inteligente
          
          const exercise = convertPAESToExercise(question, prueba as TPAESPrueba, skill);
          exercises.push(exercise);
        }
      }
      
      console.log(`✅ Sesión de práctica generada: ${exercises.length} ejercicios`);
      return exercises;
      
    } catch (error) {
      console.error('Error generando sesión de práctica:', error);
      return [];
    }
  }, [subjectToExamMap, convertPAESToExercise]);

  return {
    generatePAESExercise,
    loadPAESStats,
    loadAvailableExams,
    hasPAESContent,
    generatePracticeSession,
    isLoading,
    paesStats,
    availableExams,
    subjectToExamMap
  };
}
