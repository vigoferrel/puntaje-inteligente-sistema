
/**
 * SISTEMA CARDIOVASCULAR - Corazón Digital Limpio v1.0
 * Responsabilidad única: Control de flujo y regulación del sistema
 */

import { CardiovascularHealth, CirculatoryEvent } from './types';

interface HeartbeatOptions {
  maxBeatsPerSecond: number;
  restingPeriod: number;
  recoveryTime: number;
  emergencyThreshold: number;
}

enum HeartState {
  RESTING = 'resting',
  NORMAL = 'normal', 
  ELEVATED = 'elevated',
  EMERGENCY = 'emergency'
}

export class CardiovascularSystem {
  private state: HeartState = HeartState.NORMAL;
  private heartRate: number = 0;
  private lastBeat: number = 0;
  private beatHistory: number[] = [];
  private emergencyStartTime: number = 0;
  private readonly options: HeartbeatOptions;
  private eventListeners: ((event: CirculatoryEvent) => void)[] = [];

  constructor(options: Partial<HeartbeatOptions> = {}) {
    this.options = {
      maxBeatsPerSecond: 10,
      restingPeriod: 1000,
      recoveryTime: 3000,
      emergencyThreshold: 15,
      ...options
    };

    this.startHeartbeat();
  }

  private startHeartbeat(): void {
    setInterval(() => {
      this.cleanBeatHistory();
      this.adjustHeartState();
      this.emitHeartbeat();
    }, 1000);
  }

  private cleanBeatHistory(): void {
    const now = Date.now();
    this.beatHistory = this.beatHistory.filter(beat => now - beat < 1000);
    this.heartRate = this.beatHistory.length;
  }

  private adjustHeartState(): void {
    const now = Date.now();
    
    if (this.state === HeartState.EMERGENCY) {
      if (now - this.emergencyStartTime > this.options.recoveryTime) {
        this.state = HeartState.ELEVATED;
      }
      return;
    }

    if (this.heartRate >= this.options.emergencyThreshold) {
      this.state = HeartState.EMERGENCY;
      this.emergencyStartTime = now;
    } else if (this.heartRate >= this.options.maxBeatsPerSecond) {
      this.state = HeartState.ELEVATED;
    } else if (this.heartRate === 0) {
      this.state = HeartState.RESTING;
    } else {
      this.state = HeartState.NORMAL;
    }
  }

  private emitHeartbeat(): void {
    const event: CirculatoryEvent = {
      type: 'heartbeat',
      source: 'heart',
      data: {
        state: this.state,
        rate: this.heartRate,
        health: this.getHealth()
      },
      timestamp: Date.now()
    };

    this.eventListeners.forEach(listener => listener(event));
  }

  public canPump(): boolean {
    const now = Date.now();
    
    if (this.state === HeartState.EMERGENCY) {
      return false;
    }

    if (now - this.lastBeat < this.getRestingPeriod()) {
      return false;
    }

    if (this.heartRate >= this.getMaxRate()) {
      return false;
    }

    return true;
  }

  public pump(): boolean {
    if (!this.canPump()) {
      return false;
    }

    const now = Date.now();
    this.beatHistory.push(now);
    this.lastBeat = now;
    
    return true;
  }

  private getRestingPeriod(): number {
    switch (this.state) {
      case HeartState.RESTING: return this.options.restingPeriod * 0.8;
      case HeartState.NORMAL: return this.options.restingPeriod;
      case HeartState.ELEVATED: return this.options.restingPeriod * 1.5;
      case HeartState.EMERGENCY: return this.options.restingPeriod * 3;
    }
  }

  private getMaxRate(): number {
    switch (this.state) {
      case HeartState.RESTING: return this.options.maxBeatsPerSecond;
      case HeartState.NORMAL: return this.options.maxBeatsPerSecond;
      case HeartState.ELEVATED: return Math.max(3, this.options.maxBeatsPerSecond - 3);
      case HeartState.EMERGENCY: return 1;
    }
  }

  public getHealth(): CardiovascularHealth {
    return {
      heartRate: this.heartRate,
      bloodPressure: this.state as any,
      circulation: Math.max(0, 100 - (this.heartRate * 5)),
      oxygenation: this.state === HeartState.EMERGENCY ? 30 : Math.max(70, 100 - this.heartRate)
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

  public emergencyReset(): void {
    this.state = HeartState.NORMAL;
    this.heartRate = 0;
    this.beatHistory = [];
    this.lastBeat = 0;
    this.emergencyStartTime = 0;
  }

  public destroy(): void {
    this.eventListeners = [];
  }
}
