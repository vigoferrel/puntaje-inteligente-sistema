
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MonitoringService } from "../monitoring-service.ts";

// Create Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Stores content in cache for reuse
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
    
    MonitoringService.debug('Content stored in cache', { contentType, contentKey });
  } catch (error) {
    MonitoringService.error('Error storing content in cache:', error);
  }
}

/**
 * Retrieves content from cache
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

    // Check if content has expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      MonitoringService.debug('Cached content expired', { contentType, contentKey });
      return null;
    }

    // Increment hit count (asynchronously to avoid blocking)
    supabase
      .from('ai_content_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('content_type', contentType)
      .eq('content_key', contentKey)
      .then()
      .catch(err => MonitoringService.error('Error updating hit_count:', err));

    return data.content;
  } catch (error) {
    MonitoringService.error('Error retrieving content from cache:', error);
    return null;
  }
}

/**
 * Cleans expired content from cache
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
    MonitoringService.error('Error cleaning expired cache content:', error);
    return 0;
  }
}
