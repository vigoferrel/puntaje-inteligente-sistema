
import { useState, useCallback } from 'react';
import { fetchPAESHistoriaExam, getRandomHistoriaQuestions, getHistoriaQuestionsBySection } from '@/services/paes/paes-historia-service';
import { generateHistoriaExercisesForNode } from '@/services/diagnostic-generator/historia-exercises';
import { PAESHistoriaExamComplete, PAESHistoriaQuestion } from '@/services/paes/paes-historia-service';
import { toast } from '@/components/ui/use-toast';

export const usePAESHistoriaIntegration = () => {
  const [historiaExam, setHistoriaExam] = useState<PAESHistoriaExamComplete | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el examen completo de Historia
  const loadHistoriaExam = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const exam = await fetchPAESHistoriaExam();
      setHistoriaExam(exam);
      
      if (exam) {
        console.log(`✅ Examen PAES Historia cargado: ${exam.preguntas.length} preguntas`);
        toast({
          title: "Examen Cargado",
          description: `PAES Historia 2024 disponible con ${exam.preguntas.length} preguntas`,
        });
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar examen';
      setError(errorMsg);
      console.error('Error loading Historia exam:', err);
      toast({
        title: "Error",
        description: "No se pudo cargar el examen PAES Historia 2024",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener preguntas aleatorias para ejercicios
  const getRandomQuestions = useCallback(async (count: number = 5): Promise<PAESHistoriaQuestion[]> => {
    try {
      return await getRandomHistoriaQuestions(count);
    } catch (err) {
      console.error('Error getting random Historia questions:', err);
      toast({
        title: "Error",
        description: "No se pudieron obtener preguntas aleatorias",
        variant: "destructive"
      });
      return [];
    }
  }, []);

  // Obtener preguntas por sección
  const getQuestionsBySection = useCallback(async (
    section: 'formacion_ciudadana' | 'historia' | 'sistema_economico'
  ): Promise<PAESHistoriaQuestion[]> => {
    try {
      let startQuestion = 1;
      let endQuestion = 65;
      
      switch (section) {
        case 'formacion_ciudadana':
          startQuestion = 1;
          endQuestion = 12;
          break;
        case 'historia':
          startQuestion = 13;
          endQuestion = 57;
          break;
        case 'sistema_economico':
          startQuestion = 58;
          endQuestion = 65;
          break;
      }
      
      return await getHistoriaQuestionsBySection(startQuestion, endQuestion);
    } catch (err) {
      console.error('Error getting Historia questions by section:', err);
      toast({
        title: "Error",
        description: `No se pudieron obtener preguntas de ${section}`,
        variant: "destructive"
      });
      return [];
    }
  }, []);

  // Generar ejercicios para un nodo
  const generateExercisesForNode = useCallback(async (
    nodeId: string,
    skillId: number,
    testId: number,
    count: number = 5,
    section: 'formacion_ciudadana' | 'historia' | 'sistema_economico' = 'historia'
  ): Promise<boolean> => {
    try {
      return await generateHistoriaExercisesForNode(nodeId, skillId, testId, count, section);
    } catch (err) {
      console.error('Error generating Historia exercises:', err);
      return false;
    }
  }, []);

  // Obtener estadísticas del examen
  const getExamStats = useCallback(() => {
    if (!historiaExam) return null;
    
    const formacionCiudadana = historiaExam.preguntas.filter(p => p.numero >= 1 && p.numero <= 12);
    const historia = historiaExam.preguntas.filter(p => p.numero >= 13 && p.numero <= 57);
    const sistemaEconomico = historiaExam.preguntas.filter(p => p.numero >= 58 && p.numero <= 65);
    
    return {
      total: historiaExam.preguntas.length,
      formacionCiudadana: formacionCiudadana.length,
      historia: historia.length,
      sistemaEconomico: sistemaEconomico.length,
      duracionMinutos: historiaExam.examen.duracion_minutos,
      año: historiaExam.examen.año
    };
  }, [historiaExam]);

  return {
    historiaExam,
    loading,
    error,
    loadHistoriaExam,
    getRandomQuestions,
    getQuestionsBySection,
    generateExercisesForNode,
    getExamStats
  };
};
