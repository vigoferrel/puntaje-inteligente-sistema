
import { useState, useCallback } from 'react';
import { 
  fetchPAESMatematica2Exam, 
  getRandomMatematica2Questions, 
  getMatematica2QuestionsByEje,
  getMatematica2ExamStats,
  validateMatematica2ExamIntegrity,
  PAESMatematica2Question,
  PAESMatematica2ExamComplete
} from '@/services/paes/paes-matematica2-service';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para integrar el examen PAES Matemática 2 con el sistema
 */
export function usePAESMatematica2Integration() {
  const [isLoading, setIsLoading] = useState(false);
  const [examData, setExamData] = useState<PAESMatematica2ExamComplete | null>(null);
  const [examStats, setExamStats] = useState<any>(null);

  /**
   * Cargar el examen completo de Matemática 2
   */
  const loadExam = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading PAES Matemática 2 exam...');
      const data = await fetchPAESMatematica2Exam();
      
      if (data) {
        setExamData(data);
        console.log(`✅ Loaded Matemática 2 exam with ${data.preguntas.length} questions`);
        
        toast({
          title: "Examen cargado",
          description: `PAES Matemática 2 cargado: ${data.preguntas.length} preguntas`,
        });
      } else {
        throw new Error('No se pudo cargar el examen');
      }
    } catch (error) {
      console.error('Error loading Matemática 2 exam:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el examen PAES Matemática 2",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cargar estadísticas del examen
   */
  const loadExamStats = useCallback(async () => {
    try {
      const stats = await getMatematica2ExamStats();
      setExamStats(stats);
      return stats;
    } catch (error) {
      console.error('Error loading exam stats:', error);
      return null;
    }
  }, []);

  /**
   * Obtener preguntas aleatorias
   */
  const getRandomQuestions = useCallback(async (count: number = 5): Promise<PAESMatematica2Question[]> => {
    try {
      return await getRandomMatematica2Questions(count);
    } catch (error) {
      console.error('Error getting random questions:', error);
      toast({
        title: "Error",
        description: "No se pudieron obtener preguntas aleatorias",
        variant: "destructive"
      });
      return [];
    }
  }, []);

  /**
   * Obtener preguntas por eje temático
   */
  const getQuestionsByEje = useCallback(async (eje: 'algebra' | 'geometria' | 'probabilidad' | 'calculo'): Promise<PAESMatematica2Question[]> => {
    try {
      return await getMatematica2QuestionsByEje(eje);
    } catch (error) {
      console.error(`Error getting questions for eje ${eje}:`, error);
      toast({
        title: "Error",
        description: `No se pudieron obtener preguntas de ${eje}`,
        variant: "destructive"
      });
      return [];
    }
  }, []);

  /**
   * Validar integridad del examen
   */
  const validateExam = useCallback(async () => {
    setIsLoading(true);
    try {
      const validation = await validateMatematica2ExamIntegrity();
      
      if (validation.isValid) {
        toast({
          title: "Validación exitosa",
          description: "El examen PAES Matemática 2 está íntegro",
        });
      } else {
        toast({
          title: "Problemas encontrados",
          description: `Se encontraron ${validation.issues.length} problemas en el examen`,
          variant: "destructive"
        });
        console.warn('Validation issues:', validation.issues);
      }
      
      return validation;
    } catch (error) {
      console.error('Error validating exam:', error);
      toast({
        title: "Error",
        description: "Error al validar el examen",
        variant: "destructive"
      });
      return { isValid: false, issues: ['Error de validación'], stats: null };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generar simulación de examen
   */
  const generateSimulation = useCallback(async (questionCount: number = 10) => {
    try {
      setIsLoading(true);
      console.log(`🎯 Generating Matemática 2 simulation with ${questionCount} questions`);
      
      const questions = await getRandomMatematica2Questions(questionCount);
      
      if (questions.length === 0) {
        throw new Error('No se pudieron obtener preguntas para la simulación');
      }
      
      const simulation = {
        id: `sim-m2-${Date.now()}`,
        title: `Simulación PAES Matemática 2 - ${questionCount} preguntas`,
        questions,
        timeLimit: Math.ceil(questionCount * 2.5), // 2.5 minutos por pregunta aproximadamente
        examCode: 'PAES_MATEMATICA2_2024_FORMA_193'
      };
      
      toast({
        title: "Simulación generada",
        description: `Simulación con ${questions.length} preguntas de Matemática 2`,
      });
      
      return simulation;
    } catch (error) {
      console.error('Error generating simulation:', error);
      toast({
        title: "Error",
        description: "No se pudo generar la simulación",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    examData,
    examStats,
    
    // Actions
    loadExam,
    loadExamStats,
    getRandomQuestions,
    getQuestionsByEje,
    validateExam,
    generateSimulation,
    
    // Computed
    isExamLoaded: !!examData,
    questionCount: examData?.preguntas.length || 0,
    validQuestions: examData?.examen.preguntas_validas || 0
  };
}
