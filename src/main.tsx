
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Configuración optimizada para Lovable v2024 con corrección de errores
if (typeof window !== 'undefined') {
  // Performance monitoring mejorado
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark('lovable-app-start');
  }
  
  // Sistema mejorado de filtrado de errores para Lovable
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
    'ChunkLoadError'
  ];

  const isKnownError = (errorMessage: string) => {
    return knownErrorPatterns.some(pattern => 
      errorMessage?.toLowerCase().includes(pattern.toLowerCase())
    );
  };

  // Error handling optimizado para Lovable con filtrado robusto
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error?.message || String(error);
    
    if (isKnownError(errorMessage)) {
      event.preventDefault();
      return;
    }
    
    // Solo mostrar errores críticos no filtrados en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 Unhandled rejection (no filtrado):', error);
    }
  });

  // Filtrado mejorado para errores de script con más patrones
  window.addEventListener('error', (event) => {
    const error = event.error;
    const errorMessage = error?.message || event.message || '';
    
    if (isKnownError(errorMessage)) {
      event.preventDefault();
      return;
    }

    // Solo procesar errores no filtrados
    if (process.env.NODE_ENV === 'development') {
      console.warn('🔍 Error de script (no filtrado):', errorMessage);
    }
  });
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

// Performance measurement para Lovable
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
