
/**
 * TIPOS CENTRALES EDUCATIVOS v2.0
 * Sistema unificado de tipos para toda la plataforma educativa
 */

// Tipos de módulos educativos
export type EducationalModule = 'lectoguia' | 'paes' | 'diagnostic' | 'planning' | 'financial';

// Tipos de experiencias de aprendizaje
export type LearningExperience = 'interactive' | 'immersive' | '3d-universe' | 'simulation' | 'assessment';

// Tipos de contenido educativo
export interface EducationalContent {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'lesson' | 'assessment' | 'simulation';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  subject: string;
  estimatedTime: number;
  prerequisites?: string[];
  objectives: string[];
  metadata: Record<string, any>;
}

// Tipos de progreso educativo
export interface LearningProgress {
  userId: string;
  moduleId: string;
  contentId: string;
  completionPercentage: number;
  timeSpent: number;
  lastAccessed: Date;
  achievements: Achievement[];
  performance: PerformanceMetrics;
}

// Tipos de logros
export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'streak' | 'mastery' | 'exploration';
  icon: string;
  earnedAt: Date;
  points: number;
}

// Métricas de rendimiento
export interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
  adaptability: number;
}

// Configuración de aprendizaje adaptativo
export interface AdaptiveLearningConfig {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: 'challenging' | 'moderate' | 'comfortable';
  pacePreference: 'fast' | 'normal' | 'slow';
  interactionPreference: 'guided' | 'exploratory' | 'structured';
}

// Contexto educativo
export interface EducationalContext {
  currentModule: EducationalModule;
  currentExperience: LearningExperience;
  userProfile: UserProfile;
  sessionData: SessionData;
  preferences: AdaptiveLearningConfig;
}

// Perfil de usuario educativo
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  educationalLevel: 'secondary' | 'pre-university' | 'university';
  subjects: string[];
  goals: string[];
  strengths: string[];
  areas_for_improvement: string[];
}

// Datos de sesión
export interface SessionData {
  sessionId: string;
  startTime: Date;
  currentPath: string;
  interactions: number;
  timeSpent: number;
  completedActivities: string[];
}
