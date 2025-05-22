
// Este archivo ahora re-exporta todas las funcionalidades desde la nueva estructura modular
// para mantener compatibilidad con el código existente

export { 
  createSuccessResponse, 
  createErrorResponse,
  processAIResponse 
} from "./response-formatters.ts";

export { 
  extractJsonFromContent 
} from "./json-extractor.ts";

export { 
  createDiagnosticFallback 
} from "./fallback-generators.ts";
