
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MonitoringService } from "../monitoring-service.ts";
import { METRICS_CONFIG } from "../../config.ts";
import { storeGenerationMetrics } from "./metrics-service.ts";

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Stores an optimized prompt in the database
 */
export async function storeOptimizedPrompt(
  name: string,
  description: string,
  promptText: string,
  modelName: string,
  promptType: string,
  parameters: Record<string, any> = {}
): Promise<string | null> {
  // If prompt storage is disabled, exit early
  if (!METRICS_CONFIG.STORE_PROMPTS) return null;

  try {
    const promptData = {
      name,
      description,
      prompt_text: promptText,
      model_name: modelName,
      prompt_type: promptType,
      parameters,
      version: 1 // Initial version
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
    MonitoringService.error('Error storing optimized prompt:', error);
    return null;
  }
}

/**
 * Updates the effectiveness score of a prompt
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

    // If there's feedback, store it in metrics
    if (feedback) {
      await storeGenerationMetrics({
        feedback,
        user_rating: Math.round(score * 5) // Convert to 0-5 scale
      });
    }
  } catch (error) {
    MonitoringService.error('Error updating prompt effectiveness:', error);
  }
}
