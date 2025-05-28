
/// <reference types="vite/client" />

// Declaraciones globales para Lovable 2024.2
declare global {
  interface Window {
    importMeta?: {
      env: {
        MODE: string;
        DEV: boolean;
        PROD: boolean;
      };
      url: string;
    };
    __TRACKING_PREVENTION_DETECTED__?: boolean;
    __SKIP_GPT_ENGINEER__?: boolean;
    __EDGE_DETECTED__?: boolean;
    __CSP_RESTRICTIVE__?: boolean;
    __GPT_ENGINEER_LOADED__?: boolean;
    __LOVABLE_VERSION__?: string;
    __ENVIRONMENT_SAFE__?: boolean;
    __ENVIRONMENT_SAFETY_LEVEL__?: 'SAFE' | 'RESTRICTED' | 'CRITICAL_ERROR';
    
    // Lovable 2024.2 specific properties
    lovableEditor?: {
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
    gptengineer?: any;
    gc?: () => void;
  }
}

// Vite client types for latest version
interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly VITE_LOVABLE_VERSION?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
