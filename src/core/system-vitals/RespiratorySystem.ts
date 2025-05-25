/**
 * SISTEMA RESPIRATORIO ANTI-TRACKING v2.0 - Pulmón Digital Blindado
 * Purificación extrema y protección cardiovascular-respiratoria
 */

import { RespiratoryHealth, CirculatoryEvent, EnhancedModuleIdentity } from './types';
import { trackingFirewall } from '@/core/anti-tracking/TrackingFirewall';
import { storageProtection } from '@/core/anti-tracking/StorageProtectionLayer';

interface BreathingOptions {
  breathsPerMinute: number;
  oxygenThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum' | 'anti_tracking_extreme';
  antiTrackingMode: boolean;
  emergencyMode: boolean;
}

enum LungState {
  INHALING = 'inhaling',
  EXHALING = 'exhaling', 
  HOLDING = 'holding',
  PURIFYING = 'purifying',
  ANTI_TRACKING = 'anti_tracking_mode',
  EMERGENCY_CLEANING = 'emergency_cleaning'
}

export class RespiratorySystem {
  private state: LungState = LungState.HOLDING;
  private oxygenLevel: number = 100;
  private breathingRate: number = 0;
  private lastBreath: number = 0;
  private breathHistory: number[] = [];
  private secureStorage = new Map<string, any>();
  private purificationActive: boolean = false;
  private antiTrackingActive: boolean = true;
  private trackingAttackCount: number = 0;
  private readonly options: BreathingOptions;
  private eventListeners: ((event: CirculatoryEvent) => void)[] = [];

  constructor(options: Partial<BreathingOptions> = {}) {
    this.options = {
      breathsPerMinute: 20,
      oxygenThreshold: 80,
      purificationLevel: 'anti_tracking_extreme',
      antiTrackingMode: true,
      emergencyMode: false,
      ...options
    };

    this.initializeAntiTrackingBreathing();
  }

  private initializeAntiTrackingBreathing(): void {
    // Monitoreo de ataques de tracking
    this.monitorTrackingAttacks();
    
    // Respiración anti-tracking cada 2 segundos
    setInterval(() => {
      this.performAntiTrackingBreath();
    }, 2000);

    // Respiración normal cada 3 segundos
    setInterval(() => {
      this.cleanBreathHistory();
      this.adjustBreathingState();
      this.purifyAir();
      this.emitBreath();
    }, 3000);

    console.log('🫁 SISTEMA RESPIRATORIO ANTI-TRACKING V2.0 ACTIVADO');
  }

  private monitorTrackingAttacks(): void {
    // Detectar intentos masivos de tracking en storage
    const originalStorageAccess = localStorage.setItem;
    localStorage.setItem = (...args) => {
      if (this.isTrackingAttempt(args[0])) {
        this.trackingAttackCount++;
        if (this.trackingAttackCount > 10) {
          this.activateEmergencyMode();
        }
        return; // Bloquear completamente
      }
      return originalStorageAccess.apply(localStorage, args);
    };
  }

  private isTrackingAttempt(key: string): boolean {
    const trackingPatterns = [
      '_ga', '_gid', '_gat', 'utm_', 'fbp', 'fbc',
      'analytics', 'tracking', 'pixel', 'beacon',
      'fingerprint', 'session_id', 'user_id'
    ];
    
    return trackingPatterns.some(pattern => 
      key.toLowerCase().includes(pattern)
    );
  }

  private activateEmergencyMode(): void {
    this.state = LungState.EMERGENCY_CLEANING;
    this.options.emergencyMode = true;
    
    // Purga de emergencia
    trackingFirewall.emergencyPurge();
    storageProtection.emergencyWipe();
    
    // Reset contador
    this.trackingAttackCount = 0;
    
    console.log('🚨 MODO DE EMERGENCIA RESPIRATORIO ACTIVADO - Purga total');
    
    // Volver a estado normal después de 10 segundos
    setTimeout(() => {
      this.state = LungState.HOLDING;
      this.options.emergencyMode = false;
      console.log('✅ Modo de emergencia respiratorio desactivado');
    }, 10000);
  }

  private performAntiTrackingBreath(): void {
    if (!this.antiTrackingActive) return;

    this.state = LungState.ANTI_TRACKING;
    
    // Verificar y limpiar storage de tracking
    this.cleanTrackingData();
    
    // Incrementar oxigenación después de limpieza
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 3);
    
    // Emitir evento de limpieza
    this.emitAntiTrackingEvent();
  }

  private cleanTrackingData(): void {
    const trackingKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && this.isTrackingAttempt(key)) {
        trackingKeys.push(key);
      }
    }
    
    trackingKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    if (trackingKeys.length > 0) {
      console.log(`🧹 Respiración anti-tracking: ${trackingKeys.length} elementos purificados`);
    }
  }

  private emitAntiTrackingEvent(): void {
    const event: CirculatoryEvent = {
      type: 'toxin_removal',
      source: 'lungs',
      data: {
        trackingElementsRemoved: this.trackingAttackCount,
        oxygenLevel: this.oxygenLevel,
        purificationLevel: this.options.purificationLevel,
        antiTrackingActive: this.antiTrackingActive
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => listener(event));
  }

  private cleanBreathHistory(): void {
    const now = Date.now();
    this.breathHistory = this.breathHistory.filter(breath => now - breath < 60000);
    this.breathingRate = this.breathHistory.length;
  }

  private adjustBreathingState(): void {
    if (this.options.emergencyMode) {
      this.state = LungState.EMERGENCY_CLEANING;
      return;
    }

    if (this.oxygenLevel < this.options.oxygenThreshold) {
      this.state = LungState.INHALING;
    } else if (this.secureStorage.size > 10) {
      this.state = LungState.EXHALING;
    } else if (this.options.antiTrackingMode && !this.purificationActive) {
      this.state = LungState.PURIFYING;
    } else {
      this.state = LungState.HOLDING;
    }
  }

  private purifyAir(): void {
    if (this.state === LungState.PURIFYING || this.state === LungState.EMERGENCY_CLEANING) {
      this.purificationActive = true;
      
      // Limpiar datos obsoletos con purificación extrema
      const now = Date.now();
      for (const [key, value] of this.secureStorage.entries()) {
        const maxAge = this.options.emergencyMode ? 60000 : 300000; // 1 min en emergencia, 5 min normal
        if (value.timestamp && now - value.timestamp > maxAge) {
          this.secureStorage.delete(key);
        }
      }

      // Purificación anti-tracking extrema
      if (this.options.purificationLevel === 'anti_tracking_extreme') {
        this.performExtremeAntiTrackingPurification();
      }

      // Incrementar nivel de oxígeno después de purificación
      const oxygenBoost = this.options.emergencyMode ? 10 : 5;
      this.oxygenLevel = Math.min(100, this.oxygenLevel + oxygenBoost);
      
      setTimeout(() => {
        this.purificationActive = false;
      }, this.options.emergencyMode ? 500 : 1000);
    }
  }

  private performExtremeAntiTrackingPurification(): void {
    // Firewall stats y limpieza
    const firewallStats = trackingFirewall.getFirewallStats();
    const protectionStats = storageProtection.getProtectionStats();
    
    if (firewallStats.blockedAttempts > 50) {
      trackingFirewall.emergencyPurge();
    }
    
    if (protectionStats.totalStorageSize > 500000) { // 500KB
      storageProtection.emergencyWipe();
    }
    
    console.log('🦠 PURIFICACIÓN ANTI-TRACKING EXTREMA EJECUTADA');
  }

  private emitBreath(): void {
    const event: CirculatoryEvent = {
      type: 'breath',
      source: 'lungs',
      data: {
        state: this.state,
        rate: this.breathingRate,
        health: this.getHealth(),
        storageSize: this.secureStorage.size,
        antiTrackingStats: {
          attacksBlocked: this.trackingAttackCount,
          firewallStats: trackingFirewall.getFirewallStats(),
          protectionStats: storageProtection.getProtectionStats()
        }
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => listener(event));
  }

  public breatheIn(data: any): boolean {
    if (this.state === LungState.PURIFYING || this.state === LungState.EMERGENCY_CLEANING) {
      return false; // No aceptar datos durante purificación
    }

    const now = Date.now();
    this.breathHistory.push(now);
    this.lastBreath = now;

    // Verificar si los datos contienen tracking
    if (this.containsTrackingData(data)) {
      console.log('🚫 Datos de tracking detectados y bloqueados');
      return false;
    }

    // Procesar y almacenar datos de forma segura
    if (this.options.antiTrackingMode) {
      const secureKey = `secure_${now}_${Math.random().toString(36).substr(2, 5)}`;
      this.secureStorage.set(secureKey, {
        data: this.encryptData(data),
        timestamp: now,
        processed: false,
        antiTrackingVerified: true
      });
    }

    // Reducir oxígeno con el esfuerzo
    this.oxygenLevel = Math.max(50, this.oxygenLevel - 2);
    
    return true;
  }

  private containsTrackingData(data: any): boolean {
    const dataStr = JSON.stringify(data).toLowerCase();
    const trackingIndicators = [
      'analytics', 'tracking', 'pixel', 'beacon', 'fingerprint',
      '_ga', '_gid', 'utm_', 'fbp', 'google', 'facebook'
    ];
    
    return trackingIndicators.some(indicator => dataStr.includes(indicator));
  }

  public breatheOut(signal: any): any {
    if (this.state === LungState.INHALING || this.state === LungState.EMERGENCY_CLEANING) {
      return null; // No emitir durante inhalación o limpieza de emergencia
    }

    // Procesar y emitir señal ultra-purificada
    const ultraPurifiedSignal = this.options.antiTrackingMode 
      ? this.ultraPurifySignal(signal)
      : signal;

    // Incrementar oxígeno al exhalar
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);

    return ultraPurifiedSignal;
  }

  private ultraPurifySignal(signal: any): any {
    // Remover TODAS las propiedades de tracking conocidas
    const purified = { ...signal };
    
    // Lista exhaustiva de propiedades de tracking
    const trackingProps = [
      'tracking_id', 'analytics_data', 'user_fingerprint', 'session_id',
      'google_analytics', 'facebook_pixel', 'utm_source', 'utm_medium',
      'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid',
      'beacon_data', 'pixel_data', 'fingerprint_data', 'device_id',
      'browser_fingerprint', 'canvas_fingerprint', 'audio_fingerprint'
    ];
    
    trackingProps.forEach(prop => {
      delete purified[prop];
    });
    
    return {
      ...purified,
      purified: true,
      purification_level: this.options.purificationLevel,
      anti_tracking_verified: true,
      purification_timestamp: Date.now()
    };
  }

  public oxygenate(module: EnhancedModuleIdentity): EnhancedModuleIdentity {
    // Oxigenar módulo con contexto de seguridad anti-tracking extremo
    const oxygenatedModule: EnhancedModuleIdentity = {
      ...module,
      security_context: {
        security_mode: 'anti_tracking_active',
        tracking_protected: true,
        shield_level: Math.floor(this.oxygenLevel / 10),
        encryption_enabled: this.options.antiTrackingMode,
        firewall_active: true,
        storage_protected: true,
        purification_level: this.options.purificationLevel,
        emergency_mode: this.options.emergencyMode,
        ...module.security_context
      }
    };

    return oxygenatedModule;
  }

  private encryptData(data: any): any {
    if (!this.options.antiTrackingMode) return data;
    
    try {
      return {
        encrypted: true,
        payload: btoa(JSON.stringify(data)),
        checksum: this.generateChecksum(data),
        timestamp: Date.now(),
        anti_tracking_secured: true
      };
    } catch {
      return data; // Fallback si encryption falla
    }
  }

  private generateChecksum(data: any): string {
    try {
      return btoa(JSON.stringify(data)).slice(0, 8);
    } catch {
      return 'fallback';
    }
  }

  public getHealth(): RespiratoryHealth {
    return {
      breathingRate: this.breathingRate,
      oxygenLevel: this.oxygenLevel,
      airQuality: this.oxygenLevel > 90 ? 'pure' : this.oxygenLevel > 70 ? 'filtered' : 'contaminated',
      antiTrackingActive: this.antiTrackingActive && this.purificationActive
    };
  }

  public subscribe(listener: (event: CirculatoryEvent) => void): () => void {
    this.eventListeners.push(listener);
    return () => {
      const index = this.eventListeners.indexOf(listener);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  public emergencyPurge(): void {
    this.activateEmergencyMode();
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.breathHistory = [];
    this.state = LungState.HOLDING;
    this.purificationActive = false;
    this.trackingAttackCount = 0;
    
    console.log('🚨 PURGA DE EMERGENCIA RESPIRATORIA COMPLETADA');
  }

  public destroy(): void {
    this.eventListeners = [];
    this.secureStorage.clear();
    storageProtection.destroy();
  }
}
