
/// <reference types="vite/client" />

// Vite client types para la versión más reciente
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
