
export interface PAESUser {
  id: string;
  email: string;
  profile: {
    studyPhase: 'diagnostic' | 'preparation' | 'intensive' | 'review';
    preferences: {
      studyTime: 'morning' | 'afternoon' | 'evening' | 'night';
      difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
      visualMode: 'standard' | 'cinematic' | 'minimal';
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
  area: string;
  nivel: number;
  progreso: {
    actual: number;
    objetivo: number;
    tendencia: 'up' | 'down' | 'stable';
  };
}

export interface PAESRecomendacion {
  id: string;
  tipo: 'ejercicio' | 'teoria' | 'practica' | 'estrategia';
  titulo: string;
  descripcion: string;
  prioridad: number;
  compatibilidadGlobal: number;
  razonamiento: string[];
  accionSugerida: string;
  metadata: Record<string, any>;
}

export interface PAESDiagnostico {
  id: string;
  fecha: string;
  resultados: Record<string, number>;
  recomendaciones: string[];
  nivelGeneral: number;
}

export interface PAESPlan {
  id: string;
  nombre: string;
  duracionSemanas: number;
  objetivos: string[];
  cronograma: Record<string, any>;
  progreso: number;
}

export interface UnifiedPAESData {
  user: PAESUser;
  progress: PAESProgress;
  competencias: PAESCompetencia[];
  recomendaciones: PAESRecomendacion[];
  diagnostico: PAESDiagnostico | null;
  plan: PAESPlan | null;
}

// Estado cinemático completo con todas las propiedades necesarias
export interface CinematicState {
  currentScene: 'dashboard' | 'diagnostic' | 'neural_command' | 'study_plan' | 'exercises' | 'analytics';
  transitionActive: boolean;
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
  previousScene?: 'dashboard' | 'diagnostic' | 'neural_command' | 'study_plan' | 'exercises' | 'analytics';
  navigationHistory: string[];
  animationDuration: number;
  particleSystemEnabled: boolean;
  holographicMode: boolean;
}
