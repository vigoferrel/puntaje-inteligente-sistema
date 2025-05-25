
/**
 * SISTEMA CIRCULATORIO SIMPLIFICADO v7.0 - POST-CIRUGÍA RADICAL
 * Responsabilidad única: Coordinación cardiovascular unificada
 */

import { CardiovascularSystem } from './CardiovascularSystem';
import { SystemVitals, CirculatoryEvent, EnhancedModuleIdentity } from './types';

export class CirculatorySystem {
  private heart: CardiovascularSystem;
  private bloodFlow: Map<string, any> = new Map();
  private lastSystemCheck: number = 0;
  private isHealthy: boolean = true;

  constructor() {
    this.heart = new CardiovascularSystem({
      maxBeatsPerSecond: 8,
      restingPeriod: 1200,
      recoveryTime: 4000,
      emergencyThreshold: 12,
      purificationLevel: 'maximum',
      oxygenThreshold: 75
    });

    this.connectSystems();
  }

  private connectSystems(): void {
    // El corazón ahora maneja toda la funcionalidad
    this.heart.subscribe((event: CirculatoryEvent) => {
      if (event.type === 'heartbeat') {
        this.regulateCirculation(event.data);
      }
    });

    // Monitoreo de salud cada 30 segundos
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  private regulateCirculation(heartData: any): void {
    if (heartData.health.circulation > 60) {
      const circulationPacket = {
        type: 'circulation_flow',
        circulation: heartData.health.circulation,
        oxygenation: heartData.oxygenLevel || heartData.health.oxygenation,
        timestamp: Date.now()
      };

      this.bloodFlow.set(`flow_${Date.now()}`, circulationPacket);
    }
  }

  private performHealthCheck(): void {
    const now = Date.now();
    this.lastSystemCheck = now;

    const heartHealth = this.heart.getHealth();

    this.isHealthy = 
      heartHealth.circulation > 50 && 
      heartHealth.oxygenation > 60 &&
      heartHealth.bloodPressure !== 'emergency';

    // Limpiar flujo sanguíneo de datos antiguos
    for (const [key, value] of this.bloodFlow.entries()) {
      if (now - value.timestamp > 120000) {
        this.bloodFlow.delete(key);
      }
    }

    if (!this.isHealthy && heartHealth.bloodPressure === 'emergency') {
      this.emergencyIntervention();
    }
  }

  public canProcessSignal(): boolean {
    return this.heart.canPump() && this.isHealthy;
  }

  public processSignal(signal: any): boolean {
    if (!this.canProcessSignal()) {
      return false;
    }

    // El corazón unificado procesa todo
    const pumped = this.heart.pump();
    if (!pumped) return false;

    const processed = this.heart.breatheIn(signal);
    if (!processed) return false;

    const circulatedSignal = this.heart.breatheOut(signal);
    this.bloodFlow.set(`signal_${Date.now()}`, {
      original: signal,
      processed: circulatedSignal,
      timestamp: Date.now()
    });

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
    const heartHealth = this.heart.getHealth();
    const respiratoryHealth = this.heart.getRespiratoryHealth();

    return {
      cardiovascular: heartHealth,
      respiratory: respiratoryHealth,
      overallHealth: this.calculateOverallHealth(),
      lastCheckup: this.lastSystemCheck
    };
  }

  private calculateOverallHealth(): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    const heartHealth = this.heart.getHealth();

    if (heartHealth.bloodPressure === 'emergency' || heartHealth.oxygenation < 50) {
      return 'critical';
    }

    const avgHealth = (heartHealth.circulation + heartHealth.oxygenation) / 2;
    
    if (avgHealth >= 90) return 'excellent';
    if (avgHealth >= 75) return 'good';
    if (avgHealth >= 60) return 'fair';
    if (avgHealth >= 40) return 'poor';
    return 'critical';
  }

  private emergencyIntervention(): void {
    console.log('🚨 INTERVENCIÓN DE EMERGENCIA v7.0: Reiniciando sistema cardiovascular unificado');
    
    this.heart.emergencyReset();
    this.heart.surgicalPurge();
    this.bloodFlow.clear();
    this.isHealthy = true;
  }

  public emergencyReset(): void {
    this.emergencyIntervention();
  }

  public destroy(): void {
    this.heart.destroy();
    this.bloodFlow.clear();
  }
}
