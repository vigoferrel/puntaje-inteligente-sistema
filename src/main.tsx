
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Configuración global de performance
if (typeof window !== 'undefined') {
  // Optimizaciones para tracking prevention
  Object.defineProperty(window, 'storage_optimization_enabled', {
    value: true,
    writable: false,
  });
  
  // Configurar performance monitoring
  if ('performance' in window && 'mark' in window.performance) {
    performance.mark('app-start');
  }
  
  // Error handling global optimizado
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    // No prevenir default para permitir que el sistema se recupere
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance measurement
if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('mark' in window.performance && 'measure' in window.performance) {
        performance.mark('app-loaded');
        performance.measure('app-load-time', 'app-start', 'app-loaded');
        
        const measure = performance.getEntriesByName('app-load-time')[0];
        if (measure) {
          console.log(`🚀 App loaded in ${Math.round(measure.duration)}ms`);
        }
      }
    }, 0);
  });
}
