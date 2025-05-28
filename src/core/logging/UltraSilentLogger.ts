
/**
 * ULTRA SILENT LOGGER v1.0
 * Sistema de logging completamente silencioso con modo emergencia
 */

interface EmergencyLogLevel {
  emergency: number;
  critical: number;
  disabled: number;
}

class UltraSilentLogger {
  private static instance: UltraSilentLogger;
  private isTotalSilence = true;
  private emergencyMode = false;
  private logLevel: EmergencyLogLevel = {
    emergency: 0,
    critical: 1,
    disabled: 999
  };

  static getInstance(): UltraSilentLogger {
    if (!UltraSilentLogger.instance) {
      UltraSilentLogger.instance = new UltraSilentLogger();
    }
    return UltraSilentLogger.instance;
  }

  private constructor() {
    // Verificar si el sistema de interceptación global está activo
    this.isTotalSilence = window.__TOTAL_SILENCE_MODE__ ?? true;
  }

  // Métodos completamente silenciosos por defecto
  debug() { /* SILENCIO TOTAL */ }
  info() { /* SILENCIO TOTAL */ }
  warn() { /* SILENCIO TOTAL */ }
  error() { /* SILENCIO TOTAL */ }
  log() { /* SILENCIO TOTAL */ }

  // Método de emergencia solo para desarrollo crítico
  emergency(...args: any[]) {
    if (this.emergencyMode && process.env.NODE_ENV === 'development') {
      if (window.emergencyLog) {
        window.emergencyLog(...args);
      }
    }
  }

  // Métodos de control
  enableEmergencyMode() {
    this.emergencyMode = true;
  }

  disableEmergencyMode() {
    this.emergencyMode = false;
  }

  isSilent(): boolean {
    return this.isTotalSilence;
  }
}

export const ultraSilentLogger = UltraSilentLogger.getInstance();
