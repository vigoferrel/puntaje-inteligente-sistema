
/**
 * CAPA DE PROTECCIÓN DE STORAGE INTEGRISTA v8.0
 * Delegación completa al sistema cardiovascular
 */

import { CardiovascularSystem } from '../system-vitals/CardiovascularSystem';

export class StorageProtectionLayer {
  private cardiovascularSystem: CardiovascularSystem;

  constructor() {
    this.cardiovascularSystem = CardiovascularSystem.getInstance();
  }

  public initialize(): void {
    // Delegación al sistema cardiovascular integrista
    console.log('🛡️ Protección de storage delegada al sistema cardiovascular v8.0');
  }

  public protect(): void {
    // El sistema cardiovascular maneja toda la protección
    if (this.cardiovascularSystem.isSafeMode()) {
      console.log('🛡️ Storage protegido por sistema cardiovascular integrista');
    }
  }
}

// Export compatible con importaciones previas
export const storageProtection = new StorageProtectionLayer();
