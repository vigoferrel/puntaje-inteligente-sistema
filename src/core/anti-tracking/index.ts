
/**
 * SISTEMA ANTI-TRACKING INTEGRISTA v8.0
 * Exportación simplificada - Todo el detox está en CardiovascularSystem
 */

import { CardiovascularSystem } from '../system-vitals/CardiovascularSystem';
import { StorageProtectionLayer } from './StorageProtectionLayer';
import { TrackingFirewall } from './TrackingFirewall';

// SINGLETON CARDIOVASCULAR INTEGRISTA COMO SISTEMA DE DETOX
export const getIntegristaDetoxSystem = () => {
  return CardiovascularSystem.getInstance({
    maxBeatsPerSecond: 6,
    restingPeriod: 3000,
    recoveryTime: 8000,
    emergencyThreshold: 10,
    purificationLevel: 'maximum',
    oxygenThreshold: 75
  });
};

// INICIALIZACIÓN SIMPLIFICADA DEL SISTEMA ANTI-TRACKING
export const initializeAntiTrackingSystem = () => {
  try {
    console.log('🛡️ Inicializando sistema anti-tracking integrista v8.0');
    
    // Inicializar el sistema cardiovascular integrista (incluye detox)
    const cardiovascularDetox = getIntegristaDetoxSystem();
    
    // Sistemas complementarios
    const storageProtection = new StorageProtectionLayer();
    const trackingFirewall = new TrackingFirewall();
    
    // Configurar protecciones
    storageProtection.initialize();
    trackingFirewall.initialize();
    
    console.log('✅ Sistema anti-tracking integrista v8.0 inicializado');
    
    return {
      cardiovascularDetox,
      storageProtection,
      trackingFirewall,
      version: 'v8.0-integrista'
    };
    
  } catch (error) {
    console.error('❌ Error inicializando sistema anti-tracking integrista:', error);
    
    // Fallback usando solo el sistema cardiovascular
    return {
      cardiovascularDetox: getIntegristaDetoxSystem(),
      version: 'v8.0-integrista-fallback'
    };
  }
};

// ACTIVACIÓN DE EMERGENCIA DIRECTA AL SISTEMA CARDIOVASCULAR
export const activateEmergencyDetox = () => {
  const cardiovascularDetox = getIntegristaDetoxSystem();
  cardiovascularDetox.activateIntegratedEmergencyMode();
};

// VERIFICACIÓN DE MODO SEGURO
export const isSafeMode = () => {
  const cardiovascularDetox = getIntegristaDetoxSystem();
  return cardiovascularDetox.isSafeMode();
};

// ESTADO DEL SISTEMA INTEGRADO
export const getSystemStatus = () => {
  const cardiovascularDetox = getIntegristaDetoxSystem();
  return cardiovascularDetox.getIntegratedSystemStatus();
};

// Compatibilidad con importaciones antiguas
export const emergencyDetox = getIntegristaDetoxSystem();
export { getIntegristaDetoxSystem as EmergencyDetox };
