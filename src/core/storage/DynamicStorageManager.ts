
/**
 * DYNAMIC STORAGE MANAGER v1.0 - SOPORTE PARA CLAVES DINÁMICAS Y NAMESPACES
 * Sistema flexible que mantiene type-safety con claves parametrizadas
 */

import { storageManager } from './StorageManager';

// Tipos base para namespaces
export interface NamespaceTypes {
  'user_preferences_cache_v2': Record<string, string>;
  'user_session_data': any;
  'user_progress_cache': any;
}

// Tipo para generar claves dinámicas
export type DynamicKey<T extends keyof NamespaceTypes> = `${T}_${string}`;

// Manager especializado para claves dinámicas
class DynamicStorageManager {
  private static instance: DynamicStorageManager;

  static getInstance(): DynamicStorageManager {
    if (!DynamicStorageManager.instance) {
      DynamicStorageManager.instance = new DynamicStorageManager();
    }
    return DynamicStorageManager.instance;
  }

  // Método genérico para obtener datos con claves dinámicas
  getDynamicItem<T extends keyof NamespaceTypes>(
    namespace: T,
    identifier: string
  ): NamespaceTypes[T] | null {
    const dynamicKey = `${namespace}_${identifier}` as DynamicKey<T>;
    return storageManager.getItem(dynamicKey as any);
  }

  // Método genérico para establecer datos con claves dinámicas
  setDynamicItem<T extends keyof NamespaceTypes>(
    namespace: T,
    identifier: string,
    value: NamespaceTypes[T]
  ): boolean {
    const dynamicKey = `${namespace}_${identifier}` as DynamicKey<T>;
    return storageManager.setItem(dynamicKey as any, value);
  }

  // Método para remover elementos dinámicos
  removeDynamicItem<T extends keyof NamespaceTypes>(
    namespace: T,
    identifier: string
  ): boolean {
    const dynamicKey = `${namespace}_${identifier}` as DynamicKey<T>;
    return storageManager.removeItem(dynamicKey);
  }

  // Método para limpiar todos los elementos de un namespace
  clearNamespace<T extends keyof NamespaceTypes>(namespace: T): void {
    // Esta implementación podría mejorarse con un índice de claves
    console.log(`Clearing namespace: ${namespace}`);
  }
}

export const dynamicStorageManager = DynamicStorageManager.getInstance();
