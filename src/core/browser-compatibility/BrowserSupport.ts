
interface BrowserInfo {
  name: string;
  version: string;
  isSupported: boolean;
  features: {
    webgl: boolean;
    es6: boolean;
    modules: boolean;
    webWorkers: boolean;
  };
}

class BrowserSupportChecker {
  private static instance: BrowserSupportChecker;
  private browserInfo: BrowserInfo | null = null;

  static getInstance(): BrowserSupportChecker {
    if (!BrowserSupportChecker.instance) {
      BrowserSupportChecker.instance = new BrowserSupportChecker();
    }
    return BrowserSupportChecker.instance;
  }

  getBrowserInfo(): BrowserInfo {
    if (this.browserInfo) {
      return this.browserInfo;
    }

    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';

    // Detectar Edge
    if (userAgent.includes('Edg/')) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
    }
    // Detectar Chrome
    else if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    }
    // Detectar Firefox
    else if (userAgent.includes('Firefox/')) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    }
    // Detectar Safari
    else if (userAgent.includes('Safari/') && !userAgent.includes('Chrome/')) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    }

    const features = {
      webgl: this.checkWebGLSupport(),
      es6: this.checkES6Support(),
      modules: this.checkModuleSupport(),
      webWorkers: this.checkWebWorkerSupport()
    };

    const isSupported = Object.values(features).every(Boolean);

    this.browserInfo = {
      name: browserName,
      version: browserVersion,
      isSupported,
      features
    };

    return this.browserInfo;
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }

  private checkES6Support(): boolean {
    try {
      // Test básico de ES6
      eval('const test = () => {}; class Test {}');
      return true;
    } catch {
      return false;
    }
  }

  private checkModuleSupport(): boolean {
    return 'noModule' in HTMLScriptElement.prototype;
  }

  private checkWebWorkerSupport(): boolean {
    return typeof Worker !== 'undefined';
  }

  getOptimizationsForBrowser(): Record<string, any> {
    const info = this.getBrowserInfo();
    
    const optimizations: Record<string, any> = {
      enableAnimations: true,
      useWebGL: info.features.webgl,
      enableParallel: info.features.webWorkers,
      cacheStrategy: 'standard'
    };

    // Optimizaciones específicas por navegador
    switch (info.name) {
      case 'Edge':
        optimizations.cacheStrategy = 'aggressive';
        optimizations.enableAnimations = parseInt(info.version) >= 90;
        break;
      case 'Chrome':
        optimizations.useAdvancedFeatures = parseInt(info.version) >= 90;
        break;
      case 'Firefox':
        optimizations.enableAnimations = parseInt(info.version) >= 85;
        break;
      case 'Safari':
        optimizations.useWebGL = parseInt(info.version) >= 14;
        optimizations.enableAnimations = parseInt(info.version) >= 14;
        break;
    }

    return optimizations;
  }
}

export const browserSupport = BrowserSupportChecker.getInstance();
