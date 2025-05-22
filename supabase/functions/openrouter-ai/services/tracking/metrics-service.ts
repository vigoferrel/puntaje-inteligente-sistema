
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MonitoringService } from "../monitoring-service.ts";

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Stores quality metrics for AI content generation
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
    MonitoringService.error('Error storing generation metrics:', error);
  }
}
