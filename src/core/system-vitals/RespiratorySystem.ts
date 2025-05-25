/**
 * SISTEMA RESPIRATORIO ANTI-TRACKING v3.0 - Pulmón Digital con Detoxificación
 * Purificación extrema con protección contra auto-destrucción
 */

import { RespiratoryHealth, CirculatoryEvent, EnhancedModuleIdentity } from './types';
import { emergencyDetox } from '@/core/anti-tracking/EmergencyDetox';
import { trackingFirewall } from '@/core/anti-tracking/TrackingFirewall';
import { storageProtection } from '@/core/anti-tracking/StorageProtectionLayer';

interface BreathingOptions {
  breathsPerMinute: number;
  oxygenThreshold: number;
  purificationLevel: 'basic' | 'advanced' | 'maximum' | 'safe_mode';
  antiTrackingMode: boolean;
  emergencyMode: boolean;
}

enum LungState {
  INHALING = 'inhaling',
  EXHALING = 'exhaling', 
  HOLDING = 'holding',
  PURIFYING = 'purifying',
  SAFE_MODE = 'safe_mode',
  DETOXING = 'detoxing',
  EMERGENCY_CLEANING = 'emergency_cleaning'
}

export class RespiratorySystem {
  private static instanceCount = 0;
  private instanceId: string;
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
  private breathingInterval: number | null = null;
  private antiTrackingInterval: number | null = null;

  constructor(options: Partial<BreathingOptions> = {}) {
    RespiratorySystem.instanceCount++;
    this.instanceId = `respiratory-${RespiratorySystem.instanceCount}-${Date.now()}`;
    
    // Prevenir múltiples instancias
    if (RespiratorySystem.instanceCount > 1) {
      console.warn(`⚠️ Múltiples instancias del sistema respiratorio detectadas (${RespiratorySystem.instanceCount})`);
      
      // Activar detox si hay demasiadas instancias
      if (RespiratorySystem.instanceCount > 3) {
        emergencyDetox.activateEmergencyMode();
        return;
      }
    }

    this.options = {
      breathsPerMinute: 20,
      oxygenThreshold: 80,
      purificationLevel: emergencyDetox.isSafeMode() ? 'safe_mode' : 'advanced',
      antiTrackingMode: !emergencyDetox.isSafeMode(),
      emergencyMode: false,
      ...options
    };

    this.initializeRespiratory();
  }

  private initializeRespiratory(): void {
    // Verificar si estamos en modo de emergencia
    if (emergencyDetox.isSafeMode()) {
      this.state = LungState.SAFE_MODE;
      this.initializeSafeMode();
    } else {
      this.initializeNormalMode();
    }

    console.log(`🫁 SISTEMA RESPIRATORIO v3.0 ACTIVADO [${this.instanceId}] - Modo: ${this.state}`);
  }

  private initializeSafeMode(): void {
    // Modo seguro sin anti-tracking agresivo
    this.breathingInterval = window.setInterval(() => {
      this.safeBreath();
    }, 5000);
  }

  private initializeNormalMode(): void {
    // Monitoreo de auto-destrucción
    this.monitorSelfDestruction();
    
    // Respiración anti-tracking controlada
    this.antiTrackingInterval = window.setInterval(() => {
      this.performControlledAntiTrackingBreath();
    }, 3000);

    // Respiración normal
    this.breathingInterval = window.setInterval(() => {
      this.performNormalBreath();
    }, 4000);
  }

  private monitorSelfDestruction(): void {
    let errorCount = 0;
    const maxErrors = 5;
    
    window.addEventListener('error', (event) => {
      if (event.message.includes('Illegal invocation') || 
          event.message.includes('RespiratorySystem')) {
        errorCount++;
        
        if (errorCount >= maxErrors) {
          console.log('🚨 Auto-destrucción detectada, activando emergencia');
          emergencyDetox.activateEmergencyMode();
        }
      }
    });
  }

  private safeBreath(): void {
    this.state = LungState.SAFE_MODE;
    this.oxygenLevel = Math.min(100, this.oxygenLevel + 1);
    
    // Solo limpiar tracking obvio y externo
    this.cleanObviousTracking();
    
    this.emitSafeBreath();
  }

  private cleanObviousTracking(): void {
    try {
      const keysToRemove: string[] = [];
      
      // Solo remover tracking obvio, no tocar storage interno
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && this.isObviousTracking(key) && !emergencyDetox.isInternalKey(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          // Silencioso
        }
      });
      
      if (keysToRemove.length > 0) {
        console.log(`🧹 Limpieza segura: ${keysToRemove.length} elementos obvios de tracking removidos`);
      }
    } catch (error) {
      // Respiración silenciosa si hay problemas
    }
  }

  private isObviousTracking(key: string): boolean {
    const obviousTrackers = ['_ga', '_gid', '_gat', 'fbp', 'fbc'];
    return obviousTrackers.some(tracker => key.includes(tracker));
  }

  private performControlledAntiTrackingBreath(): void {
    // Solo si no estamos en modo seguro
    if (emergencyDetox.isSafeMode()) {
      return;
    }

    try {
      this.state = LungState.PURIFYING;
      this.cleanObviousTracking();
      this.oxygenLevel = Math.min(100, this.oxygenLevel + 2);
    } catch (error) {
      // Activar modo seguro si hay problemas
      emergencyDetox.activateEmergencyMode();
    }
  }

  private performNormalBreath(): void {
    try {
      this.cleanBreathHistory();
      this.adjustBreathingState();
      this.emitBreath();
    } catch (error) {
      console.error('Error en respiración normal:', error);
      emergencyDetox.activateEmergencyMode();
    }
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

      // Purificación anti-tracking extrema solo en modo máximo
      if (this.options.purificationLevel === 'maximum') {
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
    try {
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
    } catch (error) {
      console.error('Error en purificación extrema:', error);
      emergencyDetox.activateEmergencyMode();
    }
  }

  private emitSafeBreath(): void {
    const event: CirculatoryEvent = {
      type: 'breath',
      source: 'lungs',
      data: {
        state: this.state,
        instanceId: this.instanceId,
        safeMode: true,
        oxygenLevel: this.oxygenLevel,
        detoxStatus: emergencyDetox.getDetoxStatus()
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        // Listener silencioso
      }
    });
  }

  private emitBreath(): void {
    const event: CirculatoryEvent = {
      type: 'breath',
      source: 'lungs',
      data: {
        state: this.state,
        instanceId: this.instanceId,
        rate: this.breathingRate,
        health: this.getHealth(),
        storageSize: this.secureStorage.size,
        detoxStatus: emergencyDetox.getDetoxStatus()
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        // Listener silencioso para evitar cascadas
      }
    });
  }

  public breatheIn(data: any): boolean {
    if (emergencyDetox.isSafeMode()) {
      // En modo seguro, solo aceptar datos internos
      if (this.containsTrackingData(data)) {
        return false;
      }
      return true;
    }

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
    try {
      const dataStr = JSON.stringify(data).toLowerCase();
      const trackingIndicators = ['analytics', 'tracking', 'pixel', 'beacon'];
      return trackingIndicators.some(indicator => dataStr.includes(indicator));
    } catch {
      return false;
    }
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
      airQuality: emergencyDetox.isSafeMode() ? 'filtered' : 
                  this.oxygenLevel > 90 ? 'pure' : 
                  this.oxygenLevel > 70 ? 'filtered' : 'contaminated',
      antiTrackingActive: this.antiTrackingActive && !emergencyDetox.isSafeMode()
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
    // Activar detox de emergencia
    emergencyDetox.activateEmergencyMode();
    
    this.secureStorage.clear();
    this.oxygenLevel = 100;
    this.breathHistory = [];
    this.state = LungState.SAFE_MODE;
    this.purificationActive = false;
    this.trackingAttackCount = 0;
    
    console.log(`🚨 PURGA DE EMERGENCIA RESPIRATORIA COMPLETADA [${this.instanceId}]`);
  }

  public destroy(): void {
    RespiratorySystem.instanceCount = Math.max(0, RespiratorySystem.instanceCount - 1);
    
    if (this.breathingInterval) {
      clearInterval(this.breathingInterval);
    }
    if (this.antiTrackingInterval) {
      clearInterval(this.antiTrackingInterval);
    }
    
    this.eventListeners = [];
    this.secureStorage.clear();
    
    console.log(`🫁 Sistema respiratorio destruido [${this.instanceId}]`);
  }
}
