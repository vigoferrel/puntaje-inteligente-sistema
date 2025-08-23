import { useState, useEffect, useCallback } from 'react';
import { UserProgress, UserPreferences, PAESSubject } from './use-educational-paes';

interface OfflineData {
  userProgress: UserProgress[];
  userPreferences: UserPreferences;
  subjects: PAESSubject[];
  lastSync: Date;
  isDataStale: boolean;
}

const STORAGE_KEYS = {
  USER_PROGRESS: 'paes_user_progress',
  USER_PREFERENCES: 'paes_user_preferences',
  SUBJECTS: 'paes_subjects',
  LAST_SYNC: 'paes_last_sync'
};

const STALE_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const useOfflineStorage = () => {
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  // Load data from localStorage
  const loadOfflineData = useCallback((): OfflineData | null => {
    try {
      const progressData = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
      const preferencesData = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      const subjectsData = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      const lastSyncData = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);

      if (!progressData || !preferencesData || !subjectsData) {
        return null;
      }

      const lastSync = lastSyncData ? new Date(lastSyncData) : new Date(0);
      const isDataStale = Date.now() - lastSync.getTime() > STALE_THRESHOLD;

      return {
        userProgress: JSON.parse(progressData),
        userPreferences: JSON.parse(preferencesData),
        subjects: JSON.parse(subjectsData),
        lastSync,
        isDataStale
      };
    } catch (error) {
      console.error('Error loading offline data:', error);
      return null;
    }
  }, []);

  // Save data to localStorage
  const saveOfflineData = useCallback((data: Partial<OfflineData>) => {
    try {
      if (data.userProgress) {
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(data.userProgress));
      }
      if (data.userPreferences) {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.userPreferences));
      }
      if (data.subjects) {
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(data.subjects));
      }
      
      // Always update last sync when saving
      const now = new Date();
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, now.toISOString());

      // Update state directly without calling loadOfflineData
      setOfflineData(prev => {
        if (prev) {
          return {
            ...prev,
            ...data,
            lastSync: now,
            isDataStale: false
          };
        }
        return null;
      });
    } catch (error) {
      console.error('Error saving offline data:', error);
    }
  }, []);

  // Clear offline data
  const clearOfflineData = useCallback(() => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      setOfflineData(null);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }, []);

  // Check if offline data exists
  const hasOfflineData = useCallback((): boolean => {
    const data = loadOfflineData();
    return data !== null;
  }, [loadOfflineData]);

  // Get mock data for offline mode
  const getMockData = useCallback((): OfflineData => {
    const mockProgress: UserProgress[] = [
      {
        userId: 'offline-user',
        subject: 'MATEMATICA_M1',
        progress: 75,
        totalExercises: 45,
        correctAnswers: 34,
        averageScore: 75.6,
        lastStudied: new Date().toISOString(),
        weakAreas: ['Geometría'],
        strongAreas: ['Álgebra']
      },
      {
        userId: 'offline-user',
        subject: 'COMPETENCIA_LECTORA',
        progress: 62,
        totalExercises: 30,
        correctAnswers: 19,
        averageScore: 63.3,
        lastStudied: new Date().toISOString(),
        weakAreas: ['Análisis de texto'],
        strongAreas: ['Comprensión literal']
      },
      {
        userId: 'offline-user',
        subject: 'CIENCIAS',
        progress: 88,
        totalExercises: 50,
        correctAnswers: 44,
        averageScore: 88.0,
        lastStudied: new Date().toISOString(),
        weakAreas: [],
        strongAreas: ['Biología', 'Química']
      },
      {
        userId: 'offline-user',
        subject: 'HISTORIA',
        progress: 40,
        totalExercises: 25,
        correctAnswers: 10,
        averageScore: 40.0,
        lastStudied: new Date().toISOString(),
        weakAreas: ['Historia contemporánea'],
        strongAreas: ['Historia de Chile']
      },
      {
        userId: 'offline-user',
        subject: 'MATEMATICA_M2',
        progress: 55,
        totalExercises: 35,
        correctAnswers: 19,
        averageScore: 54.3,
        lastStudied: new Date().toISOString(),
        weakAreas: ['Cálculo diferencial'],
        strongAreas: ['Funciones']
      }
    ];

    const mockPreferences: UserPreferences = {
      userId: 'offline-user',
      difficulty: 'auto',
      focusSkills: ['Matemática', 'Ciencias'],
      studyTime: 45,
      notifications: true,
      musicEnabled: false
    };

    const mockSubjects: PAESSubject[] = [
      {
        id: 'MATEMATICA_M1',
        name: 'Matemática M1',
        description: 'Matemática obligatoria para todas las carreras',
        bloomLevels: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
        progress: 75,
        weakAreas: ['Geometría'],
        strongAreas: ['Álgebra']
      },
      {
        id: 'COMPETENCIA_LECTORA',
        name: 'Competencia Lectora',
        description: 'Comprensión y análisis de textos',
        bloomLevels: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
        progress: 62,
        weakAreas: ['Análisis de texto'],
        strongAreas: ['Comprensión literal']
      },
      {
        id: 'CIENCIAS',
        name: 'Ciencias',
        description: 'Biología, Física y Química',
        bloomLevels: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
        progress: 88,
        weakAreas: [],
        strongAreas: ['Biología', 'Química']
      },
      {
        id: 'HISTORIA',
        name: 'Historia',
        description: 'Historia de Chile y el mundo',
        bloomLevels: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
        progress: 40,
        weakAreas: ['Historia contemporánea'],
        strongAreas: ['Historia de Chile']
      },
      {
        id: 'MATEMATICA_M2',
        name: 'Matemática M2',
        description: 'Matemática específica para carreras científicas',
        bloomLevels: ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'],
        progress: 55,
        weakAreas: ['Cálculo diferencial'],
        strongAreas: ['Funciones']
      }
    ];

    return {
      userProgress: mockProgress,
      userPreferences: mockPreferences,
      subjects: mockSubjects,
      lastSync: new Date(),
      isDataStale: false
    };
  }, []);

  // Initialize offline data
  useEffect(() => {
    const data = loadOfflineData();
    if (data) {
      setOfflineData(data);
    } else {
      // If no offline data exists, create mock data
      const mockData = getMockData();
      // Save directly to localStorage and state
      try {
        localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(mockData.userProgress));
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(mockData.userPreferences));
        localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(mockData.subjects));
        localStorage.setItem(STORAGE_KEYS.LAST_SYNC, mockData.lastSync.toISOString());
        setOfflineData(mockData);
      } catch (error) {
        console.error('Error initializing offline data:', error);
      }
    }
  }, [loadOfflineData, getMockData]);

  return {
    offlineData,
    saveOfflineData,
    clearOfflineData,
    hasOfflineData,
    getMockData,
    loadOfflineData,
    isDataStale: offlineData?.isDataStale || false,
    lastSync: offlineData?.lastSync || new Date(0)
  };
};
