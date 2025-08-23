
import type { WidgetConfig, WidgetRenderConfig } from '../types/bloom';

class WidgetBootstrapperClass {
  private static instance: WidgetBootstrapperClass;
  private shadowRoots: Map<string, ShadowRoot> = new Map();
  private widgetInstances: Map<string, any> = new Map();

  static initialize(): void {
    if (this.instance) return;
    this.instance = new WidgetBootstrapperClass();
    this.instance.setupGlobalInterface();
  }

  setupGlobalInterface(): void {
    // Global API para embed
    (window as any).SkillnestBloomWidget = {
      init: this.initWidget.bind(this),
      destroy: this.destroyWidget.bind(this),
      getResults: this.getWidgetResults.bind(this),
      version: '1.0.0'
    };

    console.log('Skillnest Bloom Widget initialized v1.0.0');
  }

  async initWidget(config: WidgetConfig): Promise<string> {
    const {
      container,
      techDomain = 'javascript',
      theme = 'default',
      onComplete,
      onProgress,
      customBranding = false,
      maxQuestions = 5,
      timeLimit = 900 // 15 minutes in seconds
    } = config;

    // Validate container
    const containerElement = typeof container === 'string' 
      ? document.querySelector(container)
      : container;

    if (!containerElement) {
      throw new Error(`Widget container not found: ${container}`);
    }

    const widgetId = this.generateWidgetId();

    try {
      // Create Shadow DOM for complete isolation
      const shadowRoot = containerElement.attachShadow({ mode: 'closed' });
      this.shadowRoots.set(widgetId, shadowRoot);

      // Inject isolated styles
      await this.injectStyles(shadowRoot, theme);

      // Initialize React application within Shadow DOM
      await this.renderWidget(shadowRoot, {
        widgetId,
        techDomain,
        theme,
        onComplete,
        onProgress,
        customBranding,
        maxQuestions,
        timeLimit
      });

      console.log(`Widget ${widgetId} initialized successfully`);
      return widgetId;

    } catch (error) {
      console.error('Error initializing widget:', error);
      throw new Error(`Failed to initialize widget: ${error.message}`);
    }
  }

  async destroyWidget(widgetId: string): Promise<boolean> {
    try {
      const shadowRoot = this.shadowRoots.get(widgetId);
      if (shadowRoot) {
        // Clean up React instance
        const widgetInstance = this.widgetInstances.get(widgetId);
        if (widgetInstance && widgetInstance.unmount) {
          widgetInstance.unmount();
        }

        // Remove from maps
        this.shadowRoots.delete(widgetId);
        this.widgetInstances.delete(widgetId);

        console.log(`Widget ${widgetId} destroyed successfully`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error destroying widget:', error);
      return false;
    }
  }

  getWidgetResults(widgetId: string): any {
    const widgetInstance = this.widgetInstances.get(widgetId);
    return widgetInstance?.getResults?.() || null;
  }

  private generateWidgetId(): string {
    // Use crypto.getRandomValues for better entropy in widget ID generation
    const randomValue = typeof crypto !== 'undefined' && crypto.getRandomValues
      ? crypto.getRandomValues(new Uint32Array(1))[0] / (0xFFFFFFFF + 1)
      : Math.random() // Fallback only for unsupported environments
    return `skillnest-widget-${Date.now()}-${randomValue.toString(36).substr(2, 9)}`;
  }

  private async injectStyles(shadowRoot: ShadowRoot, theme: string): Promise<void> {
    const styleSheet = new CSSStyleSheet();
    
    // Load theme-specific styles
    const styles = await this.loadThemeStyles(theme);
    
    // Add CSS reset and widget-specific styles with Skillnest branding
    const fullStyles = `
      /* CSS Reset for complete isolation */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      
      /* Skillnest Brand Colors */
      :root {
        --skillnest-primary: #0ea5e9;
        --skillnest-primary-dark: #0284c7;
        --skillnest-turquoise: #06b6d4;
        --skillnest-turquoise-light: #67e8f9;
        --skillnest-gradient: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #67e8f9 100%);
        --skillnest-gradient-dark: linear-gradient(135deg, #0284c7 0%, #0891b2 50%, #06b6d4 100%);
        --skillnest-black: #1f2937;
        --skillnest-gray: #6b7280;
        --skillnest-white: #ffffff;
        --skillnest-bg-light: #f8fafc;
        --skillnest-border: #e2e8f0;
        --skillnest-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      /* Widget base styles with Skillnest branding */
      .skillnest-widget {
        display: block;
        width: 100%;
        max-width: 700px;
        margin: 0 auto;
        background: var(--skillnest-white);
        border-radius: 16px;
        box-shadow: var(--skillnest-shadow);
        overflow: hidden;
        position: relative;
        z-index: 1000;
        font-size: 16px;
        line-height: 1.6;
        border: 1px solid var(--skillnest-border);
      }

      .skillnest-widget * {
        box-sizing: border-box;
      }

      /* Skillnest Header with brand gradient */
      .skillnest-widget-header {
        background: var(--skillnest-gradient);
        color: var(--skillnest-white);
        padding: 2rem;
        text-align: center;
        position: relative;
        overflow: hidden;
      }

      .skillnest-widget-header::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="30" r="0.5" fill="rgba(255,255,255,0.15)"/><circle cx="40" cy="70" r="0.8" fill="rgba(255,255,255,0.1)"/><circle cx="70" cy="80" r="1.2" fill="rgba(255,255,255,0.08)"/><circle cx="30" cy="40" r="0.6" fill="rgba(255,255,255,0.12)"/></svg>') repeat;
        opacity: 0.6;
      }

      .skillnest-widget-header h1 {
        font-size: 1.75rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        position: relative;
        z-index: 1;
      }

      .skillnest-widget-header p {
        font-size: 1rem;
        opacity: 0.9;
        position: relative;
        z-index: 1;
      }

      .skillnest-widget-content {
        padding: 2rem;
      }

      /* Loading states with Skillnest branding */
      .skillnest-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 3rem 2rem;
        color: var(--skillnest-gray);
        text-align: center;
      }

      .skillnest-spinner {
        width: 32px;
        height: 32px;
        border: 3px solid var(--skillnest-border);
        border-top: 3px solid var(--skillnest-primary);
        border-radius: 50%;
        animation: skillnest-spin 1s linear infinite;
        margin-bottom: 1rem;
      }

      @keyframes skillnest-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* Button styles with Skillnest branding */
      .skillnest-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.875rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        font-family: inherit;
        position: relative;
        overflow: hidden;
      }

      .skillnest-btn-primary {
        background: var(--skillnest-gradient);
        color: var(--skillnest-white);
        box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
      }

      .skillnest-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
      }

      .skillnest-btn-secondary {
        background: var(--skillnest-white);
        color: var(--skillnest-primary);
        border: 2px solid var(--skillnest-primary);
      }

      .skillnest-btn-secondary:hover {
        background: var(--skillnest-primary);
        color: var(--skillnest-white);
        transform: translateY(-1px);
      }

      /* Form elements with Skillnest styling */
      .skillnest-input, .skillnest-textarea {
        width: 100%;
        padding: 1rem;
        border: 2px solid var(--skillnest-border);
        border-radius: 8px;
        font-size: 16px;
        font-family: inherit;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        background: var(--skillnest-white);
      }

      .skillnest-input:focus, .skillnest-textarea:focus {
        outline: none;
        border-color: var(--skillnest-primary);
        box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
      }

      .skillnest-textarea {
        min-height: 120px;
        resize: vertical;
        font-family: inherit;
      }

      /* Progress indicator */
      .skillnest-progress {
        width: 100%;
        height: 8px;
        background: var(--skillnest-border);
        border-radius: 4px;
        overflow: hidden;
        margin: 1rem 0;
      }

      .skillnest-progress-bar {
        height: 100%;
        background: var(--skillnest-gradient);
        border-radius: 4px;
        transition: width 0.3s ease;
      }

      /* Error states */
      .skillnest-error {
        padding: 1.5rem;
        background: #fef2f2;
        border: 1px solid #fecaca;
        border-radius: 8px;
        color: #dc2626;
        margin: 1rem;
        border-left: 4px solid #dc2626;
      }

      .skillnest-error h3 {
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      /* Results styling */
      .skillnest-results {
        background: var(--skillnest-bg-light);
        border-radius: 12px;
        padding: 2rem;
        margin-top: 1rem;
      }

      .skillnest-bloom-level {
        display: inline-flex;
        align-items: center;
        background: var(--skillnest-gradient);
        color: var(--skillnest-white);
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }

      .skillnest-skill-tag {
        display: inline-block;
        background: var(--skillnest-primary);
        color: var(--skillnest-white);
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        margin: 0.25rem;
      }

      /* Mobile responsiveness */
      @media (max-width: 640px) {
        .skillnest-widget {
          max-width: 100%;
          margin: 0;
          border-radius: 0;
          border-left: none;
          border-right: none;
        }
        
        .skillnest-widget-header {
          padding: 1.5rem;
        }
        
        .skillnest-widget-header h1 {
          font-size: 1.5rem;
        }
        
        .skillnest-widget-content {
          padding: 1.5rem;
        }
        
        .skillnest-btn {
          width: 100%;
          padding: 1rem;
        }
      }

      ${styles}
    `;

    styleSheet.replaceSync(fullStyles);
    shadowRoot.adoptedStyleSheets = [styleSheet];
  }

  private async loadThemeStyles(theme: string): Promise<string> {
    const themes: Record<string, string> = {
      default: `
        /* Default Skillnest theme - already included in base styles */
      `,
      dark: `
        .skillnest-widget {
          background: var(--skillnest-black);
          color: var(--skillnest-white);
          border-color: #374151;
        }
        .skillnest-widget-header {
          background: var(--skillnest-gradient-dark);
        }
        .skillnest-widget-content {
          background: var(--skillnest-black);
        }
        .skillnest-input, .skillnest-textarea {
          background: #374151;
          border-color: #4b5563;
          color: var(--skillnest-white);
        }
        .skillnest-btn-secondary {
          background: #374151;
          color: var(--skillnest-white);
          border-color: #4b5563;
        }
        .skillnest-results {
          background: #1f2937;
        }
      `,
      minimal: `
        .skillnest-widget {
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 2px solid var(--skillnest-border);
        }
        .skillnest-widget-header {
          background: var(--skillnest-bg-light);
          color: var(--skillnest-black);
          border-bottom: 2px solid var(--skillnest-border);
        }
        .skillnest-widget-header::before {
          display: none;
        }
      `
    };

    return themes[theme] || themes.default;
  }

  private async renderWidget(
    shadowRoot: ShadowRoot,
    config: WidgetRenderConfig
  ): Promise<void> {
    // Create container div
    const container = document.createElement('div');
    container.className = 'skillnest-widget-root';
    shadowRoot.appendChild(container);

    // Show loading state initially
    container.innerHTML = `
      <div class="skillnest-widget">
        <div class="skillnest-widget-header">
          <h1>Skillnest Bloom Assessment</h1>
          <p>Evaluación cognitiva de habilidades técnicas</p>
        </div>
        <div class="skillnest-loading">
          <div class="skillnest-spinner"></div>
          <p>Inicializando evaluación Bloom...</p>
        </div>
      </div>
    `;

    try {
      // Dynamically import React and the widget app
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      const { default: WidgetApp } = await import('../components/WidgetApp');

      // Create React root and render
      const root = ReactDOM.createRoot(container);
      
      const widgetElement = React.createElement(WidgetApp, {
        ...config,
        onMount: (instance: any) => {
          this.widgetInstances.set(config.widgetId, instance);
        }
      });

      root.render(widgetElement);

      // Store root for cleanup
      this.widgetInstances.set(config.widgetId, { 
        root, 
        unmount: () => root.unmount() 
      });

    } catch (error) {
      console.error('Error rendering widget:', error);
      container.innerHTML = `
        <div class="skillnest-widget">
          <div class="skillnest-widget-header">
            <h1>Error de Inicialización</h1>
            <p>No se pudo cargar la evaluación</p>
          </div>
          <div class="skillnest-error">
            <h3>Error al cargar el widget</h3>
            <p>${error.message}</p>
            <p style="margin-top: 1rem; font-size: 0.875rem;">
              Por favor, verifica tu conexión a internet e intenta nuevamente.
            </p>
          </div>
        </div>
      `;
    }
  }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      WidgetBootstrapperClass.initialize();
    });
  } else {
    WidgetBootstrapperClass.initialize();
  }
}

// Export for use in other modules
export { WidgetBootstrapperClass as WidgetBootstrapper };
