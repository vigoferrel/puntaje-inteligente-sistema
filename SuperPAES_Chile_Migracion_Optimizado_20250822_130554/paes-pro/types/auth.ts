import { Database } from './database'

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export interface AuthUser {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
  app_metadata?: {
    provider?: string
    providers?: string[]
  }
}

export interface AuthSession {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type: string
  user: AuthUser
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  full_name: string
  grade_level?: string
  region?: string
  city?: string
}

export interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<UserUpdate>) => Promise<void>
}

export type AuthError = {
  message: string
  status?: number
}

// Tipos para perfil de usuario
export interface UserProfile extends User {
  diagnostic_results?: DiagnosticResults
  study_statistics?: StudyStatistics
  preferences?: UserPreferences
}

export interface DiagnosticResults {
  competencia_lectora: number
  matematica_m1: number
  matematica_m2: number
  historia: number
  ciencias: number
  overall_score: number
  completed_at: string
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
}

export interface StudyStatistics {
  total_study_minutes: number
  current_streak_days: number
  max_streak_days: number
  sessions_completed: number
  average_score: number
  improvement_rate: number
  favorite_subjects: string[]
  study_time_by_subject: Record<string, number>
}

export interface UserPreferences {
  study_reminders: boolean
  email_notifications: boolean
  daily_goal_minutes: number
  preferred_study_time: 'morning' | 'afternoon' | 'evening' | 'night'
  difficulty_preference: 'adaptive' | 'easy' | 'medium' | 'hard'
  theme: 'light' | 'dark' | 'system'
  language: 'es' | 'en'
}

// Enums para mejor tipado
export enum GradeLevel {
  SEPTIMO = '7mo_basico',
  OCTAVO = '8vo_basico',
  PRIMERO = '1ro_medio',
  SEGUNDO = '2do_medio',
  TERCERO = '3ro_medio',
  CUARTO = '4to_medio',
  GRADUATE = 'egresado'
}

export enum Region {
  ANTOFAGASTA = 'antofagasta',
  ATACAMA = 'atacama',
  COQUIMBO = 'coquimbo',
  VALPARAISO = 'valparaiso',
  METROPOLITANA = 'metropolitana',
  OHIGGINS = 'ohiggins',
  MAULE = 'maule',
  NUBLE = 'nuble',
  BIOBIO = 'biobio',
  ARAUCANIA = 'araucania',
  LOS_RIOS = 'los_rios',
  LOS_LAGOS = 'los_lagos',
  AYSEN = 'aysen',
  MAGALLANES = 'magallanes',
  ARICA = 'arica_parinacota',
  TARAPACA = 'tarapaca'
}

export enum TestType {
  COMPETENCIA_LECTORA = 'competencia_lectora',
  MATEMATICA_M1 = 'matematica_m1',
  MATEMATICA_M2 = 'matematica_m2',
  HISTORIA = 'historia',
  CIENCIAS = 'ciencias'
}
