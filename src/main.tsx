
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ultraSilentLogger } from './core/logging/UltraSilentLogger';

// Configuración Ultra-Silenciosa 2024.2
class UltraSilentCompatibilityLayer {
  private static instance: UltraSilentCompatibilityLayer;
  private isInitialized = false;
  
  static getInstance(): UltraSilentCompatibilityLayer {
    if (!UltraSilentCompatibilityLayer.instance) {
      UltraSilentCompatibilityLayer.instance = new UltraSilentCompatibilityLayer();
    }
    return UltraSilentCompatibilityLayer.instance;
  }

  private setupSilentOperations(): void {
    // Verificar que la interceptación global esté activa
    if (!window.__CONSOLE_INTERCEPTED__) {
      // Backup de interceptación si falló la del HTML
      const silentConsole = () => {};
      ['log', 'warn', 'error', 'info', 'debug', 'trace', 'table', 'group', 'groupEnd'].forEach(method => {
        console[method as keyof Console] = silentConsole as any;
      });
    }

    // Configuración de entorno silencioso
    window.__ENVIRONMENT_SAFE__ = true;
    window.__ENVIRONMENT_SAFETY_LEVEL__ = 'SAFE';
  }

  private setupPerformanceOptimizations(): void {
    // Optimizaciones sin logs
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        if (typeof window.gc === 'function') {
          window.gc();
        }
      });
    }
  }

  initialize(): void {
    if (this.isInitialized) return;

    try {
      this.setupSilentOperations();
      this.setupPerformanceOptimizations();
      
      this.isInitialized = true;
      
      // Solo en emergencia durante desarrollo
      if (process.env.NODE_ENV === 'development') {
        ultraSilentLogger.emergency('Ultra-Silent System Initialized');
      }
    } catch (error) {
      // Silenciar errores de inicialización
    }
  }
}

// Inicialización Ultra-Silenciosa
const silentLayer = UltraSilentCompatibilityLayer.getInstance();
silentLayer.initialize();

// React 18 Ultra-Optimizado
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container, {
  identifierPrefix: 'paes-ultra-silent',
});

// Renderizado silencioso
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
