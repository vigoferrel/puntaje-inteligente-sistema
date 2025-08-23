/**
 * TIPOS CENTRALIZADOS DEL SISTEMA v3.0
 * Definiciones TypeScript estrictas para todo el sistema
 */

// ============================================================================
// TIPOS BASE DEL SISTEMA
// ============================================================================

export interface BaseEntity {
  readonly id: string;
  readonly created_at: string;
  readonly updated_at: string;
}

export interface User extends BaseEntity {
  readonly email: string;
  readonly name: string | null;
  readonly role: UserRole;
  readonly is_active: boolean;
}

export type UserRole = 'student' | 'teacher' | 'admin' | 'guest';

// ============================================================================
// TIPOS EDUCATIVOS
// ============================================================================

export type PAESSubject = 
  | 'COMPETENCIA_LECTORA'
  | 'MATEMATICA_1' 
  | 'MATEMATICA_2'
  | 'CIENCIAS'
  | 'HISTORIA';

export type TierPriority = 'TIER_1' | 'TIER_2' | 'TIER_3';

export type BloomLevel = 
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate'
  | 'create';

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface LearningNode extends BaseEntity {
  readonly code: string;
  readonly title: string;
  readonly description: string | null;
  readonly subject_area: PAESSubject;
  readonly tier_priority: TierPriority;
  readonly cognitive_level: BloomLevel;
  readonly difficulty: DifficultyLevel;
  readonly position: number;
  readonly depends_on: readonly string[] | null;
  readonly estimated_time_minutes: number | null;
  readonly paes_frequency: number | null;
}

export interface UserProgress extends BaseEntity {
  readonly user_id: string;
  readonly node_id: string;
  readonly mastery_level: number; // 0-1
  readonly completed_exercises: number;
  readonly total_time_spent: number; // minutes
  readonly last_activity: string;
  readonly streak_count: number;
  readonly best_score: number | null;
}

export interface Exercise extends BaseEntity {
  readonly question: string;
  readonly options: readonly string[];
  readonly correct_answer: string;
  readonly explanation: string | null;
  readonly node_id: string | null;
  readonly difficulty: DifficultyLevel;
  readonly bloom_level: BloomLevel;
  readonly estimated_time: number | null; // seconds
  readonly source: ExerciseSource;
}

export type ExerciseSource = 'official' | 'ai_generated' | 'curated';

// ============================================================================
// TIPOS DEL SISTEMA NEURAL
// ============================================================================

export interface NeuralMetrics {
  readonly real_time_engagement: number; // 0-1
  readonly session_quality: number; // 0-1
  readonly learning_effectiveness: number; // 0-1
  readonly neural_coherence: number; // 0-1
  readonly user_satisfaction_index: number; // 0-1
  readonly adaptive_intelligence_score: number; // 0-1
}

export interface NeuralEvent {
  readonly type: NeuralEventType;
  readonly payload: Record<string, unknown>;
  readonly timestamp: number;
  readonly session_id: string | null;
  readonly user_id: string | null;
}

export type NeuralEventType =
  | 'USER_ACTION'
  | 'PERFORMANCE_METRIC'
  | 'ERROR_OCCURRED'
  | 'INSIGHT_GENERATED'
  | 'PREDICTION_MADE'
  | 'RECOMMENDATION_CREATED';

export interface Insight extends BaseEntity {
  readonly type: InsightType;
  readonly title: string;
  readonly description: string;
  readonly confidence: number; // 0-1
  readonly impact_score: number; // 0-1
  readonly actionable: boolean;
  readonly metadata: Record<string, unknown>;
}

export type InsightType = 
  | 'learning_pattern'
  | 'performance_trend'
  | 'skill_gap'
  | 'optimization_opportunity'
  | 'behavioral_insight';

export interface Prediction extends BaseEntity {
  readonly type: PredictionType;
  readonly predicted_value: number;
  readonly confidence_interval: readonly [number, number];
  readonly time_horizon: number; // days
  readonly factors: readonly string[];
  readonly methodology: string;
}

export type PredictionType =
  | 'paes_score'
  | 'completion_time'
  | 'mastery_probability'
  | 'dropout_risk'
  | 'optimal_study_schedule';

// ============================================================================
// TIPOS DE LECTOGUÍA
// ============================================================================

export interface LectoGuiaMessage extends BaseEntity {
  readonly content: string;
  readonly type: MessageType;
  readonly sender: MessageSender;
  readonly subject_context: PAESSubject | null;
  readonly source: MessageSource;
  readonly metadata: MessageMetadata;
}

export type MessageType = 'text' | 'exercise' | 'explanation' | 'recommendation';
export type MessageSender = 'user' | 'assistant';
export type MessageSource = 'official' | 'ai_contextual' | 'hybrid' | 'cache';

export interface MessageMetadata {
  readonly cost_saving?: number;
  readonly response_time?: number;
  readonly quality_score?: number;
  readonly tokens_used?: number;
  readonly model_used?: string;
}

export interface LectoGuiaSession extends BaseEntity {
  readonly user_id: string;
  readonly subject: PAESSubject;
  readonly message_count: number;
  readonly total_cost: number;
  readonly quality_score: number;
  readonly ended_at: string | null;
}

// ============================================================================
// TIPOS DE DIAGNÓSTICO
// ============================================================================

export interface DiagnosticTest extends BaseEntity {
  readonly title: string;
  readonly description: string | null;
  readonly target_subject: PAESSubject;
  readonly target_tier: TierPriority | null;
  readonly total_questions: number;
  readonly estimated_duration: number; // minutes
  readonly is_adaptive: boolean;
}

export interface DiagnosticSession extends BaseEntity {
  readonly user_id: string;
  readonly test_id: string;
  readonly status: DiagnosticStatus;
  readonly current_question: number;
  readonly total_questions: number;
  readonly started_at: string;
  readonly completed_at: string | null;
  readonly paused_at: string | null;
}

export type DiagnosticStatus = 'not_started' | 'in_progress' | 'paused' | 'completed' | 'abandoned';

export interface DiagnosticResult extends BaseEntity {
  readonly session_id: string;
  readonly user_id: string;
  readonly predicted_paes_score: number;
  readonly estimated_ability_level: number;
  readonly confidence_interval: readonly [number, number];
  readonly strong_skills: readonly string[];
  readonly weak_skills: readonly string[];
  readonly recommendations: readonly Recommendation[];
  readonly detailed_analysis: Record<string, unknown>;
}

export interface Recommendation extends BaseEntity {
  readonly type: RecommendationType;
  readonly title: string;
  readonly description: string;
  readonly priority: RecommendationPriority;
  readonly estimated_impact: number; // 0-1
  readonly estimated_effort: number; // hours
  readonly target_nodes: readonly string[];
  readonly metadata: Record<string, unknown>;
}

export type RecommendationType = 
  | 'study_plan'
  | 'skill_focus'
  | 'time_allocation'
  | 'resource_suggestion'
  | 'strategy_adjustment';

export type RecommendationPriority = 'low' | 'medium' | 'high' | 'critical';

// ============================================================================
// TIPOS FINANCIEROS
// ============================================================================

export interface FinancialSimulation extends BaseEntity {
  readonly user_id: string | null;
  readonly simulation_name: string | null;
  readonly target_career: string | null;
  readonly estimated_cost: number | null;
  readonly available_funding: number | null;
  readonly projected_income: number | null;
  readonly risk_assessment: Record<string, unknown> | null;
  readonly roi_analysis: Record<string, unknown> | null;
  readonly funding_sources: Record<string, unknown> | null;
}

export interface Scholarship extends BaseEntity {
  readonly name: string;
  readonly institution: string;
  readonly type: ScholarshipType;
  readonly amount: number | null;
  readonly coverage_percentage: number | null;
  readonly minimum_score_requirements: Record<string, number> | null;
  readonly application_deadline: string | null;
  readonly eligible_careers: readonly string[] | null;
  readonly requirements: Record<string, unknown> | null;
}

export type ScholarshipType = 'merit' | 'need_based' | 'sports' | 'artistic' | 'academic_excellence';

// ============================================================================
// TIPOS DE ESTADO GLOBAL
// ============================================================================

export interface SystemState {
  readonly isInitialized: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly phase: SystemPhase;
  readonly lastSync: string | null;
}

export type SystemPhase = 'idle' | 'auth' | 'nodes' | 'validation' | 'complete' | 'emergency';

export interface UIState {
  readonly isDarkMode: boolean;
  readonly cinematicMode: boolean;
  readonly sidebarOpen: boolean;
  readonly currentModule: string;
  readonly notifications: readonly Notification[];
}

export interface Notification extends BaseEntity {
  readonly type: NotificationType;
  readonly title: string;
  readonly message: string;
  readonly read: boolean;
  readonly actionable: boolean;
  readonly action_url: string | null;
  readonly expires_at: string | null;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'achievement';

// ============================================================================
// TIPOS DE RENDIMIENTO
// ============================================================================

export interface PerformanceMetrics {
  readonly memoryUsage: number;
  readonly renderTime: number;
  readonly errorCount: number;
  readonly warningCount: number;
  readonly lastUpdate: number;
  readonly isHealthy: boolean;
}

export interface StorageStatus {
  readonly isReady: boolean;
  readonly storageAvailable: boolean;
  readonly trackingBlocked: boolean;
  readonly cacheSize: number;
  readonly queueLength: number;
  readonly alertCount: number;
  readonly circuitBreakerActive: boolean;
  readonly gracefulDegradation: boolean;
}

// ============================================================================
// TIPOS DE API
// ============================================================================

export interface APIResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: string;
  readonly timestamp: number;
  readonly requestId?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  readonly pagination: {
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly totalPages: number;
    readonly hasNext: boolean;
    readonly hasPrev: boolean;
  };
}

export interface QueryOptions {
  readonly page?: number;
  readonly pageSize?: number;
  readonly sortBy?: string;
  readonly sortOrder?: 'asc' | 'desc';
  readonly filters?: Record<string, unknown>;
  readonly include?: readonly string[];
}

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface UserAction {
  readonly type: UserActionType;
  readonly target: string;
  readonly metadata: Record<string, unknown>;
  readonly timestamp: number;
}

export type UserActionType =
  | 'click'
  | 'navigation'
  | 'exercise_start'
  | 'exercise_complete'
  | 'message_send'
  | 'diagnostic_start'
  | 'diagnostic_complete'
  | 'plan_generate'
  | 'content_view';

// ============================================================================
// TIPOS DE VALIDACIÓN
// ============================================================================

export interface ValidationError {
  readonly field: string;
  readonly code: string;
  readonly message: string;
  readonly value?: unknown;
}

export interface ValidationResult<T> {
  readonly success: boolean;
  readonly data?: T;
  readonly errors?: readonly ValidationError[];
}

// ============================================================================
// TIPOS UTILITARIOS
// ============================================================================

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Branded types para mayor type safety
export type UserId = string & { readonly __brand: 'UserId' };
export type NodeId = string & { readonly __brand: 'NodeId' };
export type SessionId = string & { readonly __brand: 'SessionId' };

// Utility functions para branded types
export const createUserId = (id: string): UserId => id as UserId;
export const createNodeId = (id: string): NodeId => id as NodeId;
export const createSessionId = (id: string): SessionId => id as SessionId;

// ============================================================================
// TIPOS DE CONFIGURACIÓN
// ============================================================================

export interface AppConfig {
  readonly api: {
    readonly baseUrl: string;
    readonly timeout: number;
    readonly retries: number;
  };
  readonly features: {
    readonly neuralSystem: boolean;
    readonly diagnostics: boolean;
    readonly lectoguia: boolean;
    readonly financial: boolean;
    readonly universe3d: boolean;
  };
  readonly debug: {
    readonly logging: boolean;
    readonly performance: boolean;
    readonly errorReporting: boolean;
  };
}

// ============================================================================
// GUARDS DE TIPO
// ============================================================================

export const isUser = (obj: unknown): obj is User => {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'email' in obj && 
         'role' in obj;
};

export const isPAESSubject = (subject: string): subject is PAESSubject => {
  return ['COMPETENCIA_LECTORA', 'MATEMATICA_1', 'MATEMATICA_2', 'CIENCIAS', 'HISTORIA']
    .includes(subject);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================================================
// EXPORTACIONES PRINCIPALES
// ============================================================================

export type {
  // Entidades principales
  User,
  LearningNode,
  UserProgress,
  Exercise,
  
  // Sistema Neural
  NeuralMetrics,
  NeuralEvent,
  Insight,
  Prediction,
  
  // LectoGuía
  LectoGuiaMessage,
  LectoGuiaSession,
  
  // Diagnósticos
  DiagnosticTest,
  DiagnosticSession,
  DiagnosticResult,
  Recommendation,
  
  // Sistema
  SystemState,
  UIState,
  PerformanceMetrics,
  StorageStatus,
  
  // API
  APIResponse,
  PaginatedResponse,
  QueryOptions,
};
