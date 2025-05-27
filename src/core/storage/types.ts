
/**
 * TIPOS PARA UNIFIED STORAGE SYSTEM v6.0
 * Tipos simplificados para evitar conflictos de TypeScript
 */

export interface CacheDataTypes {
  'unified_education_state': any;
  'lectoguia_chat_settings_v2': any;
  'diagnostic_test_progress_v3': any;
  'user_preferences': Record<string, string>;
  'system_metrics': any;
  'theme_preference': 'dark' | 'light';
  'diagnostic_test_progress_unified': any;
  'learning_plans_unified': any;
  'current_plan_unified': any;
  'plan_progress_unified': any;
  'cache_timestamp_unified': number;
  'learning_plans_hook_unified': any;
  'current_plan_hook_unified': any;
  'plan_progress_hook_unified': any;
  'cache_timestamp_hook_unified': number;
  'lectoguia_chat_settings_unified': any;
  [key: string]: any;
}

// Simplificado: solo string para evitar conflictos de tipos
export type CacheKey = string;

export interface TypeSafeBatchItem {
  key: CacheKey;
  value: any;
}

// Helper para convertir keys tipados automáticamente
export function createCacheKey<K extends keyof CacheDataTypes>(key: K): CacheKey {
  return key as string;
}
