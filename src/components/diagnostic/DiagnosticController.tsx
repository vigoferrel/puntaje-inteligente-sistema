
import React, { useEffect } from "react";
import { useDiagnosticController, DiagnosticControllerState } from "@/hooks/use-diagnostic-controller";

export interface DiagnosticControllerProps {
  children: (props: DiagnosticControllerState) => React.ReactNode;
}

export { type DiagnosticControllerState };

export const DiagnosticController: React.FC<DiagnosticControllerProps> = ({ children }) => {
  const controllerState = useDiagnosticController();
  
  // Add hidden DOM elements to store state for the use-diagnostic-progress hook
  // This is a workaround for our refactoring approach
  useEffect(() => {
    const updateHiddenElements = () => {
      // Set data attributes for the hidden elements
      const currentQuestionIndex = document.getElementById('current-question-index');
      if (currentQuestionIndex) {
        currentQuestionIndex.setAttribute('data-value', controllerState.currentQuestionIndex.toString());
      }
      
      const currentAnswers = document.getElementById('current-answers');
      if (currentAnswers) {
        currentAnswers.setAttribute('data-value', JSON.stringify(controllerState.answers));
      }
      
      const timeStarted = document.getElementById('time-started');
      if (timeStarted && controllerState.timeStarted) {
        timeStarted.setAttribute('data-value', controllerState.timeStarted.toISOString());
      }
    };
    
    updateHiddenElements();
  }, [controllerState.currentQuestionIndex, controllerState.answers, controllerState.timeStarted]);
  
  return (
    <>
      {/* Hidden elements to store state for use-diagnostic-progress hook */}
      <div style={{ display: 'none' }}>
        <div id="current-question-index" data-value={controllerState.currentQuestionIndex.toString()}></div>
        <div id="current-answers" data-value={JSON.stringify(controllerState.answers)}></div>
        <div id="time-started" data-value={controllerState.timeStarted?.toISOString()}></div>
      </div>
      
      {children(controllerState)}
    </>
  );
};
