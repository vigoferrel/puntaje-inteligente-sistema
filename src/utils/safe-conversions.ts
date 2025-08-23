/**
 * Utilidades para conversiones seguras de objetos a valores primitivos
 * Previene el error "Cannot convert object to primitive value"
 */

/**
 * Convierte de forma segura cualquier valor a string
 */
export const safeToString = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  
  if (typeof value === 'object') {
    try {
      // Intentar JSON.stringify primero
      return JSON.stringify(value);
    } catch (error) {
      // Si falla JSON.stringify, usar toString() con manejo de errores
      try {
        return value.toString();
      } catch (toStringError) {
        console.warn('Error converting object to string:', toStringError);
        return '[Object]';
      }
    }
  }
  
  return String(value);
};

/**
 * Convierte de forma segura cualquier valor a number
 */
export const safeToNumber = (value: unknown): number => {
  if (value === null || value === undefined) {
    return 0;
  }
  
  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  if (typeof value === 'boolean') {
    return value ? 1 : 0;
  }
  
  if (typeof value === 'object') {
    try {
      // Intentar convertir el objeto a string y luego a número
      const stringValue = safeToString(value);
      const parsed = parseFloat(stringValue);
      return isNaN(parsed) ? 0 : parsed;
    } catch (error) {
      console.warn('Error converting object to number:', error);
      return 0;
    }
  }
  
  return 0;
};

/**
 * Convierte de forma segura cualquier valor a boolean
 */
export const safeToBoolean = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'number') {
    return value !== 0 && !isNaN(value);
  }
  
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  
  if (typeof value === 'object') {
    // Para objetos, considerar como true si no está vacío
    try {
      return Object.keys(value).length > 0;
    } catch (error) {
      return false;
    }
  }
  
  return Boolean(value);
};

/**
 * Convierte de forma segura cualquier valor a un objeto
 */
export const safeToObject = (value: unknown): Record<string, any> => {
  if (value === null || value === undefined) {
    return {};
  }
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (error) {
      return { value };
    }
  }
  
  return { value };
};

/**
 * Convierte de forma segura cualquier valor a un array
 */
export const safeToArray = (value: unknown): any[] => {
  if (value === null || value === undefined) {
    return [];
  }
  
  if (Array.isArray(value)) {
    return value;
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [value];
    } catch (error) {
      return [value];
    }
  }
  
  if (typeof value === 'object') {
    return Object.values(value);
  }
  
  return [value];
};

/**
 * Función de utilidad para debuggear valores problemáticos
 */
export const debugValue = (value: unknown, context: string = 'unknown'): void => {
  console.group(`🔍 Debug Value - ${context}`);
  console.log('Type:', typeof value);
  console.log('Value:', value);
  console.log('Constructor:', value?.constructor?.name);
  
  if (typeof value === 'object' && value !== null) {
    try {
      console.log('Keys:', Object.keys(value));
      console.log('Stringified:', JSON.stringify(value, null, 2));
    } catch (error) {
      console.log('Error stringifying:', error);
    }
  }
  
  console.groupEnd();
};
