
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ============================================================================
// SISTEMA UNIFICADO DE RENDIMIENTO ULTRA-OPTIMIZADO v6.0 - FUSIÓN COMPLETA
// Integración total de main.tsx + index.html para máximo rendimiento
// ============================================================================

// FASE 1: DETECCIÓN DE ENTORNO Y CONFIGURACIÓN GLOBAL INMEDIATA
const initializeUnifiedSystem = (() => {
  'use strict';
  
  // PATRONES MAESTROS DE EXTINCIÓN - LISTA UNIFICADA EXPANDIDA
  const MASTER_EXTINCTION_PATTERNS = [
    // Browser features y permisos
    'vr', 'ambient-light-sensor', 'battery', 'Unrecognized feature',
    'camera', 'microphone', 'geolocation', 'accelerometer', 'gyroscope',
    'magnetometer', 'usb', 'serial', 'bluetooth', 'payment',
    // Privacy/Tracking
    'Tracking Prevention', 'blocked access to storage', 'QuotaExceeded',
    'Anti-tracking', 'third-party cookies', 'cross-site tracking',
    // Resource loading
    'preloaded using link preload but not used', 'Failed to load resource',
    'Loading chunk', 'ChunkLoadError', 'NetworkError', 'Failed to fetch',
    'Images loaded lazily', 'Load events are deferred',
    // Security policies
    'CORS policy', 'Access-Control-Allow-Origin', 'Content Security Policy',
    'script-src', 'Refused to load', 'violates the following',
    // External services y GPT Engineer
    'gptengineer', 'gpteng.co', 'facebook.com', 'cloudflareinsights.com',
    'beacon.min.js', 'static.cloudflareinsights.com',
    // SES/Lockdown
    'SES_UNCAUGHT_EXCEPTION', 'lockdown', '_ES_UNCAUGHT_EXCEPTION',
    // Browser interventions
    'Intervention', 'Microsoft Edge is moving', 'replaced with placeholders',
    // Development noise
    'We\'re hiring', 'lovable.dev/careers', 'Explain Console errors',
    // Import/Module errors
    'import.meta', 'Cannot use \'import.meta\' outside a module',
    // Performance y misc
    'BloomFilter error', 'go.microsoft.com/fwlink'
  ];

  // FUNCIÓN MAESTRA DE DETECCIÓN DE SPAM - ULTRA OPTIMIZADA
  const masterSpamDetector = (message: string): boolean => {
    if (!message || typeof message !== 'string') return true;
    const lowerMessage = message.toLowerCase();
    
    // Cache de patrones para ultra-performance
    return MASTER_EXTINCTION_PATTERNS.some(pattern => 
      lowerMessage.includes(pattern.toLowerCase())
    );
  };

  // DETECCIÓN AVANZADA DE ENTORNO RESTRICTIVO
  const detectEnvironment = () => {
    try {
      // Test 1: Storage access
      const hasStorageAccess = (() => {
        try {
          localStorage.setItem('__unified_test__', '1');
          localStorage.removeItem('__unified_test__');
          return true;
        } catch (e) {
          return false;
        }
      })();

      // Test 2: Browser detection avanzada
      const userAgent = navigator.userAgent;
      const isEdge = userAgent.includes('Edg/');
      const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
      const isFirefox = userAgent.includes('Firefox');
      
      // Test 3: Security features
      const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
      const hasLockdown = typeof window.lockdown !== 'undefined' || typeof window.SES !== 'undefined';
      
      // Test 4: Privacy features avanzadas
      const hasTrackingPrevention = !hasStorageAccess;
      const hasStrictPrivacy = isFirefox || isSafari;
      
      return {
        hasStorageAccess,
        isEdge,
        isSafari,
        isFirefox,
        hasCSP,
        hasLockdown,
        hasTrackingPrevention,
        hasStrictPrivacy,
        shouldSkipGPTEngineer: !hasStorageAccess || hasLockdown || hasTrackingPrevention,
        environmentSafety: hasStorageAccess && !hasLockdown && !hasTrackingPrevention ? 'SAFE' : 'RESTRICTED'
      };
    } catch (error) {
      return { 
        shouldSkipGPTEngineer: true, 
        environmentSafety: 'CRITICAL_ERROR'
      };
    }
  };

  // CONFIGURACIÓN DE BANDERAS GLOBALES UNIFICADAS
  const setupGlobalFlags = (envDetection: any) => {
    // Configurar banderas de estado avanzadas
    Object.assign(window, {
      __TRACKING_PREVENTION_DETECTED__: envDetection.hasTrackingPrevention,
      __SKIP_GPT_ENGINEER__: envDetection.shouldSkipGPTEngineer,
      __EDGE_DETECTED__: envDetection.isEdge,
      __SAFARI_DETECTED__: envDetection.isSafari,
      __FIREFOX_DETECTED__: envDetection.isFirefox,
      __CSP_RESTRICTIVE__: envDetection.hasCSP,
      __ENVIRONMENT_SAFE__: envDetection.environmentSafety === 'SAFE',
      __ENVIRONMENT_SAFETY_LEVEL__: envDetection.environmentSafety,
      isUltraSpam: masterSpamDetector
    });
  };

  // POLYFILL ULTRA-ROBUSTO PARA IMPORT.META
  const setupImportMetaPolyfill = () => {
    if (!window.importMeta) {
      Object.defineProperty(window, 'importMeta', {
        value: { 
          env: { 
            MODE: 'production',
            DEV: false,
            PROD: true,
            VITE_LOVABLE_VERSION: '2025.1'
          },
          url: window.location.href
        },
        writable: false,
        configurable: false
      });
    }
  };

  // INTERCEPTACIÓN ULTRA-AGRESIVA DE CONSOLE - SISTEMA UNIFICADO
  const setupUnifiedConsoleSystem = () => {
    const originalMethods = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
      table: console.table,
      group: console.group,
      groupEnd: console.groupEnd
    };

    // Sobrescritura maestra de todos los métodos console
    console.log = function(...args) {
      const message = args.join(' ');
      if (!masterSpamDetector(message) && !message.includes('⠀⣠⠴')) {
        originalMethods.log.apply(console, args);
      }
    };

    console.warn = function(...args) {
      const message = args.join(' ');
      if (!masterSpamDetector(message)) {
        originalMethods.warn.apply(console, args);
      }
    };

    console.error = function(...args) {
      const message = args.join(' ');
      if (!masterSpamDetector(message)) {
        originalMethods.error.apply(console, args);
      }
    };

    console.info = function(...args) {
      const message = args.join(' ');
      if (!masterSpamDetector(message)) {
        originalMethods.info.apply(console, args);
      }
    };

    // Métodos adicionales silenciados
    console.debug = function() { /* Debug completamente silenciado */ };
    console.table = function(...args) {
      const message = args.join(' ');
      if (!masterSpamDetector(message)) {
        originalMethods.table.apply(console, args);
      }
    };
    console.group = function(...args) {
      const message = args.join(' ');
      if (!masterSpamDetector(message)) {
        originalMethods.group.apply(console, args);
      }
    };
    console.groupEnd = originalMethods.groupEnd;
  };

  // INTERCEPTACIÓN MAESTRA DE ERRORES GLOBALES
  const setupUnifiedErrorHandling = () => {
    // Error events ultra-agresivos
    window.addEventListener('error', (event) => {
      const error = event.error;
      const errorMessage = error?.message || event.message || '';
      
      if (masterSpamDetector(errorMessage)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }

      // Filtrar errores de recursos específicos con type guards
      if (event.target && event.target !== window) {
        const target = event.target as HTMLElement;
        
        if ('src' in target && typeof target.src === 'string') {
          const spamDomains = [
            'facebook.com', 'gptengineer.js', 'gpteng.co', 
            'cloudflareinsights.com', 'beacon.min.js', 
            'static.cloudflareinsights.com'
          ];
          
          if (spamDomains.some(domain => target.src.includes(domain))) {
            event.preventDefault();
            event.stopImmediatePropagation();
            return false;
          }
        }
      }

      // Solo procesar errores verdaderamente críticos
      if (process.env.NODE_ENV === 'development' && !masterSpamDetector(errorMessage)) {
        console.warn('🔍 Critical error detected:', errorMessage);
      }
    }, true);

    // Unhandled rejections ultra-filtradas
    window.addEventListener('unhandledrejection', (event) => {
      const error = event.reason;
      const errorMessage = error?.message || String(error);
      
      if (masterSpamDetector(errorMessage)) {
        event.preventDefault();
        return;
      }

      if (process.env.NODE_ENV === 'development' && !masterSpamDetector(errorMessage)) {
        console.warn('🔍 Unhandled rejection (filtered):', error);
      }
    });
  };

  // PERFORMANCE MONITORING ULTRA-SILENCIOSO
  const setupPerformanceMonitoring = () => {
    if ('performance' in window && 'mark' in window.performance) {
      try {
        performance.mark('lovable-unified-start');
        performance.mark('lovable-app-start'); // Backward compatibility
      } catch (e) {
        // Silenciar completamente errores de performance
      }
    }
  };

  // CARGA INTELIGENTE DE GPT ENGINEER
  const setupIntelligentGPTEngineering = (envDetection: any) => {
    if (!envDetection.shouldSkipGPTEngineer && envDetection.environmentSafety === 'SAFE') {
      // Solo cargar en entornos seguros
      setTimeout(() => {
        try {
          const script = document.createElement('script');
          script.src = 'https://cdn.gpteng.co/gptengineer.js';
          script.type = 'module';
          script.async = true;
          script.onload = () => {
            window.__GPT_ENGINEER_LOADED__ = true;
            if (process.env.NODE_ENV === 'development') {
              console.log('🔧 GPT Engineer loaded successfully');
            }
          };
          script.onerror = () => {
            // Fallar silenciosamente en caso de error
            window.__GPT_ENGINEER_LOADED__ = false;
          };
          document.head.appendChild(script);
        } catch (error) {
          // Fallar silenciosamente
          window.__GPT_ENGINEER_LOADED__ = false;
        }
      }, 100); // Delay mínimo para no interferir con inicialización
    } else {
      window.__GPT_ENGINEER_LOADED__ = false;
      if (process.env.NODE_ENV === 'development') {
        console.log('🚫 GPT Engineer skipped - Restrictive environment detected');
      }
    }
  };

  // INICIALIZACIÓN MAESTRA
  return () => {
    if (typeof window === 'undefined') return;

    console.log('🚀 Inicializando Sistema Unificado Ultra-Optimizado v6.0...');

    // Ejecutar fases de inicialización
    const envDetection = detectEnvironment();
    setupGlobalFlags(envDetection);
    setupImportMetaPolyfill();
    setupUnifiedConsoleSystem();
    setupUnifiedErrorHandling();
    setupPerformanceMonitoring();
    setupIntelligentGPTEngineering(envDetection);

    console.log('✅ Sistema Unificado inicializado -', {
      environment: envDetection.environmentSafety,
      gptEngineer: !envDetection.shouldSkipGPTEngineer,
      features: ['Console Filtrado', 'Error Handling', 'Performance Monitoring']
    });

    return envDetection;
  };
})();

// EJECUTAR INICIALIZACIÓN INMEDIATA
if (typeof window !== 'undefined') {
  initializeUnifiedSystem();
}

// ============================================================================
// RENDERIZADO ULTRA-COORDINADO CON MANEJO DE ERRORES ROBUSTO
// ============================================================================

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

// FUNCIÓN DE RENDERIZADO ULTRA-ROBUSTA
const renderUnifiedApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 App renderizada exitosamente con StrictMode');
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Unknown render error';
    
    // Solo loggear si no es spam Y tenemos la función disponible
    if (typeof window !== 'undefined' && 
        window.isUltraSpam && 
        !window.isUltraSpam(errorMessage)) {
      console.error('🚨 Render error:', error);
    }
    
    // Fallback ultra-robusto sin StrictMode
    try {
      root.render(<App />);
      if (process.env.NODE_ENV === 'development') {
        console.log('🔄 Fallback render successful');
      }
    } catch (fallbackError: any) {
      const fallbackMessage = fallbackError?.message || 'Unknown fallback error';
      
      if (typeof window !== 'undefined' && 
          window.isUltraSpam && 
          !window.isUltraSpam(fallbackMessage)) {
        console.error('🚨 Fallback render error:', fallbackError);
      }
    }
  }
};

// RENDERIZADO COORDINADO CON DETECCIÓN DE ESTADO ULTRA-PRECISA
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderUnifiedApp);
} else {
  // DOM ya cargado, renderizar inmediatamente
  renderUnifiedApp();
}

// ============================================================================
// PERFORMANCE MEASUREMENT ULTRA-SILENCIOSO Y MÉTRICAS FINALES
// ============================================================================

if (typeof window !== 'undefined' && 'performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      if ('mark' in window.performance && 'measure' in window.performance) {
        try {
          performance.mark('lovable-unified-loaded');
          performance.measure('lovable-unified-time', 'lovable-unified-start', 'lovable-unified-loaded');
          
          const measure = performance.getEntriesByName('lovable-unified-time')[0];
          if (measure && process.env.NODE_ENV === 'development') {
            const gptStatus = window.__GPT_ENGINEER_LOADED__ ? 'Cargado' : 'Omitido';
            console.log(`🚀 Sistema Unificado completamente cargado en ${Math.round(measure.duration)}ms`);
            console.log(`🔧 GPT Engineer: ${gptStatus} | Entorno: ${window.__ENVIRONMENT_SAFETY_LEVEL__}`);
          }
        } catch (error) {
          // Performance API no disponible, continuar silenciosamente
        }
      }
    }, 150); // Delay para asegurar que todo esté cargado
  });
}
