
/// <reference types="vite/client" />

// Declaraciones globales para Lovable v2024.2
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
    // Lovable v2024.2 specific properties
    lovableEditor?: {
      isActive: boolean;
      version: string;
    };
    gptengineer?: any;
  }
}

// Vite client types for latest version
interface ImportMetaEnv {
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
