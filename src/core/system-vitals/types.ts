
/**
 * Tipos del Sistema Cardiovascular Unificado v8.0
 * Arquitectura simplificada post-cirugía radical + soporte detox
 */

// Contexto de seguridad modular con soporte detox integrado
export interface ModuleSecurityContext {
  security_mode?: 'anti_tracking_active' | 'normal' | 'stealth';
  tracking_protected?: boolean;
  shield_level?: number;
  encryption_enabled?: boolean;
  firewall_active?: boolean;
  storage_protected?: boolean;
  purification_level?: string;
  emergency_mode?: boolean;
  surgical_recovery?: boolean;
  detox_level?: 'minimal' | 'moderate' | 'aggressive' | 'surgical';
  integrista_version?: string;
}

// Identidad de módulo extendida
export interface EnhancedModuleIdentity {
  id: string;
  type: 'diagnostic' | 'lectoguia' | 'plans' | 'paes_universe' | 'dashboard' | 'intersectional';
  capabilities: string[];
  current_state: any;
  security_context?: ModuleSecurityContext;
}

// Sistema de salud cardiovascular unificado (incluye funcionalidad respiratoria)
export interface CardiovascularHealth {
  heartRate: number;
  bloodPressure: 'optimal' | 'monitored' | 'restricted' | 'emergency' | 'resting' | 'normal' | 'elevated' | 'purifying';
  circulation: number;
  oxygenation: number;
}

// Sistema de salud respiratorio (ahora manejado por el corazón)
export interface RespiratoryHealth {
  breathingRate: number;
  oxygenLevel: number;
  airQuality: 'pure' | 'filtered' | 'contaminated';
  antiTrackingActive: boolean;
}

// Comunicación entre sistemas - CORREGIDO para incluir "emergency"
export interface SystemVitals {
  cardiovascular: CardiovascularHealth;
  respiratory: RespiratoryHealth;
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | 'emergency';
  lastCheckup: number;
}

// Eventos del sistema circulatorio unificado
export interface CirculatoryEvent {
  type: 'heartbeat' | 'breath' | 'oxygen_delivery' | 'toxin_removal';
  source: 'heart' | 'lungs' | 'circulation';
  data: any;
  timestamp: number;
}
