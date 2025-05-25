/**
 * Tipos del Sistema Cardiovascular-Respiratorio
 * Arquitectura limpia para corazón, pulmón y circulación
 */

// Contexto de seguridad modular
export interface ModuleSecurityContext {
  security_mode?: 'anti_tracking_active' | 'normal' | 'stealth';
  tracking_protected?: boolean;
  shield_level?: number;
  encryption_enabled?: boolean;
  firewall_active?: boolean;
  storage_protected?: boolean;
  purification_level?: string;
  emergency_mode?: boolean;
  surgical_recovery?: boolean; // Agregar propiedad faltante
}

// Identidad de módulo extendida
export interface EnhancedModuleIdentity {
  id: string;
  type: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard' | 'intersectional';
  capabilities: string[];
  current_state: any;
  security_context?: ModuleSecurityContext;
}

// Sistema de salud cardiovascular
export interface CardiovascularHealth {
  heartRate: number;
  bloodPressure: 'optimal' | 'monitored' | 'restricted' | 'emergency';
  circulation: number;
  oxygenation: number;
}

// Sistema de salud respiratorio
export interface RespiratoryHealth {
  breathingRate: number;
  oxygenLevel: number;
  airQuality: 'pure' | 'filtered' | 'contaminated';
  antiTrackingActive: boolean;
}

// Comunicación entre sistemas
export interface SystemVitals {
  cardiovascular: CardiovascularHealth;
  respiratory: RespiratoryHealth;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  lastCheckup: number;
}

// Eventos del sistema circulatorio
export interface CirculatoryEvent {
  type: 'heartbeat' | 'breath' | 'oxygen_delivery' | 'toxin_removal';
  source: 'heart' | 'lungs' | 'circulation';
  data: any;
  timestamp: number;
}
