
export interface CinematicState {
  currentScene: 'dashboard' | 'subject' | 'help' | 'loading' | 'universe' | 'superpaes';
  transitionActive: boolean;
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  color: string;
  description: string;
}

export interface SubjectProgress {
  subject: string;
  progress: number;
  color: string;
  topics: Array<{
    name: string;
    progress: number;
    exercises: number;
  }>;
}

export interface UserMetrics {
  overallProgress: number;
  projectedScore: number;
  studyStreak: number;
  exercisesCompleted: number;
  neuralLevel: string;
}

// Nuevos tipos unificados para PAES
export interface PAESUser {
  id: string;
  email: string;
  profile: {
    studyPhase: 'diagnostic' | 'learning' | 'practice' | 'exam';
    preferences: {
      studyTime: 'morning' | 'afternoon' | 'evening';
      difficulty: 'basic' | 'intermediate' | 'advanced' | 'adaptive';
      visualMode: 'simple' | 'standard' | 'cinematic';
    };
  };
}

export interface PAESProgress {
  overall: number;
  bySubject: Record<string, number>;
  streak: number;
  totalStudyTime: number;
  lastActivity: string;
  achievements: string[];
}

export interface PAESCompetencia {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  nivel: number;
  progreso: {
    actual: number;
    objetivo: number;
    fechaActualizacion: string;
  };
  habilidades: string[];
}

export interface PAESRecomendacion {
  id: string;
  tipo: 'ejercicio' | 'tema' | 'estrategia' | 'recurso';
  titulo: string;
  descripcion: string;
  compatibilidadGlobal: number;
  razonamiento: string[];
  accionSugerida: string;
  prioridad: number;
  metadata: Record<string, any>;
}

export interface PAESDiagnostico {
  id: string;
  fechaCreacion: string;
  estado: 'pendiente' | 'en_progreso' | 'completado';
  resultados: {
    puntajeGeneral: number;
    fortalezas: string[];
    areasAMejorar: string[];
    recomendaciones: PAESRecomendacion[];
  };
}

export interface PAESPlan {
  id: string;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  estado: 'activo' | 'pausado' | 'completado';
  objetivos: {
    puntajeObjetivo: number;
    fechaExamen: string;
    materiasPrioritarias: string[];
  };
  progreso: {
    porcentajeCompletado: number;
    nodosCompletados: number;
    tiempoInvertido: number;
  };
}

export interface UnifiedPAESData {
  user: PAESUser;
  progress: PAESProgress;
  competencias: PAESCompetencia[];
  recomendaciones: PAESRecomendacion[];
  diagnostico: PAESDiagnostico | null;
  plan: PAESPlan | null;
}
