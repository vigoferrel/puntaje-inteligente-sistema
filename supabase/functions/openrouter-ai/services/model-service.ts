
import { config, MODELS, MODEL_CONFIGS, METRICS_CONFIG } from "../config.ts";
import { getOpenRouterHeaders, createErrorResponse, ServiceResult } from "./base-service.ts";
import { handleApiError, processSuccessfulResponse } from "./error-handler.ts";
import { MonitoringService } from "./monitoring-service.ts";
import { trackModelUsage } from "./usage-tracking-service.ts";

// Re-export from new modular services
import { attemptModelRequest, generateRequestId } from "./model/request-service.ts";
import { callOpenRouter } from "./model/fallback-strategy.ts";

// Re-export for backward compatibility
export { attemptModelRequest, callOpenRouter, generateRequestId };
