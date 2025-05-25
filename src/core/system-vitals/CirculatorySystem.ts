
/**
 * SISTEMA CIRCULATORIO SINGLETON v7.2 - POST-CIRUGÍA ESTABILIZACIÓN
 * Responsabilidad única: Coordinación cardiovascular unificada con singleton estricto
 */

import { CardiovascularSystem } from './CardiovascularSystem';
import { SystemVitals, CirculatoryEvent, EnhancedModuleIdentity } from './types';

export class CirculatorySystem {
  private heart: CardiovascularSystem;
  private bloodFlow: Map<string, any> = new Map();
  private lastSystemCheck: number = 0;
  private isHealthy: boolean = true;
  private lastLogTime: number = 0;
  private logThrottle: number = 30000; // 30 segundos

  constructor() {
    // USAR SINGLETON ESTRICTO v7.2
    this.heart = CardiovascularSystem.getInstance({
      maxBeatsPerSecond: 6,     // Más conservador
      restingPeriod: 2500,      // Más espaciado
      recoveryTime: 6000,       // Recovery más largo
      emergencyThreshold: 10,   // Más tolerante
      purificationLevel: 'maximum',
      oxygenThreshold: 75
    });

    this.connectSystems();
  }

  private connectSystems(): void {
    // El corazón singleton maneja toda la funcionalidad
    this.heart.subscribe((event: CirculatoryEvent) => {
      if (event.type === 'heartbeat') {
        this.regulateCirculation(event.data);
      }
    });

    // Monitoreo de salud cada 60 segundos (reducido)
    setInterval(() => {
      this.performHealthCheck();
    }, 60000);
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
    const shouldLog = now - this.lastLogTime > this.logThrottle;
    
    this.lastSystemCheck = now;

    const heartHealth = this.heart.getHealth();

    this.isHealthy = 
      heartHealth.circulation > 40 &&  // Más permisivo
      heartHealth.oxygenation > 50 &&  // Más permisivo
      heartHealth.bloodPressure !== 'emergency';

    // Limpiar flujo sanguíneo de datos antiguos (más agresivo)
    for (const [key, value] of this.bloodFlow.entries()) {
      if (now - value.timestamp > 180000) { // 3 minutos
        this.bloodFlow.delete(key);
      }
    }

    if (!this.isHealthy && heartHealth.bloodPressure === 'emergency') {
      if (shouldLog) {
        console.log('🚨 Intervención circulatoria necesaria v7.2');
        this.lastLogTime = now;
      }
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

    // El corazón singleton procesa todo
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

  private emergencyIntervention(): void {
    // Log throttled de emergencia
    const now = Date.now();
    if (now - this.lastLogTime > 10000) { // Solo cada 10 segundos en emergencia
      console.log('🚨 INTERVENCIÓN DE EMERGENCIA CIRCULATORIA v7.2');
      this.lastLogTime = now;
    }
    
    this.heart.emergencyReset();
    this.heart.surgicalPurge();
    this.bloodFlow.clear();
    this.isHealthy = true;
  }

  public emergencyReset(): void {
    this.emergencyIntervention();
  }

  public destroy(): void {
    // NO destruir el singleton cardiovascular
    this.bloodFlow.clear();
    console.log('🩸 Sistema circulatorio v7.2 limpiado (corazón singleton preservado)');
  }
}
