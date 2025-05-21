
import { DiagnosticTest } from "@/types/diagnostic";

// Type definitions for stored test data
export interface StoredTestProgress {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: string;
  lastPausedAt: string;
}

// Storage key constant
const TEST_PROGRESS_KEY = 'paused_diagnostic_test';

/**
 * Saves the current test progress to localStorage
 */
export const saveTestProgress = (
  test: DiagnosticTest,
  currentQuestionIndex: number,
  answers: Record<string, string>,
  timeStarted: Date
): void => {
  const progressData: StoredTestProgress = {
    testId: test.id,
    currentQuestionIndex,
    answers,
    timeStarted: timeStarted.toISOString(),
    lastPausedAt: new Date().toISOString()
  };
  
  localStorage.setItem(TEST_PROGRESS_KEY, JSON.stringify(progressData));
};

/**
 * Retrieves saved test progress from localStorage
 */
export const getTestProgress = (): StoredTestProgress | null => {
  const savedData = localStorage.getItem(TEST_PROGRESS_KEY);
  if (!savedData) return null;
  
  try {
    return JSON.parse(savedData) as StoredTestProgress;
  } catch (error) {
    console.error('Error parsing saved test progress:', error);
    return null;
  }
};

/**
 * Clears saved test progress from localStorage
 */
export const clearTestProgress = (): void => {
  localStorage.removeItem(TEST_PROGRESS_KEY);
};

/**
 * Checks if there's a saved test progress for a given test
 */
export const hasSavedProgress = (testId: string): boolean => {
  const progress = getTestProgress();
  return progress !== null && progress.testId === testId;
};
