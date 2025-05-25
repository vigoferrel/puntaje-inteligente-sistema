/**
 * SISTEMA CIRCULATORIO v8.2 - DELEGACIÓN CALIBRADA
 * Responsabilidad única: Delegación silenciosa al CardiovascularSystem
 */

import { CardiovascularSystem } from './CardiovascularSystem';
import { SystemVitals, CirculatoryEvent, EnhancedModuleIdentity } from './types';

export class CirculatorySystem {
  private heart: CardiovascularSystem;
  private lastLogTime: number = 0;
  private logThrottle: number = 300000; // 5 minutos para v8.2

  constructor() {
    // USAR SINGLETON CALIBRADO v8.2
    this.heart = CardiovascularSystem.getInstance({
      maxBeatsPerSecond: 4,     // Más conservador para v8.2
      restingPeriod: 4000,      // Más espaciado
      recoveryTime: 10000,      // Recovery más largo
      emergencyThreshold: 8,    // Más tolerante
      purificationLevel: 'safe_mode',
      oxygenThreshold: 70
    });

    this.connectToCalibratedSystem();
  }

  private connectToCalibratedSystem(): void {
    // Sistema circulatorio silencioso - delegación completa
    this.heart.subscribe((event: CirculatoryEvent) => {
      if (event.type === 'heartbeat') {
        const now = Date.now();
        // Solo log muy ocasional y crítico
        if (now - this.lastLogTime > this.logThrottle && Math.random() > 0.98) {
          console.log('🩸 Sistema circulatorio v8.2 delegando (modo silencioso)');
          this.lastLogTime = now;
        }
      }
    });
  }

  public canProcessSignal(): boolean {
    return this.heart.canPump() && !this.heart.isSafeMode();
  }

  public processSignal(signal: any): boolean {
    if (!this.canProcessSignal()) {
      return false;
    }

    const pumped = this.heart.pump();
    if (!pumped) return false;

    const processed = this.heart.breatheIn(signal);
    if (!processed) return false;

    this.heart.breatheOut(signal);
    return true;
  }

  public oxygenateModule(module: any): EnhancedModuleIdentity {
    const enhancedModule: EnhancedModuleIdentity = {
      id: module.id,
      type: module.type,
      capabilities: module.capabilities || [],
      current_state: module.current_state || {},
      security_context: module.security_context
    };

    return this.heart.oxygenate(enhancedModule);
  }

  public getSystemVitals(): SystemVitals {
    const integristaStatus = this.heart.getIntegratedSystemStatus();
    const respiratoryHealth = this.heart.getRespiratoryHealth();

    return {
      cardiovascular: integristaStatus.cardiovascular,
      respiratory: respiratoryHealth,
      overallHealth: this.calculateOverallHealth(integristaStatus.cardiovascular),
      lastCheckup: integristaStatus.timestamp
    };
  }

  private calculateOverallHealth(heartHealth: any): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (heartHealth.bloodPressure === 'emergency' || heartHealth.oxygenation < 40) {
      return 'critical';
    }

    const avgHealth = (heartHealth.circulation + heartHealth.oxygenation) / 2;
    
    if (avgHealth >= 85) return 'excellent';
    if (avgHealth >= 70) return 'good';
    if (avgHealth >= 50) return 'fair';
    if (avgHealth >= 30) return 'poor';
    return 'critical';
  }

  public emergencyReset(): void {
    this.heart.emergencyReset();
  }

  public destroy(): void {
    // NO destruir el singleton integrista
    console.log('🩸 Sistema circulatorio v8.2 limpiado (integrista preservado)');
  }
}
