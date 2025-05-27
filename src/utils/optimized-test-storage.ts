
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';
import { DiagnosticTest } from "@/types/diagnostic";

export interface StoredTestProgress {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: string;
  lastPausedAt: string;
}

const TEST_PROGRESS_KEY = 'diagnostic_test_progress_v3';

/**
 * Sistema optimizado de storage para tests usando UnifiedStorageSystem v2.0
 */
export const optimizedTestStorage = {
  async saveTestProgress(
    test: DiagnosticTest,
    currentQuestionIndex: number,
    answers: Record<string, string>,
    timeStarted: Date
  ): Promise<void> {
    try {
      // Esperar a que el storage esté listo
      await unifiedStorageSystem.waitForReady();
      
      const progressData: StoredTestProgress = {
        testId: test.id,
        currentQuestionIndex,
        answers,
        timeStarted: timeStarted.toISOString(),
        lastPausedAt: new Date().toISOString()
      };
      
      unifiedStorageSystem.setItem(TEST_PROGRESS_KEY, progressData, { silentErrors: true });
      
    } catch (error) {
      console.warn('Could not save test progress:', error);
    }
  },

  getTestProgress(): StoredTestProgress | null {
    try {
      return unifiedStorageSystem.getItem(TEST_PROGRESS_KEY) || null;
    } catch (error) {
      console.warn('Could not load test progress:', error);
      return null;
    }
  },

  clearTestProgress(): void {
    try {
      unifiedStorageSystem.removeItem(TEST_PROGRESS_KEY);
    } catch (error) {
      console.warn('Could not clear test progress:', error);
    }
  },

  hasSavedProgress(testId: string): boolean {
    try {
      const progress = this.getTestProgress();
      return progress !== null && progress.testId === testId;
    } catch (error) {
      return false;
    }
  }
};

// Exportar funciones individuales para compatibilidad
export const saveTestProgress = (
  test: DiagnosticTest,
  currentQuestionIndex: number,
  answers: Record<string, string>,
  timeStarted: Date
) => optimizedTestStorage.saveTestProgress(test, currentQuestionIndex, answers, timeStarted);

export const getTestProgress = () => optimizedTestStorage.getTestProgress();
export const clearTestProgress = () => optimizedTestStorage.clearTestProgress();
export const hasSavedProgress = (testId: string) => optimizedTestStorage.hasSavedProgress(testId);
