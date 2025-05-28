
// Declaraciones globales para propiedades customizadas del window
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
  }
}

export {};
