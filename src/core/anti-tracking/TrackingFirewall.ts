
/**
 * FIREWALL ANTI-TRACKING EXTREMO v2.0 - REPARACIÓN QUIRÚRGICA
 * Blindaje selectivo con modo observación por defecto
 */

interface TrackingFirewallConfig {
  blockAll: boolean;
  whitelist: string[];
  blacklist: string[];
  aggressiveMode: boolean;
  observationMode: boolean;
}

class TrackingFirewall {
  private static instance: TrackingFirewall | null = null;
  private config: TrackingFirewallConfig;
  private blockedAttempts: number = 0;
  private lastCleanup: number = 0;
  private isActive: boolean = false;
  private originalFetch: typeof fetch;
  private originalXHR: typeof XMLHttpRequest;

  // Lista negra ULTRACONSERVADORA - solo trackers obvios
  private readonly OBVIOUS_TRACKERS = [
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.com/tr',
    'doubleclick.net',
    'googlesyndication.com'
  ];

  private constructor(config: Partial<TrackingFirewallConfig> = {}) {
    this.config = {
      blockAll: false, // Deshabilitado por defecto
      whitelist: ['lovable.dev', 'gpteng.co', 'localhost', '127.0.0.1'],
      blacklist: this.OBVIOUS_TRACKERS,
      aggressiveMode: false,
      observationMode: true, // Modo observación por defecto
      ...config
    };

    this.originalFetch = window.fetch;
    this.originalXHR = window.XMLHttpRequest;

    if (!this.config.observationMode) {
      this.initializeFirewall();
    } else {
      this.initializeObservationMode();
    }
  }

  public static getInstance(config?: Partial<TrackingFirewallConfig>): TrackingFirewall {
    if (!TrackingFirewall.instance) {
      TrackingFirewall.instance = new TrackingFirewall(config);
    }
    return TrackingFirewall.instance;
  }

  private initializeObservationMode(): void {
    // Solo observar, no bloquear
    this.startPassiveMonitoring();
    console.log('👁️ FIREWALL ANTI-TRACKING - Modo observación activado');
  }

  private initializeFirewall(): void {
    if (this.isActive) return;

    try {
      // Solo interceptar si realmente es necesario
      this.interceptOnlyObviousTracking();
      this.isActive = true;
      console.log('🛡️ FIREWALL ANTI-TRACKING ACTIVADO - Modo selectivo');
    } catch (error) {
      console.error('Error inicializando firewall:', error);
      this.fallbackToObservation();
    }
  }

  private fallbackToObservation(): void {
    this.config.observationMode = true;
    this.isActive = false;
    this.restoreOriginalAPIs();
    this.initializeObservationMode();
  }

  private startPassiveMonitoring(): void {
    // Monitoreo pasivo de requests sin interferir
    const originalFetch = this.originalFetch;
    
    window.fetch = function(...args: Parameters<typeof fetch>) {
      const url = args[0] as string;
      
      // Solo logging, no bloqueo
      if (url && typeof url === 'string') {
        for (const tracker of TrackingFirewall.instance?.OBVIOUS_TRACKERS || []) {
          if (url.includes(tracker)) {
            console.log(`📊 Tracking request observado (no bloqueado): ${url}`);
            break;
          }
        }
      }
      
      return originalFetch.apply(this, args);
    };
  }

  private interceptOnlyObviousTracking(): void {
    const self = this;
    
    // Override fetch SOLO para trackers obvios
    window.fetch = function(...args: Parameters<typeof fetch>) {
      const url = args[0] as string;
      
      if (self.isObviousTrackingUrl(url)) {
        self.blockedAttempts++;
        console.log(`🚫 Blocked obvious tracking: ${url}`);
        return Promise.reject(new Error('Blocked obvious tracking'));
      }
      
      return self.originalFetch.apply(this, args);
    };
  }

  private isObviousTrackingUrl(url: string): boolean {
    if (!url || typeof url !== 'string') return false;
    
    const urlLower = url.toLowerCase();
    return this.OBVIOUS_TRACKERS.some(tracker => 
      urlLower.includes(tracker.toLowerCase())
    );
  }

  private restoreOriginalAPIs(): void {
    try {
      window.fetch = this.originalFetch;
      window.XMLHttpRequest = this.originalXHR;
    } catch (error) {
      console.warn('No se pudieron restaurar APIs originales:', error);
    }
  }

  public escalateToActiveMode(): void {
    if (!this.config.observationMode) return;
    
    console.log('🚨 Escalando firewall a modo activo');
    this.config.observationMode = false;
    this.initializeFirewall();
  }

  public getFirewallStats() {
    return {
      blockedAttempts: this.blockedAttempts,
      mode: this.config.observationMode ? 'OBSERVACIÓN' : 
            this.config.aggressiveMode ? 'AGRESIVO' : 'SELECTIVO',
      lastCleanup: this.lastCleanup,
      isActive: this.isActive,
      observationMode: this.config.observationMode
    };
  }

  public emergencyPurge(): void {
    // Purga ultraconservadora
    console.log('🧹 PURGA DE EMERGENCIA FIREWALL - Modo conservador');
    this.blockedAttempts = 0;
    this.lastCleanup = Date.now();
  }

  public destroy(): void {
    this.restoreOriginalAPIs();
    this.isActive = false;
    TrackingFirewall.instance = null;
    console.log('🛡️ Firewall anti-tracking destruido');
  }
}

// Instancia global con configuración ultraconservadora
export const trackingFirewall = TrackingFirewall.getInstance({
  blockAll: false,
  aggressiveMode: false,
  observationMode: true
});
