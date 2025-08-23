
import { useState } from "react";

interface DiagnosticStateProps {
  onTestStarted?: (started: boolean) => void;
  onTestIdSelected?: (id: string | null) => void;
}

export const useDiagnosticState = (props?: DiagnosticStateProps) => {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  
  const handleSelectTest = (id: string | null) => {
    setSelectedTestId(id);
    if (props?.onTestIdSelected) {
      props.onTestIdSelected(id);
    }
  };
  
  const handleStartTest = (started: boolean) => {
    setTestStarted(started);
    if (props?.onTestStarted) {
      props.onTestStarted(started);
    }
  };
  
  return {
    selectedTestId,
    testStarted,
    setSelectedTestId: handleSelectTest,
    setTestStarted: handleStartTest
  };
};
