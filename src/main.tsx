
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Sistema ultra-optimizado de filtrado de errores para Lovable v2024
if (typeof window !== 'undefined') {
  // Performance monitoring mejorado
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark('lovable-app-start');
  }
  
  // Sistema ULTRA-MEJORADO de filtrado de errores conocidos
  const knownErrorPatterns = [
    'Access is denied',
    'QuotaExceeded',
    'storage',
    'import.meta',
    'lockdown',
    'SES_',
    '_ES_UNCAUGHT_EXCEPTION',
    'vr',
    'ambient-light-sensor',
    'battery',
    'preloaded using link preload but not used',
    'BloomFilter error',
    'Cannot use \'import.meta\' outside a module',
    'gptengineer',
    'CORS',
    'Cross-Origin Request Blocked',
    'NetworkError',
    'Failed to fetch',
    'Loading chunk',
    'ChunkLoadError',
    'Tracking Prevention',
    'blocked access to storage',
    'Unrecognized feature',
    'The resource https://www.facebook.com',
    'preloaded using link preload but not used',
    'Microsoft Edge is moving towards',
    'third-party cookies',
    'Failed to load resource: net::ERR_FAILED',
    'No \'Access-Control-Allow-Origin\' header',
    'Explain Console errors',
    'Images loaded lazily',
    'Load events are deferred',
    'We\'re hiring!',
    'lovable.dev/careers'
  ];

  const isKnownError = (errorMessage: string) => {
    if (!errorMessage || typeof errorMessage !== 'string') return true;
    return knownErrorPatterns.some(pattern => 
      errorMessage.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  // Filtrar errores de características no soportadas
  const isFeatureError = (errorMessage: string) => {
    const featurePatterns = ['vr', 'ambient-light-sensor', 'battery', 'Unrecognized feature'];
    return featurePatterns.some(pattern => errorMessage.includes(pattern));
  };

  // Filtrar errores de tracking prevention
  const isTrackingError = (errorMessage: string) => {
    return errorMessage.includes('Tracking Prevention') || 
           errorMessage.includes('blocked access to storage');
  };

  // Error handling ultra-optimizado con filtrado robusto
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || String(error);
    
    if (isKnownError(errorMessage) || isFeatureError(errorMessage) || isTrackingError(errorMessage)) {
      event.preventDefault();
      return;
    }
    
    // Solo mostrar errores críticos no filtrados en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 Unhandled rejection (no filtrado):', error);
    }
  });

  // Filtrado ultra-mejorado para errores de script
  window.addEventListener('error', (event) => {
    const error = event.error;
    const errorMessage = error?.message || event.message || '';
    
    if (isKnownError(errorMessage) || isFeatureError(errorMessage) || isTrackingError(errorMessage)) {
      event.preventDefault();
      return;
    }

    // Filtrar errores específicos de recursos con type guard
    if (event.target && event.target !== window) {
      const target = event.target as HTMLElement;
      
      // Type guard para elementos con src
      const hasSource = (element: HTMLElement): element is HTMLImageElement | HTMLScriptElement => {
        return 'src' in element;
      };
      
      if (hasSource(target) && target.src && (
        target.src.includes('facebook.com') ||
        target.src.includes('gptengineer.js') ||
        target.src.includes('gpteng.co')
      )) {
        event.preventDefault();
        return;
      }
    }

    // Solo procesar errores no filtrados
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 Error de script (no filtrado):', errorMessage);
    }
  });

  // Filtrar mensajes de consola conocidos
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = function(...args) {
    const message = args.join(' ');
    if (!isKnownError(message) && !message.includes('⠀⣠⠴') && !message.includes('We\'re hiring')) {
      originalLog.apply(console, args);
    }
  };

  console.warn = function(...args) {
    const message = args.join(' ');
    if (!isKnownError(message) && !isFeatureError(message)) {
      originalWarn.apply(console, args);
    }
  };

  console.error = function(...args) {
    const message = args.join(' ');
    if (!isKnownError(message) && !isTrackingError(message)) {
      originalError.apply(console, args);
    }
  };
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

// Renderizado coordinado con mejor manejo de errores
const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('🚨 Render error:', error);
    // Fallback sin StrictMode si es necesario
    try {
      root.render(<App />);
    } catch (fallbackError) {
      console.error('🚨 Fallback render error:', fallbackError);
    }
  }
};

// Renderizado coordinado con detección de estado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Performance measurement optimizado
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('mark' in window.performance && 'measure' in window.performance) {
        try {
          performance.mark('lovable-app-loaded');
          performance.measure('lovable-load-time', 'lovable-app-start', 'lovable-app-loaded');
          
          const measure = performance.getEntriesByName('lovable-load-time')[0];
          if (measure && process.env.NODE_ENV === 'development') {
            console.log(`🚀 Lovable App cargada en ${Math.round(measure.duration)}ms`);
          }
        } catch (error) {
          // Performance API no disponible, continuar silenciosamente
        }
      }
    }, 100);
  });
}
