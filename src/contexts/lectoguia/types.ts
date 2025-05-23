
import { TLearningNode, TPAESHabilidad, TPAESPrueba } from '@/types/system-types';
import { Exercise } from '@/types/ai-types';
import { TNodeProgress } from '@/types/node-progress';
import { Message } from '@/hooks/lectoguia-chat/types';

export interface LectoGuiaContextType {
  // Estado general
  activeTab: 'chat' | 'exercise' | 'progress';
  setActiveTab: (tab: 'chat' | 'exercise' | 'progress') => void;
  isLoading: boolean;
  
  // Chat
  messages: Message[];
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
  nodeProgress: Record<string, TNodeProgress>;
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
