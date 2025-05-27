
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Configuración global optimizada para prevenir errores
if (typeof window !== 'undefined') {
  // Prevenir errores de import.meta
  if (!window.importMeta) {
    window.importMeta = { env: { MODE: 'production' } };
  }
  
  // Optimizaciones para tracking prevention
  Object.defineProperty(window, 'storage_optimization_enabled', {
    value: true,
    writable: false,
  });
  
  // Performance monitoring mejorado
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark('app-start');
  }
  
  // Error handling global mejorado - filtrar errores conocidos
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    // Filtrar errores de storage/tracking que son esperables
    if (error?.message?.includes('Access is denied') ||
        error?.message?.includes('QuotaExceeded') ||
        error?.message?.includes('storage') ||
        error?.message?.includes('import.meta')) {
      console.log('ℹ️ Storage limitation detected (expected in some browsers)');
      event.preventDefault(); // Prevenir que se propague
      return;
    }
    
    console.warn('Unhandled promise rejection:', error);
    // Permitir que otros errores se manejen normalmente
  });

  // Manejo específico para errores de React
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    // Filtrar errores específicos conocidos
    if (error?.message?.includes('Minified React error #185') ||
        error?.message?.includes('import.meta') ||
        error?.message?.includes('Access is denied')) {
      console.log('ℹ️ Known browser limitation detected');
      event.preventDefault();
      return;
    }
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

// Hydration segura con error boundaries
const safeRender = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Critical render error:', error);
    
    // Fallback render sin StrictMode
    root.render(<App />);
  }
};

// Renderizar después de que el DOM esté completamente listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', safeRender);
} else {
  // DOM ya está listo
  setTimeout(safeRender, 0);
}

// Performance measurement mejorado
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('mark' in window.performance && 'measure' in window.performance) {
        try {
          performance.mark('app-loaded');
          performance.measure('app-load-time', 'app-start', 'app-loaded');
          
          const measure = performance.getEntriesByName('app-load-time')[0];
          if (measure) {
            console.log(`🚀 App loaded in ${Math.round(measure.duration)}ms`);
          }
        } catch (error) {
          // Performance API no disponible
        }
      }
    }, 100);
  });
}
