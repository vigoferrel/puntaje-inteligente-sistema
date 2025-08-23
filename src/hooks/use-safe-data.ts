import { useState, useCallback, useEffect } from 'react';

interface SafeDataOptions {
  defaultValue?: any;
  validator?: (data: any) => boolean;
  transformer?: (data: any) => any;
  retryAttempts?: number;
  retryDelay?: number;
}

export const useSafeData = <T>(
  dataFetcher: () => Promise<T> | T,
  options: SafeDataOptions = {}
) => {
  const {
    defaultValue = null,
    validator = (data: any) => data !== null && data !== undefined,
    transformer = (data: any) => data,
    retryAttempts = 3,
    retryDelay = 1000
  } = options;

  const [data, setData] = useState<T | null>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const safeTransform = useCallback((rawData: any): T => {
    try {
      if (!validator(rawData)) {
        throw new Error('Data validation failed');
      }
      return transformer(rawData);
    } catch (err) {
      console.warn('Data transformation failed, using fallback:', err);
      return defaultValue;
    }
  }, [validator, transformer, defaultValue]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const rawData = await dataFetcher();
      const safeData = safeTransform(rawData);
      setData(safeData);
    } catch (err) {
      console.error('Data fetching failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Retry logic
      if (retryCount < retryAttempts) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, retryDelay);
      } else {
        setData(defaultValue);
      }
    } finally {
      setIsLoading(false);
    }
  }, [dataFetcher, safeTransform, retryCount, retryAttempts, retryDelay, defaultValue]);

  const retry = useCallback(() => {
    setRetryCount(0);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    retryCount,
    retry,
    refetch: fetchData
  };
};

// Utilidades para validación de datos específicos
export const validators = {
  isArray: (data: any) => Array.isArray(data),
  isObject: (data: any) => typeof data === 'object' && data !== null && !Array.isArray(data),
  isString: (data: any) => typeof data === 'string',
  isNumber: (data: any) => typeof data === 'number' && !isNaN(data),
  isBoolean: (data: any) => typeof data === 'boolean',
  isNotEmpty: (data: any) => {
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'string') return data.trim().length > 0;
    if (typeof data === 'object') return Object.keys(data).length > 0;
    return data !== null && data !== undefined;
  }
};

// Transformadores comunes
export const transformers = {
  ensureArray: (data: any) => Array.isArray(data) ? data : [],
  ensureObject: (data: any) => typeof data === 'object' && data !== null ? data : {},
  ensureString: (data: any) => String(data || ''),
  ensureNumber: (data: any) => {
    const num = Number(data);
    return isNaN(num) ? 0 : num;
  },
  ensureBoolean: (data: any) => Boolean(data),
  sanitizeObject: (data: any, allowedKeys: string[]) => {
    if (typeof data !== 'object' || data === null) return {};
    const sanitized: any = {};
    allowedKeys.forEach(key => {
      if (key in data) {
        sanitized[key] = data[key];
      }
    });
    return sanitized;
  }
};
