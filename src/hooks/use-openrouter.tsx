import { useState, useCallback } from 'react';

export type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export interface OpenRouterRequest {
  action: string;
  payload: Record<string, any>;
}

export function useOpenRouter() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connected');
  const [lastError, setLastError] = useState<Error | null>(null);
  const [lastRequest, setLastRequest] = useState<OpenRouterRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  /**
   * Reset connection status and retry last operation
   */
  const resetConnectionStatus = useCallback(() => {
    setConnectionStatus('connecting');
    if (lastRequest) {
      return callOpenRouter(lastRequest);
    }
    setConnectionStatus('connected');
    return Promise.resolve(null);
  }, [lastRequest]);
  
  /**
   * Retry last API operation
   */
  const retryLastOperation = useCallback(() => {
    if (lastRequest) {
      return callOpenRouter(lastRequest);
    }
    return Promise.resolve(null);
  }, [lastRequest]);
  
  /**
   * Process image with vision model
   */
  const processImage = useCallback((imageData: string, prompt: string, context?: string) => {
    return callOpenRouter<any>({
      action: "process_image",
      payload: { imageData, prompt, context }
    });
  }, []);

  /**
   * Call OpenRouter endpoint with better error handling
   */
  const callOpenRouter = useCallback(async <T,>(request: OpenRouterRequest, silent: boolean = false): Promise<T> => {
    try {
      if (!silent) {
        setIsLoading(true);
        setLastRequest(request);
      }
      
      setConnectionStatus('connecting');
      
      // Configure the request
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      // Parse JSON response with fallback
      const result = await response.json();
      
      setConnectionStatus('connected');
      setLastError(null);
      
      return result as T;
    } catch (error) {
      console.error('Error calling OpenRouter:', error);
      
      // Update connection status
      setConnectionStatus('disconnected');
      
      // Store the error for retry mechanism
      setLastError(error instanceof Error ? error : new Error(String(error)));
      
      // Return default value or re-throw depending on silent flag
      if (silent) {
        return {} as T;
      }
      
      throw error;
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);
  
  return {
    callOpenRouter,
    retryLastOperation,
    resetConnectionStatus,
    processImage,
    isLoading,
    lastError,
    connectionStatus
  };
}
