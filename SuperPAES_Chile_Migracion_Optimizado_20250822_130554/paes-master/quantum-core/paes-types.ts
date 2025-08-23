/**
 * 📚 PAES MASTER QUANTUM - Tipos TypeScript
 * Basado en la estructura oficial PAES encontrada
 */

// Tipos de prueba PAES
export type PaesTestType = 
  | 'COMPETENCIA_LECTORA'
  | 'MATEMATICA_M1'
  | 'MATEMATICA_M2'
  | 'HISTORIA_CIENCIAS_SOCIALES'
  | 'CIENCIAS_BIOLOGIA'
  | 'CIENCIAS_FISICA'
  | 'CIENCIAS_QUIMICA';

// Habilidades PAES
export type PaesSkill = 
  | 'localizar'
  | 'interpretar' 
  | 'evaluar'
  | 'resolver'
  | 'modelar'
  | 'representar'
  | 'argumentar'
  | 'analizar'
  | 'sintetizar';

// Niveles de dificultad
export type DifficultyLevel = 
  | 'principiante'
  | 'intermedio'
  | 'avanzado'
  | 'experto';

// Niveles Bloom
export type BloomLevel = 
  | 'L1' // Recordar
  | 'L2' // Comprender
  | 'L3' // Aplicar
  | 'L4' // Analizar
  | 'L5' // Evaluar
  | 'L6'; // Crear

// Estado de progreso
export type ProgressStatus = 
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'needs_review'
  | 'mastered';

// Nodo de aprendizaje
export interface LearningNode {
  id: string;
  name: string;
  description?: string;
  testType: PaesTestType;
  skill: PaesSkill;
  subSkill: string;
  difficulty: DifficultyLevel;
  bloomLevel: BloomLevel;
  position: number;
  prerequisites: string[];
  estimatedTimeMinutes: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}

// Progreso del usuario
export interface UserProgress {
  userId: string;
  nodeId: string;
  status: ProgressStatus;
  progressPercentage: number;
  score?: number;
  timeSpentMinutes: number;
  attempts: number;
  lastAttemptAt?: Date;
  masteryLevel: number;
  nextReviewDate?: Date;
  metadata?: Record<string, any>;
}

// Sesión de práctica
export interface PracticeSession {
  userId: string;
  testType: PaesTestType;
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  timeSpentMinutes: number;
  completedAt: Date;
  metadata?: Record<string, any>;
}

// Contenido generado por IA
export interface AIGeneratedContent {
  userId: string;
  nodeId: string;
  contentType: 'question' | 'explanation' | 'feedback' | 'recommendation';
  title: string;
  content: string;
  difficulty: DifficultyLevel;
  bloomLevel: BloomLevel;
  metadata?: Record<string, any>;
}

// Playlist Spotify Neural
export interface SpotifyNeural {
  playlistId: string;
  testType: PaesTestType;
  skill: PaesSkill;
  subSkill: string;
  tracks: Array<{
    trackId: string;
    name: string;
    bloomLevel: BloomLevel;
    duration: number;
  }>;
  neuralSync: boolean;
}

// Estado cuántico
export interface QuantumState {
  nodes: Map<string, LearningNode>;
  bloom: Map<BloomLevel, {
    name: string;
    description: string;
    verbs: string[];
    examples: string[];
  }>;
  spotify: {
    playlists: SpotifyNeural[];
    neuralSync: boolean;
  };
  entanglement: Map<string, {
    nodes: string[];
    strength: number;
    coherence: number;
  }>;
  coherence: number;
  entropy: number;
}

// Configuración del sistema
export interface QuantumConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openrouterApiKey?: string;
  spotifyConfig?: {
    clientId: string;
    clientSecret: string;
  };
  quantumPort: number;
  quantumHost: string;
}


