
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
  const { handleFinishTest } = useSubmitResult({
    currentTest,
    answers,
    timeStarted
  });
  
  // Use the extracted restart hook
  const { handleRestartDiagnostic } = useRestartDiagnostic({
    setResultSubmitted,
    setTestResults: setTestResults as (value: null) => void,
    setTestStarted
  });
  
  return {
    resultSubmitted,
    testResults,
    handleFinishTest,
    handleRestartDiagnostic
  };
};
