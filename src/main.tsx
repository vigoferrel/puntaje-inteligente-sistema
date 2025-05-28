
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Configuración global ultra-optimizada
if (typeof window !== 'undefined') {
  // Performance monitoring optimizado
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark('app-start');
  }
  
  // Error handling ultra-filtrado para reducir spam
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Lista extendida de errores conocidos a filtrar
    const knownErrors = [
      'Access is denied',
      'QuotaExceeded',
      'storage',
      'import.meta',
      'lockdown',
      'SES_',
      'vr',
      'ambient-light-sensor',
      'battery',
      'preloaded using link preload but not used',
      'BloomFilter error',
      'Cannot use \'import.meta\' outside a module'
    ];
    
    if (knownErrors.some(known => error?.message?.includes(known))) {
      event.preventDefault();
      return;
    }
    
    // Solo mostrar errores realmente críticos
    if (process.env.NODE_ENV === 'development') {
      console.warn('Unhandled rejection:', error);
    }
  });

  // Filtrado mejorado para errores de script
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    const knownScriptErrors = [
      'Minified React error #185',
      'import.meta',
      'Access is denied',
      'Cannot use \'import.meta\' outside a module',
      'lockdown',
      'SES_',
      'gptengineer'
    ];
    
    if (knownScriptErrors.some(known => error?.message?.includes(known))) {
      event.preventDefault();
      return;
    }
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

// Renderizado simplificado y estable
const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Render error:', error);
    root.render(<App />);
  }
};

// Renderizado coordinado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Performance measurement simplificado
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('mark' in window.performance && 'measure' in window.performance) {
        try {
          performance.mark('app-loaded');
          performance.measure('app-load-time', 'app-start', 'app-loaded');
          
          const measure = performance.getEntriesByName('app-load-time')[0];
          if (measure && process.env.NODE_ENV === 'development') {
            console.log(`🚀 App cargada en ${Math.round(measure.duration)}ms`);
          }
        } catch (error) {
          // Performance API no disponible
        }
      }
    }, 100);
  });
}
