
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

export const useSimulation = () => {
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
      // Fetch real questions from database based on simulation type
      const { data: exercises, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('test_id', getTestIdFromPrueba(selectedSimulation.prueba))
        .limit(selectedSimulation.questionCount);

      if (error) throw error;

      const simulationQuestions = (exercises || []).map((exercise, index) => ({
        id: exercise.id,
        question: exercise.question,
        options: exercise.options ? Object.values(exercise.options) : [],
        correctAnswer: exercise.correct_answer,
        explanation: exercise.explanation || '',
        skill: 'INTERPRET_RELATE' as any,
        difficulty: exercise.difficulty || 'intermediate',
        index
      }));

      setQuestions(simulationQuestions);
      setCurrentQuestion(simulationQuestions[0] || null);
      setCurrentQuestionIndex(0);
      setTimeRemaining(selectedSimulation.timeMinutes * 60);
      setAnswers({});

      // Start timer
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
      console.error('Error starting simulation:', error);
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
    
    // PAES score estimation (150-850 scale)
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

    // Save simulation result to database
    try {
      await supabase.from('user_exercise_attempts').insert({
        user_id: user.id,
        exercise_id: `simulation-${selectedSimulation.id}`,
        selected_option: 0,
        is_correct: percentageCorrect >= 60,
        skill_type: 'SIMULATION',
        prueba: selectedSimulation.prueba,
        metadata: {
          simulation_type: selectedSimulation.id,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          estimated_score: estimatedScore
        }
      });
    } catch (error) {
      console.error('Error saving simulation result:', error);
    }
  }, [selectedSimulation, user?.id, questions, answers, timeRemaining]);

  const handleNavigation = useCallback((direction: 'prev' | 'next' | number) => {
    if (typeof direction === 'number') {
      setCurrentQuestionIndex(direction);
      setCurrentQuestion(questions[direction] || null);
    } else if (direction === 'prev' && currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      setCurrentQuestion(questions[newIndex]);
    } else if (direction === 'next' && currentQuestionIndex < questions.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      setCurrentQuestion(questions[newIndex]);
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

// Helper function to map prueba to test_id
function getTestIdFromPrueba(prueba: TPAESPrueba): number {
  const mapping: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };
  return mapping[prueba] || 1;
}
