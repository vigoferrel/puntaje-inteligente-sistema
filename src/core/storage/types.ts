
/**
 * TIPOS PARA UNIFIED STORAGE SYSTEM v4.0
 */

export interface CacheDataTypes {
  'unified_education_state': any;
  'lectoguia_chat_settings_v2': any;
  'diagnostic_test_progress_v3': any;
  'user_preferences': Record<string, string>;
  'system_metrics': any;
  [key: string]: any;
}

export type CacheKey = keyof CacheDataTypes | string;
