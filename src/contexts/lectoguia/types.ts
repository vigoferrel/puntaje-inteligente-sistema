
import { ChatMessage } from '@/components/ai/ChatInterface';
import { Exercise } from '@/types/ai-types';
import { NodeProgress } from '@/types/node-progress';
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

// Estado inicial para niveles de habilidades
export const initialSkillLevels: Record<TPAESHabilidad, number> = {
  'TRACK_LOCATE': 0.1,
  'INTERPRET_RELATE': 0.2,
  'EVALUATE_REFLECT': 0,
  'SOLVE_PROBLEMS': 0.3,
  'REPRESENT': 0.2,
  'MODEL': 0.1,
  'ARGUE_COMMUNICATE': 0,
  'IDENTIFY_THEORIES': 0.4,
  'PROCESS_ANALYZE': 0.1,
  'APPLY_PRINCIPLES': 0,
  'SCIENTIFIC_ARGUMENT': 0,
  'TEMPORAL_THINKING': 0.2,
  'SOURCE_ANALYSIS': 0.1,
  'MULTICAUSAL_ANALYSIS': 0,
  'CRITICAL_THINKING': 0.2,
  'REFLECTION': 0.1
};

// Mapeo de materias a pruebas PAES
export const SUBJECT_TO_PRUEBA_MAP: Record<string, TPAESPrueba> = {
  'general': 'COMPETENCIA_LECTORA',
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA'
};

// Nombres para mostrar de las materias
export const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  'general': 'General',
  'lectura': 'Comprensión Lectora',
  'matematicas-basica': 'Matemáticas (7° a 2° medio)',
  'matematicas-avanzada': 'Matemáticas (3° y 4° medio)',
  'ciencias': 'Ciencias',
  'historia': 'Historia'
};

// Tipos para el contexto
export interface LectoGuiaContextType {
  // Estado general
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  
  // Chat
  messages: ChatMessage[];
  isTyping: boolean;
  activeSubject: string;
  handleSendMessage: (message: string, imageData?: string) => void;
  handleSubjectChange: (subject: string) => void;
  
  // Ejercicios
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (index: number) => void;
  handleNewExercise: () => void;
  
  // Progreso
  skillLevels: Record<TPAESHabilidad, number>;
  handleStartSimulation: () => void;
  
  // Nodos
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  handleNodeSelect: (nodeId: string) => void;
  selectedTestId: number;
  setSelectedTestId: (testId: number) => void;
  selectedPrueba: TPAESPrueba;
}

// Interfaces para hooks específicos
export interface UseTabsState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface UseSubjectsState {
  activeSubject: string;
  handleSubjectChange: (subject: string) => void;
}

export interface UseNodesState {
  nodes: TLearningNode[];
  nodeProgress: Record<string, NodeProgress>;
  handleNodeSelect: (nodeId: string) => void;
  selectedTestId: number;
  setSelectedTestId: (testId: number) => void;
  selectedPrueba: TPAESPrueba;
}

export interface UseExerciseState {
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (index: number) => void;
  handleNewExercise: () => void;
  isLoading: boolean;
}

export interface UseChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  handleSendMessage: (message: string, imageData?: string) => void;
  addUserMessage: (content: string, imageData?: string) => ChatMessage;
  addAssistantMessage: (content: string) => ChatMessage;
}

export interface UseSkillsState {
  skillLevels: Record<TPAESHabilidad, number>;
  updateSkillLevel: (skillId: number, isCorrect: boolean) => Promise<void>;
  getSkillIdFromCode: (skillCode: TPAESHabilidad) => number | null;
  handleStartSimulation: () => void;
}
