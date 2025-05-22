
import { useCallback } from "react";

interface RestartDiagnosticProps {
  setResultSubmitted: (value: boolean) => void;
  setTestResults: (value: null) => void;
  setTestStarted: (value: boolean) => void;
}

export const useRestartDiagnostic = ({
  setResultSubmitted,
  setTestResults,
  setTestStarted
}: RestartDiagnosticProps) => {
  const handleRestartDiagnostic = useCallback(() => {
    setResultSubmitted(false);
    setTestResults(null);
    setTestStarted(false);
  }, [setResultSubmitted, setTestResults, setTestStarted]);
  
  return {
    handleRestartDiagnostic
  };
};
