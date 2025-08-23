
// Declaraciones globales unificadas para propiedades customizadas del window v5.0 - Sistema Ultra-Silencioso
declare global {
  interface Window {
    importMeta?: {
      env: {
        MODE: string;
        DEV: boolean;
        PROD: boolean;
        VITE_APP_VERSION?: string;
      };
      url: string;
    };
    
    // Banderas de detección de entorno
    __TRACKING_PREVENTION_DETECTED__?: boolean;
    __SKIP_GPT_ENGINEER__?: boolean;
    __EDGE_DETECTED__?: boolean;
    __SAFARI_DETECTED__?: boolean;
    __FIREFOX_DETECTED__?: boolean;
    __CSP_RESTRICTIVE__?: boolean;
    __GPT_ENGINEER_LOADED__?: boolean;
    __ENVIRONMENT_SAFE__?: boolean;
    __ENVIRONMENT_SAFETY_LEVEL__?: 'SAFE' | 'RESTRICTED' | 'CRITICAL_ERROR';
    
    // Propiedades del sistema de logging ultra-silencioso
    __TOTAL_SILENCE_MODE__?: boolean;
    __CONSOLE_INTERCEPTED__?: boolean;
    __APP_VERSION__?: string;
    
    // Función de emergencia para desarrollo crítico
    emergencyLog?: (...args: any[]) => void;
    
    // Función maestra de detección de spam
    isUltraSpam?: (message: string) => boolean;
    
    // Editor de Aplicación
appEditor?: {
      isActive: boolean;
      version: string;
      features?: {
        selectMode?: boolean;
        devMode?: boolean;
        codeEditing?: boolean;
        aiAssist?: boolean;
        realTimePreview?: boolean;
      };
    };
    
    // Función de garbage collection
    gc?: () => void;
    
    // GPT Engineer relacionado
    gptengineer?: any;
  }
}

export {};
