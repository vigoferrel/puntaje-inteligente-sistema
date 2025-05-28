
// Declaraciones globales para propiedades customizadas del window v4.0 - Sistema Unificado
declare global {
  interface Window {
    importMeta?: {
      env: {
        MODE: string;
        DEV: boolean;
        PROD: boolean;
        VITE_LOVABLE_VERSION?: string;
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
    
    // Función maestra de detección de spam
    isUltraSpam?: (message: string) => boolean;
  }
}

export {};
