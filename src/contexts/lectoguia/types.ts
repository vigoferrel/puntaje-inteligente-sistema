
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { NodeProgress } from '@/types/node-progress';

// Tipos de estado para los hooks
export interface UseTabsState {
  activeTab: 'chat' | 'exercise' | 'progress';
  setActiveTab: (tab: 'chat' | 'exercise' | 'progress') => void;
}

export interface UseChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
}

export interface UseSubjectsState {
  activeSubject: string;
  setActiveSubject: (subject: string) => void;
}

export interface UseExerciseState {
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  isLoading: boolean;
  setCurrentExercise: (exercise: Exercise | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export interface UseSkillsState {
  skillLevels: Record<TPAESHabilidad, number>;
  updateSkillLevel: (skillId: number, isCorrect: boolean) => Promise<void>;
  getSkillIdFromCode: (skillCode: TPAESHabilidad) => number | null;
  handleStartSimulation: () => void;
}

// Mensaje de chat simple
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  imageData?: string;
}

// Niveles iniciales de habilidades
export const initialSkillLevels: Record<TPAESHabilidad, number> = {
  'TRACK_LOCATE': 0,
  'INTERPRET_RELATE': 0,
  'EVALUATE_REFLECT': 0,
  'SOLVE_PROBLEMS': 0,
  'REPRESENT': 0,
  'MODEL': 0,
  'ARGUE_COMMUNICATE': 0,
  'IDENTIFY_THEORIES': 0,
  'PROCESS_ANALYZE': 0,
  'APPLY_PRINCIPLES': 0,
  'SCIENTIFIC_ARGUMENT': 0,
  'TEMPORAL_THINKING': 0,
  'SOURCE_ANALYSIS': 0,
  'MULTICAUSAL_ANALYSIS': 0,
  'CRITICAL_THINKING': 0,
  'REFLECTION': 0
};

export interface LectoGuiaContextType {
  // Estado general
  activeTab: 'chat' | 'exercise' | 'progress';
  setActiveTab: (tab: 'chat' | 'exercise' | 'progress') => void;
  isLoading: boolean;
  
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  activeSubject: string;
  handleSendMessage: (message: string, imageData?: string) => Promise<void>;
  handleSubjectChange: (subject: string) => void;
  
  // Ejercicios
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (optionIndex: number) => void;
  handleNewExercise: () => Promise<boolean>;
  
  // Habilidades
  activeSkill: TPAESHabilidad | null;
  setActiveSkill: (skill: TPAESHabilidad | null) => void;
  handleSkillSelect: (skill: TPAESHabilidad) => Promise<boolean>;
  
  // Progreso
  skillLevels: Record<TPAESHabilidad, number>;
  handleStartSimulation: () => void;
  
  // Nodos
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  handleNodeSelect: (nodeId: string) => Promise<boolean>;
  selectedTestId: number;
  setSelectedTestId: (testId: number) => void;
  selectedPrueba: TPAESPrueba;
  recommendedNodes: TLearningNode[];
  
  // Estado de validación
  validationStatus: {
    isValid: boolean;
    issuesCount: number;
    lastValidation?: Date;
  };
  
  // Estado de conexión
  serviceStatus: {
    isOnline: boolean;
    lastCheck: Date;
  };
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
  resetConnectionStatus: () => void;
  showConnectionStatus: boolean;
}

// Mapeos para conversión entre formatos
export const SUBJECT_TO_PRUEBA_MAP: Record<string, TPAESPrueba> = {
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

export const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  'lectura': 'Comprensión Lectora',
  'matematicas-basica': 'Matemática 1',
  'matematicas-avanzada': 'Matemática 2',
  'ciencias': 'Ciencias',
  'historia': 'Historia'
};
