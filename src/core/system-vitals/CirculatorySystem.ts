
/**
 * SISTEMA CIRCULATORIO INTEGRISTA v8.0 - DELEGACIÓN COMPLETA
 * Responsabilidad única: Delegación al CardiovascularSystem integrista
 */

import { CardiovascularSystem } from './CardiovascularSystem';
import { SystemVitals, CirculatoryEvent, EnhancedModuleIdentity } from './types';

export class CirculatorySystem {
  private heart: CardiovascularSystem;
  private lastLogTime: number = 0;
  private logThrottle: number = 120000; // 2 minutos

  constructor() {
    // USAR SINGLETON INTEGRISTA v8.0
    this.heart = CardiovascularSystem.getInstance({
      maxBeatsPerSecond: 5,     // Más conservador para v8.0
      restingPeriod: 3000,      // Más espaciado
      recoveryTime: 8000,       // Recovery más largo
      emergencyThreshold: 8,    // Más tolerante
      purificationLevel: 'maximum',
      oxygenThreshold: 80
    });

    this.connectToIntegristaSystem();
  }

  private connectToIntegristaSystem(): void {
    // El sistema cardiovascular integrista maneja TODA la funcionalidad
    this.heart.subscribe((event: CirculatoryEvent) => {
      if (event.type === 'heartbeat') {
        // Sistema circulatorio simplificado - solo delega
        const now = Date.now();
        if (now - this.lastLogTime > this.logThrottle && Math.random() > 0.95) {
          console.log('🩸 Sistema circulatorio v8.0 delegando al integrista');
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

    // Delegación completa al sistema cardiovascular integrista
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
    // Delegación completa al sistema integrista
    this.heart.emergencyReset();
  }

  public destroy(): void {
    // NO destruir el singleton integrista
    console.log('🩸 Sistema circulatorio v8.0 limpiado (integrista preservado)');
  }
}
