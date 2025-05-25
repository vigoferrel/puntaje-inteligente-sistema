
import { useState } from "react";
import { DiagnosticTest, DiagnosticResult } from "@/types/diagnostic";
import { useSubmitResult } from "./results/use-submit-result";
import { useRestartDiagnostic } from "./results/use-restart-diagnostic";

interface ResultsProps {
  currentTest: DiagnosticTest | null;
  answers: Record<string, string>;
  timeStarted: Date | null;
  setTestStarted: (started: boolean) => void;
}

export const useDiagnosticResults = ({
  currentTest,
  answers,
  timeStarted,
  setTestStarted
}: ResultsProps) => {
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const [testResults, setTestResults] = useState<DiagnosticResult | null>(null);
  
  // Use the extracted submission hook
  const { submit, submitting } = useSubmitResult();
  
  // Use the extracted restart hook
  const { handleRestartDiagnostic } = useRestartDiagnostic({
    setResultSubmitted,
    setTestResults: setTestResults as (value: null) => void,
    setTestStarted
  });
  
  const handleFinishTest = async () => {
    if (!currentTest) return null;
    
    try {
      const result = await submit(
        'demo-user',
        currentTest.id,
        answers,
        currentTest.questions
      );
      
      if (result) {
        setTestResults(result);
        setResultSubmitted(true);
      }
      
      return result;
    } catch (error) {
      console.error('Error finishing test:', error);
      return null;
    }
  };
  
  return {
    resultSubmitted,
    testResults,
    handleFinishTest,
    handleRestartDiagnostic
  };
};
