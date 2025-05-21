
import { useState, useEffect } from "react";
import { useDiagnostic } from "@/hooks/use-diagnostic";
import { StoredTestProgress, getTestProgress } from "@/utils/test-storage";

interface TestExecutionProps {
  selectedTestId: string | null;
  testStarted: boolean;
  setTestStarted: (started: boolean) => void;
}

export const useDiagnosticTestExecution = ({
  selectedTestId,
  testStarted,
  setTestStarted
}: TestExecutionProps) => {
  const { currentTest, startDiagnosticTest } = useDiagnostic();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState(false);
  
  // Initialize test state when a test starts
  useEffect(() => {
    const initializeTest = async () => {
      if (testStarted && selectedTestId) {
        const pausedProgress = getTestProgress();
        
        if (pausedProgress && pausedProgress.testId === selectedTestId) {
          // Resume from saved progress
          setCurrentQuestionIndex(pausedProgress.currentQuestionIndex);
          setAnswers(pausedProgress.answers);
          setTimeStarted(new Date(pausedProgress.timeStarted));
        } else {
          // Start fresh
          setCurrentQuestionIndex(0);
          setAnswers({});
          setTimeStarted(new Date());
        }
        
        setShowHint(false);
      }
    };
    
    initializeTest();
  }, [testStarted, selectedTestId]);
  
  // Handle answer selection
  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Handle hint requests
  const handleRequestHint = () => {
    setShowHint(true);
  };
  
  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowHint(false);
    }
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowHint(false);
    }
  };
  
  return {
    currentTest,
    currentQuestionIndex,
    answers,
    timeStarted,
    showHint,
    handleAnswerSelect,
    handleRequestHint,
    handlePreviousQuestion,
    handleNextQuestion,
    setCurrentQuestionIndex,
    setAnswers,
    setTimeStarted
  };
};
