
import { Exercise } from '@/types/ai-types';
import { ConnectionStatus } from '@/hooks/use-openrouter';
import { TPAESHabilidad, TPAESPrueba } from '@/types/system-types';

// Mapa de materias a pruebas PAES
export const SUBJECT_TO_PRUEBA_MAP: Record<string, TPAESPrueba> = {
  'lectura': 'COMPETENCIA_LECTORA',
  'matematicas-basica': 'MATEMATICA_1',
  'matematicas-avanzada': 'MATEMATICA_2',
  'ciencias': 'CIENCIAS',
  'historia': 'HISTORIA',
  'general': 'COMPETENCIA_LECTORA'
};

// Nombres legibles para las materias
export const SUBJECT_DISPLAY_NAMES: Record<string, string> = {
  'lectura': 'Comprensión Lectora',
  'matematicas-basica': 'Matemáticas (7° a 2° medio)',
  'matematicas-avanzada': 'Matemáticas (3° y 4° medio)',
  'ciencias': 'Ciencias',
  'historia': 'Historia',
  'general': 'General'
};

// Mapa de pruebas PAES a test_id (para base de datos)
export const PRUEBA_TO_TEST_ID: Record<TPAESPrueba, number> = {
  'COMPETENCIA_LECTORA': 1,
  'MATEMATICA_1': 2,
  'MATEMATICA_2': 3,
  'CIENCIAS': 4,
  'HISTORIA': 5
};

// Niveles iniciales de habilidad
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

// Tipos utilizados en los hooks y componentes
export interface LectoGuiaContextType {
  // Estado general
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading: boolean;
  
  // Chat
  messages: any[];
  isTyping: boolean;
  activeSubject: string;
  handleSendMessage: (message: string, imageData?: string) => void;
  handleSubjectChange: (subject: string) => void;
  
  // Ejercicios
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (index: number) => void;
  handleNewExercise: () => Promise<boolean>;
  
  // Habilidades
  activeSkill?: TPAESHabilidad | null;
  setActiveSkill?: (skill: TPAESHabilidad | null) => void;
  handleSkillSelect?: (skill: TPAESHabilidad) => Promise<boolean>;
  
  // Progreso
  skillLevels: Record<string | TPAESHabilidad, number>;
  handleStartSimulation: () => void;
  
  // Nodos
  nodes: any[];
  nodeProgress: Record<string, any>;
  handleNodeSelect: (nodeId: string) => Promise<boolean>;
  selectedTestId: string | null;
  setSelectedTestId: (testId: string | null) => void;
  selectedPrueba: TPAESPrueba;
  recommendedNodes?: any[];
  
  // Estado de conexión
  serviceStatus: 'available' | 'degraded' | 'unavailable';
  connectionStatus: ConnectionStatus;
  resetConnectionStatus: () => void;
  showConnectionStatus: () => React.ReactNode | null;
}

// Tipos para los hooks internos
export interface UseTabsState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface UseSubjectsState {
  activeSubject: string;
  handleSubjectChange: (subject: string) => void;
}

export interface UseSkillsState {
  skillLevels: Record<TPAESHabilidad, number>;
  updateSkillLevel: (skillId: number, isCorrect: boolean) => Promise<void>;
  getSkillIdFromCode: (skillCode: TPAESHabilidad) => number | null;
  handleStartSimulation: () => void;
}

export interface UseNodesState {
  nodes: any[];
  nodeProgress: Record<string, any>;
  selectedTestId: string | null;
  setSelectedTestId: (testId: string | null) => void;
  selectedPrueba: TPAESPrueba;
}

export interface UseExerciseState {
  currentExercise: Exercise | null;
  selectedOption: number | null;
  showFeedback: boolean;
  handleOptionSelect: (index: number) => void;
  handleNewExercise: () => Promise<boolean>;
  isLoading: boolean;
  setCurrentExercise: React.Dispatch<React.SetStateAction<Exercise | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
