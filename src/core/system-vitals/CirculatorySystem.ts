
/**
 * SISTEMA CIRCULATORIO - Conexión Cardiovascular-Respiratoria v1.0
 * Responsabilidad única: Comunicación fluida entre corazón y pulmón
 */

import { CardiovascularSystem } from './CardiovascularSystem';
import { RespiratorySystem } from './RespiratorySystem';
import { SystemVitals, CirculatoryEvent, EnhancedModuleIdentity } from './types';

export class CirculatorySystem {
  private heart: CardiovascularSystem;
  private lungs: RespiratorySystem;
  private bloodFlow: Map<string, any> = new Map();
  private lastSystemCheck: number = 0;
  private isHealthy: boolean = true;

  constructor() {
    this.heart = new CardiovascularSystem({
      maxBeatsPerSecond: 8,
      restingPeriod: 1200,
      recoveryTime: 4000,
      emergencyThreshold: 12
    });

    this.lungs = new RespiratorySystem({
      breathsPerMinute: 15,
      oxygenThreshold: 75,
      purificationLevel: 'maximum',
      antiTrackingMode: true
    });

    this.connectSystems();
  }

  private connectSystems(): void {
    // Conectar corazón -> pulmón
    this.heart.subscribe((event: CirculatoryEvent) => {
      if (event.type === 'heartbeat') {
        this.deliverOxygen(event.data);
      }
    });

    // Conectar pulmón -> corazón
    this.lungs.subscribe((event: CirculatoryEvent) => {
      if (event.type === 'breath') {
        this.regulateHeartbeat(event.data);
      }
    });

    // Monitoreo de salud cada 30 segundos
    setInterval(() => {
      this.performHealthCheck();
    }, 30000);
  }

  private deliverOxygen(heartData: any): void {
    // Solo entregar oxígeno si el corazón está saludable
    if (heartData.health.circulation > 60) {
      const oxygenPacket = {
        type: 'oxygen_delivery',
        circulation: heartData.health.circulation,
        timestamp: Date.now()
      };

      this.bloodFlow.set(`oxygen_${Date.now()}`, oxygenPacket);
    }
  }

  private regulateHeartbeat(lungData: any): void {
    // Ajustar ritmo cardíaco basado en oxigenación
    if (lungData.health.oxygenLevel < 70) {
      // Respiración comprometida -> corazón debe trabajar más
      this.bloodFlow.set(`regulation_${Date.now()}`, {
        type: 'increase_heartbeat',
        reason: 'low_oxygen',
        timestamp: Date.now()
      });
    }
  }

  private performHealthCheck(): void {
    const now = Date.now();
    this.lastSystemCheck = now;

    const heartHealth = this.heart.getHealth();
    const lungHealth = this.lungs.getHealth();

    // Determinar salud general del sistema
    this.isHealthy = 
      heartHealth.circulation > 50 && 
      lungHealth.oxygenLevel > 60 &&
      heartHealth.bloodPressure !== 'emergency';

    // Limpiar flujo sanguíneo de datos antiguos
    for (const [key, value] of this.bloodFlow.entries()) {
      if (now - value.timestamp > 120000) { // 2 minutos
        this.bloodFlow.delete(key);
      }
    }

    // Auto-recovery si es necesario
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

    // Corazón bombea la señal
    const pumped = this.heart.pump();
    if (!pumped) return false;

    // Pulmón procesa y purifica
    const processed = this.lungs.breatheIn(signal);
    if (!processed) return false;

    // Circular la señal procesada
    const circulatedSignal = this.lungs.breatheOut(signal);
    this.bloodFlow.set(`signal_${Date.now()}`, {
      original: signal,
      processed: circulatedSignal,
      timestamp: Date.now()
    });

    return true;
  }

  public oxygenateModule(module: any): EnhancedModuleIdentity {
    // Asegurar que el módulo tenga el formato correcto
    const enhancedModule: EnhancedModuleIdentity = {
      id: module.id,
      type: module.type,
      capabilities: module.capabilities || [],
      current_state: module.current_state || {},
      security_context: module.security_context
    };

    return this.lungs.oxygenate(enhancedModule);
  }

  public getSystemVitals(): SystemVitals {
    return {
      cardiovascular: this.heart.getHealth(),
      respiratory: this.lungs.getHealth(),
      overallHealth: this.calculateOverallHealth(),
      lastCheckup: this.lastSystemCheck
    };
  }

  private calculateOverallHealth(): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    const heartHealth = this.heart.getHealth();
    const lungHealth = this.lungs.getHealth();

    if (heartHealth.bloodPressure === 'emergency' || lungHealth.oxygenLevel < 50) {
      return 'critical';
    }

    const avgHealth = (heartHealth.circulation + lungHealth.oxygenLevel) / 2;
    
    if (avgHealth >= 90) return 'excellent';
    if (avgHealth >= 75) return 'good';
    if (avgHealth >= 60) return 'fair';
    if (avgHealth >= 40) return 'poor';
    return 'critical';
  }

  private emergencyIntervention(): void {
    console.log('🚨 INTERVENCIÓN DE EMERGENCIA: Reiniciando sistemas cardiovascular-respiratorio');
    
    this.heart.emergencyReset();
    this.lungs.emergencyPurge();
    this.bloodFlow.clear();
    this.isHealthy = true;
  }

  public emergencyReset(): void {
    this.emergencyIntervention();
  }

  public destroy(): void {
    this.heart.destroy();
    this.lungs.destroy();
    this.bloodFlow.clear();
  }
}
