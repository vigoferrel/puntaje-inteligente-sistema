
interface LogEntry {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  module: string;
  message: string;
  data?: any;
  stackTrace?: string;
}

class SystemLogger {
  private static instance: SystemLogger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isProduction = process.env.NODE_ENV === 'production';

  static getInstance(): SystemLogger {
    if (!SystemLogger.instance) {
      SystemLogger.instance = new SystemLogger();
    }
    return SystemLogger.instance;
  }

  private constructor() {
    // Capturar errores globales
    window.addEventListener('error', (event) => {
      this.error('Global Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise
      });
    });
  }

  private addLog(level: LogEntry['level'], module: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      module,
      message,
      data,
      stackTrace: level === 'error' || level === 'critical' ? new Error().stack : undefined
    };

    this.logs.push(entry);
    
    // Mantener solo los últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log en consola solo en desarrollo o errores críticos
    if (!this.isProduction || level === 'error' || level === 'critical') {
      const logMethod = this.getConsoleMethod(level);
      logMethod(`[${module}] ${message}`, data || '');
    }
  }

  private getConsoleMethod(level: LogEntry['level']) {
    switch (level) {
      case 'debug': return console.debug;
      case 'info': return console.log;
      case 'warn': return console.warn;
      case 'error':
      case 'critical': return console.error;
      default: return console.log;
    }
  }

  debug(module: string, message: string, data?: any) {
    this.addLog('debug', module, message, data);
  }

  info(module: string, message: string, data?: any) {
    this.addLog('info', module, message, data);
  }

  warn(module: string, message: string, data?: any) {
    this.addLog('warn', module, message, data);
  }

  error(module: string, message: string, data?: any) {
    this.addLog('error', module, message, data);
  }

  critical(module: string, message: string, data?: any) {
    this.addLog('critical', module, message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByLevel(level: LogEntry['level']): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = SystemLogger.getInstance();
