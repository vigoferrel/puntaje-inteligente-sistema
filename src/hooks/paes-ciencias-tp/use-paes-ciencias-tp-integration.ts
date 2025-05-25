
import { useState, useCallback } from 'react';
import { 
  fetchPAESCienciasTPExam, 
  getRandomCienciasTPQuestions, 
  getCienciasTPQuestionsByArea,
  getCienciasTPQuestionsByModulo,
  getCienciasTPExamStats,
  validateCienciasTPExamIntegrity,
  PAESCienciasTPQuestion,
  PAESCienciasTPExamComplete
} from '@/services/paes/paes-ciencias-tp-service';
import { toast } from '@/hooks/use-toast';

/**
 * Hook para integrar el examen PAES Ciencias TP 2024 con el sistema
 */
export function usePAESCienciasTPIntegration() {
  const [isLoading, setIsLoading] = useState(false);
  const [examData, setExamData] = useState<PAESCienciasTPExamComplete | null>(null);
  const [examStats, setExamStats] = useState<any>(null);

  /**
   * Cargar el examen completo de Ciencias TP
   */
  const loadExam = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Loading PAES Ciencias TP exam...');
      const data = await fetchPAESCienciasTPExam();
      
      if (data) {
        setExamData(data);
        console.log(`✅ Loaded Ciencias TP exam with ${data.preguntas.length} questions`);
        
        toast({
          title: "Examen cargado",
          description: `PAES Ciencias TP cargado: ${data.preguntas.length} preguntas`,
        });
      } else {
        throw new Error('No se pudo cargar el examen');
      }
    } catch (error) {
      console.error('Error loading Ciencias TP exam:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el examen PAES Ciencias TP",
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
      const stats = await getCienciasTPExamStats();
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
  const getRandomQuestions = useCallback(async (count: number = 10): Promise<PAESCienciasTPQuestion[]> => {
    try {
      return await getRandomCienciasTPQuestions(count);
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
   * Obtener preguntas por área científica
   */
  const getQuestionsByArea = useCallback(async (
    area: 'BIOLOGIA' | 'FISICA' | 'QUIMICA'
  ): Promise<PAESCienciasTPQuestion[]> => {
    try {
      return await getCienciasTPQuestionsByArea(area);
    } catch (error) {
      console.error(`Error getting questions for area ${area}:`, error);
      toast({
        title: "Error",
        description: `No se pudieron obtener preguntas de ${area}`,
        variant: "destructive"
      });
      return [];
    }
  }, []);

  /**
   * Obtener preguntas por módulo
   */
  const getQuestionsByModulo = useCallback(async (
    modulo: 'COMUN' | 'TECNICO_PROFESIONAL'
  ): Promise<PAESCienciasTPQuestion[]> => {
    try {
      return await getCienciasTPQuestionsByModulo(modulo);
    } catch (error) {
      console.error(`Error getting questions for modulo ${modulo}:`, error);
      toast({
        title: "Error",
        description: `No se pudieron obtener preguntas del ${modulo}`,
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
      const validation = await validateCienciasTPExamIntegrity();
      
      if (validation.isValid) {
        toast({
          title: "Validación exitosa",
          description: "El examen PAES Ciencias TP está íntegro",
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
   * Generar simulación de examen por área específica
   */
  const generateAreaSimulation = useCallback(async (
    area: 'BIOLOGIA' | 'FISICA' | 'QUIMICA',
    questionCount: number = 10
  ) => {
    try {
      setIsLoading(true);
      console.log(`🎯 Generating ${area} simulation with ${questionCount} questions`);
      
      const questions = await getCienciasTPQuestionsByArea(area);
      const validQuestions = questions.filter(q => !q.es_piloto);
      const selectedQuestions = validQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCount);
      
      if (selectedQuestions.length === 0) {
        throw new Error(`No se pudieron obtener preguntas de ${area} para la simulación`);
      }
      
      const simulation = {
        id: `sim-ciencias-tp-${area.toLowerCase()}-${Date.now()}`,
        title: `Simulación PAES Ciencias TP - ${area} (${selectedQuestions.length} preguntas)`,
        area,
        questions: selectedQuestions,
        timeLimit: Math.ceil(selectedQuestions.length * 2.0), // 2 minutos por pregunta
        examCode: 'PAES_CIENCIAS_TP_2024_FORMA_183'
      };
      
      toast({
        title: "Simulación generada",
        description: `Simulación de ${area} con ${selectedQuestions.length} preguntas`,
      });
      
      return simulation;
    } catch (error) {
      console.error('Error generating area simulation:', error);
      toast({
        title: "Error",
        description: `No se pudo generar la simulación de ${area}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generar simulación completa del examen
   */
  const generateFullSimulation = useCallback(async (questionCount: number = 40) => {
    try {
      setIsLoading(true);
      console.log(`🎯 Generating full Ciencias TP simulation with ${questionCount} questions`);
      
      // Distribuir preguntas proporcionalmente: 35% Bio, 32.5% Fis, 32.5% Qui
      const biologiaCount = Math.ceil(questionCount * 0.35);
      const fisicaCount = Math.ceil(questionCount * 0.325);
      const quimicaCount = questionCount - biologiaCount - fisicaCount;
      
      const [biologiaQuestions, fisicaQuestions, quimicaQuestions] = await Promise.all([
        getCienciasTPQuestionsByArea('BIOLOGIA'),
        getCienciasTPQuestionsByArea('FISICA'),
        getCienciasTPQuestionsByArea('QUIMICA')
      ]);
      
      const selectedQuestions = [
        ...biologiaQuestions.filter(q => !q.es_piloto).sort(() => Math.random() - 0.5).slice(0, biologiaCount),
        ...fisicaQuestions.filter(q => !q.es_piloto).sort(() => Math.random() - 0.5).slice(0, fisicaCount),
        ...quimicaQuestions.filter(q => !q.es_piloto).sort(() => Math.random() - 0.5).slice(0, quimicaCount)
      ].sort((a, b) => a.numero - b.numero);
      
      if (selectedQuestions.length === 0) {
        throw new Error('No se pudieron obtener preguntas para la simulación');
      }
      
      const simulation = {
        id: `sim-ciencias-tp-full-${Date.now()}`,
        title: `Simulación Completa PAES Ciencias TP - ${selectedQuestions.length} preguntas`,
        questions: selectedQuestions,
        timeLimit: Math.ceil(selectedQuestions.length * 2.0), // 2 minutos por pregunta
        examCode: 'PAES_CIENCIAS_TP_2024_FORMA_183',
        distribution: {
          biologia: selectedQuestions.filter(q => q.area_cientifica === 'BIOLOGIA').length,
          fisica: selectedQuestions.filter(q => q.area_cientifica === 'FISICA').length,
          quimica: selectedQuestions.filter(q => q.area_cientifica === 'QUIMICA').length
        }
      };
      
      toast({
        title: "Simulación generada",
        description: `Simulación completa con ${selectedQuestions.length} preguntas de Ciencias TP`,
      });
      
      return simulation;
    } catch (error) {
      console.error('Error generating full simulation:', error);
      toast({
        title: "Error",
        description: "No se pudo generar la simulación completa",
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
    getQuestionsByArea,
    getQuestionsByModulo,
    validateExam,
    generateAreaSimulation,
    generateFullSimulation,
    
    // Computed
    isExamLoaded: !!examData,
    questionCount: examData?.preguntas.length || 0,
    validQuestions: examData?.examen.preguntas_validas || 0,
    
    // Areas stats
    biologiaCount: examData?.preguntas.filter(p => p.area_cientifica === 'BIOLOGIA').length || 0,
    fisicaCount: examData?.preguntas.filter(p => p.area_cientifica === 'FISICA').length || 0,
    quimicaCount: examData?.preguntas.filter(p => p.area_cientifica === 'QUIMICA').length || 0,
    pilotQuestions: examData?.preguntas.filter(p => p.es_piloto).length || 0
  };
}
