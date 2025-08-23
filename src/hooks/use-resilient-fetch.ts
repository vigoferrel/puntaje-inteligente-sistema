import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  exponentialBase?: number;
  shouldRetry?: (error: any, attempt: number) => boolean;
  onRetry?: (error: any, attempt: number) => void;
}

interface FetchResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  retryCount: number;
}

const defaultShouldRetry = (error: any, attempt: number): boolean => {
  // Don't retry on client errors (4xx) except for rate limiting
  if (error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false;
  }
  
  // Retry on network errors and server errors
  return attempt < 3 && (
    !error.status || // Network errors
    error.status >= 500 || // Server errors
    error.status === 429 || // Rate limiting
    error.message?.includes('ERR_INSUFFICIENT_RESOURCES') ||
    error.message?.includes('ERR_NETWORK') ||
    error.message?.includes('ERR_INTERNET_DISCONNECTED')
  );
};

export const useResilientFetch = <T>() => {
  const [state, setState] = useState<FetchResult<T>>({
    data: null,
    error: null,
    isLoading: false,
    retryCount: 0
  });

  const exponentialBackoff = (attempt: number, baseDelay: number, maxDelay: number, exponentialBase: number): number => {
    const delay = Math.min(baseDelay * Math.pow(exponentialBase, attempt), maxDelay);
    // Add jitter to prevent thundering herd
    return delay + Math.random() * delay * 0.1;
  };

  const fetchWithRetry = useCallback(async (
    fetchFn: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> => {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      exponentialBase = 2,
      shouldRetry = defaultShouldRetry,
      onRetry
    } = options;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await fetchFn();
        setState({
          data: result,
          error: null,
          isLoading: false,
          retryCount: attempt
        });
        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        setState(prev => ({
          ...prev,
          error: lastError,
          retryCount: attempt
        }));

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }

        // Check if we should retry
        if (!shouldRetry(lastError, attempt)) {
          break;
        }

        // Call retry callback if provided
        if (onRetry) {
          onRetry(lastError, attempt);
        }

        // Wait before retrying
        const delay = exponentialBackoff(attempt, baseDelay, maxDelay, exponentialBase);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    setState(prev => ({
      ...prev,
      isLoading: false,
      error: lastError
    }));

    throw lastError;
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
      retryCount: 0
    });
  }, []);

  return {
    ...state,
    fetchWithRetry,
    reset
  };
};

// Specialized hook for Supabase operations
export const useSupabaseFetch = <T>() => {
  const resilientFetch = useResilientFetch<T>();

  const supabaseFetch = useCallback(async (
    operation: () => Promise<T>,
    fallback?: () => T | Promise<T>
  ): Promise<T> => {
    try {
      return await resilientFetch.fetchWithRetry(operation, {
        shouldRetry: (error, attempt) => {
          console.warn(`Supabase operation failed (attempt ${attempt + 1}):`, error.message);
          
          // Specific handling for Supabase errors
          if (error.message?.includes('ERR_INSUFFICIENT_RESOURCES')) {
            return attempt < 2; // Only retry twice for resource errors
          }
          
          return defaultShouldRetry(error, attempt);
        },
        onRetry: (error, attempt) => {
          console.log(`Retrying Supabase operation in ${Math.pow(2, attempt)} seconds...`);
        },
        baseDelay: 2000, // Longer delay for Supabase
        maxDelay: 15000
      });
    } catch (error) {
      console.error('All Supabase retries failed:', error);
      
      // If fallback is provided, use it
      if (fallback) {
        console.log('Using fallback data...');
        return await fallback();
      }
      
      throw error;
    }
  }, [resilientFetch]);

  return {
    ...resilientFetch,
    supabaseFetch
  };
};
