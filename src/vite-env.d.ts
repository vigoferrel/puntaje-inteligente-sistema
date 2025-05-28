
/// <reference types="vite/client" />

// Declaraciones globales para Lovable v2024
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
    // Lovable v2024 specific properties
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
