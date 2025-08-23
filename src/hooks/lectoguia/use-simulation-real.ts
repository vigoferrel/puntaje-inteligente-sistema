
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Exercise } from '@/types/ai-types';
import { TPAESPrueba } from '@/types/system-types';

export interface SimulationOption {
  id: string;
  title: string;
  description: string;
  prueba: TPAESPrueba;
  questionCount: number;
  timeMinutes: number;
  difficulty: string;
}

export interface SimulationResult {
  id: string;
  timestamp: Date;
  prueba: TPAESPrueba;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unansweredCount: number;
  percentageCorrect: number;
  timeSpentMinutes: number;
  skillResults: any[];
  estimatedScore: number;
}

export const useSimulationReal = () => {
  const { user } = useAuth();
  const [selectedSimulation, setSelectedSimulation] = useState<SimulationOption | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<(Exercise & { index: number }) | null>(null);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Exercise[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleSelectSimulation = useCallback((simulation: SimulationOption) => {
    setSelectedSimulation(simulation);
  }, []);

  const handleStartSimulation = useCallback(async () => {
    if (!selectedSimulation || !user?.id) return;

    setIsLoading(true);
    try {
      console.log('🎮 Iniciando simulación real desde base de datos');
      
      // Obtener preguntas reales desde banco_preguntas
      const { data: preguntasData, error: preguntasError } = await supabase
        .from('banco_preguntas')
        .select(`
          id,
          codigo_pregunta,
          enunciado,
          competencia_especifica,
          nivel_dificultad,
          tiempo_estimado_segundos
        `)
        .eq('prueba_paes', selectedSimulation.prueba)
        .eq('validada', true)
        .limit(selectedSimulation.questionCount);

      if (preguntasError) throw preguntasError;

      // Obtener alternativas para cada pregunta
      const questionsWithOptions = await Promise.all(
        (preguntasData || []).map(async (pregunta, index) => {
          const { data: alternativasData, error: alternativasError } = await supabase
            .from('alternativas_respuesta')
            .select('letra, contenido, es_correcta')
            .eq('pregunta_id', pregunta.id)
            .order('orden');

          if (alternativasError) {
            console.warn('⚠️ Error obteniendo alternativas para pregunta:', pregunta.id);
            return null;
          }

          const correctAnswer = alternativasData?.find(alt => alt.es_correcta)?.contenido || '';
          const options = alternativasData?.map(alt => alt.contenido) || [];

          return {
            id: pregunta.id,
            question: pregunta.enunciado,
            options,
            correctAnswer,
            explanation: `Pregunta oficial de ${pregunta.competencia_especifica}`,
            skill: 'INTERPRET_RELATE' as any,
            difficulty: pregunta.nivel_dificultad || 'intermediate',
            index
          };
        })
      );

      const validQuestions = questionsWithOptions.filter(Boolean) as Exercise[];
      
      setQuestions(validQuestions);
      if (validQuestions[0]) {
        setCurrentQuestion({ ...validQuestions[0], index: 0 });
      }
      setCurrentQuestionIndex(0);
      setTimeRemaining(selectedSimulation.timeMinutes * 60);
      setAnswers({});

      console.log(`✅ Simulación real iniciada con ${validQuestions.length} preguntas`);

      // Iniciar timer
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinishSimulation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('❌ Error starting real simulation:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSimulation, user?.id]);

  const handleAnswerSelect = useCallback((questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  }, []);

  const handleFinishSimulation = useCallback(async () => {
    if (!selectedSimulation || !user?.id) return;

    const correctAnswers = questions.reduce((count, question, index) => {
      const userAnswer = answers[index];
      if (userAnswer !== null && userAnswer !== undefined) {
        const selectedOption = question.options[userAnswer];
        if (selectedOption === question.correctAnswer) {
          return count + 1;
        }
      }
      return count;
    }, 0);

    const totalAnswered = Object.values(answers).filter(a => a !== null).length;
    const wrongAnswers = totalAnswered - correctAnswers;
    const unansweredCount = questions.length - totalAnswered;
    const percentageCorrect = questions.length > 0 ? (correctAnswers / questions.length) * 100 : 0;
    
    const estimatedScore = Math.round(150 + (percentageCorrect / 100) * 700);

    const results: SimulationResult = {
      id: `sim-${Date.now()}`,
      timestamp: new Date(),
      prueba: selectedSimulation.prueba,
      totalQuestions: questions.length,
      correctAnswers,
      wrongAnswers,
      unansweredCount,
      percentageCorrect,
      timeSpentMinutes: selectedSimulation.timeMinutes - Math.floor(timeRemaining / 60),
      skillResults: [],
      estimatedScore
    };

    setSimulationResults(results);

    // Guardar resultado real en la base de datos
    try {
      await supabase.from('user_exercise_attempts').insert({
        user_id: user.id,
        exercise_id: `simulation-${selectedSimulation.id}`,
        answer: `${correctAnswers}/${questions.length}`,
        is_correct: percentageCorrect >= 60,
        skill_type: 'SIMULATION',
        prueba: selectedSimulation.prueba,
        metadata: JSON.stringify({
          simulation_type: selectedSimulation.id,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          estimated_score: estimatedScore,
          time_spent_minutes: results.timeSpentMinutes
        })
      });
      console.log('✅ Resultado de simulación guardado en base de datos');
    } catch (error) {
      console.error('❌ Error saving simulation result:', error);
    }
  }, [selectedSimulation, user?.id, questions, answers, timeRemaining]);

  const handleNavigation = useCallback((direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      setCurrentQuestionIndex(direction);
      if (questions[direction]) {
        setCurrentQuestion({ ...questions[direction], index: direction });
      }
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setCurrentQuestion({ ...questions[newIndex], index: newIndex });
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setCurrentQuestion({ ...questions[newIndex], index: newIndex });
    }
  }, [currentQuestionIndex, questions]);

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
    handleNavigation,
  };
};
