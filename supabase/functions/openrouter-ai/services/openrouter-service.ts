
// Este archivo re-exporta todas las funcionalidades desde la nueva estructura modular
// para mantener compatibilidad con el código existente

export { callOpenRouter, attemptModelRequest } from "./model-service.ts";
export { callVisionModel } from "./vision-service.ts";
export { handleApiError, processSuccessfulResponse } from "./error-handler.ts";
export { getOpenRouterHeaders, createServiceResponse, createErrorResponse } from "./base-service.ts";
export type { ServiceResult } from "./base-service.ts";
