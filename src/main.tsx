
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ultraStabilityLayer } from './core/system/UltraStabilityLayer';

// Ultra-Silent System v2024.4 con Estabilidad Total
class UltraSilentCompatibilityLayer {
  private static instance: UltraSilentCompatibilityLayer;
  private isInitialized = false;
  
  static getInstance(): UltraSilentCompatibilityLayer {
    if (!UltraSilentCompatibilityLayer.instance) {
      UltraSilentCompatibilityLayer.instance = new UltraSilentCompatibilityLayer();
    }
    return UltraSilentCompatibilityLayer.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Esperar a que el sistema de estabilidad esté listo
      await ultraStabilityLayer.waitForStability();
      
      const config = ultraStabilityLayer.getOptimizedConfig();
      
      // Configuración ultra-optimizada basada en el estado del sistema
      (window as any).__ULTRA_STABILITY_CONFIG__ = config;
      (window as any).__ENVIRONMENT_STABLE__ = true;
      (window as any).__SYSTEM_STATUS__ = ultraStabilityLayer.getSystemStatus();
      
      this.isInitialized = true;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Ultra-Silent System v2024.4 with Total Stability Initialized');
      }
    } catch (error) {
      // Sistema de fallback ultra-robusto
      (window as any).__ENVIRONMENT_STABLE__ = false;
      (window as any).__EMERGENCY_MODE__ = true;
    }
  }
}

// Inicialización asíncrona mejorada
const initializeApplication = async () => {
  const silentLayer = UltraSilentCompatibilityLayer.getInstance();
  await silentLayer.initialize();

  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container, {
    identifierPrefix: 'paes-ultra-stable',
  });

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Inicializar con manejo de errores total
initializeApplication().catch((error) => {
  console.error('Critical application initialization error:', error);
  
  // Fallback de último recurso
  const container = document.getElementById('root');
  if (container) {
    container.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #1e40af, #7c3aed); color: white; font-family: system-ui;">
        <div style="text-align: center;">
          <h1>Sistema PAES - Modo Seguro</h1>
          <p>La aplicación se está ejecutando en modo de recuperación.</p>
          <button onclick="window.location.reload()" style="background: white; color: #1e40af; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 16px;">
            Reiniciar Aplicación
          </button>
        </div>
      </div>
    `;
  }
});
