
import React, { createContext, useContext, ReactNode } from "react";
import { LearningPlanContextType } from "./types";
import { useLearningPlanProvider } from "./hooks/useLearningPlanProvider";

// Create context with undefined default (will be provided by provider)
const LearningPlanContext = createContext<LearningPlanContextType | undefined>(undefined);

// Provider component
export const LearningPlanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use our custom hook to get all the state and logic
  const learningPlanState = useLearningPlanProvider();

  // Return the provider with the state from our hook
  return (
    <LearningPlanContext.Provider value={learningPlanState}>
      {children}
    </LearningPlanContext.Provider>
  );
};

// Custom hook to use the learning plan context
export const useLearningPlanContext = () => {
  const context = useContext(LearningPlanContext);
  if (!context) {
    throw new Error('useLearningPlanContext must be used within a LearningPlanProvider');
  }
  return context;
};
