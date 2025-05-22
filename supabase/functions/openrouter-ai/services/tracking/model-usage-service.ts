
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MonitoringService } from "../monitoring-service.ts";
import { METRICS_CONFIG } from "../../config.ts";

// Create Supabase client to interact with the database
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Interface for model usage tracking parameters
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
 * Records model usage in the database
 */
export async function trackModelUsage(params: ModelUsageParams): Promise<void> {
  // If tracking is disabled, exit early
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

    // Prepare data for insertion
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

    // Insert into the database
    const { error: dbError } = await supabase
      .from('ai_model_usage')
      .insert(usageData);

    if (dbError) {
      throw dbError;
    }

    MonitoringService.debug('Model usage recorded successfully', { model, success, duration });
  } catch (error) {
    MonitoringService.error('Error recording model usage in DB:', error);
    // Don't propagate error to avoid interrupting the main flow
  }
}
