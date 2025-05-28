
// Declaraciones globales para propiedades customizadas del window v2.0
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
  }
}

export {};
