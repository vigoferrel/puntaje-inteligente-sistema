
import { DiagnosticTest } from "@/types/diagnostic";
import { unifiedStorageSystem } from "@/core/storage/UnifiedStorageSystem";

// Type definitions for stored test data
export interface StoredTestProgress {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: string;
  lastPausedAt: string;
}

// Storage key constant
const TEST_PROGRESS_KEY = 'diagnostic_test_progress_unified';

/**
 * Saves the current test progress using UnifiedStorageSystem
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
  
  unifiedStorageSystem.setItem(TEST_PROGRESS_KEY, progressData, { silentErrors: true });
};

/**
 * Retrieves saved test progress using UnifiedStorageSystem
 */
export const getTestProgress = (): StoredTestProgress | null => {
  return unifiedStorageSystem.getItem(TEST_PROGRESS_KEY) || null;
};

/**
 * Clears saved test progress using UnifiedStorageSystem
 */
export const clearTestProgress = (): void => {
  unifiedStorageSystem.removeItem(TEST_PROGRESS_KEY);
};

/**
 * Checks if there's a saved test progress for a given test
 */
export const hasSavedProgress = (testId: string): boolean => {
  const progress = getTestProgress();
  return progress !== null && progress.testId === testId;
};
