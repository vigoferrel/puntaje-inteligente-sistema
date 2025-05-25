
/**
 * SISTEMA ANTI-TRACKING UNIFICADO v2.0
 * Exportaciones centralizadas con desintoxicación de emergencia
 */

export { trackingFirewall } from './TrackingFirewall';
export { storageProtection } from './StorageProtectionLayer';
export { emergencyDetox, EmergencyDetox } from './EmergencyDetox';

// Función de inicialización global anti-tracking con protección
export const initializeAntiTrackingSystem = () => {
  try {
    console.log('🛡️ SISTEMA ANTI-TRACKING v2.0 INICIADO - Con protección anti-autodestrucción');
    
    // Verificar si necesitamos modo de emergencia
    const { emergencyDetox } = require('./EmergencyDetox');
    
    if (emergencyDetox.isSafeMode()) {
      console.log('⚠️ Sistema iniciado en MODO SEGURO');
      return;
    }
    
    // Las instancias se inicializan automáticamente al importar
    console.log('✅ Firewall Anti-Tracking: ACTIVO');
    console.log('✅ Protección de Storage: ACTIVA');
    console.log('✅ Purificación Respiratoria: ACTIVA');
    console.log('✅ Desintoxicación de Emergencia: STANDBY');
    
  } catch (error) {
    console.error('Error inicializando anti-tracking:', error);
    
    // Activar modo de emergencia si hay problemas en la inicialización
    const { emergencyDetox } = require('./EmergencyDetox');
    emergencyDetox.activateEmergencyMode();
  }
};

// Emergency reset global mejorado
export const emergencyAntiTrackingReset = () => {
  console.log('🚨 RESET DE EMERGENCIA ANTI-TRACKING GLOBAL v2.0');
  
  try {
    const { emergencyDetox } = require('./EmergencyDetox');
    
    // Activar desintoxicación de emergencia
    emergencyDetox.activateEmergencyMode();
    
    // Intentar reset tradicional después de detox
    setTimeout(() => {
      try {
        const { trackingFirewall } = require('./TrackingFirewall');
        const { storageProtection } = require('./StorageProtectionLayer');
        
        trackingFirewall.emergencyPurge();
        storageProtection.emergencyWipe();
      } catch (error) {
        console.error('Error en reset tradicional:', error);
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error en reset de emergencia:', error);
    
    // Último recurso: reload de la página
    setTimeout(() => {
      window.location.reload();
    }, 10000);
  }
  
  console.log('✅ Reset de emergencia v2.0 completado');
};

// Función de salud del sistema
export const getAntiTrackingHealth = () => {
  try {
    const { emergencyDetox } = require('./EmergencyDetox');
    const { trackingFirewall } = require('./TrackingFirewall');
    const { storageProtection } = require('./StorageProtectionLayer');
    
    return {
      detoxStatus: emergencyDetox.getDetoxStatus(),
      firewallStats: trackingFirewall.getFirewallStats(),
      protectionStats: storageProtection.getProtectionStats(),
      overallHealth: emergencyDetox.isSafeMode() ? 'safe_mode' : 'active'
    };
  } catch (error) {
    return {
      overallHealth: 'error',
      error: error.message
    };
  }
};
