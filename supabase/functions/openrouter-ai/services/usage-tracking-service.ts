
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MonitoringService } from "./monitoring-service.ts";
import { METRICS_CONFIG } from "../config.ts";

// Crear cliente Supabase para interactuar con la base de datos
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Interface para parámetros de seguimiento de uso del modelo
 */
interface ModelUsageParams {
  model: string;
  success: boolean;
  duration: number;
  status?: number;
  error?: string;
  requestId?: string;
  userId?: string;
  actionType?: string;
  tokenCount?: number;
  metadata?: Record<string, any>;
}

/**
 * Registra el uso del modelo en la base de datos
 */
export async function trackModelUsage(params: ModelUsageParams): Promise<void> {
  // Si el seguimiento está desactivado, salir temprano
  if (!METRICS_CONFIG.ENABLE_TRACKING) return;

  try {
    const {
      model,
      success,
      duration,
      status,
      error,
      requestId,
      userId,
      actionType = "chat_completion",
      tokenCount,
      metadata = {}
    } = params;

    // Preparar datos para inserción
    const usageData = {
      model_name: model,
      action_type: actionType,
      response_time_ms: duration,
      success,
      token_count: tokenCount,
      user_id: userId,
      metadata: {
        ...metadata,
        ...(status && { status }),
        ...(error && { error }),
        ...(requestId && { requestId })
      }
    };

    // Insertar en la base de datos
    const { error: dbError } = await supabase
      .from('ai_model_usage')
      .insert(usageData);

    if (dbError) {
      throw dbError;
    }

    MonitoringService.debug('Uso del modelo registrado correctamente', { model, success, duration });
  } catch (error) {
    MonitoringService.error('Error al registrar uso del modelo en BD:', error);
    // No propagar error para evitar interrumpir el flujo principal
  }
}

/**
 * Registra un prompt optimizado en la base de datos
 */
export async function storeOptimizedPrompt(
  name: string,
  description: string,
  promptText: string,
  modelName: string,
  promptType: string,
  parameters: Record<string, any> = {}
): Promise<string | null> {
  // Si el almacenamiento de prompts está desactivado, salir temprano
  if (!METRICS_CONFIG.STORE_PROMPTS) return null;

  try {
    const promptData = {
      name,
      description,
      prompt_text: promptText,
      model_name: modelName,
      prompt_type: promptType,
      parameters,
      version: 1 // Versión inicial
    };

    const { data, error } = await supabase
      .from('ai_prompts')
      .insert(promptData)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  } catch (error) {
    MonitoringService.error('Error al almacenar prompt optimizado:', error);
    return null;
  }
}

/**
 * Actualiza la puntuación de efectividad de un prompt
 */
export async function updatePromptEffectiveness(
  promptId: string,
  score: number,
  feedback?: string
): Promise<void> {
  if (!METRICS_CONFIG.STORE_PROMPTS) return;

  try {
    const { error } = await supabase
      .from('ai_prompts')
      .update({
        effectiveness_score: score,
        updated_at: new Date().toISOString()
      })
      .eq('id', promptId);

    if (error) {
      throw error;
    }

    // Si hay retroalimentación, almacenarla en métricas
    if (feedback) {
      await storeGenerationMetrics({
        feedback,
        user_rating: Math.round(score * 5) // Convertir a escala 0-5
      });
    }
  } catch (error) {
    MonitoringService.error('Error al actualizar efectividad del prompt:', error);
  }
}

/**
 * Almacena métricas de calidad de generación
 */
export async function storeGenerationMetrics(metrics: {
  generation_id?: string;
  accuracy_score?: number;
  relevance_score?: number;
  creativity_score?: number;
  user_rating?: number;
  feedback?: string;
}): Promise<void> {
  try {
    const { error } = await supabase
      .from('ai_generation_metrics')
      .insert(metrics);

    if (error) {
      throw error;
    }
  } catch (error) {
    MonitoringService.error('Error al almacenar métricas de generación:', error);
  }
}

/**
 * Almacena contenido en caché para reutilización
 */
export async function storeContentInCache(
  contentType: string,
  contentKey: string,
  content: any,
  ttlHours: number = 24
): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + ttlHours);

    const { error } = await supabase
      .from('ai_content_cache')
      .insert({
        content_type: contentType,
        content_key: contentKey,
        content,
        expires_at: expiresAt.toISOString()
      })
      .onConflict(['content_type', 'content_key'])
      .merge();

    if (error) {
      throw error;
    }
    
    MonitoringService.debug('Contenido almacenado en caché', { contentType, contentKey });
  } catch (error) {
    MonitoringService.error('Error al almacenar contenido en caché:', error);
  }
}

/**
 * Recupera contenido de la caché
 */
export async function getContentFromCache(
  contentType: string,
  contentKey: string
): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('ai_content_cache')
      .select('content, expires_at, hit_count')
      .eq('content_type', contentType)
      .eq('content_key', contentKey)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Verificar si el contenido ha expirado
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      MonitoringService.debug('Contenido en caché expirado', { contentType, contentKey });
      return null;
    }

    // Incrementar contador de hits (asíncronamente para no bloquear)
    supabase
      .from('ai_content_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('content_type', contentType)
      .eq('content_key', contentKey)
      .then()
      .catch(err => MonitoringService.error('Error al actualizar hit_count:', err));

    return data.content;
  } catch (error) {
    MonitoringService.error('Error al recuperar contenido de caché:', error);
    return null;
  }
}

/**
 * Limpia contenido expirado de la caché
 */
export async function cleanExpiredCacheContent(): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('ai_content_cache')
      .delete()
      .lt('expires_at', new Date().toISOString())
      .select('id');

    if (error) {
      throw error;
    }

    return data?.length || 0;
  } catch (error) {
    MonitoringService.error('Error al limpiar contenido expirado de caché:', error);
    return 0;
  }
}
