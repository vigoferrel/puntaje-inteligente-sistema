
/**
 * FIREWALL ANTI-TRACKING EXTREMO v1.1
 * Blindaje quirúrgico contra todas las formas de tracking
 */

interface TrackingFirewallConfig {
  blockAll: boolean;
  whitelist: string[];
  blacklist: string[];
  aggressiveMode: boolean;
}

class TrackingFirewall {
  private config: TrackingFirewallConfig;
  private blockedAttempts: number = 0;
  private lastCleanup: number = 0;

  // Lista negra ultra-agresiva de dominios de tracking
  private readonly TRACKING_BLACKLIST = [
    'google-analytics.com',
    'googletagmanager.com',
    'facebook.com',
    'doubleclick.net',
    'googlesyndication.com',
    'amazon-adsystem.com',
    'googleadservices.com',
    'adsystem.amazon.com',
    'scorecardresearch.com',
    'outbrain.com',
    'taboola.com',
    'hotjar.com',
    'mixpanel.com',
    'segment.com',
    'fullstory.com',
    'logrocket.com',
    'amplitude.com',
    'heap.io',
    'intercom.io',
    'zendesk.com',
    'crisp.chat',
    'tawk.to',
    'drift.com',
    'cloudflareinsights.com',
    'beacon.min.js',
    'analytics',
    'tracking',
    'pixel',
    'beacon'
  ];

  constructor(config: Partial<TrackingFirewallConfig> = {}) {
    this.config = {
      blockAll: true,
      whitelist: ['lovable.dev', 'gpteng.co'],
      blacklist: this.TRACKING_BLACKLIST,
      aggressiveMode: true,
      ...config
    };

    this.initializeFirewall();
  }

  private initializeFirewall(): void {
    // Interceptor de Network Requests
    this.interceptNetworkRequests();
    
    // Bloqueador de Storage Access
    this.blockStorageAccess();
    
    // Limpiador de cookies de tracking
    this.blockTrackingCookies();
    
    // Monitor de scripts maliciosos
    this.monitorScriptLoading();

    console.log('🛡️ FIREWALL ANTI-TRACKING ACTIVADO - Modo quirúrgico extremo');
  }

  private interceptNetworkRequests(): void {
    // Override fetch para bloquear requests de tracking
    const originalFetch = window.fetch;
    const self = this;
    
    window.fetch = function(...args: Parameters<typeof fetch>) {
      const url = args[0] as string;
      
      if (self.isTrackingUrl(url)) {
        self.blockedAttempts++;
        console.log(`🚫 Blocked tracking request: ${url}`);
        return Promise.reject(new Error('Blocked by anti-tracking firewall'));
      }
      
      return originalFetch.apply(this, args);
    };

    // Override XMLHttpRequest
    const originalXHR = window.XMLHttpRequest;
    const OriginalXHRClass = class extends originalXHR {
      open(method: string, url: string, async: boolean = true, username?: string | null, password?: string | null) {
        if (self.isTrackingUrl(url)) {
          self.blockedAttempts++;
          console.log(`🚫 Blocked XHR tracking request: ${url}`);
          throw new Error('Blocked by anti-tracking firewall');
        }
        return super.open(method, url, async, username, password);
      }
    };
    
    window.XMLHttpRequest = OriginalXHRClass as any;
  }

  private isTrackingUrl(url: string): boolean {
    const urlLower = url.toLowerCase();
    
    return this.config.blacklist.some(blocked => 
      urlLower.includes(blocked.toLowerCase())
    );
  }

  private blockStorageAccess(): void {
    // Crear proxy para localStorage que filtra tracking
    const originalLocalStorage = window.localStorage;
    const self = this;
    
    const storageHandler: ProxyHandler<Storage> = {
      set(target: Storage, key: string | symbol, value: any): boolean {
        const keyStr = String(key);
        if (keyStr === 'setItem') {
          return true; // Permitir acceso al método
        }
        
        if (self.isTrackingKey(keyStr)) {
          console.log(`🚫 Blocked tracking storage: ${keyStr}`);
          return true;
        }
        
        (target as any)[key] = value;
        return true;
      },
      
      get(target: Storage, key: string | symbol): any {
        const keyStr = String(key);
        
        if (keyStr === 'setItem') {
          return function(this: Storage, storageKey: string, storageValue: string) {
            if (self.isTrackingKey(storageKey)) {
              console.log(`🚫 Blocked tracking storage: ${storageKey}`);
              return;
            }
            return originalLocalStorage.setItem.call(this, storageKey, storageValue);
          };
        }
        
        if (keyStr === 'getItem') {
          return function(this: Storage, storageKey: string) {
            if (self.isTrackingKey(storageKey)) {
              return null;
            }
            return originalLocalStorage.getItem.call(this, storageKey);
          };
        }
        
        return (target as any)[key];
      }
    };

    const storageProxy = new Proxy(originalLocalStorage, storageHandler);

    // Protección anti-fingerprinting
    Object.defineProperty(window, 'localStorage', {
      value: storageProxy,
      writable: false,
      configurable: false
    });
  }

  private isTrackingKey(key: string): boolean {
    const trackingKeys = [
      '_ga', '_gid', '_gat', 'fb', 'utm_', 'analytics',
      'tracking', 'pixel', 'beacon', 'fingerprint'
    ];
    
    return trackingKeys.some(trackingKey => 
      key.toLowerCase().includes(trackingKey)
    );
  }

  private blockTrackingCookies(): void {
    // Interceptar document.cookie
    let cookieValue = '';
    Object.defineProperty(document, 'cookie', {
      get: () => cookieValue,
      set: (value: string) => {
        if (!this.isTrackingCookie(value)) {
          cookieValue = value;
        } else {
          console.log(`🚫 Blocked tracking cookie: ${value}`);
        }
      }
    });
  }

  private isTrackingCookie(cookie: string): boolean {
    const trackingCookies = ['_ga', '_gid', '_gat', 'fb', 'utm'];
    return trackingCookies.some(tc => cookie.includes(tc));
  }

  private monitorScriptLoading(): void {
    // Observer para scripts dinámicos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'SCRIPT') {
              const src = element.getAttribute('src');
              if (src && this.isTrackingUrl(src)) {
                element.remove();
                this.blockedAttempts++;
                console.log(`🚫 Removed tracking script: ${src}`);
              }
            }
          }
        });
      });
    });

    observer.observe(document.head, { childList: true, subtree: true });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  public getFirewallStats() {
    return {
      blockedAttempts: this.blockedAttempts,
      mode: this.config.aggressiveMode ? 'EXTREMO' : 'NORMAL',
      lastCleanup: this.lastCleanup
    };
  }

  public emergencyPurge(): void {
    // Limpiar TODO el storage de tracking
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isTrackingKey(key)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Limpiar cookies de tracking
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.split('=');
      if (this.isTrackingCookie(name)) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      }
    });

    this.lastCleanup = Date.now();
    console.log('🧹 PURGA DE EMERGENCIA ANTI-TRACKING COMPLETADA');
  }
}

export const trackingFirewall = new TrackingFirewall({
  blockAll: true,
  aggressiveMode: true
});
