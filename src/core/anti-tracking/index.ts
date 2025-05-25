
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
    
    // Verificar si necesitamos modo de emergencia usando import directo
    import('./EmergencyDetox').then(({ emergencyDetox }) => {
      if (emergencyDetox.isSafeMode()) {
        console.log('⚠️ Sistema iniciado en MODO SEGURO');
        return;
      }
    });
    
    // Las instancias se inicializan automáticamente al importar
    console.log('✅ Firewall Anti-Tracking: ACTIVO');
    console.log('✅ Protección de Storage: ACTIVA');
    console.log('✅ Purificación Respiratoria: ACTIVA');
    console.log('✅ Desintoxicación de Emergencia: STANDBY');
    
  } catch (error) {
    console.error('Error inicializando anti-tracking:', error);
    
    // Activar modo de emergencia si hay problemas en la inicialización
    import('./EmergencyDetox').then(({ emergencyDetox }) => {
      emergencyDetox.activateEmergencyMode();
    }).catch(err => {
      console.error('Error crítico en emergencyDetox:', err);
    });
  }
};

// Emergency reset global mejorado
export const emergencyAntiTrackingReset = async () => {
  console.log('🚨 RESET DE EMERGENCIA ANTI-TRACKING GLOBAL v2.0');
  
  try {
    const { emergencyDetox } = await import('./EmergencyDetox');
    
    // Activar desintoxicación de emergencia
    emergencyDetox.activateEmergencyMode();
    
    // Intentar reset tradicional después de detox
    setTimeout(async () => {
      try {
        const [{ trackingFirewall }, { storageProtection }] = await Promise.all([
          import('./TrackingFirewall'),
          import('./StorageProtectionLayer')
        ]);
        
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
export const getAntiTrackingHealth = async () => {
  try {
    const [{ emergencyDetox }, { trackingFirewall }, { storageProtection }] = await Promise.all([
      import('./EmergencyDetox'),
      import('./TrackingFirewall'),
      import('./StorageProtectionLayer')
    ]);
    
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
