import { describe, it, expect, vi, beforeEach } from 'vitest';
import { unifiedStorageSystem } from '@/core/storage/UnifiedStorageSystem';

describe('UnifiedStorageSystem', () => {
  beforeEach(() => {
    // Limpiar storage antes de cada test
    unifiedStorageSystem.clear();
    unifiedStorageSystem.forceReset();
    vi.clearAllMocks();
  });

  it('debería inicializarse correctamente', async () => {
    await unifiedStorageSystem.waitForReady();
    const status = unifiedStorageSystem.getStatus();
    
    expect(status.isReady).toBe(true);
  });

  it('debería almacenar y recuperar datos correctamente', () => {
    const testData = { name: 'Test', value: 123 };
    const result = unifiedStorageSystem.setItem('test-key', testData);
    
    expect(result).toBe(true);
    
    const retrieved = unifiedStorageSystem.getItem('test-key');
    expect(retrieved).toEqual(testData);
  });

  it('debería manejar datos nulos', () => {
    const result = unifiedStorageSystem.getItem('non-existent-key');
    expect(result).toBe(null);
  });

  it('debería remover elementos correctamente', () => {
    unifiedStorageSystem.setItem('test-key', { data: 'test' });
    expect(unifiedStorageSystem.getItem('test-key')).toBeTruthy();
    
    unifiedStorageSystem.removeItem('test-key');
    expect(unifiedStorageSystem.getItem('test-key')).toBe(null);
  });

  it('debería usar cache en memoria cuando localStorage falla', () => {
    // Simular fallo de localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage quota exceeded');
    });

    const testData = { cached: true };
    const result = unifiedStorageSystem.setItem('cache-test', testData, { silentErrors: true });
    
    // Debería fallar en localStorage pero éxito en memoria
    expect(result).toBe(false);
    
    // Pero aún debería estar en cache de memoria
    const retrieved = unifiedStorageSystem.getItem('cache-test');
    expect(retrieved).toEqual(testData);

    // Restaurar localStorage
    localStorage.setItem = originalSetItem;
  });

  it('debería activar degradación graceful en múltiples errores', () => {
    // Simular múltiples fallos
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage error');
    });

    // Provocar errores para activar degradación graceful
    for (let i = 0; i < 5; i++) {
      unifiedStorageSystem.setItem(`test-${i}`, { data: i }, { silentErrors: true });
    }

    const status = unifiedStorageSystem.getStatus();
    expect(status.gracefulDegradation || status.circuitBreakerActive).toBe(true);

    // Restaurar localStorage
    localStorage.setItem = originalSetItem;
  });

  it('debería proporcionar métricas de rendimiento', () => {
    unifiedStorageSystem.setItem('metric-test-1', { data: 1 });
    unifiedStorageSystem.setItem('metric-test-2', { data: 2 });
    
    const metrics = unifiedStorageSystem.getPerformanceMetrics();
    
    expect(metrics).toHaveProperty('cacheSize');
    expect(metrics).toHaveProperty('alertCount');
    expect(metrics).toHaveProperty('trackingBlocked');
    expect(metrics.cacheSize).toBeGreaterThanOrEqual(2);
  });

  it('debería manejar TTL en cache', async () => {
    const testData = { expiring: true };
    
    // Establecer con TTL muy corto
    unifiedStorageSystem.setItem('ttl-test', testData);
    
    // Verificar que existe inmediatamente
    expect(unifiedStorageSystem.getItem('ttl-test')).toEqual(testData);
    
    // Para test de TTL necesitaríamos simular el paso del tiempo
    // o modificar el sistema para aceptar TTL personalizado
  });

  it('debería manejar el reset del sistema', () => {
    // Agregar algunos datos
    unifiedStorageSystem.setItem('reset-test-1', { data: 1 });
    unifiedStorageSystem.setItem('reset-test-2', { data: 2 });
    
    let status = unifiedStorageSystem.getStatus();
    expect(status.cacheSize).toBeGreaterThan(0);
    
    // Hacer reset
    unifiedStorageSystem.forceReset();
    
    status = unifiedStorageSystem.getStatus();
    expect(status.alertCount).toBe(0);
    expect(status.circuitBreakerActive).toBe(false);
    expect(status.gracefulDegradation).toBe(false);
  });
});
