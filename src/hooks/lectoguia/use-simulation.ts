
import { useState, useEffect, useCallback } from 'react';
import { Exercise } from '@/types/ai-types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { generateExercisesBatch } from '@/services/openrouter/exercise-generation';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { v4 as uuidv4 } from 'uuid';
import { SimulationOption } from '@/components/lectoguia/simulation/SimulationSelector';
import { SimulationResult, SkillResult } from '@/components/lectoguia/simulation/SimulationResults';

/**
 * Hook para manejar toda la lógica de simulaciones PAES
 */
export function useSimulation() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationOption | null>(null);
  const [questions, setQuestions] = useState<(Exercise & { index: number })[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  const [simulationStartTime, setSimulationStartTime] = useState<Date | null>(null);
  const [simulationId, setSimulationId] = useState<string>('');

  // Seleccionar una simulación
  const handleSelectSimulation = useCallback((simulation: SimulationOption) => {
    setSelectedSimulation(simulation);
    // Reiniciar estado
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(simulation.timeMinutes * 60); // Convertir minutos a segundos
    setIsRunning(false);
    setSimulationResults(null);
  }, []);

  // Iniciar la simulación
  const handleStartSimulation = useCallback(async () => {
    if (!selectedSimulation) return;

    try {
      setIsLoading(true);
      
      // Generar un ID para la simulación
      const newSimulationId = uuidv4();
      setSimulationId(newSimulationId);
      
      // Inicializar estado de simulación
      setTimeRemaining(selectedSimulation.timeMinutes * 60);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setSimulationStartTime(new Date());
      
      // Obtener preguntas para la simulación
      const generatedQuestions = await fetchSimulationQuestions(
        selectedSimulation.prueba, 
        selectedSimulation.questionCount,
        selectedSimulation.difficulty as 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
      );
      
      if (generatedQuestions.length > 0) {
        // Añadir índice a cada pregunta
        const indexedQuestions = generatedQuestions.map((q, index) => ({
          ...q,
          index
        }));
        
        setQuestions(indexedQuestions);
        
        // Inicializar respuestas
        const initialAnswers: Record<number, number | null> = {};
        indexedQuestions.forEach((_, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
        
        // Iniciar temporizador
        setIsRunning(true);
        
        toast({
          title: "Simulación iniciada",
          description: `${selectedSimulation.timeMinutes} minutos para completar ${selectedSimulation.questionCount} preguntas.`
        });
      } else {
        toast({
          title: "Error al iniciar simulación",
          description: "No se pudieron generar las preguntas para la simulación.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error al iniciar simulación:", error);
      toast({
        title: "Error al iniciar simulación",
        description: "Ocurrió un error al preparar la simulación. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSimulation, user?.id]);

  // Temporizador de la simulación
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Tiempo agotado
          clearInterval(timer);
          handleFinishSimulation();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isRunning]);

  // Seleccionar respuesta
  const handleAnswerSelect = useCallback((questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  }, []);

  // Navegar entre preguntas
  const handleNavigation = useCallback((direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      setCurrentQuestionIndex(direction);
      return;
    }
    
    if (direction === 'prev' && currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  // Finalizar simulación
  const handleFinishSimulation = useCallback(async () => {
    if (!selectedSimulation || !questions.length) return;
    
    setIsRunning(false);
    setIsLoading(true);
    
    try {
      // Calcular resultados
      const endTime = new Date();
      const startTime = simulationStartTime || new Date();
      const timeSpentMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (60 * 1000));
      
      // Calcular respuestas correctas e incorrectas
      let correctCount = 0;
      let wrongCount = 0;
      let unansweredCount = 0;
      
      // Mapa de habilidades
      const skillResultsMap: Record<string, {
        correctCount: number;
        totalCount: number;
        skill: TPAESHabilidad;
      }> = {};
      
      // Procesar cada pregunta
      questions.forEach((question, index) => {
        const userAnswer = answers[index];
        
        // Registrar por habilidad
        const skill = question.skill as TPAESHabilidad || 'INTERPRET_RELATE';
        
        if (!skillResultsMap[skill]) {
          skillResultsMap[skill] = {
            correctCount: 0,
            totalCount: 0,
            skill
          };
        }
        
        skillResultsMap[skill].totalCount++;
        
        if (userAnswer === null) {
          unansweredCount++;
        } else {
          const correctAnswer = question.options.findIndex(option => 
            option === question.correctAnswer
          );
          
          if (userAnswer === correctAnswer) {
            correctCount++;
            skillResultsMap[skill].correctCount++;
          } else {
            wrongCount++;
          }
        }
      });
      
      // Convertir mapa a array de resultados por habilidad
      const skillResults: SkillResult[] = Object.values(skillResultsMap).map(result => ({
        skill: result.skill,
        correctCount: result.correctCount,
        totalCount: result.totalCount,
        percentageCorrect: (result.correctCount / result.totalCount) * 100
      }));
      
      const percentageCorrect = (correctCount / questions.length) * 100;
      
      // Calcular puntaje estimado (fórmula simplificada)
      const estimatedScore = Math.round(600 + (percentageCorrect * 2.5));
      
      // Crear objeto de resultados
      const results: SimulationResult = {
        id: simulationId,
        timestamp: new Date(),
        prueba: selectedSimulation.prueba,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        wrongAnswers: wrongCount,
        unansweredCount,
        percentageCorrect,
        timeSpentMinutes,
        skillResults,
        estimatedScore
      };
      
      setSimulationResults(results);
      
      toast({
        title: "Simulación completada",
        description: `Has completado la simulación con un ${Math.round(percentageCorrect)}% de respuestas correctas.`
      });
      
    } catch (error) {
      console.error("Error al finalizar simulación:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar los resultados de la simulación.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [selectedSimulation, questions, answers, simulationStartTime, simulationId, user?.id]);

  // Función actual que obtiene las preguntas
  const currentQuestion = questions[currentQuestionIndex] || null;

  return {
    selectedSimulation,
    currentQuestion,
    answers,
    timeRemaining,
    simulationResults,
    isLoading,
    handleSelectSimulation,
    handleStartSimulation,
    handleAnswerSelect,
    handleFinishSimulation,
    handleNavigation
  };
}

// Función para obtener preguntas para la simulación
async function fetchSimulationQuestions(
  prueba: TPAESPrueba,
  count: number,
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED'
): Promise<Exercise[]> {
  try {
    // Mapa de habilidades por prueba para tener una distribución adecuada
    const skillsByPrueba: Record<TPAESPrueba, TPAESHabilidad[]> = {
      'COMPETENCIA_LECTORA': ['TRACK_LOCATE', 'INTERPRET_RELATE', 'EVALUATE_REFLECT'],
      'MATEMATICA_1': ['SOLVE_PROBLEMS', 'REPRESENT'],
      'MATEMATICA_2': ['MODEL', 'ARGUE_COMMUNICATE'],
      'CIENCIAS': ['IDENTIFY_THEORIES', 'PROCESS_ANALYZE', 'APPLY_PRINCIPLES', 'SCIENTIFIC_ARGUMENT'],
      'HISTORIA': ['TEMPORAL_THINKING', 'SOURCE_ANALYSIS', 'MULTICAUSAL_ANALYSIS', 'CRITICAL_THINKING']
    };
    
    const skills = skillsByPrueba[prueba] || ['INTERPRET_RELATE'];
    
    // Generar ejercicios equilibrados por habilidad
    const questions: Exercise[] = [];
    const batchSize = Math.ceil(count / skills.length);
    
    // Generar preguntas por cada habilidad
    for (const skill of skills) {
      const nodeId = `simulation-${prueba}-${skill}`;
      const testId = pruebaToTestId(prueba);
      
      const skillQuestions = await generateExercisesBatch(
        nodeId, 
        skill, 
        testId,
        Math.min(batchSize, count - questions.length),
        difficulty
      );
      
      questions.push(...skillQuestions);
      
      if (questions.length >= count) break;
    }
    
    // Mezclar preguntas para que no estén agrupadas por habilidad
    return shuffleArray(questions).slice(0, count);
  } catch (error) {
    console.error("Error generando preguntas de simulación:", error);
    return [];
  }
}

// Función para mezclar array (algoritmo Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Función para convertir prueba a ID
function pruebaToTestId(prueba: TPAESPrueba): number {
  const mapping: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };
  return mapping[prueba] || 1;
}
