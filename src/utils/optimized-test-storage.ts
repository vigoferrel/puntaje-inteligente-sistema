
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';
import { DiagnosticTest } from "@/types/diagnostic";

export interface StoredTestProgress {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeStarted: string;
  lastPausedAt: string;
}

const TEST_PROGRESS_KEY = 'diagnostic_test_progress_v2';

/**
 * Sistema optimizado de storage para tests usando el sistema unificado
 */
export const optimizedTestStorage = {
  saveTestProgress(
    test: DiagnosticTest,
    currentQuestionIndex: number,
    answers: Record<string, string>,
    timeStarted: Date
  ): void {
    const progressData: StoredTestProgress = {
      testId: test.id,
      currentQuestionIndex,
      answers,
      timeStarted: timeStarted.toISOString(),
      lastPausedAt: new Date().toISOString()
    };
    
    unifiedStorageSystem.setItem(TEST_PROGRESS_KEY as any, progressData, { silentErrors: true });
  },

  getTestProgress(): StoredTestProgress | null {
    return unifiedStorageSystem.getItem(TEST_PROGRESS_KEY as any) || null;
  },

  clearTestProgress(): void {
    unifiedStorageSystem.removeItem(TEST_PROGRESS_KEY);
  },

  hasSavedProgress(testId: string): boolean {
    const progress = this.getTestProgress();
    return progress !== null && progress.testId === testId;
  }
};

// Exportar funciones individuales para compatibilidad
export const saveTestProgress = optimizedTestStorage.saveTestProgress.bind(optimizedTestStorage);
export const getTestProgress = optimizedTestStorage.getTestProgress.bind(optimizedTestStorage);
export const clearTestProgress = optimizedTestStorage.clearTestProgress.bind(optimizedTestStorage);
export const hasSavedProgress = optimizedTestStorage.hasSavedProgress.bind(optimizedTestStorage);
