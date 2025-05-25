
import { useCallback } from 'react';

interface RestartDiagnosticProps {
  setResultSubmitted: (submitted: boolean) => void;
  setTestResults: (results: null) => void;
  setTestStarted: (started: boolean) => void;
}

export const useRestartDiagnostic = ({
  setResultSubmitted,
  setTestResults,
  setTestStarted
}: RestartDiagnosticProps) => {
  
  const handleRestartDiagnostic = useCallback(() => {
    console.log('🔄 Reiniciando diagnóstico');
    
    // Reset all states
    setResultSubmitted(false);
    setTestResults(null);
    setTestStarted(false);
    
    // Optional: redirect to test selection or reload tests
    window.location.reload();
  }, [setResultSubmitted, setTestResults, setTestStarted]);

  return {
    handleRestartDiagnostic
  };
};
