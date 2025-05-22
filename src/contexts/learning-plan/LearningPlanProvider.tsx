
import React, { createContext, useContext, ReactNode } from "react";
import { LearningPlanContextType } from "./types";
import { useLearningPlanProvider } from "./hooks/useLearningPlanProvider";

// Create context with default values
const LearningPlanContext = createContext<LearningPlanContextType>({
  plans: [],
  currentPlan: null,
  loading: false,
  initializing: true,
  error: null,
  progressData: {},
  progressLoading: false,
  recommendedNodeId: null,
  refreshPlans: async () => {},
  selectPlan: () => {},
  createPlan: async () => null,
  updatePlanProgress: async () => {},
  getPlanProgress: () => null
});

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
export const useLearningPlanContext = () => useContext(LearningPlanContext);
