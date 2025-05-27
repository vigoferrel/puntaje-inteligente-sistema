
/**
 * SISTEMA DE TIPOS PARA STORAGE v1.0
 * Tipos seguros y específicos para cada tipo de dato
 */

import { LearningPlan, PlanProgress } from "@/types/learning-plan";

// Tipos específicos para cada clave de cache
export interface CacheDataTypes {
  'learning_plans_v2': LearningPlan[];
  'current_plan_v2': LearningPlan | null;
  'plan_progress_v2': Record<string, PlanProgress>;
  'cache_timestamp_v2': number;
  'diagnostic_test_progress_v2': any;
  'lectoguia_chat_settings_v2': any;
  'user_preferences_cache_v2': Record<string, string>;
  'cv_emergency_state': any;
}

// Tipo para claves válidas
export type CacheKey = keyof CacheDataTypes;

// Tipo para elementos de batch
export interface BatchItem<K extends CacheKey = CacheKey> {
  key: K;
  value: CacheDataTypes[K];
}

// Interfaz type-safe para batch operations
export interface TypeSafeBatchItem {
  key: string;
  value: any;
}

