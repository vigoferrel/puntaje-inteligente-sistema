
import { supabase } from "@/integrations/supabase/client";

/**
 * Servicio de optimización RLS para resolver problemas de performance
 * Implementa cache de autenticación sin abstracciones genéricas problemáticas
 */

let userIdCache: string | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 segundos

export class OptimizedRLSService {
  
  /**
   * Obtiene el user_id actual con cache para evitar re-evaluaciones
   */
  static async getCurrentUserId(): Promise<string | null> {
    const now = Date.now();
    
    // Usar cache si está vigente
    if (userIdCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return userIdCache;
    }
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        userIdCache = null;
        cacheTimestamp = now;
        return null;
      }
      
      userIdCache = user.id;
      cacheTimestamp = now;
      return userIdCache;
      
    } catch (error) {
      console.error('Error getting current user ID:', error);
      userIdCache = null;
      cacheTimestamp = now;
      return null;
    }
  }
  
  /**
   * Invalida el cache de usuario (llamar al hacer logout/login)
   */
  static invalidateUserCache(): void {
    userIdCache = null;
    cacheTimestamp = 0;
  }
  
  /**
   * Inicializa el listener de cambios de autenticación
   */
  static initializeAuthListener(): void {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT' || event === 'SIGNED_IN') {
        this.invalidateUserCache();
      }
    });
  }
  
  /**
   * Verifica si el usuario actual es admin (cached)
   */
  static async isCurrentUserAdmin(): Promise<boolean> {
    const userId = await this.getCurrentUserId();
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();
      
      if (error || !data) return false;
      
      // Lógica simple de admin - mejorar según necesidades
      return data.email?.endsWith('@admin.com') || false;
      
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}

// Inicializar el listener al cargar el módulo
OptimizedRLSService.initializeAuthListener();
