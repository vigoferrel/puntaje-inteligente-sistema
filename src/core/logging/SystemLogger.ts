
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
    // Capturar errores globales con manejo seguro
    window.addEventListener('error', (event) => {
      const errorData = {
        message: event.message || 'Unknown error',
        filename: event.filename || 'Unknown file',
        lineno: event.lineno || 0,
        colno: event.colno || 0,
        stack: event.error?.stack || 'No stack trace available'
      };
      
      this.error('Global Error', `${errorData.message} at ${errorData.filename}:${errorData.lineno}:${errorData.colno}`, errorData);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const rejectionData = {
        reason: event.reason?.toString() || 'Unknown rejection reason',
        promise: 'Promise object'
      };
      
      this.error('Unhandled Promise Rejection', `Promise rejected: ${rejectionData.reason}`, rejectionData);
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
      const logData = data ? (typeof data === 'object' ? JSON.stringify(data, null, 2) : data) : '';
      logMethod(`[${module}] ${message}`, logData);
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
