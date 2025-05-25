
/**
 * Tipos unificados para el ecosistema PAES
 * Centraliza todas las interfaces para evitar duplicación
 */

// Tipos base del sistema PAES
export interface UnifiedPAESData {
  user: PAESUser;
  progress: PAESProgress;
  competencias: PAESCompetencia[];
  recomendaciones: PAESRecomendacion[];
  diagnostico: PAESDiagnostico | null;
  plan: PAESPlan | null;
}

export interface PAESUser {
  id: string;
  email: string;
  name?: string;
  profile: PAESProfile;
}

export interface PAESProfile {
  targetCareer?: string;
  targetScore?: number;
  studyPhase: 'diagnostic' | 'learning' | 'practice' | 'mastery';
  preferences: {
    studyTime: string;
    difficulty: 'adaptive' | 'challenging' | 'comfortable';
    visualMode: 'standard' | 'cinematic' | 'immersive';
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
  nivel: number; // 0-100
  categoria: 'transversal' | 'especifica' | 'cognitiva';
  colorVisualizacion: string;
  prioridad: 'alta' | 'media' | 'baja';
  progreso: {
    actual: number;
    objetivo: number;
    tendencia: 'mejorando' | 'estable' | 'declinando';
  };
}

export interface PAESRecomendacion {
  id: string;
  tipo: 'carrera' | 'universidad' | 'estrategia' | 'recurso';
  titulo: string;
  descripcion: string;
  compatibilidadGlobal: number;
  razonamiento: string[];
  accionSugerida: string;
  prioridad: number;
  metadata: {
    universidad?: string;
    puntajeMinimo?: number;
    modalidad?: string;
    duracion?: string;
  };
}

export interface PAESDiagnostico {
  id: string;
  fechaRealizacion: string;
  resultados: {
    puntajeGlobal: number;
    fortalezas: string[];
    debilidades: string[];
    recomendaciones: string[];
  };
  analisisDetallado: {
    competenciasPorArea: Record<string, number>;
    tiempoPromedio: number;
    patronesError: string[];
    estiloAprendizaje: string;
  };
}

export interface PAESPlan {
  id: string;
  titulo: string;
  descripcion: string;
  duracionSemanas: number;
  progreso: number;
  nodos: PAESPlanNodo[];
  objetivo: {
    puntaje: number;
    fecha: string;
    prioridades: string[];
  };
  metricas: {
    horasEstimadas: number;
    sesionesCompletadas: number;
    efectividad: number;
  };
}

export interface PAESPlanNodo {
  id: string;
  nombre: string;
  descripcion: string;
  semana: number;
  posicion: number;
  estado: 'pendiente' | 'en_progreso' | 'completado';
  tiempoEstimado: number;
  habilidades: string[];
  dependencias?: string[];
}

// Tipos para el mapa 3D
export interface SkillMap3DData {
  name: string;
  level: number; // 0-1
  color: string;
  position?: [number, number, number];
  connections?: string[];
}

// Estados cinematográficos
export interface CinematicState {
  currentScene: 'dashboard' | 'universe' | 'diagnostic' | 'superpaes' | 'plan';
  transitionActive: boolean;
  immersionLevel: 'minimal' | 'standard' | 'full';
  effectsEnabled: boolean;
}

// Métricas del sistema
export interface SystemMetrics {
  totalNodes: number;
  completedNodes: number;
  availableTests: number;
  userEngagement: number;
  systemPerformance: {
    loadTime: number;
    errorRate: number;
    userSatisfaction: number;
  };
}
