import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@/core/logging/SystemLogger';

describe('SystemLogger', () => {
  beforeEach(() => {
    logger.clearLogs();
    vi.clearAllMocks();
  });

  it('debería registrar logs de diferentes niveles', () => {
    logger.debug('TestModule', 'Debug message');
    logger.info('TestModule', 'Info message');
    logger.warn('TestModule', 'Warning message');
    logger.error('TestModule', 'Error message');
    logger.critical('TestModule', 'Critical message');

    const logs = logger.getLogs();
    expect(logs).toHaveLength(5);
    
    const levels = logs.map(log => log.level);
    expect(levels).toContain('debug');
    expect(levels).toContain('info');
    expect(levels).toContain('warn');
    expect(levels).toContain('error');
    expect(levels).toContain('critical');
  });

  it('debería filtrar logs por nivel', () => {
    logger.info('TestModule', 'Info 1');
    logger.error('TestModule', 'Error 1');
    logger.info('TestModule', 'Info 2');
    logger.warn('TestModule', 'Warning 1');

    const errorLogs = logger.getLogsByLevel('error');
    const infoLogs = logger.getLogsByLevel('info');

    expect(errorLogs).toHaveLength(1);
    expect(infoLogs).toHaveLength(2);
    expect(errorLogs[0].message).toBe('Error 1');
  });

  it('debería incluir timestamp en los logs', () => {
    const beforeTime = Date.now();
    logger.info('TestModule', 'Test message');
    const afterTime = Date.now();

    const logs = logger.getLogs();
    const log = logs[0];
    
    expect(log.timestamp).toBeGreaterThanOrEqual(beforeTime);
    expect(log.timestamp).toBeLessThanOrEqual(afterTime);
  });

  it('debería incluir stack trace para errores', () => {
    logger.error('TestModule', 'Error with stack');
    logger.critical('TestModule', 'Critical with stack');
    logger.info('TestModule', 'Info without stack');

    const logs = logger.getLogs();
    const errorLog = logs.find(log => log.level === 'error');
    const criticalLog = logs.find(log => log.level === 'critical');
    const infoLog = logs.find(log => log.level === 'info');

    expect(errorLog?.stackTrace).toBeDefined();
    expect(criticalLog?.stackTrace).toBeDefined();
    expect(infoLog?.stackTrace).toBeUndefined();
  });

  it('debería almacenar datos adicionales', () => {
    const testData = { userId: '123', action: 'login' };
    logger.info('AuthModule', 'User logged in', testData);

    const logs = logger.getLogs();
    const log = logs[0];
    
    expect(log.data).toEqual(testData);
    expect(log.module).toBe('AuthModule');
    expect(log.message).toBe('User logged in');
  });

  it('debería limitar el número de logs almacenados', () => {
    // Simular muchos logs
    for (let i = 0; i < 1200; i++) {
      logger.info('TestModule', `Message ${i}`);
    }

    const logs = logger.getLogs();
    expect(logs.length).toBeLessThanOrEqual(1000);
    
    // Verificar que mantiene los más recientes
    const lastLog = logs[logs.length - 1];
    expect(lastLog.message).toBe('Message 1199');
  });

  it('debería limpiar logs correctamente', () => {
    logger.info('TestModule', 'Message 1');
    logger.error('TestModule', 'Message 2');
    
    expect(logger.getLogs()).toHaveLength(2);
    
    logger.clearLogs();
    
    expect(logger.getLogs()).toHaveLength(0);
  });
});
